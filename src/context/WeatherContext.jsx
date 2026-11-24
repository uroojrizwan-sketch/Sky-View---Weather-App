import React, {createContext,useCallback,useContext, useEffect, useState} from 'react'
import { SettingsContext } from './SettingsContext'
import { fetchWeatherByCity } from '../services/weatherService'
export const WeatherContext = createContext(null)
const WeatherProvider = ({ children }) => {
  const { preferences } = useContext(SettingsContext)
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchWeather = useCallback(async (signal) => {
    try {
      setLoading(true)
      setError(null)

      const data = await fetchWeatherByCity(
        preferences.city,
        preferences.temperature,
        signal
      )

      setWeather(data)
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Something went wrong.')
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false)
      }
    }
  }, [preferences.city, preferences.temperature])

  useEffect(() => {
    const controller = new AbortController()

    fetchWeather(controller.signal)

    return () => {
      controller.abort()
    }
  }, [fetchWeather])

  const refreshWeather = () => {
    fetchWeather()
  }

  return (
    <WeatherContext.Provider
      value={{
        weather,
        loading,
        error,
        refreshWeather
      }}
    >
      {children}
    </WeatherContext.Provider>
  )
}

export default WeatherProvider
