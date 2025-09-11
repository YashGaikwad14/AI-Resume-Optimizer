import { useRecoilState } from "recoil";
import { marked } from "marked";
import ResultsContainer from "./components/ResultsContainer";
import ToolsMenu from "./components/ToolsMenu";
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
      const res = await fetch(`http://localhost:5000/${path}`, { method: "POST", body: formData });
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
      'rewrite-bullets': setRewriteBullets,
      'skills-gap': setSkillsGap,
      'tailor': setTailor,
      'interview-questions': setInterviewQs,
      'linkedin': setLinkedin
    };
    
    const setState = setStateMap[tool.path];
    if (setState) {
      callTool(tool.path, setState, tool.section);
    }
  };

  return (
    <div className="main-container">
      <div className="card-primary">
        <header className="app-header">
          <h1 className="app-title">AI Resume Optimizer</h1>
          <p className="app-subtitle">Get instant feedback to tailor your resume</p>
        </header>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="form-section">
            <h3 className="font-semibold text-slate-800 mb-2">Inputs</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="form-label">Upload Resume (PDF)</label>
                <label className={`file-drop-zone ${resumeFile ? "file-selected" : ""}`}>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  {resumeFile ? (
                    <span>{resumeFile.name}</span>
                  ) : (
                    <span>Click to choose a PDF</span>
                  )}
                </label>
              </div>
              <div className="md:col-span-2">
                <label className="form-label">Job Description</label>
                <textarea
                  className="form-textarea"
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>
            </div>

            <h3 className="font-semibold text-slate-800 mt-6 mb-2">Tools</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                className="btn-primary"
                onClick={analyzeResume}
                disabled={loading}
              >
                {loading ? "Analyzing..." : "Analyze Resume"}
              </button>
              <button
                className="btn-primary"
                onClick={scoreResume}
                disabled={loading}
              >
                Score Match
              </button>
              <button
                className="btn-primary"
                onClick={generateCoverLetter}
                disabled={loading}
              >
                Cover Letter
              </button>
            </div>
            <ToolsMenu onToolClick={handleToolClick} />

            {error && (
              <div className="error-container">{error}</div>
            )}
          </div>

          <ResultsContainer
            copyHtmlText={copyHtmlText}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
