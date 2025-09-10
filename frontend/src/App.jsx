import { useState } from "react";
import { marked } from "marked";

function App() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState("");
  const [score, setScore] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [showAnalysis, setShowAnalysis] = useState(true);
  const [activeSection, setActiveSection] = useState("analysis"); // analysis | score | coverLetter | rewrite | skills | tailor | interview | linkedin
  const [rewriteBullets, setRewriteBullets] = useState("");
  const [skillsGap, setSkillsGap] = useState("");
  const [tailor, setTailor] = useState("");
  const [interviewQs, setInterviewQs] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [showScore, setShowScore] = useState(true);
  const [showCover, setShowCover] = useState(true);
  const [showRewrite, setShowRewrite] = useState(true);
  const [showSkills, setShowSkills] = useState(true);
  const [showTailor, setShowTailor] = useState(true);
  const [showInterview, setShowInterview] = useState(true);
  const [showLinkedin, setShowLinkedin] = useState(true);
  const [error, setError] = useState("");

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
    setShowAnalysis(true);

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
    setShowAnalysis(false);
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
    setShowAnalysis(false);
    setShowCover(true);
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
    setShowAnalysis(false);
    // Ensure the selected section is expanded
    if (section === 'skills') setShowSkills(true);
    if (section === 'rewrite') setShowRewrite(true);
    if (section === 'tailor') setShowTailor(true);
    if (section === 'interview') setShowInterview(true);
    if (section === 'linkedin') setShowLinkedin(true);
    if (section === 'coverLetter') setShowCover(true);
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
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100" disabled={loading} onClick={() => { setShowToolsMenu(false); callTool('rewrite-bullets', setRewriteBullets, 'rewrite'); }}>Rewrite Bullets</button>
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100" disabled={loading} onClick={() => { setShowToolsMenu(false); callTool('skills-gap', setSkillsGap, 'skills'); }}>Skills Gap</button>
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100" disabled={loading} onClick={() => { setShowToolsMenu(false); callTool('tailor', setTailor, 'tailor'); }}>Tailor Resume</button>
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100" disabled={loading} onClick={() => { setShowToolsMenu(false); callTool('interview-questions', setInterviewQs, 'interview'); }}>Interview Questions</button>
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100" disabled={loading} onClick={() => { setShowToolsMenu(false); callTool('linkedin', setLinkedin, 'linkedin'); }}>LinkedIn Suggestions</button>
                </div>
              )}
            </div>

            {error && (
              <div className="error-container">{error}</div>
            )}
          </div>

          <div className={`results-container`}>
            {loading && (
              <div className="loading-overlay">
                <div className="loading-spinner" />
                <div className="mt-3 text-slate-700">Analyzing your resume...</div>
              </div>
            )}

            {!loading && !results && !error && (
              <div className="empty-state">
                <div className="text-slate-600">Your analysis will appear here.</div>
              </div>
            )}

            {!!results && (
              <div className={`rounded-lg border border-slate-200 ${activeSection === 'analysis' ? 'ring-2 ring-indigo-500' : ''}`}>
                <div className="flex items-center justify-between px-4 py-3 bg-white/70 rounded-t-lg">
                  <h3 className="font-semibold text-slate-800">Resume Improvements</h3>
                  <button
                    className="text-sm px-3 py-1 rounded-md bg-slate-100 hover:bg-slate-200"
                    onClick={() => setShowAnalysis((v) => !v)}
                  >
                    {showAnalysis ? 'Hide' : 'Show'}
                  </button>
                </div>
                {showAnalysis && (
                  <div className="px-4 pb-4">
                    <div className="prose-custom" dangerouslySetInnerHTML={{ __html: results }} />
                  </div>
                )}
              </div>
            )}

            {!!results && (
              <div className="mt-3">
                <button
                  className="btn-primary"
                  onClick={() => copyHtmlText(results)}
                >
                  Copy Improvements
                </button>
              </div>
            )}

            {score && (
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
            )}

            {!!coverLetter && (
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
            )}

            {!!rewriteBullets && (
              <div id="section-rewrite" className={`scroll-offset prose-custom mt-6 rounded-lg border border-slate-200 ${activeSection === 'rewrite' ? 'ring-2 ring-indigo-500' : ''}`}>
                <div className="flex items-center justify-between px-4 py-3 bg-white/70 rounded-t-lg">
                  <h3 className="font-semibold text-slate-800">Rewritten Bullets</h3>
                  <button className="text-sm px-3 py-1 rounded-md bg-slate-100 hover:bg-slate-200" onClick={() => setShowRewrite(v => !v)}>{showRewrite ? 'Hide' : 'Show'}</button>
                </div>
                {showRewrite && (
                  <div className="px-4 pb-4">
                    <div dangerouslySetInnerHTML={{ __html: rewriteBullets }} />
                    <div className="mt-3"><button className="btn-primary" onClick={() => copyHtmlText(rewriteBullets)}>Copy Bullets</button></div>
                  </div>
                )}
              </div>
            )}

            {!!skillsGap && (
              <div id="section-skills" className={`scroll-offset prose-custom mt-6 rounded-lg border border-slate-200 ${activeSection === 'skills' ? 'ring-2 ring-indigo-500' : ''}`}>
                <div className="flex items-center justify-between px-4 py-3 bg-white/70 rounded-t-lg">
                  <h3 className="font-semibold text-slate-800">Skills Gap & Roadmap</h3>
                  <button className="text-sm px-3 py-1 rounded-md bg-slate-100 hover:bg-slate-200" onClick={() => setShowSkills(v => !v)}>{showSkills ? 'Hide' : 'Show'}</button>
                </div>
                {showSkills && (
                  <div className="px-4 pb-4">
                    <div dangerouslySetInnerHTML={{ __html: skillsGap }} />
                    <div className="mt-3"><button className="btn-primary" onClick={() => copyHtmlText(skillsGap)}>Copy Roadmap</button></div>
                  </div>
                )}
              </div>
            )}

            {!!tailor && (
              <div id="section-tailor" className={`scroll-offset prose-custom mt-6 rounded-lg border border-slate-200 ${activeSection === 'tailor' ? 'ring-2 ring-indigo-500' : ''}`}>
                <div className="flex items-center justify-between px-4 py-3 bg-white/70 rounded-t-lg">
                  <h3 className="font-semibold text-slate-800">Tailored Mapping</h3>
                  <button className="text-sm px-3 py-1 rounded-md bg-slate-100 hover:bg-slate-200" onClick={() => setShowTailor(v => !v)}>{showTailor ? 'Hide' : 'Show'}</button>
                </div>
                {showTailor && (
                  <div className="px-4 pb-4">
                    <div dangerouslySetInnerHTML={{ __html: tailor }} />
                    <div className="mt-3"><button className="btn-primary" onClick={() => copyHtmlText(tailor)}>Copy Mapping</button></div>
                  </div>
                )}
              </div>
            )}

            {!!interviewQs && (
              <div id="section-interview" className={`scroll-offset prose-custom mt-6 rounded-lg border border-slate-200 ${activeSection === 'interview' ? 'ring-2 ring-indigo-500' : ''}`}>
                <div className="flex items-center justify-between px-4 py-3 bg-white/70 rounded-t-lg">
                  <h3 className="font-semibold text-slate-800">Interview Questions</h3>
                  <button className="text-sm px-3 py-1 rounded-md bg-slate-100 hover:bg-slate-200" onClick={() => setShowInterview(v => !v)}>{showInterview ? 'Hide' : 'Show'}</button>
                </div>
                {showInterview && (
                  <div className="px-4 pb-4">
                    <div dangerouslySetInnerHTML={{ __html: interviewQs }} />
                    <div className="mt-3"><button className="btn-primary" onClick={() => copyHtmlText(interviewQs)}>Copy Questions</button></div>
                  </div>
                )}
              </div>
            )}

            {!!linkedin && (
              <div id="section-linkedin" className={`scroll-offset prose-custom mt-6 rounded-lg border border-slate-200 ${activeSection === 'linkedin' ? 'ring-2 ring-indigo-500' : ''}`}>
                <div className="flex items-center justify-between px-4 py-3 bg-white/70 rounded-t-lg">
                  <h3 className="font-semibold text-slate-800">LinkedIn Suggestions</h3>
                  <button className="text-sm px-3 py-1 rounded-md bg-slate-100 hover:bg-slate-200" onClick={() => setShowLinkedin(v => !v)}>{showLinkedin ? 'Hide' : 'Show'}</button>
                </div>
                {showLinkedin && (
                  <div className="px-4 pb-4">
                    <div dangerouslySetInnerHTML={{ __html: linkedin }} />
                    <div className="mt-3"><button className="btn-primary" onClick={() => copyHtmlText(linkedin)}>Copy Suggestions</button></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
