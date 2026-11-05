import { NavLink, Outlet } from 'react-router'

export default function Layout() {
  return (
    <div className="app">
      <nav className="nav">
        <span className="logo">Ledger</span>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/ledger">Ledger</NavLink>
        <NavLink to="/reports">Reports</NavLink>
        <NavLink to="/search">Search</NavLink>
      </nav>
      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}