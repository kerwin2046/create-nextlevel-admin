import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/core/auth/auth.hooks';
import { AuthContextType } from '@/core/auth/auth.types';
import './login.css';

type LoginForm = {
  username: string;
  password: string;
};

export default function Login() {
  const { login } = useAuth() as AuthContextType;
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState<LoginForm>({
    username: 'admin',
    password: 'admin',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 登录成功后跳回原页面
  const from = (location.state as any)?.from?.pathname || '/dashboard';

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
      // navigate(from, { replace: true })
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError('用户名或密码错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="form">
        <form className="register-form">
          <input name="username" type="text" placeholder="name" onChange={onChange} value={form.username} />
          <input name="password" type="password" placeholder="password" onChange={onChange} value={form.password} />
          <p className="message">
            Already registered? <a href="#">Sign In</a>
          </p>
        </form>
        <form className="login-form">
          <input name="username" type="text" placeholder="username" onChange={onChange} value={form.username} />
          <input name="password" type="password" placeholder="password" onChange={onChange} value={form.password} />
          <button onClick={onSubmit}>login</button>
          <p className="message">
            Not registered? <a href="#">Create an account</a>
          </p>
        </form>
      </div>
    </div>
  );
}
