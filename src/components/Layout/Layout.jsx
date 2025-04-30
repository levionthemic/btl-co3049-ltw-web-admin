import { Outlet } from 'react-router-dom'
import Footer from '~/components/Footer/Footer'
import Sidebar from '~/components/Sidebar/Sidebar'

function Layout() {
  return (
    <div id="app">
      <Sidebar />
      <div id="main">
        <header className="mb-3">
          <a href="#" className="burger-btn d-block d-xl-none">
            <i className="bi bi-justify fs-3"></i>
          </a>
        </header>
        <Outlet />
        <Footer />
      </div>
    </div>
  )
}

export default Layout