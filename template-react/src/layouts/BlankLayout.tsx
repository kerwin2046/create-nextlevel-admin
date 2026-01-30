import { Outlet } from 'react-router-dom';

/** 无侧栏/顶栏的空白布局，用于登录等单页。 */
export default function BlankLayout() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Outlet />
    </div>
  );
}
