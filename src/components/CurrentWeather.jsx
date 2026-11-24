import React, { useContext } from 'react'
import {
  CloudSun,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudSnow,
  CloudFog,
  Sun,
  CloudLightning,
  MapPin,
  ThermometerSun,
  Heart
} from "lucide-react"
import { WeatherContext } from '../context/WeatherContext'
import { SettingsContext } from '../context/SettingsContext'
import { FavouritesContext } from '../context/FavouritesContext'

// Weather code converter
const getWeatherInfo = (code) => {

  if (code === 0) return { text: "Clear Sky", icon: Sun }

  if (code === 1 || code === 2)
    return { text: "Partly Cloudy", icon: CloudSun }

  if (code === 3) return { text: "Overcast", icon: Cloud }

  if ([45, 48].includes(code))
    return { text: "Foggy", icon: CloudFog }

  if ([51, 53, 55, 56, 57].includes(code))
    return { text: "Drizzle", icon: CloudDrizzle }

  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code))
    return { text: "Rainy", icon: CloudRain }

  if ([71, 73, 75, 77, 85, 86].includes(code))
    return { text: "Snowy", icon: CloudSnow }

  if ([95, 96, 99].includes(code))
    return { text: "Thunderstorm", icon: CloudLightning }

  return { text: "Unknown", icon: CloudSun }
}

const CurrentWeather = () => {

  const { weather, loading, error } = useContext(WeatherContext)
  const { preferences } = useContext(SettingsContext)

  const {
    toggleFavourite,
    isFavourite
  } = useContext(FavouritesContext)

  const unit = preferences.temperature

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-8 flex items-center justify-center min-h-80">
        <p className="text-slate-400 animate-pulse">
          Loading current weather...
        </p>
      </div>
    )
  }

  if (error || !weather) {
    return (
      <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-8 flex items-center justify-center min-h-80">
        <p className="text-red-400 text-center">
          {error || "Weather data unavailable."}
        </p>
      </div>
    )
  }
  const current = weather.current
  const daily = weather.daily
  const location = weather.location
  const currentTemp = Math.round(current.temperature_2m)
  const maxTemp = Math.round(daily.temperature_2m_max[0])
  const minTemp = Math.round(daily.temperature_2m_min[0])
  const weatherInfo = getWeatherInfo(current.weather_code)
  const WeatherIcon = weatherInfo.icon

  // Current city favourite status
  const city = {
    name: location.name,
    country: location.country,
    latitude: location.latitude,
    longitude: location.longitude
  }

  const favourite = isFavourite(city)

  return (
    <div className="relative rounded-3xl border border-white/10 bg-linear-to-br from-indigo-600/15 via-slate-900/70 to-blue-500/10 backdrop-blur-2xl p-6 sm:p-8 shadow-xl">

      {/* Card Header */}
      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-slate-400 font-medium">
            Current Weather
          </p>

          <div className="flex items-center gap-2 mt-2">
            <MapPin size={16} className="text-indigo-400" />

            <h2 className="text-lg font-semibold">
              {location.name}, {location.country}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">

          <span className="text-sm text-slate-400 font-medium">
            Today
          </span>

          {/* Favourite Button */}
          <button
            type="button"
            onClick={() => toggleFavourite(city)}
            className={`p-3 rounded-xl border transition-all duration-300 ${
              favourite
                ? "bg-pink-500/15 border-pink-400/30 text-pink-400"
                : "bg-white/5 border-white/10 text-slate-400 hover:text-pink-400 hover:bg-pink-500/10"
            }`}
            title={
              favourite
                ? "Remove from favourites"
                : "Add to favourites"
            }
            aria-label={
              favourite
                ? "Remove from favourites"
                : "Add to favourites"
            }
          >
            <Heart
              size={21}
              fill={favourite ? "currentColor" : "none"}
            />
          </button>

        </div>
      </div>

      {/* Temperature */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-10 gap-6">

        <div>
          <h1 className="text-7xl sm:text-8xl font-light tracking-tight">
            {currentTemp}°
            <span className="text-4xl text-slate-400">
              {unit}
            </span>
          </h1>

          <p className="text-xl font-medium text-slate-200 mt-3">
            {weatherInfo.text}
          </p>

          <p className="text-sm text-slate-400 mt-2">
            Feels like {Math.round(current.apparent_temperature)}°{unit}
          </p>
        </div>

        {/* Weather Icon */}
        <div className="flex justify-center sm:justify-end">
          <div className="w-30 h-30 rounded-full bg-indigo-400/10 border border-indigo-300/10 flex items-center justify-center shadow-[0_0_60px_rgba(99,102,241,0.15)]">
            <WeatherIcon
              size={70}
              strokeWidth={1.2}
              className="text-indigo-200"
            />
          </div>
        </div>

      </div>

      {/* High / Low */}
      <div className="flex justify-between items-center gap-8 mt-10 pt-6 border-t border-white/10">

        {/* High */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-400/10 flex items-center justify-center">
            <ThermometerSun size={20} className="text-orange-300" />
          </div>

          <div>
            <p className="text-xs text-slate-400">High</p>
            <p className="text-lg font-semibold">
              {maxTemp}°{unit}
            </p>
          </div>
        </div>

        {/* Low */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-400/10 flex items-center justify-center">
            <ThermometerSun size={20} className="text-blue-300" />
          </div>

          <div>
            <p className="text-xs text-slate-400">Low</p>
            <p className="text-lg font-semibold">
              {minTemp}°{unit}
            </p>
          </div>
        </div>

      </div>

    </div>
  )
}

export default CurrentWeather
