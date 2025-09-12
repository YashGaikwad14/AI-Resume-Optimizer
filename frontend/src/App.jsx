import { useRecoilState } from "recoil";
import { marked } from "marked";
import ResultsUnified from "./components/ResultsUnified";
import ToolsSection from "./components/ToolsSection";
import NewHeader from "./components/NewHeader";
import HeroSection from "./components/HeroSection";
import {
  resumeFileState,
  jobDescriptionState,
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
  atsOptimizerState,
  activeSectionState
} from "./Atoms/atoms";

function App() {
  // Recoil state hooks
  const [resumeFile, setResumeFile] = useRecoilState(resumeFileState);
  const [jobDescription, setJobDescription] = useRecoilState(jobDescriptionState);
  const [loading, setLoading] = useRecoilState(loadingState);
  const [, setResults] = useRecoilState(resultsState);
  const [, setScore] = useRecoilState(scoreState);
  const [, setCoverLetter] = useRecoilState(coverLetterState);
  const [, setActiveSection] = useRecoilState(activeSectionState);
  const [, setRewriteBullets] = useRecoilState(rewriteBulletsState);
  const [, setSkillsGap] = useRecoilState(skillsGapState);
  const [, setTailor] = useRecoilState(tailorState);
  const [, setInterviewQs] = useRecoilState(interviewQsState);
  const [, setLinkedin] = useRecoilState(linkedinState);
  const [, setAtsOptimizer] = useRecoilState(atsOptimizerState);
  const [error, setError] = useRecoilState(errorState);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file?.type === "application/pdf") {
      setResumeFile(file);
      setError("");
    } else {
      setError("Please upload a PDF file");
    }
  };

  const analyzeResume = async () => {
    if (!resumeFile) {
      setError("Please upload a resume");
      return;
    }
    setLoading(true);
    setError("");
    setResults("");
    setActiveSection("analysis");

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobDescription", jobDescription);

    try {
      const res = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        body: formData,
      });
      const data = await parseResponse(res);
      if (data.error) throw new Error(data.error);
      setResults(marked(data.result));
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const scoreResume = async () => {
    if (!resumeFile) {
      setError("Please upload a resume");
      return;
    }
    setLoading(true);
    setError("");
    setScore(null);
    setActiveSection("score");
    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobDescription", jobDescription);
    try {
      const res = await fetch("http://localhost:5000/score", {
        method: "POST",
        body: formData,
      });
      const data = await parseResponse(res);
      if (data.error) throw new Error(data.error);
      setScore(data);
    } catch (err) {
      setError(err.message || "Failed to score resume");
    } finally {
      setLoading(false);
    }
  };

  const generateCoverLetter = async () => {
    if (!resumeFile) {
      setError("Please upload a resume");
      return;
    }
    setLoading(true);
    setError("");
    setCoverLetter("");
    setActiveSection("coverLetter");
    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobDescription", jobDescription);
    try {
      const res = await fetch("http://localhost:5000/cover-letter", {
        method: "POST",
        body: formData,
      });
      const data = await parseResponse(res);
      if (data.error) throw new Error(data.error);
      setCoverLetter(marked(data.result));
      requestAnimationFrame(() => {
        const el = document.getElementById('section-coverLetter');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } catch (err) {
      setError(err.message || "Failed to generate cover letter");
    } finally {
      setLoading(false);
    }
  };

  const copyHtmlText = async (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    const text = tmp.textContent || tmp.innerText || '';
    await navigator.clipboard.writeText(text);
  };

  const callTool = async (path, setState, section) => {
    if (!resumeFile) {
      setError("Please upload a resume");
      return;
    }
    setLoading(true);
    setError("");
    setActiveSection(section);
    setState("");
    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobDescription", jobDescription);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`http://localhost:5000/${path}`, { method: "POST", body: formData, headers });
      const data = await parseResponse(res);
      if (data.error) throw new Error(data.error);
      setState(marked(data.result));
      // Scroll to the generated section
      requestAnimationFrame(() => {
        const el = document.getElementById(`section-${section}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } catch (err) {
      setError(err.message || `Failed to call ${path}`);
    } finally {
      setLoading(false);
    }
  };

  const parseResponse = async (res) => {
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return res.json();
    }
    const text = await res.text();
    throw new Error(`Server returned non-JSON (${res.status}). ${text.slice(0,200)}`);
  };

  const handleToolClick = (tool) => {
    const setStateMap = {
      'premium/rewrite-bullets': setRewriteBullets,
      'premium/skills-gap': setSkillsGap,
      'premium/tailor': setTailor,
      'premium/interview-questions': setInterviewQs,
      'premium/linkedin': setLinkedin,
      'premium/ats-optimizer': setAtsOptimizer
    };
    
    const setState = setStateMap[tool.path];
    if (setState) {
      callTool(tool.path, setState, tool.section);
    }
  };

  return (
    <div className="main-container">
      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6">
        <NewHeader />
        <HeroSection />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="rounded-2xl border border-border bg-secondary p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Inputs</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-semibold text-muted-foreground mb-2">Upload Resume (PDF)</label>
                <label className={`file-drop-zone ${resumeFile ? "file-selected" : ""}`}>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  {resumeFile ? (
                    <span className="text-sm text-muted-foreground">{resumeFile.name}</span>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-primary"><path d="M12 16a1 1 0 0 1-1-1V8.41l-2.3 2.3a1 1 0 1 1-1.4-1.42l4-4a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1-1.4 1.42L13 8.4V15a1 1 0 0 1-1 1Z"/><path d="M5 20a3 3 0 0 1-3-3v-1a3 3 0 0 1 3-3h2a1 1 0 0 1 0 2H5a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1h-2a1 1 0 1 1 0-2h2a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3H5Z"/></svg>
                      <div className="text-muted-foreground">
                        <div className="text-sm font-medium">Click to choose a PDF</div>
                        <div className="text-xs opacity-80">or drag and drop your resume here</div>
                      </div>
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background/50 text-sm">
                        Browse Files
                      </span>
                    </div>
                  )}
                </label>
              </div>
              <div>
                <label className="block text-sm font-semibold text-muted-foreground mb-2">Job Description</label>
                <div className="rounded-xl border border-border bg-background/50 p-3">
                  <textarea
                    id="jd-area"
                    className="w-full h-32 sm:h-48 p-3 bg-transparent outline-none text-foreground placeholder:text-muted-foreground transition-smooth resize-none"
                    placeholder="Paste the complete job description... (requirements, responsibilities, company info)"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2 text-xs text-muted-foreground gap-1">
                    <span>Tip: richer JDs yield better analysis.</span>
                    <span>{jobDescription.length} chars</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-secondary p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Tools</h3>
            <ToolsSection 
              onAnalyze={analyzeResume}
              onScoreMatch={scoreResume}
              onGenerateCoverLetter={generateCoverLetter}
              onAdvancedTool={handleToolClick}
              onAdvancedToggle={(open) => {
                const area = document.getElementById('jd-area');
                if (area) {
                  area.style.height = open ? '20rem' : '12rem';
                }
              }}
              isLoading={loading}
              canAnalyze={!!resumeFile}
            />
            {error && (
              <div className="mt-4 error-banner">
                <div className="text-sm">{error}</div>
                <button className="text-xs underline text-red-200/80" onClick={() => setError("")}>Dismiss</button>
              </div>
            )}
          </div>
        </div>
        <div className="mt-8">
          <ResultsUnified />
        </div>
      </div>
    </div>
  );
}

export default App;
