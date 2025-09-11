import { useState } from "react";

export default function ToolsSection({ onAnalyze, onScoreMatch, onGenerateCoverLetter, onAdvancedTool, onAdvancedToggle, isLoading, canAnalyze }) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [busyKey, setBusyKey] = useState("");

  const mainTools = [
    { name: "Analyze Resume", action: onAnalyze, description: "Get detailed analysis of your resume", gradient: "from-blue-500 to-purple-600" },
    { name: "Score Match", action: onScoreMatch, description: "See how well your resume matches the job", gradient: "from-purple-500 to-pink-600" },
    { name: "Cover Letter", action: onGenerateCoverLetter, description: "Generate a tailored cover letter     ", gradient: "from-pink-500 to-red-600" }
  ];

  const advancedTools = [
    { name: "Rewrite Bullets", path: "rewrite-bullets", section: "rewrite" },
    { name: "Skills Gap", path: "skills-gap", section: "skills" },
    { name: "Tailor Resume", path: "tailor", section: "tailor" },
    { name: "Interview Questions", path: "interview-questions", section: "interview" },
    { name: "LinkedIn Suggestions", path: "linkedin", section: "linkedin" }
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
        <div className="grid gap-4 md:grid-cols-3">
          {mainTools.map((tool, index) => (
            <div key={index} className="p-6 rounded-xl border border-border bg-secondary shadow-card hover:shadow-elegant transition-smooth">
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <div className="p-3 rounded-xl bg-gradient-primary shadow-glow-accent"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">{tool.name}</h4>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </div>
                <button
                  className="btn-primary w-full bg-gradient-button shadow-glow-accent "
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
          className="w-full p-4 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/40 hover:border-primary text-foreground transition-smooth"
          onClick={() => { const v = !showAdvanced; setShowAdvanced(v); if (onAdvancedToggle) onAdvancedToggle(v); }}
        >
          <span className="font-medium">
            {showAdvanced ? "Hide Advanced Tools" : "Show Advanced Tools"}
          </span>
        </button>
        {showAdvanced && (
          <div className="mt-4 p-6 rounded-xl border border-border bg-secondary">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
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
          </div>
        )}
      </div>
    </div>
  );
}
