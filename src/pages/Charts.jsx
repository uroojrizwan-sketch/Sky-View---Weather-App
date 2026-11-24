import React, { useContext } from 'react'
import WeatherChart from '../components/WeatherChart'
import {
  CloudSun,
  CloudRain,
  Droplets,
  Wind,
  Thermometer
} from 'lucide-react'
import { WeatherContext } from '../context/WeatherContext'
import { SettingsContext } from '../context/SettingsContext'

const Charts = () => {
  const { weather, loading, error } = useContext(WeatherContext)
  const { preferences } = useContext(SettingsContext)

  const unit = preferences.temperature
  const daily = weather?.daily
  const hourly = weather?.hourly

  const average = (values) => {
    if (!values?.length) return null

    return values.reduce((sum, value) => sum + value, 0) / values.length
  }

  const avgTemp = average(daily?.temperature_2m_max?.map((max, index) =>
    (max + daily.temperature_2m_min[index]) / 2
  ))

  const avgHumidity = average(hourly?.relative_humidity_2m?.slice(0, 24))

  const totalRainfall = daily?.precipitation_sum?.slice(0, 7)
    .reduce((sum, value) => sum + value, 0)

  const avgWind = average(daily?.wind_speed_10m_max?.slice(0, 7))

  const stats = [
    {
      title: "Average Temperature",
      value: avgTemp !== null ? `${Math.round(avgTemp)}°${unit}` : '--',
      icon: Thermometer,
      color: "text-orange-400",
      bg: "bg-orange-400/10"
    },
    {
      title: "Average Humidity",
      value: avgHumidity !== null ? `${Math.round(avgHumidity)}%` : '--',
      icon: Droplets,
      color: "text-sky-400",
      bg: "bg-sky-400/10"
    },
    {
      title: "Rainfall",
      value: totalRainfall !== undefined
        ? `${totalRainfall.toFixed(1)} mm`
        : '--',
      icon: CloudRain,
      color: "text-blue-400",
      bg: "bg-blue-400/10"
    },
    {
      title: "Wind Speed",
      value: avgWind !== null ? `${Math.round(avgWind)} km/h` : '--',
      icon: Wind,
      color: "text-purple-400",
      bg: "bg-purple-400/10"
    }
  ]

  return (
    <div className="w-full min-w-0 text-white">

      <main className="w-full space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Weather Analytics
          </h1>

          <p className="text-slate-400 mt-2">
            Explore weather patterns and detailed statistics.
          </p>
        </div>

        {/* Loading / Error */}
        {loading ? (
          <div className="p-6 text-slate-400 animate-pulse">
            Loading weather statistics...
          </div>
        ) : error || !weather ? (
          <div className="p-6 text-red-400">
            {error || 'Weather data unavailable.'}
          </div>
        ) : (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

              {stats.map((item, index) => {
                const Icon = item.icon

                return (
                  <div
                    key={index}
                    className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-5 hover:bg-white/5 transition"
                  >

                    <div className="flex items-center justify-between">

                      <p className="text-sm text-slate-400">
                        {item.title}
                      </p>

                      <div className={`p-3 rounded-xl ${item.bg}`}>
                        <Icon size={22} className={item.color} />
                      </div>

                    </div>

                    <h2 className="text-3xl font-bold mt-5">
                      {item.value}
                    </h2>

                  </div>
                )
              })}

            </div>
          </>
        )}

        {/* Temperature Chart */}
        <WeatherChart />

        {/* Rainfall and Weather Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          <div className="rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-6">

            <div className="flex items-center gap-3 mb-3">
              <CloudRain className="text-sky-400" size={24} />

              <h2 className="text-lg font-semibold">
                Rainfall Analysis
              </h2>
            </div>

            <p className="text-sm text-slate-400">
              Rainfall trends and precipitation statistics.
            </p>

          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-6">

            <div className="flex items-center gap-3 mb-3">
              <CloudSun className="text-orange-400" size={24} />

              <h2 className="text-lg font-semibold">
                Weather Insights
              </h2>
            </div>

            <p className="text-sm text-slate-400">
              Detailed weather conditions and environmental patterns.
            </p>

          </div>

        </div>

      </main>

    </div>
  )
}

export default Charts
