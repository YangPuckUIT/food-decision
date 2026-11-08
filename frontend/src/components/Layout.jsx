import { useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import './Layout.css'

// Khung chung cho mọi trang: header ở trên, trang hiện tại hiện ở <Outlet />
function Layout() {
  const { pathname } = useLocation()

  // Mỗi khi đổi trang (URL đổi) -> cuộn về đầu trang
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="layout">
      <header className="layout__header">
        {/* Khung chờ logo — thay bằng art vẽ tay sau */}
        <div className="layout__logo wob">Logo</div>

        <nav aria-label="Main">
          {/* NavLink tự thêm aria-current="page" khi đang ở đúng trang;
              end: chỉ coi là "đang ở" khi URL đúng "/" (không tính /gacha...) */}
          <NavLink to="/" end className="layout__nav-link wob2">
            Map
          </NavLink>
        </nav>
      </header>

      <Outlet />
    </div>
  )
}

export default Layout
