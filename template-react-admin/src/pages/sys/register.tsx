import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerApi } from '@/core/auth/auth.service';
import { message } from 'antd';
import './login.css';
import { EyeInvisibleOutlined } from '@ant-design/icons';
import type { RegisterPayload } from '@/core/auth/auth.types';
import { GoogleOutlined } from '@ant-design/icons';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterPayload>({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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
      await registerApi(form);
      message.success('注册成功');
      navigate('/login', { replace: true });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      message.error(msg || '注册失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__form-wrap">
        <div className="auth-page__form-box">
          <h2 className="auth-page__form-title">Hello, Welcome to NextLevel Admin!</h2>

          <form onSubmit={onSubmit}>
            <div className="auth-page__field">
              <label className="auth-page__label" htmlFor="register-username">
                Username
              </label>
              <div className="auth-page__input-wrap">
                <input
                  id="register-username"
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
              <label className="auth-page__label" htmlFor="register-password">
                Password
              </label>
              <div className="auth-page__input-wrap">
                <input
                  id="register-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className="auth-page__input auth-page__input--with-icon"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={onChange}
                  autoComplete="new-password"
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
              {loading ? 'Creating...' : 'Create account'}
            </button>
          </form>

          <button type="button" className="auth-page__btn auth-page__btn--secondary" disabled>
            <GoogleOutlined />
            Continue with Google
          </button>

          <p className="auth-page__message">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
