import { useRecoilValue, useRecoilState } from 'recoil';
import { resultsState, activeSectionState, showAnalysisState } from '../Atoms/atoms';

export default function AnalysisSection({ copyHtmlText }) {
  const results = useRecoilValue(resultsState);
  const activeSection = useRecoilValue(activeSectionState);
  const [showAnalysis, setShowAnalysis] = useRecoilState(showAnalysisState);

  if (!results) return null;

  return (
    <div className={`rounded-lg border border-slate-200 ${activeSection === 'analysis' ? 'ring-2 ring-indigo-500' : ''}`}>
      <div className="flex items-center justify-between px-4 py-3 bg-white/70 rounded-t-lg">
        <h3 className="font-semibold text-slate-800">Resume Improvements</h3>
        <button
          className="text-sm px-3 py-1 rounded-md bg-slate-100 hover:bg-slate-200"
          onClick={() => setShowAnalysis((v) => !v)}
        >
          {showAnalysis ? 'Hide' : 'Show'}
        </button>
      </div>
      {showAnalysis && (
        <div className="px-4 pb-4">
          <div className="prose-custom" dangerouslySetInnerHTML={{ __html: results }} />
        </div>
      )}
      <div className="mt-3 px-4 pb-4">
        <button
          className="btn-primary"
          onClick={() => copyHtmlText(results)}
        >
          Copy Improvements
        </button>
      </div>
    </div>
  );
}



