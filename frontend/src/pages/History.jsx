import { useState } from 'react'
import Layout from '../components/Layout.jsx'

const sampleData = [
  { time: '2026-06-23 14:30:05.500', register: 'MODBUS_TCP.REG_4001', raw: '0x4207', conv: 135.2, status: 'VALID' },
  { time: '2026-06-23 14:30:05.500', register: 'MODBUS_TCP.REG_4002', raw: '0x2A1C', conv: 205.8, status: 'VALID' },
  { time: '2026-06-23 14:30:05.498', register: 'MODBUS_TCP.REG_4003', raw: '0x03E9', conv: 100.1, status: 'WARN' },
  { time: '2026-06-23 14:30:05.000', register: 'MODBUS_TCP.REG_4001', raw: '0x4208', conv: 135.4, status: 'VALID' },
  { time: '2026-06-23 14:30:05.000', register: 'MODBUS_TCP.REG_4002', raw: '0x2A1B', conv: 205.6, status: 'VALID' },
  { time: '2026-06-23 14:30:04.500', register: 'MODBUS_TCP.REG_4001', raw: '0x4206', conv: 135.0, status: 'VALID' },
]

export default function History() {
  const [sampleRate, setSampleRate] = useState('500ms')
  const [format, setFormat] = useState('RAW')

  return (
    <Layout title="历史记录">
      <div className="max-w-[1400px] mx-auto space-y-4">
        <section className="bg-surface-container border border-outline-variant p-4">
          <div className="mb-4 text-xs text-outline uppercase">数据查询筛选</div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-3">
              <label className="text-[10px] text-outline uppercase block mb-1">时间范围</label>
              <div className="flex items-center bg-surface-container-low border border-outline-variant px-2 py-2">
                <input type="date" className="bg-transparent border-none text-xs focus:ring-0 outline-none text-on-surface" />
                <span className="mx-2 text-outline text-xs">至</span>
                <input type="date" className="bg-transparent border-none text-xs focus:ring-0 outline-none text-on-surface" />
              </div>
            </div>

            <div className="md:col-span-3">
              <label className="text-[10px] text-outline uppercase block mb-1">寄存器选择</label>
              <div className="bg-surface-container-low border border-outline-variant px-3 py-2 flex justify-between items-center cursor-pointer">
                <span className="text-sm">多选 (3个已选)</span>
                <span className="material-symbols-outlined text-sm">expand_more</span>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] text-outline uppercase block mb-1">采样率</label>
              <select
                value={sampleRate}
                onChange={(e) => setSampleRate(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:border-primary"
              >
                <option>100ms</option>
                <option>500ms</option>
                <option>1s</option>
                <option>5s</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] text-outline uppercase block mb-1">格式</label>
              <div className="flex gap-1 bg-surface-container-low p-1 border border-outline-variant">
                <button
                  onClick={() => setFormat('RAW')}
                  className={`flex-1 py-1 text-[10px] font-bold ${format === 'RAW' ? 'bg-secondary-container text-on-secondary' : 'text-outline'}`}
                >
                  RAW
                </button>
                <button
                  onClick={() => setFormat('CONV')}
                  className={`flex-1 py-1 text-[10px] font-bold ${format === 'CONV' ? 'bg-secondary-container text-on-secondary' : 'text-outline'}`}
                >
                  CONV
                </button>
              </div>
            </div>

            <div className="md:col-span-2 flex items-end">
              <button className="w-full bg-secondary-container text-on-secondary font-bold py-2 px-4 text-xs uppercase active:scale-[0.95] transition-transform flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">search</span>
                查询
              </button>
            </div>
          </div>
        </section>

        <section className="bg-surface-container border border-outline-variant flex flex-col h-[300px]">
          <div className="px-4 py-3 border-b border-outline-variant">
            <span className="text-xs text-outline uppercase">多序列趋势分析</span>
          </div>
          <div className="flex-1 bg-[#0e0e0e] flex items-center justify-center text-outline">
            [ 历史趋势图占位 ]
          </div>
        </section>

        <section className="bg-surface-container border border-outline-variant">
          <div className="px-4 py-3 border-b border-outline-variant flex justify-between items-center">
            <span className="text-xs text-outline uppercase">详细历史日志</span>
            <button className="text-xs text-primary flex items-center gap-1 hover:underline">
              <span className="material-symbols-outlined text-sm">download</span>
              导出 CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-data-mono">
              <thead className="bg-surface-container-low border-b border-outline-variant">
                <tr className="text-[10px] text-outline uppercase">
                  <th className="px-4 py-2">Timestamp</th>
                  <th className="px-4 py-2">Register</th>
                  <th className="px-4 py-2 text-right">Raw Value</th>
                  <th className="px-4 py-2 text-right">Conv. Value</th>
                  <th className="px-4 py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {sampleData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-surface-container-high transition-colors">
                    <td className="px-4 py-2 text-primary">{row.time}</td>
                    <td className="px-4 py-2">{row.register}</td>
                    <td className="px-4 py-2 text-right">{row.raw}</td>
                    <td className="px-4 py-2 text-right">{row.conv}</td>
                    <td className="px-4 py-2 text-center">
                      <span className={`px-1.5 py-0.5 rounded-full text-[9px] border ${
                        row.status === 'VALID'
                          ? 'bg-secondary/10 text-secondary border-secondary/20'
                          : 'bg-error/10 text-error border-error/20'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </Layout>
  )
}
