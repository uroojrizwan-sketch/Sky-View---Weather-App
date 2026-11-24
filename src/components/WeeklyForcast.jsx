import React, { useContext, useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { WeatherContext } from '../context/WeatherContext'
const WeeklyForcast = () => {
  const { weather, loading, error } = useContext(WeatherContext)
  const scrollRef = useRef(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [visibleCards, setVisibleCards] = useState(2)

  const getWeatherInfo = (code) => {

    if (code === 0) return { icon: '☀️', condition: 'Sunny' }

    if ([1, 2].includes(code))
      return { icon: '🌤️', condition: 'Partly Cloudy' }

    if (code === 3)
      return { icon: '☁️', condition: 'Cloudy' }

    if ([45, 48].includes(code))
      return { icon: '🌁', condition: 'Foggy' }

    if ([51, 53, 55, 56, 57].includes(code))
      return { icon: '🌦️', condition: 'Drizzle' }

    if ([61, 63, 65, 66, 67].includes(code))
      return { icon: '🌧️', condition: 'Rainy' }

    if ([71, 73, 75, 77].includes(code))
      return { icon: '❄️', condition: 'Snowy' }

    if ([80, 81, 82].includes(code))
      return { icon: '🌧️', condition: 'Rain Showers' }

    if ([85, 86].includes(code))
      return { icon: '🌨️', condition: 'Snow Showers' }

    if ([95, 96, 99].includes(code))
      return { icon: '⛈️', condition: 'Thunderstorm' }

    return { icon: '🌤️', condition: 'Unknown' }
  }

  // Format API dates
  const formatDay = (date, index) => {

    if (index === 0) return 'Today'

    return new Date(`${date}T12:00:00`).toLocaleDateString(
      'en-US',
      { weekday: 'long' }
    )
  }

  // Convert API data into cards
  const weeklyData = weather?.daily
    ? weather.daily.time.map((date, index) => {

        const info = getWeatherInfo(
          weather.daily.weather_code[index]
        )

        return {
          day: formatDay(date, index),
          icon: info.icon,
          condition: info.condition,
          max: Math.round(weather.daily.temperature_2m_max[index]),
          min: Math.round(weather.daily.temperature_2m_min[index]),
          rain: Math.round(
            weather.daily.precipitation_probability_max[index] ?? 0
          )
        }

      })
    : []

  // Responsive visible cards
  useEffect(() => {

    const updateVisibleCards = () => {

      if (window.innerWidth >= 1280) {
        setVisibleCards(7)
      } else if (window.innerWidth >= 640) {
        setVisibleCards(3)
      } else {
        setVisibleCards(2)
      }

      setCurrentPage(0)

      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          left: 0,
          behavior: 'smooth'
        })
      }
    }

    updateVisibleCards()

    window.addEventListener('resize', updateVisibleCards)

    return () => {
      window.removeEventListener('resize', updateVisibleCards)
    }

  }, [])

  const totalPages = Math.ceil(weeklyData.length / visibleCards)

  const scrollNext = () => {

    const container = scrollRef.current

    if (!container || currentPage >= totalPages - 1) return

    container.scrollTo({
      left: container.clientWidth * (currentPage + 1),
      behavior: 'smooth'
    })

    setCurrentPage(prev => prev + 1)
  }

  const scrollPrev = () => {

    const container = scrollRef.current

    if (!container || currentPage <= 0) return

    container.scrollTo({
      left: container.clientWidth * (currentPage - 1),
      behavior: 'smooth'
    })

    setCurrentPage(prev => prev - 1)
  }

  // Loading
  if (loading && !weather) {
    return (
      <div className="w-full rounded-3xl border border-white/10 bg-slate-900/50 p-6 text-slate-400">
        Loading weekly forecast...
      </div>
    )
  }

  // Error
  if (error && !weather) {
    return (
      <div className="w-full rounded-3xl border border-red-400/20 bg-slate-900/50 p-6 text-red-400">
        {error}
      </div>
    )
  }

  if (!weeklyData.length) return null

  return (

    <div className="w-full min-w-0 rounded-3xl border border-white/10 bg-linear-to-br from-indigo-600/15 via-slate-900/70 to-blue-500/10 shadow-xl backdrop-blur-2xl p-4 sm:p-6">

      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-6">

        <div>
          <h2 className="text-xl font-semibold text-white">
            Weekly Forecast
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Weather outlook for the next 7 days
          </p>
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center gap-2 xl:hidden">

          <button
            onClick={scrollPrev}
            disabled={currentPage === 0}
            className="p-2 rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/15 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={scrollNext}
            disabled={currentPage >= totalPages - 1}
            className="p-2 rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/15 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={20} />
          </button>

        </div>

      </div>

      {/* Weekly Cards */}
      <div
        ref={scrollRef}
        className="grid grid-flow-col auto-cols-[calc((100%-0.5rem)/2)] sm:auto-cols-[calc((100%-1.5rem)/3)] xl:auto-cols-[calc((100%-4.5rem)/7)] gap-2 sm:gap-3 overflow-x-auto scroll-smooth [scrollbar-none] [&::-webkit-scrollbar]:hidden"
      >

        {weeklyData.map((day, index) => (

          <div
            key={day.day + index}
            className={`weekly-card min-w-0 flex flex-col items-center justify-evenly gap-3 rounded-2xl border p-3 sm:p-4 transition-all duration-300 hover:bg-white/10
              ${index === 0
                ? "border-sky-400/40 bg-sky-400/10"
                : "border-white/10 bg-white/5"
              }`}
          >

            {/* Day */}
            <p className={`text-sm font-medium text-center ${
              index === 0 ? "text-sky-300" : "text-slate-300"
            }`}>
              {day.day}
            </p>

            {/* Weather Icon */}
            <div className="text-3xl sm:text-4xl">
              {day.icon}
            </div>

            {/* Condition */}
            <p className="text-xs text-slate-400 text-center">
              {day.condition}
            </p>

            {/* Temperature */}
            <div className="flex items-center gap-2">

              <span className="text-lg font-semibold text-white">
                {day.max}°
              </span>

              <span className="text-sm text-slate-400">
                {day.min}°
              </span>

            </div>

            {/* Rain Probability */}
            <div className="flex items-center gap-1 text-xs text-sky-300">
              <span>💧</span>
              <span>{day.rain}%</span>
            </div>

          </div>

        ))}

      </div>

    </div>
  )
}

export default WeeklyForcast
