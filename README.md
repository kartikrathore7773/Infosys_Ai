### 🔧 Conversion Highlights

- Switched the backend to Node + Express while keeping the same `/history` and `/analyze` endpoints so the Vite client needs no API changes.
- Introduced proper MVC structure with controllers, routers, models, and shared utilities (`backend/utils/analyzer.js`).
- Reimplemented analytics using `compromise` (tokenization) + `sentiment` (polarity) to match the prior heuristics and suggestions.
- Added centralized error handling, `helmet` for basic security headers, and environment-driven configuration for MongoDB.
- Added JWT-based authentication (`/auth/register`, `/auth/login`) and now require the Bearer token on `/history` and `/analyze` so every chat is scoped to a verified user.

### 📁 Repository Layout

- `frontend/` – Contains the Vite + React workspace (`package.json`, `src/`, `public/`, etc.) plus the frontend `.env.example`.
- `backend/` – Houses the Express API (`server.js`, controllers, routers, Mongoose models, and `backend/.env.example`).

## AI Content Creator

Next-gen content workspace that pairs a Vite + React front end with a MERN-style Node + Express backend. Marketers can craft prompts, generate multi-format copy with multiple LLM providers, compare A/B variants, run batch jobs, post-process outputs, and inspect analytics for each generation while every chat is persisted into MongoDB Atlas.

---

### 📦 At A Glance

- **Frontend**: React 18, React Router 7, TailwindCSS, Framer Motion, CodeMirror editor wrappers, Lucide icons.
- **Backend**: Node.js + Express API (`backend/server.js`) with MVC controllers, Mongoose models, and the same `/history` + `/analyze` surface area.
- **AI Providers**: OpenAI (`VITE_OPENAI_API_KEY`), Google Gemini (`VITE_GEMINI_API_KEY`), Mistral/HuggingFace (`VITE_HF_API_KEY`) with automatic fallback in `src/services/aiService.js`.
- **Data Store**: Chat history now lives in MongoDB Atlas accessed through the Node backend (`/history/...`); the client still mirrors the data in `localStorage` for offline UX (auth/profile flags, templates, analytics counters, feedback, etc.).

---

### 🗂️ System Architecture

1. **Browser client (Vite + React in frontend/)**
   - Pages: Intro landing, Sign (auth), Home (main workspace), Dashboard (analytics), EditorWorkspace (rich editor), Profile (personalization), and auxiliary overlays.
   - Context providers: `ThemeContext` (dark + advanced mode toggles), `PromptContext` (prompt panel state), `ABContext` (A/B lab lifecycle).
   - Services & utils: `aiService` orchestrates LLM calls, template substitution, validation, post-processing, and history persistence. `analysisService` forwards content to the Express `/analyze` API. Utility modules cover template storage, prompt validation, analytics calculations, and export helpers.
2. **Node.js + Express backend (`backend/server.js`)**
   - Routes: `/history` (GET/POST/PUT/DELETE) + `/analyze` implemented as separate routers/controllers with the same request/response shapes and `history` metadata.
   - Stack: `express`, `cors`, `helmet`, `mongoose`, `compromise`, and `sentiment`. Environment variables live in `backend/.env.example`.
3. **Persistence layer**
   - Express exposes `/history` endpoints that mirror the chat array into MongoDB Atlas. `frontend/src/utils/historyStorage.js` now hydrates from that API, handles all localStorage caching for fast UI reads, and keeps the remote store in sync whenever chats, titles, or messages change. AB tests still promote into permanent chats with the same metadata flow.

---

### ✨ Feature Highlights

- **Guided Prompting & Templates**: Dynamic prompt builder merges base templates (`src/utils/templates.js`) with user profile preferences and ad-hoc prompt edits via the Prompt Panel.
- **Multi-model AI Generation**: `generateContent()` automatically falls back between OpenAI, Gemini, and Mistral to ensure responses. Manual model preference and template locking supported.
- **A/B Lab & Variations**: `ABContext` powers AB test runs with fullscreen loaders, interactive winner selection, and conversion into real chat sessions (`createChatFromAB`). Variation mode requests three structured alternates in one go.
- **Batch Mode & Bulk Processor**: Users can queue multiple prompts, auto-detect formats, and export aggregated outputs to CSV/PDF via utilities under `src/utils`.
- **History + Rich Editor**: Chats (stored under `creator_chat_history`) can be reopened in `EditorWorkspace` for WYSIWYG editing with toolbar actions, floating panels, and export options.
- **Analytics Dashboard**: `Dashboard.jsx` combines `analysisService` results, custom heuristics, spark lines (`UsageStats`), content-type pies, sentiment gauges, and downloadable JSON reports.
- **Profile Personalization**: `Profile.jsx` collects tone, industry, style, language, and avatar, feeding personalization blocks inside prompts and powering the activity heatmap.
- **Onboarding & Auth UX**: `Intro.jsx` marketing site, `Sign.jsx` with video background, password strength meter, and local credential storage (no remote auth provider).
- **Advanced UI Polish**: Loader overlays, keyboard shortcuts (`useKeyboardShortcuts`), template sidebar, toast system, search overlays, and theme toggles.

---

### 🧰 Tech Stack

| Layer    | Tech                                                                                                    |
| -------- | ------------------------------------------------------------------------------------------------------- |
| Frontend | React 18, React Router 7, Vite 7, TailwindCSS 3, PostCSS, Framer Motion, GSAP, Lucide icons, CodeMirror |
| Backend  | Node.js (ESM), Express, Mongoose, Helmet, Sentiment, Compromise (analyzer)                              |
| Tooling  | Node.js 18+, npm, vite scripts, Tailwind CLI                                                            |
| Data     | MongoDB Atlas-backed history + browser `localStorage` cache for UI state                                |

---

### 🧱 Backend Folder Structure

This MVC layout keeps the history logic, analyzer, and authentication isolated, improving testability and making the API consumer-friendly.

### 🔑 Environment variables

- **Frontend (`frontend/.env` or `frontend/.env.local`)** – copy `frontend/.env.example`, fill the OpenAI/Gemini/HuggingFace keys, and set `VITE_BACKEND_URL=http://localhost:5000` (or your deployed backend URL) so both `analysisService.js` and `historyService.js` reach the same API.
- **Backend (`backend/.env`)** – copy `backend/.env.example`, fill `MONGODB_URI` with your Atlas connection string, provide a strong `JWT_SECRET` for signing tokens, and optionally override `PORT` if you do not want to run on `5000`.

```bash
cd backend
cp .env.example .env
# fill MONGODB_URI, JWT_SECRET, and PORT (optional)
```

> **Security note:** Keep secret keys and connection strings out of source control. Use `.env` files locally and inject real secrets via your hosting platform.

---

### 🛠️ Prerequisites

- Node.js **18.x** (or newer) + npm (for both frontend and backend).
- MongoDB Atlas cluster ready with `MONGODB_URI` credentials.

---

### 🚀 Setup & Run Instructions

1. **Clone & enter repo**

   ```bash
   git clone <repo-url>
   cd Developing-an-AI-System-for-Personalized-Content-Creation-in-Media_Dec_Batch-7_2025-
   ```

2. **Backend (Node + Express)**

   ```bash
   cd backend
   npm install
   cp .env.example .env
   # fill the MONGODB_URI and optional PORT values
   npm run dev            # starts nodemon on PORT (default 5000)
   ```

   - Express exposes `/history` for CRUD and `/analyze` for content scoring.
   - Requests/responses follow the same contract the frontend expects, so no client changes were needed.
   - Keep this server running before you start the frontend.

3. **Frontend setup (Vite + React)**

   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # fill the OpenAI/Gemini/HuggingFace keys and `VITE_BACKEND_URL`
   npm run dev            # launches http://localhost:5173 by default
   ```

   - The client now talks to the Express API at `VITE_BACKEND_URL` via `aiService`, `historyService`, and `analysisService`.

4. **Production build (optional)**
   ```bash
   cd frontend
   npm run build
   npm run preview
   ```

> **Tip:** Run backend and frontend in separate terminals so the client can hit `/history`/`/analyze` while you iterate on React. Use `npm start` inside `backend/` for production mode.

---

### 📡 API Reference

| Method | URL                          | Body                                               | Description                                                                                                     |
| ------ | ---------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| POST   | `/auth/register`             | `{ "email", "password", "name" }`                  | Creates a user account, hashes the password, and returns `{ token, user }` used to authenticate future calls.   |
| POST   | `/auth/login`                | `{ "email", "password" }`                          | Validates credentials and returns the JWT + user payload that the frontend caches.                              |
| GET    | `/history`                   | —                                                  | Returns the list of chats for the current user (requires `Authorization: Bearer <JWT>`).                        |
| POST   | `/history`                   | `{ "chatId", "title", "type", "messages": [...] }` | Creates a new chat record (used when new sessions start or AB tests are promoted).                              |
| POST   | `/history/{chatId}/messages` | `{ "role", "content", "meta", "messageId" }`       | Appends a message to the specified chat and echoes the stored message payload.                                  |
| PUT    | `/history/{chatId}/title`    | `{ "title": "New title" }`                         | Renames a chat.                                                                                                 |
| DELETE | `/history/{chatId}`          | —                                                  | Removes a chat from MongoDB when the user deletes it from the UI.                                               |
| POST   | `/analyze`                   | `{ "text": "<content>" }`                          | Returns `{ metrics: { readability, sentiment, keywords[], engagement }, suggestions[] }` used by the dashboard. |

All `/history` and `/analyze` requests must supply the `Authorization: Bearer <token>` header that the `/auth/login` or `/auth/register` response returns.

\`backend/utils/analyzer.js\` logic:

- `compromise` tokenizes sentences/terms and builds keyword densities.
- `sentiment` scores polarity, which is normalized like the previous TextBlob output.
- The same heuristics compute readability, engagement, and suggestions so the dashboard still sees familiar metrics.

### 🔐 Authentication Flow

1. `Sign.jsx` posts the captured email/password (and optional name) to `/auth/register` or `/auth/login`.
2. The Express API replies with `{ token, user }`, which `frontend/src/utils/authStorage.js` caches so every page knows the signed-in user and the JWT.
3. `frontend/src/services/historyService.js` and `analysisService.js` read the token and include it as `Authorization: Bearer <token>` on every request, while `Sidebar`/`App` gate routes based on the helper.
4. The backend validates the JWT via `backend/middleware/auth.js` using the `JWT_SECRET` from `backend/.env`, ensuring `/history` and `/analyze` are scoped to the authenticated user.

---

### 🧱 Frontend Structure (selected folders)

```
frontend/src/
├─ App.jsx                 # Routes + auth gating
├─ context/               # Theme, Prompt, AB providers
├─ pages/                 # Intro, Home, Dashboard, EditorWorkspace, Profile, Sign
├─ components/
│  ├─ sidebar, header, prompt, analytics, history, editor, overlays, templates, etc.
├─ services/
│  ├─ aiService.js        # Core generation pipeline & provider fallbacks
│  ├─ analysisService.js  # Fetch helper for the Express /analyze API
│  └─ authService.js      # Register/login helpers for the JWT backend
├─ utils/
│  ├─ historyStorage.js   # mirrors localStorage with Express/Mongo history endpoints
│  ├─ authStorage.js      # keeps the cached token/user and gate helpers
│  ├─ templateLibrary.js  # default + custom template store
│  ├─ textAnalytics.js    # word count & readability helpers
│  ├─ usageTracker.js     # profile heatmap counters
│  ├─ validator.js        # rule-based content checks
│  └─ ...
└─ hooks/useKeyboardShortcuts.js
```

---

### 🔄 Content Generation Flow

1. User selects a content type, fills optional tone/audience/keywords, or picks a template.
2. `PromptContext` builds/edits the final prompt; `aiService.generateContent()` merges profile preferences and feedback hints.
3. The service selects an AI provider (OpenAI → Gemini → Mistral fallback) and posts the prompt.
4. Response passes through post-processing + validation, then is stored via `historyStorage.saveChatMessage()` alongside metadata.
5. `Home.jsx` displays the conversation, enabling copying, feedback tagging, and editing.
6. Analytics tab or Dashboard replays the latest assistant message through `/analyze` for quality metrics.

---

### 📊 Analytics & Storage

- **History storage**: Chat sessions are now persisted in MongoDB Atlas through the Express `/history` API. The UI keeps a cached copy in `localStorage` for fast rendering; `historyStorage.js` hydrates that cache on startup and writes through the same API.
- **Schema**: `{ chatId, title, createdAt, messages: [{ role, content, meta, messageId, createdAt }] }` for each document stored on MongoDB.
- **Feedback**: `ai_feedback` dictionary keyed by `messageId` for like/dislike tracking remains in `localStorage`.
- **Profile heatmap**: `ai_usage_<year>` tracks per-day counts in `localStorage` for the Profile calendar.

If you are building multi-region or authenticated multi-user support, keep using these APIs but add the required auth headers or user scoping layers on top of MongoDB.

---

### 📜 npm Scripts (frontend)

Execute the following from within `frontend/`.

| Command           | Purpose                               |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Start Vite dev server with HMR        |
| `npm run build`   | Production build (outputs to `/dist`) |
| `npm run preview` | Preview built assets locally          |

---

### 🧪 Testing & Quality Notes

- No automated tests are bundled. Recommended next steps: add integration tests for `aiService` (mocking fetch), component tests via Vitest/Testing Library, and backend unit tests for `backend/utils/analyzer.js`.
- The backend analyzer relies on `compromise` + `sentiment`; install backend deps with `npm install` inside `backend/` and re-run `npm run dev` if scoring responses stop appearing.

---

### 🧭 Troubleshooting

- **Backend server fails to start**: Run `npm install` inside `backend/`, ensure `MONGODB_URI` and `JWT_SECRET` are set in `backend/.env`, and then `npm run dev`. The Express app throws descriptive errors when required secrets are missing.
- **Frontend cannot reach the API**: Confirm `frontend/.env` sets `VITE_BACKEND_URL` to the same origin/port the backend is listening on (default `http://localhost:5000`) and start the backend before running `frontend`.
- **Empty or missing AI metrics**: `analysisService` posts to `/analyze` on the Express backend. Check the backend logs for analyzer output (compromise + sentiment) if the dashboard does not show readability/sentiment.
- **MongoDB connection issues**: The Express server reads `MONGODB_URI` from `backend/.env`. If `/history` endpoints fail, verify your Atlas user, password, database name, and IP access list.
- **Authentication issues**: If `/auth/login`, `/history`, or `/analyze` return `401`, confirm that `JWT_SECRET` is defined in `backend/.env` and matches the one used when generating tokens, and that the frontend is passing `Authorization: Bearer <token>` (the Sign page logs errors). Expired tokens are rejected as well.

---

### 🗺️ Future Enhancements

1. Replace localStorage with a secure backend datastore for multi-user support.
2. Centralize environment configuration (e.g., `backend/.env` for the Express API, secrets manager for API keys).
3. Add queueing + retries for batch jobs and AB tests.
4. Implement role-based access and OAuth login providers.
5. Extend analytics with time-series charts and export formats beyond JSON.

Happy building! If you need a quick start, follow the setup steps above and run both servers in parallel.
