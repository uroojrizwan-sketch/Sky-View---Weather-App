import React, {
  createContext,
  useEffect,
  useState
} from 'react'

export const SettingsContext = createContext()

const defaultPreferences = {
  temperature: 'C',
  theme: 'Dark',
  notifications: true,
  city: 'Haripur'
}

const SettingsProvider = ({ children }) => {

  const [preferences, setPreferences] = useState(() => {
    try {
      const savedSettings = localStorage.getItem('weatherPreferences')

      return savedSettings
        ? { ...defaultPreferences, ...JSON.parse(savedSettings) }
        : defaultPreferences
    } catch {
      return defaultPreferences
    }
  })

  const updateSettings = (newSettings) => {
    setPreferences(prev => ({
      ...prev,
      ...newSettings
    }))
  }

  useEffect(() => {
    localStorage.setItem(
      'weatherPreferences',
      JSON.stringify(preferences)
    )

    document.documentElement.dataset.theme =
      preferences.theme.toLowerCase()
  }, [preferences])

  return (
    <SettingsContext.Provider
      value={{ preferences, updateSettings }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export default SettingsProvider