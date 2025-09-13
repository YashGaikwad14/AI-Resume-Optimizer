import { useRecoilValue, useRecoilState } from 'recoil';
import { activeSectionState, resultsState, scoreState, coverLetterState, skillsGapState, rewriteBulletsState, tailorState, interviewQsState, linkedinState, atsOptimizerState, showAnalysisState, showScoreState, showCoverState, showRewriteState, showSkillsState, showTailorState, showInterviewState, showLinkedinState, showAtsOptimizerState } from '../Atoms/atoms';
import { downloadAsPDF } from '../utils/pdfGenerator';

export default function ResultsUnified() {
  const active = useRecoilValue(activeSectionState);
  const results = useRecoilValue(resultsState);
  const score = useRecoilValue(scoreState);
  const coverLetter = useRecoilValue(coverLetterState);
  const rewriteBullets = useRecoilValue(rewriteBulletsState);
  const skillsGap = useRecoilValue(skillsGapState);
  const tailor = useRecoilValue(tailorState);
  const interviewQs = useRecoilValue(interviewQsState);
  const linkedin = useRecoilValue(linkedinState);
  const atsOptimizer = useRecoilValue(atsOptimizerState);

  const [showAnalysis, setShowAnalysis] = useRecoilState(showAnalysisState);
  const [showScore, setShowScore] = useRecoilState(showScoreState);
  const [showCover, setShowCover] = useRecoilState(showCoverState);
  const [showRewrite, setShowRewrite] = useRecoilState(showRewriteState);
  const [showSkills, setShowSkills] = useRecoilState(showSkillsState);
  const [showTailor, setShowTailor] = useRecoilState(showTailorState);
  const [showInterview, setShowInterview] = useRecoilState(showInterviewState);
  const [showLinkedin, setShowLinkedin] = useRecoilState(showLinkedinState);
  const [showAtsOptimizer, setShowAtsOptimizer] = useRecoilState(showAtsOptimizerState);

  const copyHtmlText = async (html) => {
    if (!html) return;
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    const text = tmp.textContent || tmp.innerText || '';
    await navigator.clipboard.writeText(text);
  };

  const downloadScoreAsPDF = async (scoreData) => {
    if (!scoreData) return;
    
    // Create HTML content for the score report
    const scoreHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="color: #333; margin-bottom: 20px;">Resume Match Score Report</h1>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #2563eb; margin: 0;">Overall Match Score: ${scoreData.score}%</h2>
        </div>
        
        ${scoreData.matched?.length ? `
          <h3 style="color: #333; margin-bottom: 10px;">Matched Keywords (${scoreData.matched.length}):</h3>
          <div style="margin-bottom: 20px;">
            ${scoreData.matched.map(word => `<span style="background: #dbeafe; color: #1d4ed8; padding: 4px 8px; margin: 2px; border-radius: 4px; display: inline-block;">${word}</span>`).join('')}
          </div>
        ` : ''}
        
        ${scoreData.flags?.length ? `
          <h3 style="color: #333; margin-bottom: 10px;">Recommendations:</h3>
          <ul style="margin: 0; padding-left: 20px;">
            ${scoreData.flags.map(flag => `<li style="margin: 5px 0; color: #666;">${flag}</li>`).join('')}
          </ul>
        ` : ''}
        
        ${scoreData.totalKeywords ? `
          <div style="margin-top: 20px; padding: 10px; background: #f9fafb; border-radius: 4px;">
            <small style="color: #6b7280;">Total keywords analyzed: ${scoreData.totalKeywords}</small>
          </div>
        ` : ''}
      </div>
    `;
    
    await downloadAsPDF(scoreHtml, 'Resume Match Score');
  };

  return (
    <div className="space-y-6">
      {/* Analysis */}
      {results && (
        <div id="section-analysis" className={`rounded-2xl border border-primary/20 bg-card/50 backdrop-blur-sm p-4 sm:p-6 ${active === 'analysis' ? 'ring-2 ring-primary/50' : ''}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
            <h3 className="text-lg font-semibold text-foreground">Resume Improvements</h3>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm rounded-lg border border-border bg-background/50" onClick={() => copyHtmlText(results)}>Copy</button>
              <button className="px-3 py-1 text-sm rounded-lg border border-border bg-background/50" onClick={() => downloadAsPDF(results, 'Resume Analysis')}>Download PDF</button>
              <button className="px-3 py-1 text-sm rounded-lg border border-border bg-background/50" onClick={() => setShowAnalysis(v => !v)}>{showAnalysis ? 'Hide' : 'Show'}</button>
            </div>
          </div>
          {showAnalysis && (
            <div className="prose-custom break-words overflow-x-auto" dangerouslySetInnerHTML={{ __html: results }} />
          )}
        </div>
      )}

      {/* Score */}
      {score && (
        <div id="section-score" className={`rounded-2xl border border-primary/20 bg-card/50 backdrop-blur-sm p-4 sm:p-6 ${active === 'score' ? 'ring-2 ring-primary/50' : ''}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
            <h3 className="text-lg font-semibold text-foreground">Match Score: {score.score}%</h3>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm rounded-lg border border-border bg-background/50" onClick={() => downloadScoreAsPDF(score)}>Download PDF</button>
              <button className="px-3 py-1 text-sm rounded-lg border border-border bg-background/50" onClick={() => setShowScore(v => !v)}>{showScore ? 'Hide' : 'Show'}</button>
            </div>
          </div>
          {showScore && score.matched?.length ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {score.matched.map((w) => (
                <span key={w} className="px-2 py-1 rounded bg-primary/15 text-primary text-sm">{w}</span>
              ))}
            </div>
          ) : null}
          {showScore && score.flags?.length ? (
            <ul className="list-disc pl-6 mt-3">
              {score.flags.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          ) : null}
        </div>
      )}

      {/* Cover Letter */}
      {coverLetter && (
        <div id="section-coverLetter" className={`rounded-2xl border border-primary/20 bg-card/50 backdrop-blur-sm p-4 sm:p-6 ${active === 'coverLetter' ? 'ring-2 ring-primary/50' : ''}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
            <h3 className="text-lg font-semibold text-foreground">Cover Letter</h3>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm rounded-lg border border-border bg-background/50" onClick={() => copyHtmlText(coverLetter)}>Copy</button>
              <button className="px-3 py-1 text-sm rounded-lg border border-border bg-background/50" onClick={() => downloadAsPDF(coverLetter, 'Cover Letter')}>Download PDF</button>
              <button className="px-3 py-1 text-sm rounded-lg border border-border bg-background/50" onClick={() => setShowCover(v => !v)}>{showCover ? 'Hide' : 'Show'}</button>
            </div>
          </div>
          {showCover && (
            <div className="prose-custom break-words overflow-x-auto" dangerouslySetInnerHTML={{ __html: coverLetter }} />
          )}
        </div>
      )}

      {/* Tools */}
      {rewriteBullets && (
        <div id="section-rewriteBullets" className={`rounded-2xl border border-primary/20 bg-card/50 backdrop-blur-sm p-4 sm:p-6 ${active === 'rewriteBullets' ? 'ring-2 ring-primary/50' : ''}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
            <h3 className="text-lg font-semibold text-foreground">Rewritten Bullets</h3>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm rounded-lg border border-border bg-background/50" onClick={() => copyHtmlText(rewriteBullets)}>Copy</button>
              <button className="px-3 py-1 text-sm rounded-lg border border-border bg-background/50" onClick={() => downloadAsPDF(rewriteBullets, 'Rewritten Bullets')}>Download PDF</button>
              <button className="px-3 py-1 text-sm rounded-lg border border-border bg-background/50" onClick={() => setShowRewrite(v => !v)}>{showRewrite ? 'Hide' : 'Show'}</button>
            </div>
          </div>
          {showRewrite && (
            <div className="prose-custom break-words overflow-x-auto" dangerouslySetInnerHTML={{ __html: rewriteBullets }} />
          )}
        </div>
      )}

      {skillsGap && (
        <div id="section-skillsGap" className={`rounded-2xl border border-primary/20 bg-card/50 backdrop-blur-sm p-4 sm:p-6 ${active === 'skillsGap' ? 'ring-2 ring-primary/50' : ''}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
            <h3 className="text-lg font-semibold text-foreground">Skills Gap & Roadmap</h3>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm rounded-lg border border-border bg-background/50" onClick={() => copyHtmlText(skillsGap)}>Copy</button>
              <button className="px-3 py-1 text-sm rounded-lg border border-border bg-background/50" onClick={() => downloadAsPDF(skillsGap, 'Skills Gap Analysis')}>Download PDF</button>
              <button className="px-3 py-1 text-sm rounded-lg border border-border bg-background/50" onClick={() => setShowSkills(v => !v)}>{showSkills ? 'Hide' : 'Show'}</button>
            </div>
          </div>
          {showSkills && (
            <div className="prose-custom break-words overflow-x-auto" dangerouslySetInnerHTML={{ __html: skillsGap }} />
          )}
        </div>
      )}

      {tailor && (
        <div id="section-tailor" className={`rounded-2xl border border-primary/20 bg-card/50 backdrop-blur-sm p-4 sm:p-6 ${active === 'tailor' ? 'ring-2 ring-primary/50' : ''}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
            <h3 className="text-lg font-semibold text-foreground">Tailored Mapping</h3>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm rounded-lg border border-border bg-background/50" onClick={() => copyHtmlText(tailor)}>Copy</button>
              <button className="px-3 py-1 text-sm rounded-lg border border-border bg-background/50" onClick={() => downloadAsPDF(tailor, 'Tailored Resume Mapping')}>Download PDF</button>
              <button className="px-3 py-1 text-sm rounded-lg border border-border bg-background/50" onClick={() => setShowTailor(v => !v)}>{showTailor ? 'Hide' : 'Show'}</button>
            </div>
          </div>
          {showTailor && (
            <div className="prose-custom break-words overflow-x-auto" dangerouslySetInnerHTML={{ __html: tailor }} />
          )}
        </div>
      )}

      {interviewQs && (
        <div id="section-interviewQs" className={`rounded-2xl border border-primary/20 bg-card/50 backdrop-blur-sm p-4 sm:p-6 ${active === 'interviewQs' ? 'ring-2 ring-primary/50' : ''}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
            <h3 className="text-lg font-semibold text-foreground">Interview Questions</h3>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm rounded-lg border border-border bg-background/50" onClick={() => copyHtmlText(interviewQs)}>Copy</button>
              <button className="px-3 py-1 text-sm rounded-lg border border-border bg-background/50" onClick={() => downloadAsPDF(interviewQs, 'Interview Questions')}>Download PDF</button>
              <button className="px-3 py-1 text-sm rounded-lg border border-border bg-background/50" onClick={() => setShowInterview(v => !v)}>{showInterview ? 'Hide' : 'Show'}</button>
            </div>
          </div>
          {showInterview && (
            <div className="prose-custom break-words overflow-x-auto" dangerouslySetInnerHTML={{ __html: interviewQs }} />
          )}
        </div>
      )}

      {linkedin && (
        <div id="section-linkedin" className={`rounded-2xl border border-primary/20 bg-card/50 backdrop-blur-sm p-4 sm:p-6 ${active === 'linkedin' ? 'ring-2 ring-primary/50' : ''}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
            <h3 className="text-lg font-semibold text-foreground">LinkedIn Suggestions</h3>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm rounded-lg border border-border bg-background/50" onClick={() => copyHtmlText(linkedin)}>Copy</button>
              <button className="px-3 py-1 text-sm rounded-lg border border-border bg-background/50" onClick={() => downloadAsPDF(linkedin, 'LinkedIn Suggestions')}>Download PDF</button>
              <button className="px-3 py-1 text-sm rounded-lg border border-border bg-background/50" onClick={() => setShowLinkedin(v => !v)}>{showLinkedin ? 'Hide' : 'Show'}</button>
            </div>
          </div>
          {showLinkedin && (
            <div className="prose-custom break-words overflow-x-auto" dangerouslySetInnerHTML={{ __html: linkedin }} />
          )}
        </div>
      )}

      {atsOptimizer && (
        <div id="section-premiumAts" className={`rounded-2xl border border-primary/20 bg-card/50 backdrop-blur-sm p-4 sm:p-6 ${active === 'premiumAts' ? 'ring-2 ring-primary/50' : ''}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
            <h3 className="text-lg font-semibold text-foreground">ATS Optimizer</h3>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm rounded-lg border border-border bg-background/50" onClick={() => copyHtmlText(atsOptimizer)}>Copy</button>
              <button className="px-3 py-1 text-sm rounded-lg border border-border bg-background/50" onClick={() => downloadAsPDF(atsOptimizer, 'ATS Optimizer Report')}>Download PDF</button>
              <button className="px-3 py-1 text-sm rounded-lg border border-border bg-background/50" onClick={() => setShowAtsOptimizer(v => !v)}>{showAtsOptimizer ? 'Hide' : 'Show'}</button>
            </div>
          </div>
          {showAtsOptimizer && (
            <div className="prose-custom break-words overflow-x-auto" dangerouslySetInnerHTML={{ __html: atsOptimizer }} />
          )}
        </div>
      )}
    </div>
  );
}