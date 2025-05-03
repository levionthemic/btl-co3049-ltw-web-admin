/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

const THEME_KEY = 'theme'

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Ưu tiên localStorage -> fallback hệ thống
    const stored = localStorage.getItem(THEME_KEY)
    return stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  })

  // Cập nhật DOM khi theme thay đổi
  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme)
    document.body.classList.remove('light', 'dark')
    document.body.classList.add(theme)
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  // Toggle function
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Custom hook
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
