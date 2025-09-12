import { useState } from 'react';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';

export default function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const Schema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters')
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const parsed = Schema.safeParse({ name, email, password });
    if (!parsed.success) {
      setError(parsed.error.errors.map(e => e.message).join(', '));
      return;
    }
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to sign up');
      localStorage.setItem('token', data.token);
      navigate('/');
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
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2 text-center">Create account</h1>
        <p className="text-muted-foreground text-center mb-6">Join to save history and reuse results.</p>
        {error ? <div className="error-container mb-4">{error}</div> : null}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-2">Name</label>
            <input className="w-full p-3 rounded-xl border border-border bg-background/50 outline-none text-foreground" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-2">Email</label>
            <input type="email" className="w-full p-3 rounded-xl border border-border bg-background/50 outline-none text-foreground" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-2">Password</label>
            <input type="password" className="w-full p-3 rounded-xl border border-border bg-background/50 outline-none text-foreground" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button className="btn-primary w-full bg-gradient-button" disabled={loading}>{loading ? 'Creating...' : 'Sign Up'}</button>
        </form>
        <div className="text-center mt-4 text-sm text-muted-foreground">
          Already have an account? <Link to="/signin" className="underline">Sign in</Link>
        </div>
      </div>
      </div>
    </div>
  );
}


