import { Layout, Menu, Button, Space } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '@/core/state/store';
import { useAuth } from '@/core/auth/auth.hooks';
import { AuthContextType } from '@/core/auth/auth.types';

const { Header, Sider, Content } = Layout;

/** 基础后台布局：侧栏 + 顶栏 + 内容区。菜单项由路由配置生成，此处为占位。 */
export default function BasicLayout() {
  console.log('BasicLayout');
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarCollapsed, setSidebarCollapsed } = useAppStore();
  const { user, logout } = useAuth() as AuthContextType;

  const menuItems = [
    { key: '/dashboard', label: '首页' },
    { key: '/example', label: '示例' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={sidebarCollapsed}
        onCollapse={setSidebarCollapsed}
        theme="dark"
      >
        <div style={{ height: 32, margin: 16, color: '#fff', textAlign: 'center' }}>
          NextLevel Admin
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 24px', background: '#fff' }}>
          <div style={{ float: 'right' }}>
           {user ? (
            <Space>
            Welcome, {user?.username}
            <Button  type="link" onClick={() => logout()}>
              Logout
            </Button>
           </Space>
           ) : null}
          </div>
        </Header>
        <Content style={{ margin: 24, padding: 24, background: '#fff' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
