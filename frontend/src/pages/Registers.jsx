import { useState } from 'react'
import Layout from '../components/Layout.jsx'

const initialRegisters = [
  { addr: '0x0001', type: 'UINT16', dec: 32767, hex: '0x7FFF', bin: '0111 1111 1111 1111', time: '12:04:31.002' },
  { addr: '0x0002', type: 'FLOAT32', dec: 124.50, hex: '0x42F90000', bin: '...', time: '12:04:31.002' },
  { addr: '0x0003', type: 'UINT16', dec: 4096, hex: '0x1000', bin: '0001 0000 0000 0000', time: '12:04:31.002' },
  { addr: '0x0004', type: 'UINT16', dec: 0, hex: '0x0000', bin: '0000 0000 0000 0000', time: '12:04:31.002' },
  { addr: '0x0005', type: 'INT16', dec: -128, hex: '0xFF80', bin: '1111 1111 1000 0000', time: '12:04:31.002' },
]

export default function Registers() {
  const [selected, setSelected] = useState({ addr: '0x0001', type: 'UINT16', val: '32767' })
  const [writeValue, setWriteValue] = useState('')
  const [format, setFormat] = useState('UINT16 (十进制)')

  return (
    <Layout title="寄存器读写">
      <div className="flex-1 flex flex-col lg:flex-row gap-4 max-w-[1400px] mx-auto">
        <section className="flex-[7] flex flex-col border border-outline-variant bg-surface-container min-h-[500px]">
          <div className="p-3 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
            <span className="text-xs text-outline uppercase">当前保持寄存器 [0x0001 - 0x0080]</span>
            <div className="flex gap-2">
              <span className="material-symbols-outlined text-outline cursor-pointer">filter_list</span>
              <span className="material-symbols-outlined text-outline cursor-pointer">refresh</span>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full text-left font-data-mono text-sm border-collapse">
              <thead className="sticky top-0 bg-surface-container z-10">
                <tr className="text-outline border-b border-outline-variant">
                  <th className="px-4 py-3">地址</th>
                  <th className="px-4 py-3">类型</th>
                  <th className="px-4 py-3">十进制</th>
                  <th className="px-4 py-3">十六进制</th>
                  <th className="px-4 py-3">二进制</th>
                  <th className="px-4 py-3 text-right">最后读取时间</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {initialRegisters.map((reg, idx) => (
                  <tr
                    key={reg.addr}
                    onClick={() => setSelected({ addr: reg.addr, type: reg.type, val: String(reg.dec) })}
                    className={`cursor-pointer hover:bg-primary/5 transition-colors ${idx % 2 === 1 ? 'bg-surface-container-low/30' : ''} ${selected.addr === reg.addr ? 'bg-primary/10' : ''}`}
                  >
                    <td className="px-4 py-3 text-primary">{reg.addr}</td>
                    <td className="px-4 py-3 text-outline">{reg.type}</td>
                    <td className="px-4 py-3">{reg.dec}</td>
                    <td className="px-4 py-3 text-outline">{reg.hex}</td>
                    <td className="px-4 py-3 text-[10px] text-outline/50">{reg.bin}</td>
                    <td className="px-4 py-3 text-right text-[11px] text-outline">{reg.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="h-32 border-t border-outline-variant bg-[#0e0e0e] p-2 font-data-mono text-[11px] overflow-y-auto">
            <div className="text-outline/40 mb-1">
              <span className="text-primary">[12:04:31.001]</span> TX: [01 03 00 00 00 80 44 21]
            </div>
            <div className="text-outline/40 mb-1">
              <span className="text-secondary">[12:04:31.002]</span> RX: [01 03 F0 7F FF 42 F9 ...] (128 字节已接收)
            </div>
          </div>
        </section>

        <aside className="flex-[3] flex flex-col gap-4">
          <div className="border border-outline-variant bg-surface-container p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs text-outline uppercase">更新寄存器</span>
              <span className="material-symbols-outlined text-primary">edit_note</span>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-outline uppercase">目标地址</label>
                <div className="bg-surface-container-low border border-outline-variant p-2 font-data-mono text-primary flex justify-between"
                >
                  <span>{selected.addr}</span>
                  <span className="material-symbols-outlined text-sm">lock</span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-outline uppercase">数值格式</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="bg-surface-container-low border border-outline-variant text-on-surface text-xs p-2 focus:outline-none focus:border-primary"
                >
                  <option>UINT16 (十进制)</option>
                  <option>INT16 (十进制)</option>
                  <option>十六进制</option>
                  <option>二进制</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-outline uppercase">写入数值</label>
                <input
                  type="text"
                  value={writeValue}
                  onChange={(e) => setWriteValue(e.target.value)}
                  placeholder={selected.val}
                  className="bg-surface-container-low border border-outline-variant text-on-surface font-data-mono p-2 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <button className="w-full bg-secondary-container text-on-secondary font-bold py-3 uppercase text-[11px] tracking-widest active:scale-[0.95] transition-transform">
                  执行写入 [0x06]
                </button>
                <button className="w-full border border-error text-error hover:bg-error/10 font-bold py-2 uppercase text-[11px] tracking-widest transition-all">
                  强制清零
                </button>
              </div>
            </div>
          </div>

          <div className="border border-primary/30 bg-primary/5 p-4">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-primary">info</span>
              <div>
                <p className="text-[11px] font-bold text-primary uppercase mb-1">工程备注</p>
                <p className="text-[10px] text-outline">使用功能码 06 进行单寄存器写入。多寄存器写入 (FC16) 必须通过系统设置中的批量更新工具进行。</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </Layout>
  )
}
