import { FormEvent, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { AuthHeader } from '../components/AuthHeader';
import { PasswordInput } from '../components/PasswordInput';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation() as any;
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'academic' | 'student'>('student');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await login(email, password, role);
      const to = user.role === 'academic' ? '/dashboard/academic' : '/dashboard/student';
      const redirect = location.state?.from?.pathname || to;
      navigate(redirect, { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <AuthHeader />
        <div className="auth-header">
          <h2 className="auth-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Sign In</h2>
          <p className="auth-subtitle">Sign in to your account</p>
        </div>
        <form onSubmit={onSubmit}>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              className="form-control"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <PasswordInput
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              label="Password"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="role">
              Role
            </label>
            <select
              id="role"
              className="form-control"
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
            >
              <option value="student">Student</option>
              <option value="academic">Academic</option>
            </select>
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner" style={{ marginRight: '8px' }}></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
          <p className="text-center mt-lg text-muted">
            Don't have an account? <Link to="/signup" style={{ color: 'var(--primary-color)', fontWeight: 500 }}>Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
