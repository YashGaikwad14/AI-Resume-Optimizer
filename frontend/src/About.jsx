export default function About() {
  return (
    <div className="main-container">
      <div className="card-primary">
        <header className="app-header">
          <h1 className="app-title">About</h1>
          <p className="app-subtitle">What this app can do for your resume</p>
        </header>
        <div className="prose-custom space-y-4">
          <h3>Capabilities</h3>
          <ul>
            <li>Analyze resume and provide actionable improvements</li>
            <li>Score match against a job description (keywords and ATS checks)</li>
            <li>Generate a tailored cover letter</li>
            <li>Rewrite resume bullets using STAR and quantification</li>
            <li>Identify skills gaps and provide a learning roadmap</li>
            <li>Tailor resume mapping to JD keywords and requirements</li>
            <li>Generate interview questions with talking points</li>
            <li>Draft LinkedIn headlines and About summaries</li>
            <li>Copy results to clipboard for easy use</li>
            <li>Modern responsive UI optimized for readability</li>
          </ul>
          <h3>How to use</h3>
          <ol className="list-decimal pl-6">
            <li>Upload your resume PDF</li>
            <li>Paste a job description (optional but recommended)</li>
            <li>Click Analyze, Score Match, Cover Letter, or open More Tools</li>
            <li>Copy the outputs and iterate on your resume</li>
          </ol>
        </div>
      </div>
    </div>
  );
}


