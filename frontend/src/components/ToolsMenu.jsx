import { useRecoilValue, useRecoilState } from 'recoil';
import { loadingState, showToolsMenuState } from '../Atoms/atoms';

export default function ToolsMenu({ onToolClick }) {
  const loading = useRecoilValue(loadingState);
  const [showToolsMenu, setShowToolsMenu] = useRecoilState(showToolsMenuState);

  const tools = [
    { name: 'Rewrite Bullets', path: 'rewrite-bullets', section: 'rewrite' },
    { name: 'Skills Gap', path: 'skills-gap', section: 'skills' },
    { name: 'Tailor Resume', path: 'tailor', section: 'tailor' },
    { name: 'Interview Questions', path: 'interview-questions', section: 'interview' },
    { name: 'LinkedIn Suggestions', path: 'linkedin', section: 'linkedin' }
  ];

  const handleToolClick = (tool) => {
    setShowToolsMenu(false);
    onToolClick(tool);
  };

  return (
    <div className="relative mt-3">
      <button
        className="btn-primary"
        onClick={() => setShowToolsMenu((v) => !v)}
        disabled={loading}
      >
        {showToolsMenu ? 'Hide Tools' : 'More Tools'}
      </button>
      {showToolsMenu && (
        <div className="absolute z-10 mt-2 w-full md:w-80 bg-white border border-slate-200 rounded-xl shadow-lg p-2 grid grid-cols-1 gap-2">
          {tools.map((tool) => (
            <button
              key={tool.path}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100"
              disabled={loading}
              onClick={() => handleToolClick(tool)}
            >
              {tool.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
