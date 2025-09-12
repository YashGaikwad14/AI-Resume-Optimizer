import { useState } from "react";
import { useRecoilValue } from 'recoil';
import { userProfileState } from '../Atoms/atoms';

export default function ToolsSection({ onAnalyze, onScoreMatch, onGenerateCoverLetter, onAdvancedTool, onAdvancedToggle, isLoading, canAnalyze }) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [busyKey, setBusyKey] = useState("");
  const profile = useRecoilValue(userProfileState);

  const mainTools = [
    { name: "Analyze Resume", action: onAnalyze, description: "Get detailed analysis of your resume", gradient: "from-blue-500 to-purple-600" },
    { name: "Score Match", action: onScoreMatch, description: "See how well your resume matches the job", gradient: "from-purple-500 to-pink-600" },
    { name: "Cover Letter", action: onGenerateCoverLetter, description: "Generate a tailored cover letter     ", gradient: "from-pink-500 to-red-600" }
  ];

  const advancedTools = [
    // Moved to premium section
  ];

  const premiumTools = [
    { name: "Rewrite Bullets", path: "premium/rewrite-bullets", section: "rewrite", premium: true },
    { name: "Skills Gap", path: "premium/skills-gap", section: "skills", premium: true },
    { name: "Tailor Resume", path: "premium/tailor", section: "tailor", premium: true },
    { name: "Interview Questions", path: "premium/interview-questions", section: "interview", premium: true },
    { name: "LinkedIn Suggestions", path: "premium/linkedin", section: "linkedin", premium: true },
    { name: "ATS Optimizer", path: "premium/ats-optimizer", section: "premiumAts", premium: true },
  ];

  const runAction = async (key, fn) => {
    if (!fn) return;
    try {
      setBusyKey(key);
      await fn();
    } finally {
      setBusyKey("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {mainTools.map((tool, index) => (
            <div key={index} className="p-4 sm:p-6 rounded-xl border border-border bg-secondary shadow-card hover:shadow-elegant transition-smooth">
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <div className="p-3 rounded-xl bg-gradient-primary shadow-glow-accent"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">{tool.name}</h4>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </div>
                <button
                  className="btn-primary w-full bg-gradient-button shadow-glow-accent text-sm sm:text-base"
                  onClick={() => runAction(tool.name, tool.action)}
                  disabled={!canAnalyze || isLoading || !!busyKey}
                >
                  {busyKey === tool.name ? "Processing..." : tool.name}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <button
          className="w-full p-3 sm:p-4 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/40 hover:border-primary text-foreground transition-smooth text-sm sm:text-base"
          onClick={() => { const v = !showAdvanced; setShowAdvanced(v); if (onAdvancedToggle) onAdvancedToggle(v); }}
        >
          <span className="font-medium">
            {showAdvanced ? "Hide Advanced Tools" : "Show Advanced Tools"}
          </span>
        </button>
        {showAdvanced && (
          <div className="mt-4 p-4 sm:p-6 rounded-xl border border-border bg-secondary">
            {advancedTools.length > 0 && (
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {advancedTools.map((tool, index) => (
                  <button
                    key={index}
                    className="text-left p-4 rounded-lg bg-secondary/40 border border-border hover:bg-secondary/60 hover:border-primary disabled:opacity-60 transition-smooth shadow-card hover:shadow-glow-primary"
                    onClick={() => runAction(tool.path, () => onAdvancedTool && onAdvancedTool(tool))}
                    disabled={!canAnalyze || isLoading || !!busyKey}
                    title={`Runs /${tool.path}`}
                  >
                    <div className="font-medium text-foreground">{busyKey === tool.path ? 'Processing…' : tool.name}</div>
                    <div className="text-xs text-muted-foreground">Runs: /{tool.path}</div>
                  </button>
                ))}
              </div>
            )}
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <h5 className="text-sm font-semibold text-foreground">Premium Tools</h5>
                {!profile?.is_premium && (
                  <a href="/pricing" className="text-xs underline text-primary">Unlock Premium</a>
                )}
              </div>
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {premiumTools.map((tool, index) => (
                  <button
                    key={`p-${index}`}
                    className={`text-left p-3 sm:p-4 rounded-lg border transition-smooth shadow-card text-sm sm:text-base ${profile?.is_premium ? 'bg-secondary/40 hover:bg-secondary/60 hover:border-primary' : 'bg-secondary/20 border-dashed cursor-not-allowed opacity-70'}`}
                    onClick={() => profile?.is_premium ? runAction(tool.path, () => onAdvancedTool && onAdvancedTool(tool)) : null}
                    disabled={!canAnalyze || isLoading || !!busyKey || !profile?.is_premium}
                    title={profile?.is_premium ? `Runs /${tool.path}` : 'Premium required'}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-foreground">{busyKey === tool.path ? 'Processing…' : tool.name}</div>
                      {!profile?.is_premium && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-600 border border-amber-500/30">Locked</span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">Runs: /{tool.path}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
