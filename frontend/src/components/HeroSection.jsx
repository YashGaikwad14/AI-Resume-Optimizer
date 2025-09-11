export default function HeroSection() {
  return (
    <section className="relative py-16 px-6 text-center">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              AI Resume Optimizer
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Get instant feedback to tailor your resume for any job. Analyze, optimize, and land your dream position with AI-powered insights.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <div className="flex items-center space-x-2 px-4 py-2 bg-secondary rounded-full border border-border">
            <div className="w-2 h-2 bg-primary rounded-full shadow-glow-primary"></div>
            <span className="text-sm text-muted-foreground">Resume Analysis</span>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-secondary rounded-full border border-border">
            <div className="w-2 h-2 bg-accent rounded-full shadow-glow-accent"></div>
            <span className="text-sm text-muted-foreground">Job Matching</span>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-secondary rounded-full border border-border">
            <div className="w-2 h-2 bg-primary rounded-full shadow-glow-primary"></div>
            <span className="text-sm text-muted-foreground">AI Optimization</span>
          </div>
        </div>
      </div>
    </section>
  );
}
