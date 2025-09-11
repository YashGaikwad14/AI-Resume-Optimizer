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
- Frontend: React (Vite), Tailwind CSS v3, Recoil (state), React Router
- Design System: Dark theme with CSS vars (HSL), gradients, glow shadows
- Backend: Node.js (Express), `multer` (PDF), `pdf-parse` (extraction)
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
   │  ├─ Atoms/
   │  │  └─ atoms.js (Recoil atoms/selectors)
   │  └─ components/
   │     ├─ NewHeader.jsx, HeroSection.jsx
   │     ├─ ToolsSection.jsx (main + advanced tools)
   │     ├─ ResultsUnified.jsx (all response cards)
   │     ├─ ToolSection.jsx (generic renderer, legacy)
   │     └─ ToolsMenu.jsx (legacy)
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

If PowerShell blocks `&&`, run commands separately:
```
cd frontend
npm run dev
```

## Usage
1. Upload your resume (PDF)
2. Paste a job description (longer gives better results)
3. Use Tools: Analyze, Score Match, Cover Letter
4. Toggle Advanced Tools to access: Rewrite Bullets, Skills Gap, Tailor Resume, Interview Questions, LinkedIn
5. Copy sections (Copy button) or Hide/Show for focus

Sections can be collapsed/expanded; when you trigger a tool it auto-highlights and scrolls into view.

## State Management (Recoil)

The application uses Recoil for efficient state management:

### State Organization
- **File & Input States**: `resumeFileState`, `jobDescriptionState`
- **Loading & Error States**: `loadingState`, `errorState`
- **Results States**: `resultsState`, `scoreState`, `coverLetterState`
- **Tool Results**: `rewriteBulletsState`, `skillsGapState`, `tailorState`, `interviewQsState`, `linkedinState`
- **UI States**: `activeSectionState`, `showToolsMenuState`
- **Component Visibility**: `showAnalysisState`, `showScoreState`, `showCoverState`, etc.

### Benefits
- **No Prop Drilling**: Components access state directly via Recoil hooks
- **Selective Re-renders**: Only components using changed atoms re-render
- **Clean Architecture**: Each component manages its own state independently
- **Easy Debugging**: Recoil DevTools for state inspection

## UI/Theme
- Tailwind `tailwind.config.js` reads HSL CSS variables from `src/index.css`
- Utilities available: `bg-gradient-hero`, `bg-gradient-card`, `bg-gradient-button`, `shadow-glow-primary`, `shadow-card`, etc.
- Response cards are in `components/ResultsUnified.jsx` with Copy and Hide/Show controls

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

