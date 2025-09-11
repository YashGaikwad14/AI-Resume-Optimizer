import { useRecoilValue } from 'recoil';
import AnalysisSection from './AnalysisSection';
import ScoreSection from './ScoreSection';
import CoverLetterSection from './CoverLetterSection';
import ToolSection from './ToolSection';
import {
  loadingState,
  errorState,
  resultsState,
  scoreState,
  coverLetterState,
  rewriteBulletsState,
  skillsGapState,
  tailorState,
  interviewQsState,
  linkedinState,
  activeSectionState
} from '../Atoms/atoms';

export default function ResultsContainer({ copyHtmlText }) {
  // Recoil state values
  const loading = useRecoilValue(loadingState);
  const error = useRecoilValue(errorState);
  const results = useRecoilValue(resultsState);
  const score = useRecoilValue(scoreState);
  const coverLetter = useRecoilValue(coverLetterState);
  const rewriteBullets = useRecoilValue(rewriteBulletsState);
  const skillsGap = useRecoilValue(skillsGapState);
  const tailor = useRecoilValue(tailorState);
  const interviewQs = useRecoilValue(interviewQsState);
  const linkedin = useRecoilValue(linkedinState);
  const activeSection = useRecoilValue(activeSectionState);
  return (
    <div className="results-container">
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner" />
          <div className="mt-3 text-slate-700">Analyzing your resume...</div>
        </div>
      )}

      {!loading && !results && !error && (
        <div className="empty-state">
          <div className="text-slate-600">Your analysis will appear here.</div>
        </div>
      )}

      <AnalysisSection copyHtmlText={copyHtmlText} />

      <ScoreSection />

      <CoverLetterSection copyHtmlText={copyHtmlText} />

      <ToolSection
        title="Rewritten Bullets"
        sectionId="section-rewrite"
        copyHtmlText={copyHtmlText}
        copyButtonText="Copy Bullets"
      />

      <ToolSection
        title="Skills Gap & Roadmap"
        sectionId="section-skills"
        copyHtmlText={copyHtmlText}
        copyButtonText="Copy Roadmap"
      />

      <ToolSection
        title="Tailored Mapping"
        sectionId="section-tailor"
        copyHtmlText={copyHtmlText}
        copyButtonText="Copy Mapping"
      />

      <ToolSection
        title="Interview Questions"
        sectionId="section-interview"
        copyHtmlText={copyHtmlText}
        copyButtonText="Copy Questions"
      />

      <ToolSection
        title="LinkedIn Suggestions"
        sectionId="section-linkedin"
        copyHtmlText={copyHtmlText}
        copyButtonText="Copy Suggestions"
      />
    </div>
  );
}



