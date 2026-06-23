import { Link, useLocation, useNavigate } from 'react-router-dom'

const menuItems = [
  { path: '/dashboard', label: '总览', icon: 'dashboard' },
  { path: '/device-link', label: '设备连接', icon: 'lan' },
  { path: '/monitor', label: '实时监控', icon: 'monitoring' },
  { path: '/registers', label: '寄存器读写', icon: 'list_alt' },
  { path: '/alarms', label: '报警中心', icon: 'error_outline' },
  { path: '/history', label: '历史记录', icon: 'history' },
  { path: '/settings', label: '系统设置', icon: 'settings' },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('modbus_user') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('modbus_token')
    localStorage.removeItem('modbus_user')
    navigate('/login')
  }

  return (
    <aside className="w-[220px] h-screen border-r border-outline-variant bg-surface-container flex flex-col shrink-0 fixed left-0 top-0 z-50">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-primary tracking-tighter">MODBUS_CORE</h1>
        <p className="text-xs text-outline mt-1">V2.4.0-STABLE</p>
      </div>

      <nav className="flex-1 mt-2">
        {menuItems.map(item => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 transition-all active:scale-[0.98] ${
                isActive
                  ? 'text-secondary-fixed border-l-2 border-secondary-fixed bg-secondary-container/10'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-body-md">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-outline-variant">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded bg-surface-container-high border border-outline-variant flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">person</span>
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold truncate">{user.display_name || user.username || '未登录'}</p>
            <p className="text-[10px] text-outline uppercase tracking-widest">{user.role || 'GUEST'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full py-2 border border-error text-error text-xs font-bold uppercase hover:bg-error/10 transition-colors"
        >
          登出
        </button>
      </div>
    </aside>
  )
}
