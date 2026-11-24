import React, { useContext } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts'
import { WeatherContext } from '../context/WeatherContext'
import { SettingsContext } from '../context/SettingsContext'
const WeatherChart = () => {
  const { weather, loading, error } = useContext(WeatherContext)
  const { preferences } = useContext(SettingsContext)
  const unit = preferences.temperature

  // Loading State
  if (loading) {
    return (
      <div className="w-full min-w-0 min-h-80 rounded-3xl border border-white/10 bg-slate-900/50 p-6 flex items-center justify-center">
        <p className="text-slate-400 animate-pulse">
          Loading weekly temperature trend...
        </p>
      </div>
    )
  }

  // Error State
  if (error || !weather?.daily) {
    return (
      <div className="w-full min-w-0 min-h-80 rounded-3xl border border-white/10 bg-slate-900/50 p-6 flex items-center justify-center">
        <p className="text-red-400 text-center">
          {error || "Weekly chart data unavailable."}
        </p>
      </div>
    )
  }

  const daily = weather.daily

  //  api data to chart data
  const weeklyData = daily.time.slice(0, 7).map((date, index) => {

    const dateObj = new Date(`${date}T12:00:00`)

    const day = index === 0
      ? 'Today'
      : dateObj.toLocaleDateString('en-US', {
          weekday: 'short'
        })

    return {
      day,
      maxTemp: Math.round(daily.temperature_2m_max[index]),
      minTemp: Math.round(daily.temperature_2m_min[index])
    }
  })

  return (
    <div className="w-full min-w-0 rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-2xl p-5 sm:p-6">

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">

        <div>
          <h2 className="text-xl font-semibold text-white">
            Weekly Temperature Trend
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Temperature changes over 7 days
          </p>
        </div>

        <div className="flex items-center gap-4">

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
            <span className="text-xs text-slate-400">Max</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
            <span className="text-xs text-slate-400">Min</span>
          </div>

        </div>

      </div>

      {/* Weekly Chart */}
      <div className="w-full h-70 sm:h-82.5">

        <ResponsiveContainer width="100%" height="100%">

          <AreaChart
            data={weeklyData}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >

            <defs>

              <linearGradient id="maxGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
              </linearGradient>

              <linearGradient id="minGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
              </linearGradient>

            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#ffffff"
              strokeOpacity={0.08}
              vertical={false}
            />

            <XAxis
              dataKey="day"
              stroke="#94a3b8"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              stroke="#94a3b8"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value}°`}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "12px",
                color: "#fff"
              }}
              formatter={(value, name) => [
                `${value}°${unit}`,
                name === "maxTemp" ? "Maximum" : "Minimum"
              ]}
            />

            <Area
              type="monotone"
              dataKey="maxTemp"
              name="maxTemp"
              stroke="#38bdf8"
              strokeWidth={3}
              fill="url(#maxGradient)"
              activeDot={{ r: 6 }}
            />

            <Area
              type="monotone"
              dataKey="minTemp"
              name="minTemp"
              stroke="#a78bfa"
              strokeWidth={3}
              fill="url(#minGradient)"
              activeDot={{ r: 6 }}
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </div>
  )
}

export default WeatherChart