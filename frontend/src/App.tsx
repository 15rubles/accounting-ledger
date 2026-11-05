import { Route, Routes } from 'react-router'
import Layout from './components/Layout.tsx'
import HomePage from './pages/HomePage'
import LedgerPage from './pages/LedgerPage'
import ReportsPage from './pages/ReportsPage'
import SearchPage from './pages/SearchPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="ledger" element={<LedgerPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}