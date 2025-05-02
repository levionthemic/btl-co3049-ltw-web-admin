import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '~/components/Footer/Footer'
import Sidebar from '~/components/Sidebar/Sidebar'
import isDesktop from '~/helpers/isDesktop'

function Layout() {
  const [active, setActive] = useState(isDesktop(window))

  const toggleSidebar = () => {
    setActive((prev) => !prev)
  }
  return (
    <div id="app">
      <Sidebar active={active} toggleSidebar={toggleSidebar} />
      <div id="main">
        <header className="mb-3">
          <a href="#" className="burger-btn d-block d-xl-none">
            <i className="bi bi-justify fs-3" onClick={toggleSidebar}></i>
          </a>
        </header>
        <Outlet />
        <Footer />
      </div>
    </div>
  )
}

export default Layout