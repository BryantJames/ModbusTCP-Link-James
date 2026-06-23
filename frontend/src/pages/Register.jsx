import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api/auth.js'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '', display_name: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password.length < 6) {
      setError('密码至少 6 个字符')
      return
    }

    setLoading(true)

    try {
      const res = await register(form)
      const { token, ...user } = res.data.data
      localStorage.setItem('modbus_token', token)
      localStorage.setItem('modbus_user', JSON.stringify(user))
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || '注册失败，请检查网络'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 modbus-grid opacity-20"></div>

      <main className="w-full max-w-[420px] px-4 z-10">
        <div className="bg-surface-container-low border border-outline-variant p-8 flex flex-col gap-6 relative">
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary opacity-50"></div>

          <header className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center bg-secondary text-on-secondary rounded">
              <span className="material-symbols-outlined !text-4xl">person_add</span>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight uppercase">注册账号</h1>
              <p className="text-sm text-outline uppercase tracking-widest mt-1">创建操作员身份</p>
            </div>
          </header>

          {error && (
            <div className="bg-error-container/20 border border-error px-4 py-3 flex items-start gap-3">
              <span className="material-symbols-outlined text-error">warning</span>
              <span className="text-error text-sm">{error}</span>
            </div>
          )}

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-outline uppercase tracking-wider" htmlFor="username">操作员身份</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-outline">
                  <span className="material-symbols-outlined">account_circle</span>
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="OPERATOR_ID"
                  required
                  minLength={3}
                  className="w-full bg-surface-container border border-outline-variant pl-10 pr-4 py-3 text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-outline uppercase tracking-wider" htmlFor="display_name">显示名称</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-outline">
                  <span className="material-symbols-outlined">badge</span>
                </div>
                <input
                  id="display_name"
                  name="display_name"
                  type="text"
                  value={form.display_name}
                  onChange={handleChange}
                  placeholder="OPTIONAL"
                  className="w-full bg-surface-container border border-outline-variant pl-10 pr-4 py-3 text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-outline uppercase tracking-wider" htmlFor="password">授权密钥</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-outline">
                  <span className="material-symbols-outlined">lock</span>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="最少 6 位"
                  required
                  minLength={6}
                  className="w-full bg-surface-container border border-outline-variant pl-10 pr-4 py-3 text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-secondary-container text-on-secondary py-4 font-bold uppercase tracking-widest hover:bg-secondary transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? '处理中...' : '注册'}
              {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
            </button>
          </form>

          <footer className="pt-4 border-t border-outline-variant text-center">
            <p className="text-sm text-outline">
              已有账号？
              <Link to="/login" className="text-primary hover:underline">立即登录</Link>
            </p>
          </footer>
        </div>
      </main>
    </div>
  )
}
