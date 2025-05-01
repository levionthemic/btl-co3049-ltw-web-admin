import Layout from '~/components/Layout/Layout'
import '~/assets/scss/app.scss'
import '~/assets/scss/themes/dark/app-dark.scss'
import '~/assets/scss/iconly.scss'
import { Route, Routes } from 'react-router-dom'
import Dashboard from '~/pages/Dashboard'
import Account from '~/pages/Account'
import Blog from '~/pages/Blog'
import Faq from '~/pages/Faq/Faq'
import Room from '~/pages/Room'
import Booking from '~/pages/Booking'
import System from '~/pages/System'
import { useEffect } from 'react'
import CustomerPage from './pages/CustomerPage'
import SettingsPage from './pages/SettingsPage'
import CreateFaqForm from './pages/Faq/CreateFaqForm'
import EditFaqForm from './pages/Faq/EditFaqForm'

function App() {
  useEffect(() => {
    const theme = localStorage.getItem('theme')

    if (theme) document.documentElement.setAttribute('data-bs-theme', theme)
  }, [])
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="account" element={<Account />} />
        <Route path="blog" element={<Blog />} />

        <Route path="faq" element={<Faq />} />
        <Route path="faq/create" element={<CreateFaqForm />} />
        <Route path="faq/edit/:id" element={<EditFaqForm />} />
        <Route path="room" element={<Room />} />
        <Route path="booki  ng" element={<Booking />} />
        <Route path="system" element={<System />} />
        <Route path="customer" element={<CustomerPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  )
}

export default App
