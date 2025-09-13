# AI Resume Optimizer - Frontend

A React application built with Vite that provides AI-powered resume analysis and optimization tools with PDF export capabilities.

## Tech Stack
- **React 18** with Vite for fast development
- **Recoil** for state management
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Marked** for Markdown rendering
- **jsPDF & html2canvas** for PDF generation
- **Mobile-First** responsive design

## Project Structure
```
src/
├── Atoms/
│   └── atoms.js          # Recoil state definitions
├── components/
│   ├── NewHeader.jsx         # Mobile-responsive navigation
│   ├── ToolsSection.jsx      # Free & premium tools UI
│   ├── ResultsUnified.jsx    # Results display with PDF download
│   ├── HistorySidebar.jsx    # Analysis history sidebar
│   ├── ProtectedRoute.jsx    # Route protection
│   └── HeroSection.jsx       # Landing page hero
├── pages/
│   ├── SignIn.jsx            # Authentication pages
│   ├── SignUp.jsx
│   ├── ForgotPassword.jsx    # Password reset
│   ├── ResetPassword.jsx     # Password reset confirmation
│   └── Pricing.jsx           # Premium subscription page
├── utils/
│   └── pdfGenerator.js       # PDF generation utilities
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
- **PDF Download** - Download all analysis results as professional PDFs
- Copy-to-clipboard functionality
- Responsive design with Tailwind CSS
- Collapsible sections with smooth scrolling
- History tracking with navigation
- Premium subscription management
- Mobile-first responsive design

## Dependencies
- `recoil` - State management
- `marked` - Markdown rendering
- `react-router-dom` - Client-side routing
- `tailwindcss` - Utility-first CSS framework
- `jspdf` - PDF generation
- `html2canvas` - HTML to canvas conversion for PDFs
- `zod` - Schema validation