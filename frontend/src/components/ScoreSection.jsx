import { useRecoilValue, useRecoilState } from 'recoil';
import { scoreState, activeSectionState, showScoreState } from '../Atoms/atoms';

export default function ScoreSection() {
  const score = useRecoilValue(scoreState);
  const activeSection = useRecoilValue(activeSectionState);
  const [showScore, setShowScore] = useRecoilState(showScoreState);

  if (!score) return null;

  return (
    <div id="section-score" className={`scroll-offset prose-custom mt-6 rounded-lg border border-slate-200 ${activeSection === 'score' ? 'ring-2 ring-indigo-500' : ''}`}>
      <div className="flex items-center justify-between px-4 py-3 bg-white/70 rounded-t-lg">
        <h3 className="font-semibold text-slate-800">Match Score: {score.score}%</h3>
        <button className="text-sm px-3 py-1 rounded-md bg-slate-100 hover:bg-slate-200" onClick={() => setShowScore(v => !v)}>{showScore ? 'Hide' : 'Show'}</button>
      </div>
      {showScore && (
        <div className="px-4 pb-4">
          <p>Total keywords: {score.totalKeywords}</p>
          {score.matched?.length ? (
            <div>
              <strong>Matched keywords:</strong>
              <div className="mt-2 flex flex-wrap gap-2">
                {score.matched.map((w) => (
                  <span key={w} className="px-2 py-1 rounded bg-indigo-100 text-indigo-700 text-sm">{w}</span>
                ))}
              </div>
            </div>
          ) : null}
          {score.flags?.length ? (
            <div className="mt-4">
              <strong>Flags:</strong>
              <ul className="list-disc pl-6">
                {score.flags.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}



