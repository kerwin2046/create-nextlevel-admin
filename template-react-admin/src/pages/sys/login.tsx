import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/core/auth/auth.hooks';
import { AuthContextType } from '@/core/auth/auth.types';
import './login.css';

type LoginForm = {
  username: string;
  password: string;
};

function EyeIcon({ show }: { show: boolean }) {
  if (show) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default function Login() {
  const { login } = useAuth() as AuthContextType;
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState<LoginForm>({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.username || !form.password) {
      setError('请输入用户名和密码');
      return;
    }

    try {
      setLoading(true);
      await login({ username: form.username, password: form.password });
      navigate(from, { replace: true });
    } catch {
      setError('用户名或密码错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__brand">
        <div className="auth-page__logo">
          Hello Admin<span className="auth-page__logo-dot" />
        </div>
        <div className="auth-page__welcome">
          <h1 className="auth-page__welcome-title">Welcome.</h1>
          <p className="auth-page__welcome-sub">
            Start your journey
            <br />
            now with our
            <br />
            management
            <br />
            system!
          </p>
        </div>
      </div>

      <div className="auth-page__form-wrap">
        <div className="auth-page__form-box">
          <h2 className="auth-page__form-title">Log in</h2>

          <form onSubmit={onSubmit}>
            {error && <div className="auth-page__error">{error}</div>}

            <div className="auth-page__field">
              <label className="auth-page__label" htmlFor="login-username">
                Username
              </label>
              <div className="auth-page__input-wrap">
                <input
                  id="login-username"
                  name="username"
                  type="text"
                  className="auth-page__input"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={onChange}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="auth-page__field">
              <label className="auth-page__label" htmlFor="login-password">
                Password
              </label>
              <div className="auth-page__input-wrap">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className="auth-page__input auth-page__input--with-icon"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={onChange}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="auth-page__toggle-pwd"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <EyeIcon show={showPassword} />
                </button>
              </div>
            </div>

            <button type="submit" className="auth-page__btn auth-page__btn--primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          <button type="button" className="auth-page__btn auth-page__btn--secondary" disabled>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <p className="auth-page__message">
            Don&apos;t have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
