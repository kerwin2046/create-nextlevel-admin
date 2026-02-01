import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/core/auth/auth.hooks';
import { AuthContextType, LoginPayload } from '@/core/auth/auth.types';
import { message } from 'antd';
import './login.css';
import { EyeInvisibleOutlined } from '@ant-design/icons';
import { GoogleOutlined } from '@ant-design/icons';

export default function Login() {
  const { login } = useAuth() as AuthContextType;
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState<LoginPayload>({
      username: '',
      password: '12345678',
    });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  /**
   * 处理输入框变化事件
   *
   * @param e - React输入框变化事件对象
   * @returns void
   */
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      await login(form);
      message.success('登录成功');
      navigate(from, { replace: true });
    } catch (err: unknown) {
      console.error(err);
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        (err as Error)?.message ??
        '登录失败';
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__form-wrap">
        <div className="auth-page__form-box">
          <h2 className="auth-page__form-title">Hello, Welcome Back!</h2>

          <form onSubmit={onSubmit}>
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
                  required
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
                  required
                />
                <button
                  type="button"
                  className="auth-page__toggle-pwd"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <EyeInvisibleOutlined />
                </button>
              </div>
            </div>

            <button type="submit" className="auth-page__btn auth-page__btn--primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          <button type="button" className="auth-page__btn auth-page__btn--secondary" disabled>
            <GoogleOutlined />
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
