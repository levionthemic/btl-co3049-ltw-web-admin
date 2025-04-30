// ThemeProvider.jsx
import React, { useEffect, useState } from 'react'

const THEME_KEY = 'theme'

const ThemeProvider = () => {
  const [theme, setThemeState] = useState(() => {
    const storedTheme = localStorage.getItem(THEME_KEY)
    if (storedTheme) return storedTheme
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  // Cập nhật UI và lưu localStorage nếu được yêu cầu
  const applyTheme = (theme, persist = false) => {
    document.body.classList.remove('dark', 'light')
    document.body.classList.add(theme)
    document.documentElement.setAttribute('data-bs-theme', theme)
    if (persist) localStorage.setItem(THEME_KEY, theme)
  }

  // Toggle theme handler
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setThemeState(newTheme)
    applyTheme(newTheme, true)
  }

  // Initial mount: apply theme & register media listener
  useEffect(() => {
    applyTheme(theme)

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const listener = (e) => {
      const systemTheme = e.matches ? 'dark' : 'light'
      setThemeState(systemTheme)
      applyTheme(systemTheme, true)
    }

    mediaQuery.addEventListener('change', listener)
    return () => mediaQuery.removeEventListener('change', listener)
  }, [])

  // Sync when theme changes via `setState`
  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  // Sync toggle switch if available
  useEffect(() => {
    const toggler = document.getElementById('toggle-dark')
    if (toggler) {
      toggler.checked = theme === 'dark'
      toggler.addEventListener('input', (e) => {
        const newTheme = e.target.checked ? 'dark' : 'light'
        setThemeState(newTheme)
        applyTheme(newTheme, true)
      })
    }

    return () => {
      if (toggler) toggler.removeEventListener('input', () => {})
    }
  }, [theme])

  return null // Không render gì
}

export default ThemeProvider
