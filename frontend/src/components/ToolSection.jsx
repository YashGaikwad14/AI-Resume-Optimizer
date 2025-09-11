import { useRecoilValue, useRecoilState } from 'recoil';
import { 
  activeSectionState,
  rewriteBulletsState,
  skillsGapState,
  tailorState,
  interviewQsState,
  linkedinState,
  showRewriteState,
  showSkillsState,
  showTailorState,
  showInterviewState,
  showLinkedinState
} from '../Atoms/atoms';

export default function ToolSection({ 
  title, 
  sectionId, 
  copyHtmlText, 
  copyButtonText
}) {
  const activeSection = useRecoilValue(activeSectionState);
  
  // Get content and show state based on sectionId
  let content, show, setShow;
  
  switch (sectionId) {
    case 'section-rewrite':
      content = useRecoilValue(rewriteBulletsState);
      [show, setShow] = useRecoilState(showRewriteState);
      break;
    case 'section-skills':
      content = useRecoilValue(skillsGapState);
      [show, setShow] = useRecoilState(showSkillsState);
      break;
    case 'section-tailor':
      content = useRecoilValue(tailorState);
      [show, setShow] = useRecoilState(showTailorState);
      break;
    case 'section-interview':
      content = useRecoilValue(interviewQsState);
      [show, setShow] = useRecoilState(showInterviewState);
      break;
    case 'section-linkedin':
      content = useRecoilValue(linkedinState);
      [show, setShow] = useRecoilState(showLinkedinState);
      break;
    default:
      content = '';
      show = true;
      setShow = () => {};
  }

  if (!content) return null;

  return (
    <div id={sectionId} className={`scroll-offset prose-custom mt-6 rounded-lg border border-slate-200 ${activeSection === sectionId.replace('section-', '') ? 'ring-2 ring-indigo-500' : ''}`}>
      <div className="flex items-center justify-between px-4 py-3 bg-white/70 rounded-t-lg">
        <h3 className="font-semibold text-slate-800">{title}</h3>
        <button className="text-sm px-3 py-1 rounded-md bg-slate-100 hover:bg-slate-200" onClick={() => setShow(v => !v)}>{show ? 'Hide' : 'Show'}</button>
      </div>
      {show && (
        <div className="px-4 pb-4">
          <div dangerouslySetInnerHTML={{ __html: content }} />
          <div className="mt-3">
            <button className="btn-primary" onClick={() => copyHtmlText(content)}>{copyButtonText}</button>
          </div>
        </div>
      )}
    </div>
  );
}



