import { useRecoilValue, useRecoilState } from 'recoil';
import { coverLetterState, activeSectionState, showCoverState } from '../Atoms/atoms';

export default function CoverLetterSection({ copyHtmlText }) {
  const coverLetter = useRecoilValue(coverLetterState);
  const activeSection = useRecoilValue(activeSectionState);
  const [showCover, setShowCover] = useRecoilState(showCoverState);

  if (!coverLetter) return null;

  return (
    <div id="section-coverLetter" className={`scroll-offset prose-custom mt-6 rounded-lg border border-slate-200 ${activeSection === 'coverLetter' ? 'ring-2 ring-indigo-500' : ''}`}>
      <div className="flex items-center justify-between px-4 py-3 bg-white/70 rounded-t-lg">
        <h3 className="font-semibold text-slate-800">Cover Letter</h3>
        <button className="text-sm px-3 py-1 rounded-md bg-slate-100 hover:bg-slate-200" onClick={() => setShowCover(v => !v)}>{showCover ? 'Hide' : 'Show'}</button>
      </div>
      {showCover && (
        <div className="px-4 pb-4">
          <div dangerouslySetInnerHTML={{ __html: coverLetter }} />
          <div className="mt-3">
            <button className="btn-primary" onClick={() => copyHtmlText(coverLetter)}>Copy Cover Letter</button>
          </div>
        </div>
      )}
    </div>
  );
}



