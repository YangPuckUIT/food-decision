import { useEffect, useState } from 'react'
import { getFoods } from '../api/foods'
import PageHeading from '../components/PageHeading'
import StatusPanel from '../components/StatusPanel'
import Codex from './Codex'
import DecisionPanel from './DecisionPanel'

const headings = {
  codex: ['Thư Viện Codex', 'Khám phá thực đơn', 'Tìm món theo tên, loại món và mức giá.'],
  oracle: ['Lều Tiên Tri', 'Bạn đang muốn ăn gì?', 'Chọn khẩu vị để nhận tối đa ba món phù hợp.'],
  group: ['Quán Bàn Tròn', 'Cùng nhau chọn một món', 'Chọn 2 đến 12 món rồi đặt điều kiện chung.'],
}

export default function Workspace({ mode, onHome }) {
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)
  useEffect(() => {
    let active = true
    getFoods().then(response => {
      if (!active) return
      if (response.error) setError(response.error.message)
      else setFoods(response.data)
      setLoading(false)
    })
    return () => { active = false }
  }, [reload])
  function retry() { setLoading(true); setError(''); setReload(value => value + 1) }
  const [place, title, description] = headings[mode]
  return <main id="main-content" className="workspace">
    <PageHeading place={place} title={title} description={description} onHome={onHome} />
    {loading ? <StatusPanel kind="loading" title="Đang tải thực đơn" />
      : error ? <StatusPanel kind="error" title="Chưa tải được thực đơn" onRetry={retry}>{error}</StatusPanel>
        : !foods.length ? <StatusPanel title="Thực đơn đang được cập nhật" onRetry={retry}>Chưa có món để lựa chọn. Bạn có thể tải lại sau.</StatusPanel>
          : mode === 'codex' ? <Codex foods={foods} /> : <DecisionPanel foods={foods} mode={mode} />}
  </main>
}
