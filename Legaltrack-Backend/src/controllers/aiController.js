const fs = require('fs');
const PDFParser = require('pdf2json');
const Groq = require('groq-sdk');
const { Document } = require('../../models');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const extractPdfText = (filePath) => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    pdfParser.on('pdfParser_dataReady', (pdfData) => {
      const text = pdfData.Pages.map(page =>
        page.Texts.map(t => {
          try {
            return decodeURIComponent(t.R.map(r => r.T).join(''));
          } catch (e) {
            return t.R.map(r => r.T).join('');
          }
        }).join(' ')
      ).join('\n');
      resolve(text);
    });
    pdfParser.on('pdfParser_dataError', reject);
    pdfParser.loadPDF(filePath);
  });
};

const summarizeDocument = async (req, res) => {
  const document = await Document.findByPk(req.params.docId);
  if (!document) {
    return res.status(404).json({
      success: false, data: null,
      error: { code: 'NOT_FOUND', message: `Document ${req.params.docId} not found`, details: {} }
    });
  }

  if (!fs.existsSync(document.filePath)) {
    return res.status(404).json({
      success: false, data: null,
      error: { code: 'FILE_NOT_FOUND', message: 'File not found on disk', details: {} }
    });
  }

  const text = await extractPdfText(document.filePath);
  const truncated = text.slice(0, 8000);

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: 'You are a legal assistant. Summarize the following legal document concisely. Extract key points, dates, and any important clauses.' },
      { role: 'user', content: `Please summarize this legal document:\n\n${truncated}` }
    ],
    max_tokens: 1000,
  });

  const summary = completion.choices[0].message.content;
  await document.update({ aiSummary: summary });

  res.status(200).json({
    success: true,
    data: { documentId: document.documentId, summary },
    error: null
  });
};

const askQuestion = async (req, res) => {
  const { prompt, context } = req.body;
  if (!prompt) {
    return res.status(400).json({
      success: false, data: null,
      error: { code: 'VALIDATION_ERROR', message: 'Missing required field: prompt', details: {} }
    });
  }

  const systemPrompt = `You are an AI legal assistant embedded in LegalTrack — a case management system for lawyers.

You can help with:
- Answering legal questions
- Summarizing legal documents and contracts
- Explaining legal terms and procedures
- Navigating the app (respond with JSON action when user wants to navigate)
- Managing cases and clients

Available pages in the app:
- /dashboard — Main dashboard
- /cases — All cases
- /clients — All clients
- /settings — User settings
- /cases/:id — Case detail page

If the user wants to navigate somewhere, respond ONLY with this JSON format:
{"action": "navigate", "path": "/cases", "message": "Taking you to Cases..."}

Otherwise respond normally as a helpful legal assistant.

${context ? `Current user context: ${context}` : ''}`;

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ],
    max_tokens: 1000,
  });

  const response = completion.choices[0].message.content;

  try {
    const parsed = JSON.parse(response);
    if (parsed.action === 'navigate') {
      return res.status(200).json({
        success: true,
        data: { response: parsed.message, action: parsed },
        error: null
      });
    }
  } catch (e) {
    // Not JSON — normal response
  }

  res.status(200).json({
    success: true,
    data: { response },
    error: null
  });
};

module.exports = { summarizeDocument, askQuestion };