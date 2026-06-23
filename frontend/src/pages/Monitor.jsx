import { useEffect, useState } from 'react'
import Layout from '../components/Layout.jsx'

const initialMetrics = [
  { id: 41, label: 'HR_0041 // 温度 A', value: 74.2, unit: '°C', icon: 'thermostat', width: 74 },
  { id: 42, label: 'HR_0042 // 系统压力', value: 120.4, unit: 'BAR', icon: 'compress', width: 60 },
  { id: 43, label: 'HR_0043 // 流量', value: 8.42, unit: 'M3/H', icon: 'waves', width: 42 },
  { id: 44, label: 'HR_0044 // 湿度', value: 45.1, unit: '%', icon: 'humidity_low', width: 45 },
  { id: 45, label: 'HR_0045 // 功率负载', value: 1.2, unit: 'KW', icon: 'bolt', width: 12 },
  { id: 46, label: 'HR_0046 // 输出频率', value: 50.0, unit: 'HZ', icon: 'rebase_edit', width: 50 },
]

const logs = [
  { time: '14:02:33.411', text: '已建立 TCP 连接至 192.168.1.100:502', color: 'text-on-surface-variant' },
  { time: '14:02:33.425', text: '单元 ID: 01 读取保持寄存器 (40041, 6)', color: 'text-on-surface-variant' },
  { time: '14:02:33.512', text: '数据更新成功', color: 'text-on-surface-variant' },
  { time: '14:03:01.002', text: '已接收到 PLC 心跳应答 (ACK)', color: 'text-on-surface' },
  { time: '14:03:15.882', text: '警告: 温度 A 超过软限制 (74.0°C)', color: 'text-tertiary-fixed-dim' },
]

export default function Monitor() {
  const [metrics, setMetrics] = useState(initialMetrics)
  const [running, setRunning] = useState(true)

  useEffect(() => {
    if (!running) return
    const timer = setInterval(() => {
      setMetrics(prev => prev.map(m => {
        const delta = (Math.random() - 0.5) * (m.unit === 'M3/H' ? 0.1 : m.unit === 'BAR' ? 2 : 0.5)
        const next = Math.max(0, m.value + delta)
        return { ...m, value: next }
      }))
    }, 1500)
    return () => clearInterval(timer)
  }, [running])

  return (
    <Layout title="实时监控">
      <div className="max-w-[1200px] mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
            <span className="text-secondary text-sm font-bold">已连接</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setRunning(!running)}
              className={`px-3 py-1.5 text-xs font-bold border ${running ? 'border-secondary text-secondary' : 'border-outline text-outline'}`}
            >
              {running ? '暂停' : '运行'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metrics.map(m => (
            <div key={m.id} className="bg-surface-container border border-outline-variant p-4 hover:border-primary/50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-outline uppercase">{m.label}</span>
                <span className="material-symbols-outlined text-outline">{m.icon}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-data-mono text-primary tracking-tighter">{m.value.toFixed(m.unit === 'M3/H' ? 2 : 1)}</span>
                <span className="text-xs text-outline">{m.unit}</span>
              </div>
              <div className="w-full bg-surface-container-lowest h-1 mt-3">
                <div className="bg-primary h-full" style={{ width: `${Math.min(100, m.width)}%` }}></div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-surface-container border border-outline-variant h-[300px] flex flex-col">
          <div className="px-4 py-3 border-b border-outline-variant flex justify-between items-center">
            <span className="text-xs text-outline uppercase">实时数据流 (多系列)</span>
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-outline">温度 A</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-secondary"></div>
                <span className="text-outline">系统压力</span>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-[#0e0e0e] flex items-center justify-center text-outline">
            [ 实时折线图占位 - 后续接入 ECharts / Chart.js ]
          </div>
        </div>

        <div className="bg-[#0e0e0e] border border-outline-variant h-[180px] flex flex-col">
          <div className="px-4 py-2 border-b border-outline-variant flex justify-between items-center">
            <span className="text-xs text-outline uppercase">系统事件日志</span>
            <span className="text-xs text-secondary">轮询频率: 100ms</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 font-data-mono text-xs space-y-1">
            {logs.map((log, idx) => (
              <div key={idx}>
                <span className="text-primary">[{log.time}]</span>{' '}
                <span className={log.color}>{log.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
