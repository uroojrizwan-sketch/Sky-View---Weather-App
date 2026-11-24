import React, {
  useContext,
  useEffect,
  useState
} from 'react'
import {
  Search,
  MapPin,
  CloudSun,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudSnow,
  CloudFog,
  Sun,
  CloudLightning,
  Trash2,
  Heart,
  Wind,
  Loader2
} from 'lucide-react'

import { FavouritesContext } from '../context/FavouritesContext'
import { SettingsContext } from '../context/SettingsContext'

const getWeatherInfo = (code) => {

  if (code === 0) return { text: "Clear Sky", icon: Sun }

  if ([1, 2].includes(code))
    return { text: "Partly Cloudy", icon: CloudSun }

  if (code === 3)
    return { text: "Overcast", icon: Cloud }

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

const Favourites = () => {

  const { favourites, removeFavourite } =
    useContext(FavouritesContext)

  const { preferences } = useContext(SettingsContext)

  const [search, setSearch] = useState('')
  const [weatherData, setWeatherData] = useState({})
  const [loading, setLoading] = useState({})
  const [errors, setErrors] = useState({})

  const unit = preferences.temperature

  // Fetch weather for saved cities
  useEffect(() => {

    const controllers = []

    const fetchAllWeather = async () => {

      for (const city of favourites) {

        const controller = new AbortController()
        controllers.push(controller)

        setLoading(prev => ({
          ...prev,
          [city.id]: true
        }))

        try {

          const params = new URLSearchParams({
            latitude: city.latitude,
            longitude: city.longitude,
            current: [
              'temperature_2m',
              'weather_code',
              'wind_speed_10m'
            ].join(','),
            temperature_unit:
              unit === 'F' ? 'fahrenheit' : 'celsius',
            wind_speed_unit: 'kmh',
            timezone: 'auto'
          })

          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?${params}`,
            { signal: controller.signal }
          )

          if (!response.ok) {
            throw new Error('Unable to fetch weather.')
          }

          const data = await response.json()

          setWeatherData(prev => ({
            ...prev,
            [city.id]: data.current
          }))

          setErrors(prev => ({
            ...prev,
            [city.id]: ''
          }))

        } catch (err) {

          if (err.name !== 'AbortError') {
            setErrors(prev => ({
              ...prev,
              [city.id]: err.message
            }))
          }

        } finally {

          if (!controller.signal.aborted) {
            setLoading(prev => ({
              ...prev,
              [city.id]: false
            }))
          }

        }
      }
    }

    if (favourites.length > 0) {
      fetchAllWeather()
    }

    return () => {
      controllers.forEach(controller => controller.abort())
    }

  }, [favourites, unit])

  // Search filter
  const filteredCities = favourites.filter(city =>
    city.name.toLowerCase().includes(search.toLowerCase()) ||
    city.country.toLowerCase().includes(search.toLowerCase())
  )

  return (

    <div className="w-full min-w-0 text-white space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Saved Locations
          </h1>

          <p className="text-slate-400 mt-2">
            Keep track of weather conditions in your favourite cities.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-300">
          <Heart size={18} />

          <span className="text-sm font-medium">
            {favourites.length} Saved Cities
          </span>
        </div>

      </div>

      {/* Search */}
      <div className="relative w-full sm:max-w-md">

        <Search
          size={19}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search saved cities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-900/50 border border-white/10 text-white outline-none focus:border-indigo-400 transition"
        />

      </div>

      {/* Cities Grid */}
      {filteredCities.length > 0 ? (

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

          {filteredCities.map(city => {

            const current = weatherData[city.id]
            const isLoading = loading[city.id]
            const error = errors[city.id]

            const weatherInfo = current
              ? getWeatherInfo(current.weather_code)
              : { text: 'Loading...', icon: CloudSun }

            const WeatherIcon = weatherInfo.icon

            return (

              <div
                key={city.id}
                className="group rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-5 hover:border-indigo-400/30 hover:bg-white/5 transition-all duration-300"
              >

                {/* Card Header */}
                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-2 text-slate-300 min-w-0">

                    <MapPin size={17} className="text-indigo-400 shrink-0" />

                    <span className="font-semibold truncate">
                      {city.name}
                    </span>

                  </div>

                  <button
                    onClick={() => removeFavourite(city.id)}
                    className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition shrink-0"
                    title="Remove from favourites"
                    aria-label={`Remove ${city.name} from favourites`}
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

                {/* Weather */}
                <div className="flex items-center justify-between mt-7">

                  <div>

                    {isLoading && !current ? (

                      <Loader2
                        size={28}
                        className="animate-spin text-indigo-400"
                      />

                    ) : error ? (

                      <p className="text-sm text-red-400">
                        Weather unavailable
                      </p>

                    ) : current ? (

                      <>
                        <h2 className="text-4xl font-bold">
                          {Math.round(current.temperature_2m)}°
                          <span className="text-lg text-slate-400">
                            {unit}
                          </span>
                        </h2>

                        <p className="text-sm text-slate-400 mt-2">
                          {weatherInfo.text}
                        </p>
                      </>

                    ) : (

                      <p className="text-sm text-slate-400">
                        Loading weather...
                      </p>

                    )}

                  </div>

                  <WeatherIcon
                    size={55}
                    strokeWidth={1.5}
                    className="text-sky-400 group-hover:scale-110 transition duration-300 shrink-0"
                  />

                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-7 pt-4 border-t border-white/10">

                  <span className="text-xs text-slate-500">
                    {city.country}
                  </span>

                  <div className="flex items-center gap-2 text-xs text-slate-400">

                    <Wind size={15} className="text-indigo-400" />

                    {current
                      ? `${Math.round(current.wind_speed_10m)} km/h`
                      : '-- km/h'
                    }

                  </div>

                </div>

              </div>

            )
          })}

        </div>

      ) : (

        /* Empty State */
        <div className="flex flex-col items-center justify-center text-center py-16 px-5 rounded-3xl border border-white/10 bg-slate-900/30">

          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-5">

            {favourites.length === 0 ? (
              <Heart size={30} className="text-indigo-400" />
            ) : (
              <Search size={30} className="text-indigo-400" />
            )}

          </div>

          <h2 className="text-xl font-semibold text-white">

            {favourites.length === 0
              ? "No Saved Locations"
              : "No Cities Found"
            }

          </h2>

          <p className="text-sm text-slate-400 mt-2 max-w-sm">

            {favourites.length === 0
              ? "You haven't saved any cities yet. Visit Dashboard and add your favourite cities."
              : "Try searching with another city name."
            }

          </p>

        </div>

      )}

    </div>
  )
}

export default Favourites
