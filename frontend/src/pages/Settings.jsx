import { useState, useRef } from 'react'
import Layout from '../components/Layout.jsx'
import { updateAvatar } from '../api/auth.js'

export default function Settings() {
  const fileInputRef = useRef(null)
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('modbus_user') || '{}'))
  const [uploading, setUploading] = useState(false)
  const [avatarError, setAvatarError] = useState('')

  const [settings, setSettings] = useState({
    host: '192.168.1.104',
    port: '502',
    unitId: '1',
    timeout: '1000',
    scanRate: '250',
    highContrast: true,
    dataAnimation: false,
    uiScale: 'DEFAULT',
    logRetention: '7'
  })

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    alert('配置已保存（演示）')
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setAvatarError('')

    if (!file.type.startsWith('image/')) {
      setAvatarError('请选择图片文件')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setAvatarError('图片大小不能超过 10MB')
      return
    }

    const reader = new FileReader()
    reader.onload = async (event) => {
      const base64 = event.target.result
      setUploading(true)
      try {
        const res = await updateAvatar({ avatar_url: base64 })
        const updatedUser = { ...user, avatar_url: base64 }
        localStorage.setItem('modbus_user', JSON.stringify(updatedUser))
        setUser(updatedUser)
        alert('头像更新成功')
      } catch (err) {
        setAvatarError(err.response?.data?.message || '上传失败')
      } finally {
        setUploading(false)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <Layout title="系统设置">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* 用户头像 */}
          <section className="lg:col-span-12 bg-surface-container border border-outline-variant p-6">
            <div className="mb-4 text-xs text-outline uppercase">00_用户头像 / USER_AVATAR</div>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded bg-surface-container-high border border-outline-variant flex items-center justify-center overflow-hidden">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-4xl text-primary">person</span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-4 py-2 bg-secondary-container text-on-secondary text-xs font-bold uppercase disabled:opacity-50"
                >
                  {uploading ? '上传中...' : '更换头像'}
                </button>
                {avatarError && <span className="text-error text-xs">{avatarError}</span>}
                <span className="text-[10px] text-outline">支持 JPG/PNG，最大 10MB</span>
              </div>
            </div>
          </section>

          {/* 通信配置 */}
          <section className="lg:col-span-7 bg-surface-container border border-outline-variant p-6">
            <div className="mb-6 text-xs text-outline uppercase">01_通信配置 / COMMUNICATION</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-outline">TCP 主机地址 (IP)</label>
                <input
                  value={settings.host}
                  onChange={(e) => handleChange('host', e.target.value)}
                  className="bg-surface-container-low border border-outline-variant px-3 py-2 font-data-mono text-primary focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-outline">端口号 (PORT)</label>
                <input
                  value={settings.port}
                  onChange={(e) => handleChange('port', e.target.value)}
                  className="bg-surface-container-low border border-outline-variant px-3 py-2 font-data-mono text-primary focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-outline">从站 ID (UNIT ID)</label>
                <input
                  type="number"
                  value={settings.unitId}
                  onChange={(e) => handleChange('unitId', e.target.value)}
                  className="bg-surface-container-low border border-outline-variant px-3 py-2 font-data-mono text-primary focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-outline">响应超时 (TIMEOUT MS)</label>
                <input
                  type="number"
                  value={settings.timeout}
                  onChange={(e) => handleChange('timeout', e.target.value)}
                  className="bg-surface-container-low border border-outline-variant px-3 py-2 font-data-mono text-primary focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-outline-variant">
              <label className="text-xs text-outline">扫描频率 (SCAN RATE): <span className="text-secondary font-bold">{settings.scanRate}ms</span></label>
              <input
                type="range"
                min="50"
                max="5000"
                value={settings.scanRate}
                onChange={(e) => handleChange('scanRate', e.target.value)}
                className="w-full mt-2 accent-secondary"
              />
              <div className="flex justify-between text-[10px] text-outline mt-1">
                <span>50MS</span>
                <span>5000MS</span>
              </div>
            </div>
          </section>

          {/* UI 主题 */}
          <section className="lg:col-span-5 bg-surface-container border border-outline-variant p-6">
            <div className="mb-6 text-xs text-outline uppercase">02_界面视觉 / UI_THEME</div>
            <div className="space-y-4">
              <div
                className="flex items-center justify-between p-3 bg-surface-container-low border border-outline-variant cursor-pointer"
                onClick={() => handleChange('highContrast', !settings.highContrast)}
              >
                <div>
                  <div className="font-bold">高对比度模式</div>
                  <div className="text-[10px] text-outline">HIGH CONTRAST MODE</div>
                </div>
                <div className={`w-10 h-5 rounded-full relative ${settings.highContrast ? 'bg-secondary-container' : 'bg-surface-variant'}`}>
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full ${settings.highContrast ? 'right-1' : 'left-1'}`}></div>
                </div>
              </div>

              <div
                className="flex items-center justify-between p-3 bg-surface-container-low border border-outline-variant cursor-pointer"
                onClick={() => handleChange('dataAnimation', !settings.dataAnimation)}
              >
                <div>
                  <div className="font-bold">启用数据动画</div>
                  <div className="text-[10px] text-outline">DATA ANIMATION</div>
                </div>
                <div className={`w-10 h-5 rounded-full relative ${settings.dataAnimation ? 'bg-secondary-container' : 'bg-surface-variant'}`}>
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full ${settings.dataAnimation ? 'right-1' : 'left-1'}`}></div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-outline">字体缩放 (UI SCALE)</label>
                <select
                  value={settings.uiScale}
                  onChange={(e) => handleChange('uiScale', e.target.value)}
                  className="bg-surface-container-low border border-outline-variant px-3 py-2 font-data-mono text-on-surface focus:outline-none focus:border-primary"
                >
                  <option>COMPACT (12PX)</option>
                  <option>DEFAULT (14PX)</option>
                  <option>COMFORT (16PX)</option>
                </select>
              </div>
            </div>
          </section>

          {/* 数据存储 */}
          <section className="lg:col-span-6 bg-surface-container border border-outline-variant p-6">
            <div className="mb-6 text-xs text-outline uppercase">03_数据存储 / DATA_STORAGE</div>
            <div className="space-y-4">
              <div className="bg-surface-container-lowest h-8 border border-outline-variant relative">
                <div className="absolute inset-y-0 left-0 bg-secondary-container/40 w-[68%]"></div>
                <div className="absolute inset-0 flex items-center px-3 justify-between">
                  <span className="text-[10px]">STORAGE_USED</span>
                  <span className="text-[10px] text-secondary">68.4 GB / 100 GB</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs text-outline">日志轮转周期 (LOG RETENTION)</label>
                <div className="flex gap-2">
                  {['7', '30', '90'].map(days => (
                    <button
                      key={days}
                      onClick={() => handleChange('logRetention', days)}
                      className={`flex-1 py-2 border text-[11px] font-bold uppercase ${
                        settings.logRetention === days
                          ? 'border-secondary text-secondary bg-secondary-container/10'
                          : 'border-outline-variant text-outline'
                      }`}
                    >
                      {days} DAYS
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 系统信息 */}
          <section className="lg:col-span-6 bg-surface-container border border-outline-variant p-6">
            <div className="mb-6 text-xs text-outline uppercase">04_系统信息 / SYSTEM_INFO</div>
            <div className="bg-surface-container-lowest p-3 border border-outline-variant font-data-mono text-[12px] space-y-1">
              <div className="flex justify-between border-b border-outline-variant/30 py-1">
                <span className="text-outline">DEVICE_SERIAL:</span>
                <span className="text-primary">MB-7749-X21</span>
              </div>
              <div className="flex justify-between border-b border-outline-variant/30 py-1">
                <span className="text-outline">MAC_ADDRESS:</span>
                <span className="text-primary">00:1A:2B:3C:4D:5E</span>
              </div>
              <div className="flex justify-between border-b border-outline-variant/30 py-1">
                <span className="text-outline">FIRMWARE_VER:</span>
                <span className="text-secondary">v2.4.0.STABLE</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-outline">HARDWARE_REV:</span>
                <span className="text-primary">PCB_REV_C</span>
              </div>
            </div>
          </section>

          {/* 底部操作栏 */}
          <div className="lg:col-span-12 flex justify-between items-center border-t border-outline-variant pt-4">
            <button className="px-6 py-3 border border-error text-error text-xs uppercase hover:bg-error/10 active:scale-95 transition-all">
              恢复出厂设置
            </button>
            <div className="flex gap-4">
              <button className="px-8 py-3 border border-outline text-outline text-xs uppercase hover:bg-surface-variant active:scale-95 transition-all">
                取消
              </button>
              <button
                onClick={handleSave}
                className="px-12 py-3 bg-secondary-container text-on-secondary font-bold text-xs uppercase active:scale-[0.95] transition-transform"
              >
                保存更改
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
