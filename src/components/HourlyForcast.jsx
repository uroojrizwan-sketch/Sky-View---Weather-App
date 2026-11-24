import React, { useContext, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { WeatherContext } from '../context/WeatherContext'
import { SettingsContext } from '../context/SettingsContext'
import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudSnow,
  CloudFog,
  CloudLightning
} from 'lucide-react'
// Weather condition icons
const getWeatherInfo = (code) => {

  if (code === 0) return { icon: Sun, label: "Clear Sky" }

  if ([1, 2].includes(code))
    return { icon: CloudSun, label: "Partly Cloudy" }

  if (code === 3)
    return { icon: Cloud, label: "Overcast" }

  if ([45, 48].includes(code))
    return { icon: CloudFog, label: "Foggy" }

  if ([51, 53, 55, 56, 57].includes(code))
    return { icon: CloudDrizzle, label: "Drizzle" }

  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code))
    return { icon: CloudRain, label: "Rainy" }

  if ([71, 73, 75, 77, 85, 86].includes(code))
    return { icon: CloudSnow, label: "Snowy" }

  if ([95, 96, 99].includes(code))
    return { icon: CloudLightning, label: "Thunderstorm" }

  return { icon: CloudSun, label: "Unknown" }
}

const HourlyForcast = () => {

  const { weather, loading, error } = useContext(WeatherContext)
  const { preferences } = useContext(SettingsContext)

  const scrollRef = useRef(null)
  const [currentPage, setCurrentPage] = useState(0)

  const unit = preferences.temperature

  // Loading
  if (loading) {
    return (
      <div className="w-full min-w-0 min-h-80 rounded-3xl border border-white/10 bg-slate-900/50 p-6 flex items-center justify-center">
        <p className="text-slate-400 animate-pulse">
          Loading hourly forecast...
        </p>
      </div>
    )
  }

  // Error
  if (error || !weather?.hourly) {
    return (
      <div className="w-full min-w-0 min-h-80 rounded-3xl border border-white/10 bg-slate-900/50 p-6 flex items-center justify-center">
        <p className="text-red-400 text-center">
          {error || "Hourly forecast unavailable."}
        </p>
      </div>
    )
  }

  const { hourly, current } = weather

  // Find current hour in API data
  let startIndex = hourly.time.indexOf(current.time)

  if (startIndex === -1) {
    startIndex = hourly.time.findIndex(
      time => time >= current.time
    )
  }

  if (startIndex === -1) startIndex = 0

  // Next 12 hours
  const hourlyData = hourly.time
    .slice(startIndex, startIndex + 12)
    .map((time, index) => {

      const actualIndex = startIndex + index

      const date = new Date(time)

      const formattedTime = index === 0
        ? "Now"
        : date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            hour12: true
          })

      return {
        time: formattedTime,
        temp: Math.round(hourly.temperature_2m[actualIndex]),
        wind: Math.round(hourly.wind_speed_10m[actualIndex]),
        code: hourly.weather_code[actualIndex]
      }
    })

  // Responsive visible cards
  const getVisibleCards = () => {
    if (window.innerWidth >= 1280) return 4
    if (window.innerWidth >= 640) return 3
    return 2
  }

  const scrollNext = () => {

    const container = scrollRef.current
    if (!container) return

    const card = container.querySelector(".hourly-card")
    if (!card) return

    const gap = parseFloat(getComputedStyle(container).columnGap) || 0
    const cardWidth = card.getBoundingClientRect().width
    const visibleCards = getVisibleCards()

    const totalPages = Math.ceil(hourlyData.length / visibleCards)

    if (currentPage < totalPages - 1) {

      container.scrollBy({
        left: visibleCards * (cardWidth + gap),
        behavior: "smooth"
      })

      setCurrentPage(prev => prev + 1)
    }
  }

  const scrollPrev = () => {

    const container = scrollRef.current
    if (!container) return

    const card = container.querySelector(".hourly-card")
    if (!card) return

    const gap = parseFloat(getComputedStyle(container).columnGap) || 0
    const cardWidth = card.getBoundingClientRect().width
    const visibleCards = getVisibleCards()

    if (currentPage > 0) {

      container.scrollBy({
        left: -visibleCards * (cardWidth + gap),
        behavior: "smooth"
      })

      setCurrentPage(prev => prev - 1)
    }
  }

  const totalPages = Math.ceil(
    hourlyData.length / getVisibleCards()
  )

  return (

    <div className="w-full min-w-0 h-full z-10 rounded-3xl border border-white/10 bg-linear-to-br from-indigo-600/15 via-slate-900/50 to-blue-500/10 backdrop-blur-2xl shadow-xl p-4 sm:p-5 lg:p-5 flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-5">

        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-semibold text-white">
            Hourly Forecast
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Next 12 hours
          </p>
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center gap-1.5 shrink-0">

          <button
            onClick={scrollPrev}
            disabled={currentPage === 0}
            className="p-1.5 sm:p-2 rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/15 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            onClick={scrollNext}
            disabled={currentPage >= totalPages - 1}
            className="p-1.5 sm:p-2 rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/15 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={18} />
          </button>

        </div>

      </div>

      {/* Hourly Cards */}
      <div
        ref={scrollRef}
        onScroll={() => {
          const container = scrollRef.current
          if (!container) return

          const card = container.querySelector(".hourly-card")
          if (!card) return

          const gap = parseFloat(getComputedStyle(container).columnGap) || 0
          const step = (card.offsetWidth + gap) * getVisibleCards()

          setCurrentPage(
            Math.round(container.scrollLeft / step)
          )
        }}
        className="grid grid-flow-col auto-cols-[calc((100%-0.5rem)/3)] sm:auto-cols-[calc((100%-1.5rem)/3)] xl:auto-cols-[calc((100%-2.25rem)/4)] gap-2 sm:gap-3 overflow-x-auto scroll-smooth flex-1 min-h-55 content-stretch [scrollbar-none] [&::-webkit-scrollbar]:hidden"
      >

        {hourlyData.map((hour, index) => {

          const WeatherIcon = getWeatherInfo(hour.code).icon

          return (

            <div
              key={hour.time + index}
              className="hourly-card hover:bg-white/10 transition-all duration-300 cursor-pointer flex flex-col items-center justify-evenly gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4 min-w-0 h-full"
              title={getWeatherInfo(hour.code).label}
            >

              <p className="text-xs sm:text-sm text-slate-400">
                {hour.time}
              </p>

              <WeatherIcon
                size={32}
                strokeWidth={1.5}
                className="text-indigo-200 sm:w-9 sm:h-9"
              />

              <h3 className="text-xl sm:text-2xl font-semibold text-white">
                {hour.temp}°
              </h3>

              <p className="text-[10px] sm:text-xs text-slate-400 text-center">
                {hour.wind} km/h wind
              </p>

            </div>

          )
        })}

      </div>

    </div>
  )
}

export default HourlyForcast
