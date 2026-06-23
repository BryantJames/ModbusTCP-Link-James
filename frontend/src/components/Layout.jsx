import Sidebar from './Sidebar.jsx'

export default function Layout({ children, title }) {
  return (
    <div className="flex min-h-screen bg-surface text-on-surface">
      <Sidebar />
      <main className="flex-1 ml-[220px] min-h-screen flex flex-col">
        <header className="h-16 border-b border-outline-variant bg-surface flex items-center px-6 sticky top-0 z-40">
          <h2 className="text-xl font-bold">{title}</h2>
        </header>
        <div className="flex-1 p-6">{children}</div>
      </main>
    </div>
  )
}
