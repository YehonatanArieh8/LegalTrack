# ⚖️ LegalTrack — Frontend

React single-page application for the LegalTrack case management system.

---

## 🚀 Tech Stack

| Component | Technology |
|-----------|-----------|
| Framework | React.js (Create React App) |
| Routing | React Router |
| HTTP Client | Fetch API |
| Real-time | Socket.IO Client |
| Charts | Recharts |
| i18n | Custom Context (English / Hebrew, RTL support) |

---

## 📁 Project Structure

```
Legaltrack-Frontend/
└── src/
    ├── components/
    │   ├── Navbar/                ← Top nav, user avatar, logout
    │   ├── Footer/
    │   ├── Card/                  ← Reusable summary card
    │   ├── DataTable/             ← Reusable data table (badges, dates, actions)
    │   ├── Notifications/         ← Toast notifications fed by WebSocket events
    │   └── AiChat/                ← Floating AI assistant widget (all pages)
    ├── pages/
    │   ├── LoginPage/             ← Login + Register tabs
    │   ├── Dashboard/             ← Stats, pie chart, recent activity
    │   ├── CasesPage/             ← Case list, filters, create/edit/delete
    │   ├── CaseDetailPage/        ← Single case: documents, folders, notes, AI summary
    │   ├── ClientsPage/           ← Client list, create/edit/delete
    │   └── SettingsPage/          ← Theme, language, notification preferences
    ├── services/
    │   ├── api.js                 ← All backend HTTP calls
    │   └── socket.js              ← Socket.IO client instance
    ├── i18n/
    │   └── LanguageContext.js     ← EN/HE translations + RTL toggle
    └── App.js                     ← Routes, ProtectedRoute, global providers
```

---

## ⚙️ Installation

### Prerequisites
- Node.js v18+
- The backend running on `http://localhost:3000` (see Backend README)

### 1. Install dependencies
```bash
cd Legaltrack-Frontend
npm install
```

### 2. Configure environment (optional)
By default the app points to `http://localhost:3000/api`. To override, create `.env`:
```
REACT_APP_API_URL=http://localhost:3000/api
PORT=5173
```

### 3. Start the dev server
```bash
npm start
```

> App runs on **http://localhost:5173**

---

## 👤 Demo Credentials

| Email | Password | Role |
|-------|----------|------|
| david@legaltrack.com | 123456 | admin |
| sarah@legaltrack.com | 123456 | manager |

You can also register a new account from the Login page.

---

## 🧭 Routes

| Path | Page | Protected |
|------|------|-----------|
| `/` | Login / Register | No |
| `/dashboard` | Dashboard (stats, chart, recent activity) | Yes |
| `/clients` | Client list & management | Yes |
| `/cases` | Case list, filter, create/edit/delete | Yes |
| `/cases/:id` | Case detail — documents, folders, notes, AI | Yes |
| `/settings` | User settings | Yes |

Protected routes redirect to `/` if no `user` is found in `localStorage`.

---

## 🧩 Key Components

### `Navbar`
Fetches the current user via `GET /auth/me` (falls back to `localStorage` if the call fails). Displays an avatar with initials, colored by role (admin = red, manager = yellow, user = blue).

### `DataTable`
Generic table component. Column config supports:
```javascript
{ key: 'status', label: 'Status', badge: true }   // renders colored badge
{ key: 'openedDate', label: 'Opened', date: true } // formats date+time
```
Accepts an optional `actions={(row) => <JSX>}` render prop for per-row buttons.

### `Notifications`
Subscribes to WebSocket events (`case:created`, `case:updated`, `document:uploaded`, `folder:created`, `note:created`) and shows auto-dismissing toast messages in the bottom-right corner.

### `AiChat`
Floating button (bottom-right, all pages). Opens a chat panel that:
- Sends messages to `POST /api/ai/chat` with the user's role as context
- Detects `action: "navigate"` responses and automatically routes the user
- Includes quick-action buttons (Dashboard / Cases / Clients / Settings)

---

## 📄 Page Details

### `LoginPage`
- Tab switcher between **Sign In** and **Register**
- Client-side validation: email format, password ≥ 6 characters
- On success, stores `user` object in `localStorage` and redirects to `/dashboard`

### `Dashboard`
- 4 stat cards: Total Cases, Open Cases, Pending Cases, Total Clients
- Pie chart (Recharts) — case distribution by status
- Recent Activity feed — last 5 cases, clickable → case detail
- Skeleton loading state

### `CasesPage`
- Status filter tabs (All / Open / Pending / Closed)
- Card view (top 3) + full DataTable
- Create / Edit (status, type, description) / Delete / View actions

### `CaseDetailPage`
- Case info card (client, status, description, dates)
- **Documents**: upload (any file type), download, AI summarize, delete, move between folders
- **Folders**: create, delete (documents move to root), upload directly into a folder
- **Notes**: add/delete free-text notes, shows author name + timestamp

### `ClientsPage`
- Card view + DataTable
- Create / Edit / Delete

### `SettingsPage`
- Editable: username, email, theme (light/dark), language (en/he), notifications toggle
- Applies theme via `document.body.setAttribute('data-theme', ...)`

---

## 🌐 i18n / RTL Support

`LanguageContext` provides a `t` (translations) object and a language switch. When Hebrew is selected, text direction switches to RTL automatically via the `LanguageProvider`.

---

## 🔌 Real-Time Behavior

`services/socket.js` creates a single Socket.IO client connected to the backend. Any open tab/browser receives live updates the moment another user (or tab) creates a case, uploads a document, adds a note, etc. — demonstrated via the `Notifications` component.

---

## 🤖 AI Features in the UI

| Feature | Where | How |
|---------|-------|-----|
| Document Summarization | Case Detail → Documents | Click **🤖 AI Summary** on any uploaded file |
| AI Chat Assistant | Floating widget, all pages | Ask questions, get navigation help, legal guidance |

---

## 🎨 Theming

Dark/light mode is controlled by a `data-theme` attribute on `<body>`, read from `localStorage` on load and updated from the Settings page. All component CSS uses CSS variables (`--bg-main`, `--bg-card`, `--text-primary`, etc.) for consistent theming.

---

## ⚠️ Known Limitations

- No client-side route guards beyond `localStorage` presence check (no token expiry handling)
- Desktop-oriented layout (no mobile-responsive breakpoints)
- AI Chat navigation relies on the model returning well-formed JSON — occasional parsing fallback to plain text

---

*LegalTrack Frontend — Fullstack Course Final Project*