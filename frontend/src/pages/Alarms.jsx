import { useState } from 'react'
import Layout from '../components/Layout.jsx'

const initialAlarms = [
  { id: 1, time: '2026-06-23 14:30:05', type: 'UPPER_LIMIT', register: '温度 A', value: 74.2, limit: 74.0, status: 0 },
  { id: 2, time: '2026-06-23 14:28:12', type: 'UPPER_LIMIT', register: '流量', value: 8.42, limit: 8.00, status: 1 },
  { id: 3, time: '2026-06-23 14:25:00', type: 'COMM_ERROR', register: '-', value: null, limit: null, status: 2 },
]

const statusMap = {
  0: { label: '未处理', class: 'bg-error/10 text-error border-error/20' },
  1: { label: '已确认', class: 'bg-secondary/10 text-secondary border-secondary/20' },
  2: { label: '已恢复', class: 'bg-primary/10 text-primary border-primary/20' },
}

export default function Alarms() {
  const [alarms, setAlarms] = useState(initialAlarms)

  const handleConfirm = (id) => {
    setAlarms(prev => prev.map(a => a.id === id ? { ...a, status: 1 } : a))
  }

  return (
    <Layout title="报警中心">
      <div className="max-w-[1200px] mx-auto">
        <div className="bg-surface-container border border-outline-variant">
          <div className="px-4 py-3 border-b border-outline-variant flex justify-between items-center">
            <span className="text-xs text-outline uppercase">报警列表</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-outline text-xs text-outline hover:bg-surface-variant">全部确认</button>
              <button className="px-3 py-1 border border-outline text-xs text-outline hover:bg-surface-variant">清空已恢复</button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-container-low border-b border-outline-variant">
                <tr className="text-xs text-outline uppercase">
                  <th className="px-4 py-3">时间</th>
                  <th className="px-4 py-3">类型</th>
                  <th className="px-4 py-3">寄存器</th>
                  <th className="px-4 py-3 text-right">当前值</th>
                  <th className="px-4 py-3 text-right">阈值</th>
                  <th className="px-4 py-3 text-center">状态</th>
                  <th className="px-4 py-3 text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {alarms.map(alarm => (
                  <tr key={alarm.id} className="hover:bg-surface-container-high transition-colors">
                    <td className="px-4 py-3 text-primary">{alarm.time}</td>
                    <td className="px-4 py-3">{alarm.type}</td>
                    <td className="px-4 py-3">{alarm.register}</td>
                    <td className="px-4 py-3 text-right">{alarm.value ?? '-'}</td>
                    <td className="px-4 py-3 text-right">{alarm.limit ?? '-'}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 text-xs border rounded-full ${statusMap[alarm.status].class}`}>
                        {statusMap[alarm.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {alarm.status === 0 && (
                        <button
                          onClick={() => handleConfirm(alarm.id)}
                          className="px-3 py-1 bg-secondary-container text-on-secondary text-xs font-bold uppercase"
                        >
                          确认
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}
