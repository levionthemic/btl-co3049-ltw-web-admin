import Layout from '~/components/Layout/Layout'
import '~/assets/scss/app.scss'
import '~/assets/scss/themes/dark/app-dark.scss'
import '~/assets/scss/iconly.scss'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import Dashboard from '~/pages/Dashboard'
import Account from '~/pages/Account/Account'
import Blog from '~/pages/Blog'
import Faq from '~/pages/Faq/Faq'
import Room from '~/pages/Room'
import Booking from '~/pages/Booking'
import System from '~/pages/System'
import CustomerPage from './pages/CustomerPage'
import SettingsPage from './pages/SettingsPage'
import CreateFaqForm from './pages/Faq/CreateFaqForm'
import EditFaqForm from './pages/Faq/EditFaqForm'
import EditRoom from '~/pages/RoomEditPage'
import EditAccountForm from '~/pages/Account/EditFaqForm'
import { useAuth } from '~/contexts/AuthContext'
import Login from '~/pages/Auth/Login'
import Spinner from '~/components/Spinner/Spinner'
import CreateRoom from './pages/RoomCreatePage'
import { initLogout } from '~/utils/authorizedAxios'

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ user }) => {
  if (!user) return <Navigate to='/login' replace={true} />
  return <Outlet />
}

function App() {
  const { currentUser, isLoading, logout } = useAuth()
  initLogout(logout)

  if (isLoading) return <Spinner />

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<PrivateRoute user={currentUser} />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />

          <Route path="account" element={<Account />} />
          <Route path="account/edit/:id" element={<EditAccountForm />} />

          <Route path="blog" element={<Blog />} />

          <Route path="faq" element={<Faq />} />
          <Route path="faq/create" element={<CreateFaqForm />} />
          <Route path="faq/edit/:id" element={<EditFaqForm />} />

          <Route path="room" element={<Room />} />
          <Route path="room/edit/:id" element={<EditRoom />} />
          <Route path="room/create" element={<CreateRoom />} />
          <Route path="booking" element={<Booking />} />
          <Route path="system" element={<System />} />
          <Route path="customer" element={<CustomerPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
