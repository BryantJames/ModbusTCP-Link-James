import { useState } from 'react'
import Layout from '../components/Layout.jsx'

export default function DeviceLink() {
  const [config, setConfig] = useState({
    ip: ['192', '168', '1', '10'],
    port: '502',
    unitId: '1',
    autoReconnect: true,
    logBinary: false
  })

  const [logs, setLogs] = useState([
    { time: '14:20:01.002', text: 'SYS_INIT: Initializing Modbus Core V2.4.0...', color: 'text-on-surface-variant' },
    { time: '14:22:00.112', text: 'NET_SOCK: Socket bound to 192.168.1.10:502', color: 'text-secondary' },
    { time: '14:22:00.450', text: 'MOD_CONN: Connected to Slave ID 01. HANDSHAKE_OK.', color: 'text-status-active' },
  ])

  const handleConnect = () => {
    setLogs(prev => [...prev, {
      time: new Date().toLocaleTimeString('zh-CN', { hour12: false }) + '.000',
      text: `MOD_CONN: 正在连接 ${config.ip.join('.')}:${config.port} [Unit ${config.unitId}]`,
      color: 'text-primary'
    }])
  }

  const handleDisconnect = () => {
    setLogs(prev => [...prev, {
      time: new Date().toLocaleTimeString('zh-CN', { hour12: false }) + '.000',
      text: 'MOD_CONN: Connection closed by user.',
      color: 'text-error'
    }])
  }

  return (
    <Layout title="设备连接">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 max-w-[1400px] mx-auto">
        <div className="lg:col-span-5 flex flex-col gap-4">
          <section className="bg-surface-container border border-outline-variant p-4">
            <div className="mb-4 text-xs text-outline uppercase tracking-wider">Modbus TCP 参数配置</div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-outline">IP 地址</label>
                <div className="grid grid-cols-4 gap-2">
                  {config.ip.map((octet, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={octet}
                      onChange={(e) => {
                        const newIp = [...config.ip]
                        newIp[idx] = e.target.value
                        setConfig({ ...config, ip: newIp })
                      }}
                      className="bg-surface-container-low border border-outline-variant text-center p-2 font-data-mono focus:border-primary focus:outline-none"
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-outline">端口</label>
                  <input
                    type="text"
                    value={config.port}
                    onChange={(e) => setConfig({ ...config, port: e.target.value })}
                    className="bg-surface-container-low border border-outline-variant p-2 font-data-mono focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-outline">从站 ID</label>
                  <input
                    type="text"
                    value={config.unitId}
                    onChange={(e) => setConfig({ ...config, unitId: e.target.value })}
                    className="bg-surface-container-low border border-outline-variant p-2 font-data-mono focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-surface-container border border-outline-variant p-4">
            <div className="mb-4 text-xs text-outline uppercase tracking-wider">协议扩展设置</div>
            <div className="space-y-3">
              <div
                className="flex items-center justify-between p-3 bg-surface-container-low border border-outline-variant cursor-pointer"
                onClick={() => setConfig({ ...config, autoReconnect: !config.autoReconnect })}
              >
                <div>
                  <div className="font-bold">自动重连</div>
                  <div className="text-xs text-outline">每 5000ms 重试一次</div>
                </div>
                <div className={`w-10 h-5 rounded-full relative ${config.autoReconnect ? 'bg-secondary-container' : 'bg-surface-variant'}`}>
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full ${config.autoReconnect ? 'right-1' : 'left-1'}`}></div>
                </div>
              </div>

              <div
                className="flex items-center justify-between p-3 bg-surface-container-low border border-outline-variant cursor-pointer"
                onClick={() => setConfig({ ...config, logBinary: !config.logBinary })}
              >
                <div>
                  <div className="font-bold">记录二进制帧</div>
                  <div className="text-xs text-outline">在终端中包含原始十六进制</div>
                </div>
                <div className={`w-10 h-5 rounded-full relative ${config.logBinary ? 'bg-secondary-container' : 'bg-surface-variant'}`}>
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full ${config.logBinary ? 'right-1' : 'left-1'}`}></div>
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleConnect}
              className="flex items-center justify-center gap-2 py-4 bg-secondary-container text-on-secondary font-bold uppercase active:scale-[0.95] transition-transform"
            >
              <span className="material-symbols-outlined">bolt</span>
              初始化连接
            </button>
            <button
              onClick={handleDisconnect}
              className="flex items-center justify-center gap-2 py-4 border border-error text-error font-bold uppercase active:scale-[0.95] transition-transform"
            >
              <span className="material-symbols-outlined">close</span>
              断开连接
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col border border-outline-variant bg-[#0e0e0e] min-h-[500px]">
          <div className="flex justify-between items-center px-4 py-2 bg-surface-container-high border-b border-outline-variant">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">terminal</span>
              <span className="text-sm font-bold uppercase">实时通信日志</span>
            </div>
            <button onClick={() => setLogs([])} className="text-outline hover:text-primary">
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 font-data-mono text-sm space-y-1">
            {logs.map((log, idx) => (
              <div key={idx} className="flex gap-4">
                <span className="text-primary">[{log.time}]</span>
                <span className={log.color}>{log.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
