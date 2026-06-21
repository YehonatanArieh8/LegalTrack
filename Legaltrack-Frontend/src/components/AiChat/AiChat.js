import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { aiChat } from '../../services/api';
import './AiChat.css';

const AiChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '👋 Hi! I\'m your LegalTrack AI assistant. I can help you navigate the app, summarize documents, answer legal questions, and more!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const context = user ? `User: ${user.firstName} ${user.lastName}, Role: ${user.userRole}` : '';
    const res = await aiChat(input, context);

    if (res.success) {
      // Check for navigation action
      if (res.data.action?.action === 'navigate') {
        setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
        setTimeout(() => navigate(res.data.action.path), 1000);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
      }
    } else {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Quick action buttons
  const quickActions = [
    { label: '📊 Dashboard', prompt: 'Take me to the dashboard' },
    { label: '📁 Cases', prompt: 'Take me to cases' },
    { label: '👥 Clients', prompt: 'Take me to clients' },
    { label: '⚙️ Settings', prompt: 'Take me to settings' },
  ];

  return (
    <>
      {/* Floating Button */}
      <button className={`ai-chat-toggle ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="ai-chat-panel">
          <div className="ai-chat-header">
            <span>🤖 AI Legal Assistant</span>
            <button className="ai-chat-close" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="ai-chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`ai-msg ${msg.role}`}>
                <div className="ai-msg-bubble">
                  <span className="ai-msg-role">{msg.role === 'assistant' ? '🤖' : '👤'}</span>
                  <p className="ai-msg-text">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="ai-msg assistant">
                <div className="ai-msg-bubble">
                  <span className="ai-msg-role">🤖</span>
                  <p className="ai-msg-text ai-typing">Thinking...</p>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Actions */}
          <div className="ai-quick-actions">
            {quickActions.map((action, i) => (
              <button
                key={i}
                className="ai-quick-btn"
                onClick={() => { setInput(action.prompt); }}
              >
                {action.label}
              </button>
            ))}
          </div>

          <div className="ai-chat-input-area">
            <textarea
              className="ai-chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything... (Enter to send)"
              rows={2}
              disabled={loading}
            />
            <button className="ai-chat-send" onClick={handleSend} disabled={loading || !input.trim()}>
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AiChat;