import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import { getMe } from '../api/auth.js'

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getMe()
        setUser(res.data.data)
      } catch (err) {
        setError('获取用户信息失败')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const quickLinks = [
    { label: '设备连接', path: '/device-link', icon: 'lan', desc: '配置 Modbus TCP 连接参数' },
    { label: '实时监控', path: '/monitor', icon: 'monitoring', desc: '查看设备运行数据' },
    { label: '寄存器读写', path: '/registers', icon: 'list_alt', desc: '读写保持寄存器' },
    { label: '历史记录', path: '/history', icon: 'history', desc: '查询历史采样数据' },
  ]

  if (loading) {
    return (
      <Layout title="总览">
        <div className="flex items-center justify-center h-64">
          <span className="text-primary">加载中...</span>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="总览">
      <div className="max-w-6xl mx-auto space-y-6">
        {error && (
          <div className="bg-error-container/20 border border-error px-4 py-3">
            <span className="text-error">{error}</span>
          </div>
        )}

        {user && (
          <div className="bg-surface-container border border-outline-variant p-6">
            <h3 className="text-lg font-bold text-primary mb-4">欢迎回来，{user.display_name}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-surface-container-low p-4 border border-outline-variant">
                <div className="text-outline mb-1">角色</div>
                <div className="font-data-mono text-secondary">{user.role}</div>
              </div>
              <div className="bg-surface-container-low p-4 border border-outline-variant">
                <div className="text-outline mb-1">权限等级</div>
                <div className="font-data-mono text-secondary">LV.{user.auth_level}</div>
              </div>
              <div className="bg-surface-container-low p-4 border border-outline-variant">
                <div className="text-outline mb-1">用户名</div>
                <div className="font-data-mono text-secondary">{user.username}</div>
              </div>
              <div className="bg-surface-container-low p-4 border border-outline-variant">
                <div className="text-outline mb-1">状态</div>
                <div className="font-data-mono text-secondary">{user.status === 1 ? '启用' : '禁用'}</div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map(link => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className="bg-surface-container border border-outline-variant p-6 text-left hover:border-primary transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="material-symbols-outlined text-primary group-hover:text-secondary transition-colors">{link.icon}</span>
                <span className="font-bold">{link.label}</span>
              </div>
              <p className="text-sm text-outline">{link.desc}</p>
            </button>
          ))}
        </div>

        <div className="bg-surface-container border border-outline-variant p-6"
        >
          <h3 className="text-lg font-bold mb-4 text-primary">系统状态</h3>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-secondary animate-pulse"></div>
            <span className="text-secondary">在线 - 已连接至 192.168.1.104:502</span>
          </div>
        </div>
      </div>
    </Layout>
  )
}
