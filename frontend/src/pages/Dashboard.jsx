import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMe, logout } from '../api/auth.js'

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

  const handleLogout = async () => {
    try {
      await logout()
    } catch (err) {
      console.error('登出请求失败', err)
    } finally {
      localStorage.removeItem('modbus_token')
      localStorage.removeItem('modbus_user')
      navigate('/login')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-primary">加载中...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-outline-variant">
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-tight">MODBUS TCP 控制中心</h1>
            <p className="text-sm text-outline mt-1">登录成功，欢迎来到受保护页面</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-error text-error hover:bg-error/10 transition-colors"
          >
            登出
          </button>
        </header>

        {error && (
          <div className="bg-error-container/20 border border-error px-4 py-3 mb-6">
            <span className="text-error">{error}</span>
          </div>
        )}

        {user && (
          <div className="bg-surface-container border border-outline-variant p-6">
            <h2 className="text-lg font-bold mb-4 text-primary">当前用户信息</h2>
            <div className="grid grid-cols-2 gap-4 font-data-mono text-sm">
              <div className="text-outline">用户 ID</div>
              <div>{user.id}</div>
              <div className="text-outline">用户名</div>
              <div>{user.username}</div>
              <div className="text-outline">显示名称</div>
              <div>{user.display_name}</div>
              <div className="text-outline">角色</div>
              <div>{user.role}</div>
              <div className="text-outline">权限等级</div>
              <div>{user.auth_level}</div>
              <div className="text-outline">账号状态</div>
              <div>{user.status === 1 ? '启用' : '禁用'}</div>
              <div className="text-outline">创建时间</div>
              <div>{new Date(user.created_at).toLocaleString()}</div>
            </div>
          </div>
        )}

        <div className="mt-8 text-sm text-outline">
          <p>提示：后续可将现有 6 个 HTML 原型页面逐步迁移到这里作为独立路由。</p>
        </div>
      </div>
    </div>
  )
}
