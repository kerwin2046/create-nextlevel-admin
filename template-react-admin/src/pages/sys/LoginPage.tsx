import { Form, Input, Button, message } from 'antd';
import { useAuth } from '@/core/demo/context';
import { useNavigate } from 'react-router-dom';
export default function LoginPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { login, register } = useAuth();
  const handleLogin = async (values: Record<string, unknown>) => {
    try {
      await login(values);
      navigate('/');
      message.success('Login successful');
    } catch (error: any) {
      message.error(error.message);
    }
  };
  const handleRegister = async () => {
    try {
      const values = form.getFieldsValue();
      await register(values);
      message.success('Register successful');
    } catch (error: any) {
      message.error(error.message || 'Register failed');
    }
  };
  return (
    <div>
      <h1>登录</h1>
      <Form form={form} onFinish={handleLogin}>
        <Form.Item name="username" label="用户名">
          <Input />
        </Form.Item>
        <Form.Item name="password" label="密码">
          <Input.Password />
        </Form.Item>
      </Form>
      <Button type="primary" onClick={() => handleLogin(form.getFieldsValue())}>
        登录
      </Button>
      <Button type="primary" onClick={() => handleRegister()}>
        注册
      </Button>
    </div>
  );
}
