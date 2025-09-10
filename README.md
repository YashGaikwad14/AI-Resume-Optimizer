# AI Resume Optimizer

An end-to-end app that analyzes your PDF resume, scores it against a job description, generates a tailored cover letter, and provides advanced career tools (skills gap, bullet rewrites, tailoring to JD, interview questions, LinkedIn suggestions).

## Features
- Resume analysis with actionable improvements (Markdown-rendered)
- Keyword match score + basic ATS checks
- Tailored cover letter generation
- Advanced tools:
  - Rewrite bullets (STAR + quantified)
  - Skills gap with learning roadmap
  - Tailor resume mapping to JD keywords
  - Interview questions with talking points
  - LinkedIn headlines + About suggestions
- Copy-to-clipboard for all generated content
- Clean UI with collapsible sections and deep-link scrolling

## Tech Stack
- Frontend: React (Vite), Tailwind CSS v3
- Backend: Node.js (Express), `multer` (PDF upload), `pdf-parse` (text extraction)
- AI: Google Gemini (generateContent API)

## Monorepo Structure
```
.
├─ backend/
│  ├─ server.js
│  └─ package.json
└─ frontend/
   ├─ src/
   │  ├─ App.jsx, App.css, index.css, main.jsx, About.jsx
   │  └─ ...
   └─ package.json
```

## Prerequisites
- Node.js 18+
- A Google Gemini API key

## Setup
1) Backend
```
cd backend
npm install
```
Create `.env` in `backend/`:
```
GEMINI_API_KEY=your_api_key_here
```
Start the server (default: http://localhost:5000):
```
npm start
```

2) Frontend
```
cd ../frontend
npm install
npm run dev
```
Open `http://localhost:5173`.

## Usage
1. Upload your resume (PDF)
2. Paste a job description (optional but recommended)
3. Use tools at the top:
   - Analyze Resume, Score Match, Cover Letter
   - More Tools: Rewrite Bullets, Skills Gap, Tailor Resume, Interview Questions, LinkedIn Suggestions
4. Copy outputs and iterate on your resume

Sections can be collapsed/expanded; when you trigger a tool it auto-highlights and scrolls into view.

## API (Backend)
All endpoints expect `multipart/form-data` with:
- `resume`: PDF file
- `jobDescription`: string (optional)

Responses: `{ result: markdown }` unless noted otherwise.

- POST `/analyze` → Resume improvements (Markdown)
- POST `/score` → `{ score, matched, totalKeywords, flags }`
- POST `/cover-letter` → Tailored cover letter (Markdown)
- POST `/rewrite-bullets` → STAR + quantified bullet rewrites (Markdown)
- POST `/skills-gap` → Skills gaps + learning roadmap (Markdown)
- POST `/tailor` → Mapping to JD keywords + suggested edits (Markdown)
- POST `/interview-questions` → Behavioral/technical questions + talking points (Markdown)
- POST `/linkedin` → Headline options + About summary (Markdown)

## Configuration
- Tailwind: `frontend/tailwind.config.js`, PostCSS via `frontend/postcss.config.js`
- React Router: `frontend/src/main.jsx` (`/` and `/about`)

## Troubleshooting
- “Unknown at rule @tailwind/@apply” in editor: it’s an editor lint; build is fine. VS Code: set `"css.lint.unknownAtRules": "ignore"` in `.vscode/settings.json`.
- Non-JSON error on tools: ensure backend is running on port 5000; frontend fetches expect JSON.
- Sticky header scroll alignment: sections use `scroll-margin-top` to align after auto-scroll.

## Roadmap
- One-click export: generate updated DOCX/PDF based on AI suggestions
- Persist sessions and versioning
- Multi-language support

## License
MIT

