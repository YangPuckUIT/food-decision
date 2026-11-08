import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import MapPage from './pages/MapPage'
import FoodRollPage from './pages/FoodRollPage'
import CodexPage from './pages/CodexPage'
import FoodDetailPage from './pages/FoodDetailPage'
import OraclePage from './pages/OraclePage'
import RoundTablePage from './pages/RoundTablePage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <Routes>
      {/* Route cha không có path: mọi trang con đều hiện bên trong Layout (chỗ <Outlet />) */}
      <Route element={<Layout />}>
        <Route index element={<MapPage />} />
        <Route path="gacha" element={<FoodRollPage />} />
        <Route path="codex" element={<CodexPage />} />
        <Route path="codex/:id" element={<FoodDetailPage />} />
        <Route path="oracle" element={<OraclePage />} />
        <Route path="round-table" element={<RoundTablePage />} />
        {/* * = mọi URL không khớp các route ở trên */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
