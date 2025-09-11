# AI Resume Optimizer - Frontend

A React application built with Vite that provides AI-powered resume analysis and optimization tools.

## Tech Stack
- **React 18** with Vite for fast development
- **Recoil** for state management
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Marked** for Markdown rendering

## Project Structure
```
src/
├── Atoms/
│   └── atoms.js          # Recoil state definitions
├── components/
│   ├── AnalysisSection.jsx    # Resume analysis results
│   ├── CoverLetterSection.jsx # Cover letter generation
│   ├── ResultsContainer.jsx   # Main results wrapper
│   ├── ScoreSection.jsx       # Resume scoring
│   ├── ToolSection.jsx        # Generic tool results
│   └── ToolsMenu.jsx          # Tools dropdown menu
├── App.jsx               # Main application component
├── main.jsx             # Application entry point
└── About.jsx            # About page
```

## State Management

The application uses Recoil for efficient state management:

### Key Atoms
- **File States**: `resumeFileState`, `jobDescriptionState`
- **Loading States**: `loadingState`, `errorState`
- **Results**: `resultsState`, `scoreState`, `coverLetterState`
- **Tool Results**: `rewriteBulletsState`, `skillsGapState`, `tailorState`, etc.
- **UI States**: `activeSectionState`, `showToolsMenuState`
- **Visibility**: `showAnalysisState`, `showScoreState`, `showCoverState`, etc.

### Benefits
- **No Prop Drilling**: Components access state directly
- **Selective Re-renders**: Only affected components update
- **Clean Architecture**: Self-contained components
- **Easy Debugging**: Recoil DevTools integration

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Features
- PDF resume upload and analysis
- Job description matching and scoring
- AI-generated cover letters
- Advanced tools: bullet rewriting, skills gap analysis, interview questions
- Copy-to-clipboard functionality
- Responsive design with Tailwind CSS
- Collapsible sections with smooth scrolling

## Dependencies
- `recoil` - State management
- `marked` - Markdown rendering
- `react-router-dom` - Client-side routing
- `tailwindcss` - Utility-first CSS framework
