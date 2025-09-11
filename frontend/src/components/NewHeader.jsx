import { Link, useLocation } from "react-router-dom";

export default function NewHeader() {
  const location = useLocation();

  return (
    <header className="w-full py-3 px-6">
      <nav className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow-primary">
            <span className="text-sm font-bold text-white">AI</span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            AI Resume Optimizer
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <Link to="/" className={`px-3 py-2 rounded-md transition ${location.pathname === '/' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}>Home</Link>
          <Link to="/about" className={`px-3 py-2 rounded-md transition ${location.pathname === '/about' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}>About</Link>
        </div>
      </nav>
    </header>
  );
}
