import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { userProfileState } from '../Atoms/atoms';

export default function NewHeader({ onHistoryClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const [profile, setProfile] = useRecoilState(userProfileState);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  useEffect(() => {
    async function loadProfile() {
      try {
        if (!token) { setProfile({ id: null, email: '', name: '', is_premium: false }); return; }
        const res = await fetch('http://localhost:5000/auth/me', { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (data?.user) setProfile(data.user);
      } catch (e) {
        // ignore
      }
    }
    loadProfile();
  }, [token]);
  const onLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };

  return (
    <header className="w-full py-3 px-4 sm:px-6">
      <nav className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow-primary">
            <span className="text-sm font-bold text-white">RU</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            ResumUp
          </h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-3">
          <Link to={token ? "/app" : "/"} className={`px-3 py-2 rounded-md transition ${(token ? location.pathname === '/app' : location.pathname === '/') ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}>Home</Link>
          <Link to="/pricing" className={`px-3 py-2 rounded-md transition ${location.pathname === '/pricing' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}>Pricing</Link>
          {profile?.is_premium && (
            <span className="px-2 py-1 text-xs rounded-md bg-emerald-600/10 text-emerald-600 border border-emerald-600/30">Premium</span>
          )}
          {token && onHistoryClick && (
            <button
              onClick={onHistoryClick}
              className="px-3 py-2 rounded-md text-slate-500 hover:text-slate-900 transition flex items-center gap-2"
              title="View History"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              History
            </button>
          )}
          {!token ? (
            <>
              <Link to="/signup" className="px-3 py-2 rounded-md text-slate-500 hover:text-slate-900 transition">Sign up</Link>
              <Link to="/signin" className="px-3 py-2 rounded-md text-slate-500 hover:text-slate-900 transition">Sign in</Link>
            </>
          ) : (
            <button onClick={onLogout} className="px-3 py-2 rounded-md border border-border bg-background/50 hover:bg-background text-foreground">Logout</button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md text-slate-500 hover:text-slate-900 hover:bg-gray-100"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
          <div className="flex flex-col space-y-2 pt-4">
            <Link 
              to={token ? "/app" : "/"} 
              className={`px-3 py-2 rounded-md transition ${(token ? location.pathname === '/app' : location.pathname === '/') ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-slate-900 hover:bg-gray-50'}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/pricing" 
              className={`px-3 py-2 rounded-md transition ${location.pathname === '/pricing' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-slate-900 hover:bg-gray-50'}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            {profile?.is_premium && (
              <div className="px-3 py-2">
                <span className="px-2 py-1 text-xs rounded-md bg-emerald-600/10 text-emerald-600 border border-emerald-600/30">Premium</span>
              </div>
            )}
            {token && onHistoryClick && (
              <button
                onClick={() => {
                  onHistoryClick();
                  setIsMobileMenuOpen(false);
                }}
                className="px-3 py-2 rounded-md text-slate-500 hover:text-slate-900 hover:bg-gray-50 transition flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                History
              </button>
            )}
            {!token ? (
              <>
                <Link 
                  to="/signup" 
                  className="px-3 py-2 rounded-md text-slate-500 hover:text-slate-900 hover:bg-gray-50 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign up
                </Link>
                <Link 
                  to="/signin" 
                  className="px-3 py-2 rounded-md text-slate-500 hover:text-slate-900 hover:bg-gray-50 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
              </>
            ) : (
              <button 
                onClick={() => {
                  onLogout();
                  setIsMobileMenuOpen(false);
                }} 
                className="px-3 py-2 rounded-md border border-border bg-background/50 hover:bg-background text-foreground text-left"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
