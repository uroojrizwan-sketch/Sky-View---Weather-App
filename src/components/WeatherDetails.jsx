import React, { useContext } from 'react'
import { Droplets, Wind, Eye, Sun } from "lucide-react"
import { WeatherContext } from '../context/WeatherContext'
const WeatherDetails = () => {
  const { weather, loading, error } = useContext(WeatherContext)
  if (loading && !weather) {
    return (
      <section className="rounded-3xl border border-white/10 bg-slate-900/50 p-6 text-slate-400">
        Loading weather details...
      </section>
    )
  }

  if (error && !weather) {
    return (
      <section className="rounded-3xl border border-white/10 bg-slate-900/50 p-6 text-red-400">
        {error}
      </section>
    )
  }

  if (!weather) return null

  const humidity = weather.current.relative_humidity_2m
  const windSpeed = weather.current.wind_speed_10m

  // Get current hour index
  const currentTime = weather.current.time.slice(0, 13)

  const hourIndex = weather.hourly.time.findIndex(
    time => time.slice(0, 13) === currentTime
  )

  // Visibility conversion
  const visibilityValue = hourIndex >= 0
    ? weather.hourly.visibility[hourIndex]
    : null

  const visibility = visibilityValue != null
    ? (visibilityValue / 1000).toFixed(1)
    : '--'

  // Daily UV Index
  const uvIndex = weather.daily.uv_index_max[0]

  // Humidity description
  const getHumidityStatus = (value) => {
    if (value < 30) return 'Low humidity'
    if (value < 60) return 'Comfortable humidity'
    if (value < 80) return 'Moderate humidity'
    return 'High humidity'
  }

  // Wind description
  const getWindStatus = (value) => {
    if (value < 12) return 'Light breeze'
    if (value < 29) return 'Moderate breeze'
    if (value < 50) return 'Fresh breeze'
    return 'Strong wind'
  }

  // UV description
  const getUVStatus = (value) => {
    if (value <= 2) return 'Low'
    if (value <= 5) return 'Moderate'
    if (value <= 7) return 'High'
    if (value <= 10) return 'Very High'
    return 'Extreme'
  }

  return (
    <section className="bg-linear-to-br from-indigo-600/15 via-slate-900/70 to-blue-500/10 sm:p-8 rounded-3xl border border-white/10 backdrop-blur-2xl p-6 shadow-xl">

      <div>
        <h2 className="text-xl font-semibold">
          Weather Details
        </h2>

        <p className="text-sm text-slate-400 mt-1">
          Today's weather highlights
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">

        {/* Humidity */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-all duration-300">

          <div className="flex items-center justify-between">
            <Droplets size={22} className="text-blue-400" />

            <span className="text-xs text-slate-500">
              Humidity
            </span>
          </div>

          <h3 className="text-2xl font-semibold mt-5">
            {humidity}%
          </h3>

          <p className="text-xs text-slate-400 mt-1">
            {getHumidityStatus(humidity)}
          </p>

        </div>

        {/* Wind Speed */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-all duration-300">

          <div className="flex items-center justify-between">
            <Wind size={22} className="text-cyan-400" />

            <span className="text-xs text-slate-500">
              Wind Speed
            </span>
          </div>

          <h3 className="text-2xl font-semibold mt-5">
            {windSpeed} km/h
          </h3>

          <p className="text-xs text-slate-400 mt-1">
            {getWindStatus(windSpeed)}
          </p>

        </div>

        {/* Visibility */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-all duration-300">

          <div className="flex items-center justify-between">
            <Eye size={22} className="text-emerald-400" />

            <span className="text-xs text-slate-500">
              Visibility
            </span>
          </div>

          <h3 className="text-2xl font-semibold mt-5">
            {visibility} km
          </h3>

          <p className="text-xs text-slate-400 mt-1">
            {visibilityValue == null
              ? 'Data unavailable'
              : visibilityValue >= 10000
                ? 'Clear visibility'
                : visibilityValue >= 4000
                  ? 'Moderate visibility'
                  : 'Low visibility'}
          </p>

        </div>

        {/* UV Index */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-all duration-300">

          <div className="flex items-center justify-between">
            <Sun size={22} className="text-orange-400" />

            <span className="text-xs text-slate-500">
              UV Index
            </span>
          </div>

          <h3 className="text-2xl font-semibold mt-5">
            {uvIndex ?? '--'}
          </h3>

          <p className="text-xs text-slate-400 mt-1">
            {uvIndex == null
              ? 'Data unavailable'
              : getUVStatus(uvIndex)}
          </p>

        </div>

      </div>

    </section>
  )
}

export default WeatherDetails
