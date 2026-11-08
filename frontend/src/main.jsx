import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* BrowserRouter: đọc URL trên thanh địa chỉ và cho mọi component bên trong dùng routing */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
