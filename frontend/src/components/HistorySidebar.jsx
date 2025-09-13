import { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { marked } from 'marked';
import { 
  activeSectionState, 
  resultsState, 
  scoreState, 
  coverLetterState, 
  rewriteBulletsState, 
  skillsGapState, 
  tailorState, 
  interviewQsState, 
  linkedinState, 
  atsOptimizerState 
} from '../Atoms/atoms';

export default function HistorySidebar({ isOpen, onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useRecoilState(activeSectionState);
  const [, setResults] = useRecoilState(resultsState);
  const [, setScore] = useRecoilState(scoreState);
  const [, setCoverLetter] = useRecoilState(coverLetterState);
  const [, setRewriteBullets] = useRecoilState(rewriteBulletsState);
  const [, setSkillsGap] = useRecoilState(skillsGapState);
  const [, setTailor] = useRecoilState(tailorState);
  const [, setInterviewQs] = useRecoilState(interviewQsState);
  const [, setLinkedin] = useRecoilState(linkedinState);
  const [, setAtsOptimizer] = useRecoilState(atsOptimizerState);
  const [selectedItem, setSelectedItem] = useState(null);

  function handleClick(item) {
    setSelectedItem(item);
  }


  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/records/recent?limit=20', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch history');
      setHistory(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      'analyze': 'Resume Analysis',
      'score': 'Resume Scoring',
      'cover_letter': 'Cover Letter',
      'rewrite_bullets': 'Bullet Rewriting',
      'skills_gap': 'Skills Gap Analysis',
      'tailor': 'Resume Tailoring',
      'interview_questions': 'Interview Questions',
      'linkedin': 'LinkedIn Suggestions'
    };
    return labels[type] || type;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleHistoryClick = (record) => {
    // Map record types to section names and state setters
    const typeToSection = {
      'analyze': 'analysis',
      'score': 'score',
      'cover_letter': 'coverLetter',
      'rewrite_bullets': 'rewriteBullets',
      'skills_gap': 'skillsGap',
      'tailor': 'tailor',
      'interview_questions': 'interviewQs',
      'linkedin': 'linkedin',
      'premium_ats_optimizer': 'premiumAts'
    };
    
    const section = typeToSection[record.type];
    if (section) {
      // Load the historical content into the appropriate state
      switch (record.type) {
        case 'analyze':
          setResults(marked(record.content));
          break;
        case 'score':
          try {
            const scoreData = JSON.parse(record.content);
            setScore(scoreData);
          } catch (e) {
            console.error('Failed to parse score data:', e);
          }
          break;
        case 'cover_letter':
          setCoverLetter(marked(record.content));
          break;
        case 'rewrite_bullets':
          setRewriteBullets(marked(record.content));
          break;
        case 'skills_gap':
          setSkillsGap(marked(record.content));
          break;
        case 'tailor':
          setTailor(marked(record.content));
          break;
        case 'interview_questions':
          setInterviewQs(marked(record.content));
          break;
        case 'linkedin':
          setLinkedin(marked(record.content));
          break;
        case 'premium_ats_optimizer':
          setAtsOptimizer(marked(record.content));
          break;
        default:
          console.warn('Unknown record type:', record.type);
      }
      
      setActiveSection(section);
      // Scroll to the section
      setTimeout(() => {
        const element = document.getElementById(`section-${section}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-secondary shadow-xl transform transition-transform duration-300 ease-in-out z-50 border-l border-border ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">History</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-background/50 transition-colors text-muted-foreground hover:text-foreground"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}

            {error && (
              <div className="error-container mb-4">
                <p className="text-sm">{error}</p>
                <button
                  onClick={fetchHistory}
                  className="text-xs underline mt-1"
                >
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && history.length === 0 && (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-muted-foreground mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-muted-foreground text-sm">No history yet</p>
                <p className="text-muted-foreground/70 text-xs mt-1">Your resume analysis history will appear here</p>
              </div>
            )}

            {!loading && !error && history.length > 0 && (
              <div className="space-y-3">
                {history.map((record, index) => (
                  <div
                    key={record.id || index}
                    onClick={() => handleHistoryClick(record)}
                    className="p-3 rounded-xl border border-border hover:border-primary/50 hover:bg-background/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-foreground truncate">
                          {getTypeLabel(record.type)}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(record.created_at)}
                        </p>
                        {record.content && (
                          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                            {record.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                          </p>
                        )}
                      </div>
                      <div className="ml-2 flex-shrink-0">
                        <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <button
              onClick={fetchHistory}
              className="w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-background/50 rounded-xl transition-colors"
            >
              Refresh History
            </button>
          </div>
        </div>
      </div>
    </>
  );
}