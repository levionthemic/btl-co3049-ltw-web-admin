/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from '~/assets/static/images/logo/logo.svg'
import isDesktop from '~/helpers/isDesktop'
import { MdAccountCircle, MdMeetingRoom, MdSpaceDashboard } from 'react-icons/md'
import { FaBloggerB, FaHotel, FaQuestion } from 'react-icons/fa6'
import { IoLogOutOutline, IoSettings } from 'react-icons/io5'
import { useTheme } from '~/contexts/ThemeContext'

const sidebarItems = [
  {
    'name': 'Admin',
    'isTitle': true
  },
  {
    'name': 'Dashboard',
    'url': '/',
    'icon': <MdSpaceDashboard />
  },
  {
    'name': 'Account',
    'url': '/account',
    'key': '/account',
    'icon': <MdAccountCircle />
  },
  {
    'name': 'Rooms',
    'url': '/room',
    'icon': <MdMeetingRoom />
  },
  {
    'name': 'Bookings',
    'url': '/booking',
    'icon': <FaHotel />
  },
  {
    'name': 'Blogs',
    'url': '/blog',
    'icon': <FaBloggerB />
  },
  {
    'name': 'FAQs',
    'key': '/faq',
    'icon': <FaQuestion />,
    'submenu': [
      {
        'name': 'Main',
        'url': '/faq'
      },
      {
        'name': 'Create Faq',
        'url': '/faq/create'
      }
    ]
  },
  {
    'name': 'System',
    'isTitle': true
  },
  {
    'name': 'System',
    'url': '/system',
    'icon': <IoSettings />
  },
  {
    'name': 'Logout',
    'url': '/logout',
    'icon': <IoLogOutOutline />
  }
]

function Sidebar({ active, toggleSidebar }) {
  const pathname = useLocation().pathname

  const sidebarRef = useRef(null)

  const calculateChildrenHeight = (el, deep = false) => {
    if (!el) return 0
    const children = el.children
    let height = 0
    for (let i = 0; i < el.childElementCount; i++) {
      const child = children[i]
      const submenuLink = child.querySelector('.submenu-link')
      if (submenuLink) height += submenuLink.clientHeight

      if (deep && child.classList.contains('has-sub')) {
        const subsubmenu = child.querySelector('.submenu')
        if (subsubmenu?.classList.contains('submenu-open')) {
          const total = [...subsubmenu.querySelectorAll('.submenu-link')].reduce(
            (acc, curr) => acc + curr.clientHeight,
            0
          )
          height += total
        }
      }
    }
    el.style.setProperty('--submenu-height', `${height}px`)
    return height
  }

  const handleSubmenuToggle = (el) => {
    if (!el) return
    if (el.classList.contains('submenu-open')) {
      el.classList.remove('submenu-open')
      el.classList.add('submenu-closed')
    } else {
      el.classList.remove('submenu-closed')
      el.classList.add('submenu-open')
    }
  }

  useEffect(() => {
    const sidebarEl = sidebarRef.current
    if (!sidebarEl) return

    if (isDesktop(window)) {
      sidebarEl.classList.add('active', 'sidebar-desktop')
    }

    const handleResize = () => {
      if (isDesktop(window)) {
        sidebarEl.classList.add('active')
        sidebarEl.classList.remove('inactive')
      } else {
        sidebarEl.classList.remove('active')
      }
      document.body.style.overflowY = isDesktop(window) ? 'auto' : 'hidden'
    }

    const handleClick = (e, sidebarItem) => {
      e.preventDefault()
      const submenu = sidebarItem.querySelector('.submenu')
      handleSubmenuToggle(submenu)

      requestAnimationFrame(() => {
        calculateChildrenHeight(submenu.parentElement, true)
      })
    }

    const initSubmenus = () => {
      const submenus = sidebarEl.querySelectorAll('.sidebar-item.has-sub .submenu')
      submenus.forEach((submenu) => {
        const parent = submenu.parentElement
        if (parent.classList.contains('active')) {
          submenu.classList.add('submenu-open')
        } else {
          submenu.classList.add('submenu-closed')
        }
        requestAnimationFrame(() => {
          calculateChildrenHeight(submenu, true)
        })
      })
    }

    const bindSidebarEvents = () => {
      const sidebarItems = sidebarEl.querySelectorAll('.sidebar-item.has-sub')
      sidebarItems.forEach((item) => {
        const link = item.querySelector('.sidebar-link')
        link.addEventListener('click', (e) => handleClick(e, item))

        const subItems = item.querySelectorAll('.submenu-item.has-sub')
        subItems.forEach((subItem) => {
          subItem.addEventListener('click', () => {
            const subsubmenu = subItem.querySelector('.submenu')
            handleSubmenuToggle(subsubmenu)
            requestAnimationFrame(() => {
              calculateChildrenHeight(subItem.parentElement, true)
            })
          })
        })
      })
    }

    window.addEventListener('resize', handleResize)
    initSubmenus()
    bindSidebarEvents()

    const activeItem = sidebarEl.querySelector('.sidebar-item.active')
    if (activeItem && !isElementInViewport(activeItem)) {
      activeItem.scrollIntoView(false)
    }

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const isElementInViewport = (el) => {
    const rect = el.getBoundingClientRect()
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  }

  const { toggleTheme } = useTheme()

  return (
    <div ref={sidebarRef} id="sidebar" className={`sidebar ${active ? 'active' : 'inactive'}`}>
      <div className="sidebar-wrapper active">
        <div className="sidebar-header position-relative">
          <div className="d-flex justify-content-between align-items-center">
            <div className="logo">
              <a href="/"><img src={logo} alt="Logo" srcSet="" /></a>
            </div>
            <div className="theme-toggle d-flex gap-2  align-items-center mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
                role="img" className="iconify iconify--system-uicons" width="20" height="20"
                preserveAspectRatio="xMidYMid meet" viewBox="0 0 21 21">
                <g fill="none" fillRule="evenodd" stroke="currentColor" strokeLinecap="round"
                  strokeLinejoin="round">
                  <path
                    d="M10.5 14.5c2.219 0 4-1.763 4-3.982a4.003 4.003 0 0 0-4-4.018c-2.219 0-4 1.781-4 4c0 2.219 1.781 4 4 4zM4.136 4.136L5.55 5.55m9.9 9.9l1.414 1.414M1.5 10.5h2m14 0h2M4.135 16.863L5.55 15.45m9.899-9.9l1.414-1.415M10.5 19.5v-2m0-14v-2"
                    opacity=".3"></path>
                  <g transform="translate(-210 -1)">
                    <path d="M220.5 2.5v2m6.5.5l-1.5 1.5"></path>
                    <circle cx="220.5" cy="11.5" r="4"></circle>
                    <path d="m214 5l1.5 1.5m5 14v-2m6.5-.5l-1.5-1.5M214 18l1.5-1.5m-4-5h2m14 0h2"></path>
                  </g>
                </g>
              </svg>
              <div className="form-check form-switch fs-6">
                <input className="form-check-input  me-0" type="checkbox" id="toggle-dark" style={{ cursor: 'pointer' }} onClick={toggleTheme} />
                <label className="form-check-label"></label>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
                role="img" className="iconify iconify--mdi" width="20" height="20" preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 24 24">
                <path fill="currentColor"
                  d="m17.75 4.09l-2.53 1.94l.91 3.06l-2.63-1.81l-2.63 1.81l.91-3.06l-2.53-1.94L12.44 4l1.06-3l1.06 3l3.19.09m3.5 6.91l-1.64 1.25l.59 1.98l-1.7-1.17l-1.7 1.17l.59-1.98L15.75 11l2.06-.05L18.5 9l.69 1.95l2.06.05m-2.28 4.95c.83-.08 1.72 1.1 1.19 1.85c-.32.45-.66.87-1.08 1.27C15.17 23 8.84 23 4.94 19.07c-3.91-3.9-3.91-10.24 0-14.14c.4-.4.82-.76 1.27-1.08c.75-.53 1.93.36 1.85 1.19c-.27 2.86.69 5.83 2.89 8.02a9.96 9.96 0 0 0 8.02 2.89m-1.64 2.02a12.08 12.08 0 0 1-7.8-3.47c-2.17-2.19-3.33-5-3.49-7.82c-2.81 3.14-2.7 7.96.31 10.98c3.02 3.01 7.84 3.12 10.98.31Z">
                </path>
              </svg>
            </div>
            <div className="sidebar-toggler  x">
              <a href="#" className="sidebar-hide d-xl-none d-block"><i className="bi bi-x bi-middle" onClick={toggleSidebar}></i></a>
            </div>
          </div>
        </div>
        <div className="sidebar-menu">
          <ul className="menu">
            {sidebarItems.map((sidebarItem, index) => (
              <div key={index}>
                {sidebarItem.isTitle
                  ? <li className="sidebar-title">{sidebarItem.name}</li>
                  : <li
                    className={`sidebar-item ${(sidebarItem.url === pathname || pathname.startsWith(sidebarItem.key)) ? 'active' : ''} ${sidebarItem?.submenu?.length > 0 ? 'has-sub' : ''}`}>
                    <Link to={sidebarItem.url!==undefined ? sidebarItem.url : '#'} className='sidebar-link'>
                      {sidebarItem.icon}
                      <span>{sidebarItem.name}</span>
                    </Link>
                    {sidebarItem.submenu?.length > 0 && (
                      <ul className='submenu'>
                        {sidebarItem.submenu?.map((sub, index) => (
                          <li key={index} className={`submenu-item ${(sub.url === pathname) && 'active'} ${sub?.submenu?.length > 0 && 'has-sub'}`}>
                            <Link to={sub.url} className="submenu-link">{sub.name}</Link>
                            {sub?.submenu?.length > 0 && (
                              <ul className='submenu submenu-level-2'>
                                {sub.submenu.map((subsub, index) => (
                                  <li key={index} className={`submenu-item ${subsub.url == pathname && 'active'}`}>
                                    <Link to={subsub.url} className="submenu-link">{subsub.name}</Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                }
              </div>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Sidebar