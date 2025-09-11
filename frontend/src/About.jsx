import NewHeader from "./components/NewHeader";

export default function About() {
  return (
    <div className="main-container">
      <div className="max-w-6xl w-full mx-auto px-8 py-1">
        <NewHeader />
        <div className="pt-16">
        <section className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">About AI Resume Optimizer</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">Transform your career prospects with our cutting-edge AI technology that optimizes your resume for any job opportunity.</p>
        </section>

        <section className="mb-16">
          <div className="rounded-2xl bg-card/50 backdrop-blur-sm border border-primary/20 p-8">
            <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-primary bg-clip-text text-transparent">Our Mission</h2>
            <p className="text-lg text-muted-foreground text-center max-w-4xl mx-auto leading-relaxed">We believe everyone deserves a chance to showcase their best professional self. Our AI-powered platform analyzes job descriptions and optimizes your resume to match what employers are looking for, increasing your chances of landing that dream job.</p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-12 text-center bg-gradient-primary bg-clip-text text-transparent">Why Choose Our Platform?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'AI-Powered', text: 'Advanced AI algorithms analyze and optimize your resume content.' },
              { title: 'ATS Friendly', text: 'Ensures your resume passes Applicant Tracking Systems.' },
              { title: 'Expert Insights', text: 'Built with insights from HR professionals and recruiters.' },
              { title: 'Secure & Private', text: 'Your data is encrypted and never shared with third parties.' }
            ].map((f, i) => (
              <div key={i} className="rounded-2xl bg-card/50 backdrop-blur-sm border border-primary/20 p-6 text-center shadow-card hover:shadow-elegant transition-smooth">
                <h3 className="text-xl font-semibold mb-3 text-foreground">{f.title}</h3>
                <p className="text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </div>
        </section>



        {/* Exact Capabilities */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-12 text-center bg-gradient-primary bg-clip-text text-transparent">Exact Capabilities</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-2xl bg-card/50 backdrop-blur-sm border border-primary/20 p-6">
              <h3 className="text-xl font-semibold mb-4 text-primary">Resume Analysis & Optimization</h3>
              <ul className="space-y-2 text-muted-foreground">
                {[
                  'Keyword density analysis and optimization',
                  'ATS compatibility scoring and improvements',
                  'Skills gap identification and suggestions',
                  'Experience section enhancement',
                  'Professional formatting and structure',
                ].map((t, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1 text-primary">•</span><span>{t}</span></li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-card/50 backdrop-blur-sm border border-primary/20 p-6">
              <h3 className="text-xl font-semibold mb-4 text-primary">Job Matching & Intelligence</h3>
              <ul className="space-y-2 text-muted-foreground">
                {[
                  'Job description analysis and parsing',
                  'Required vs. preferred skills identification',
                  'Industry-specific terminology matching',
                  'Qualification level assessment',
                  'Company culture and value alignment',
                ].map((t, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1 text-primary">•</span><span>{t}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* How to Use */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-12 text-center bg-gradient-primary bg-clip-text text-transparent">How to Use AI Resume Optimizer</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            {[{
              title: 'Upload Your Resume',
              desc: 'Upload your current resume in PDF format. Our AI will analyze the content, structure, and formatting.',
              note: 'Supported formats: PDF files up to 10MB'
            },{
              title: 'Paste Job Description',
              desc: 'Copy and paste the complete job description from the job posting you want to apply for.',
              note: 'Tip: Include requirements, responsibilities, and company information for best results'
            },{
              title: 'Get Optimized Results',
              desc: 'Receive your optimized resume with detailed analysis, keyword improvements, and ATS compatibility score.',
              note: 'Results include: Match score, suggestions, and optimized resume'
            }].map((s, i) => (
              <div key={s.title} className="rounded-2xl bg-card/50 backdrop-blur-sm border border-primary/20 p-6 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow-primary"><span className="text-2xl font-bold text-white">{i+1}</span></div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">{s.title}</h3>
                <p className="text-muted-foreground mb-4">{s.desc}</p>
                <div className="text-sm text-muted-foreground bg-background/50 rounded-lg p-3">{s.note}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Available Tools */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-12 text-center bg-gradient-primary bg-clip-text text-transparent">Available Optimization Tools</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              ['Keyword Optimizer','Automatically identifies missing keywords from the job description and suggests where to include them naturally in your resume.'],
              ['ATS Checker','Scans your resume for ATS compatibility issues like formatting problems, missing sections, or incompatible fonts.'],
              ['Skills Matcher','Compares your skills with job requirements and highlights which skills to emphasize or add to your resume.'],
              ['Experience Enhancer','Suggests improvements to your experience descriptions using action verbs and quantifiable achievements.'],
              ['Format Optimizer','Ensures proper formatting, consistent styling, and optimal layout for both human readers and ATS systems.'],
              ['Match Score','Provides a percentage match score between your resume and the job description with detailed breakdown.'],
            ].map(([title, text]) => (
              <div key={title} className="rounded-2xl bg-card/50 backdrop-blur-sm border border-primary/20 p-6">
                <h3 className="text-lg font-semibold mb-3 text-primary">{title}</h3>
                <p className="text-muted-foreground text-sm">{text}</p>
              </div>
            ))}
          </div>
        </section>

       
        </div>
      </div>
    </div>
  );
}


