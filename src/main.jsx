import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from '~/contexts/AuthContext.jsx'
import { ThemeProvider } from '~/contexts/ThemeContext.jsx'

// const theme = localStorage.getItem('theme') ||
//   (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

// document.documentElement.setAttribute('data-bs-theme', theme)
// document.body.classList.add(theme)


createRoot(document.getElementById('root')).render(
  <BrowserRouter basename='/'>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
)
