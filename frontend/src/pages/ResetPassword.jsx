import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token') || '';
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMsg('');
    if (!token) { setError('Missing reset token'); return; }
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/auth/reset', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, password }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reset');
      setMsg('Password updated. Redirecting to sign in...');
      setTimeout(() => navigate('/signin'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-6 py-8 rounded-2xl border border-border bg-secondary shadow-card">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2 text-center">Reset Password</h1>
          <p className="text-muted-foreground text-center mb-6">Enter a new password for your account.</p>
          {error && <div className="error-container mb-4">{error}</div>}
          {msg && <div className="error-container mb-4" style={{borderColor:'#22c55e', color:'#bbf7d0'}}>{msg}</div>}
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-2">New Password</label>
              <input type="password" className="w-full p-3 rounded-xl border border-border bg-background/50 outline-none text-foreground" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button className="btn-primary w-full bg-gradient-button" disabled={loading}>{loading ? 'Updating...' : 'Update Password'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}






