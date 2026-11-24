import React, { useContext } from 'react'
import { Sunrise, Sunset, Sun } from "lucide-react"
import { WeatherContext } from '../context/WeatherContext'
const SunriseSunset = () => {
    const { weather, loading, error } = useContext(WeatherContext)
    if (loading) {
        return (
            <section className="rounded-3xl border border-white/10 bg-slate-900/50 p-6 sm:p-8 shadow-xl">
                <p className="text-slate-400">Loading sun schedule...</p>
            </section>
        )
    }

    if (error || !weather?.daily) {
        return (
            <section className="rounded-3xl border border-white/10 bg-slate-900/50 p-6 sm:p-8 shadow-xl">
                <p className="text-red-400">
                    Unable to load sun schedule.
                </p>
            </section>
        )
    }

    const sunrise = weather.daily.sunrise?.[0]
    const sunset = weather.daily.sunset?.[0]
    const currentTime = weather.current?.time

    const formatTime = (time) => {
        if (!time) return '--:--'

        return new Date(time).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: weather.timezone
        })
    }

    const getMinutes = (time) => {
        if (!time) return 0

        const date = new Date(time)

        return date.getHours() * 60 + date.getMinutes()
    }

    const sunriseMinutes = getMinutes(sunrise)
    const sunsetMinutes = getMinutes(sunset)
    const currentMinutes = getMinutes(currentTime)

    const daylightDuration = sunsetMinutes - sunriseMinutes

    const progress = daylightDuration > 0
        ? Math.min(100, Math.max(
            0,
            ((currentMinutes - sunriseMinutes) / daylightDuration) * 100
        ))
        : 0

    const isDaytime =
        currentMinutes >= sunriseMinutes &&
        currentMinutes <= sunsetMinutes

    return (
        <section className="rounded-3xl border border-white/10 bg-linear-to-br from-indigo-600/15 via-slate-900/70 to-blue-500/10 backdrop-blur-2xl p-6 sm:p-8 shadow-xl">

            <div>
                <h2 className="text-xl font-semibold">
                    Sun Schedule
                </h2>

                <p className="text-sm text-slate-400 mt-1">
                    Sunrise & Sunset
                </p>
            </div>

            {/* Sunrise */}
            <div className="mt-6 flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 p-4">

                <div className="flex items-center gap-3">

                    <div className="p-3 rounded-xl bg-orange-400/10">
                        <Sunrise size={24} className="text-orange-400" />
                    </div>

                    <div>
                        <p className="text-sm text-slate-400">
                            Sunrise
                        </p>

                        <h3 className="text-xl font-semibold text-white">
                            {formatTime(sunrise)}
                        </h3>
                    </div>

                </div>

                <span className="text-xs text-slate-400">
                    Morning
                </span>

            </div>

            {/* Sunset */}
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 p-4">

                <div className="flex items-center gap-3">

                    <div className="p-3 rounded-xl bg-yellow-400/10">
                        <Sunset size={24} className="text-yellow-400" />
                    </div>

                    <div>
                        <p className="text-sm text-slate-400">
                            Sunset
                        </p>

                        <h3 className="text-xl font-semibold text-white">
                            {formatTime(sunset)}
                        </h3>
                    </div>

                </div>

                <span className="text-xs text-slate-400">
                    Evening
                </span>

            </div>

            {/* Daylight Progress */}
            <div className="mt-7">

                <div className="flex justify-between text-xs text-slate-400 mb-3">
                    <span>Sunrise</span>
                    <span>Sunset</span>
                </div>

                <div className="relative w-full h-2 rounded-full bg-white/10">

                    <div
                        className="absolute left-0 top-0 h-full rounded-full bg-linear-to-r from-yellow-500 to-orange-500 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />

                    <div
                        className="absolute -top-2 -translate-x-1/2 transition-all duration-500"
                        style={{ left: `${progress}%` }}
                    >
                        <Sun
                            size={22}
                            className="text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.6)]"
                        />
                    </div>

                </div>

                <p className="text-xs text-slate-400 mt-4 text-center">
                    {isDaytime
                        ? `${Math.round(progress)}% daylight completed`
                        : currentMinutes > sunsetMinutes
                            ? "Sun has set for today"
                            : "Sunrise is yet to come"
                    }
                </p>

            </div>

        </section>
    )
}

export default SunriseSunset
