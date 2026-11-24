import React, { useState, useEffect } from 'react'
import "leaflet/dist/leaflet.css"
import L from 'leaflet'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap
} from 'react-leaflet'

import {
    Search,
    Layers,
    MapPin,
    CloudSun,
    Wind,
    Droplets,
    Thermometer,
    RefreshCw,
    X,
    MapPinned,
    Cloud,
    RotateCcw,
    Check
} from 'lucide-react'

const customIcon = L.icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
})

const defaultLocations = [
    {
        id: 'islamabad',
        name: 'Islamabad',
        latitude: 33.6844,
        longitude: 73.0479,
        country: 'Pakistan'
    },
    {
        id: 'lahore',
        name: 'Lahore',
        latitude: 31.5204,
        longitude: 74.3587,
        country: 'Pakistan'
    },
    {
        id: 'karachi',
        name: 'Karachi',
        latitude: 24.8607,
        longitude: 67.0011,
        country: 'Pakistan'
    },
    {
        id: 'peshawar',
        name: 'Peshawar',
        latitude: 34.0151,
        longitude: 71.5249,
        country: 'Pakistan'
    }
]

const getWeatherCondition = (code) => {

    if (code === 0) return 'Clear Sky'
    if ([1, 2].includes(code)) return 'Partly Cloudy'
    if (code === 3) return 'Overcast'
    if ([45, 48].includes(code)) return 'Foggy'
    if ([51, 53, 55].includes(code)) return 'Drizzle'
    if ([56, 57].includes(code)) return 'Freezing Drizzle'
    if ([61, 63, 65].includes(code)) return 'Rainy'
    if ([66, 67].includes(code)) return 'Freezing Rain'
    if ([71, 73, 75, 77].includes(code)) return 'Snowfall'
    if ([80, 81, 82].includes(code)) return 'Rain Showers'
    if ([85, 86].includes(code)) return 'Snow Showers'
    if ([95, 96, 99].includes(code)) return 'Thunderstorm'

    return 'Unknown'
}

const getWeatherIcon = (code) => {

    if (code === 0) return '☀️'
    if ([1, 2].includes(code)) return '🌤️'
    if (code === 3) return '☁️'
    if ([45, 48].includes(code)) return '🌫️'
    if ([51, 53, 55, 56, 57].includes(code)) return '🌦️'
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return '🌧️'
    if ([71, 73, 75, 77, 85, 86].includes(code)) return '❄️'
    if ([95, 96, 99].includes(code)) return '⛈️'

    return '🌡️'
}

const MapController = ({ location }) => {

    const map = useMap()

    useEffect(() => {

        if (location) {

            map.flyTo(
                [location.latitude, location.longitude],
                10,
                { duration: 1.5 }
            )

        }

    }, [location, map])

    return null
}

const Maps = () => {

    const [search, setSearch] = useState('')
    const [searchResults, setSearchResults] = useState([])

    const [searchLoading, setSearchLoading] = useState(false)
    const [selectedLocation, setSelectedLocation] = useState(null)

    const [weatherData, setWeatherData] = useState({})
    const [weatherLoading, setWeatherLoading] = useState(false)

    const [error, setError] = useState('')
    const [layerMenu, setLayerMenu] = useState(false)
    const [mapLayer, setMapLayer] = useState('normal')

    const [refreshing, setRefreshing] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)

    const displayLocations = selectedLocation
        ? [
            ...defaultLocations.filter(
                city => city.id !== selectedLocation.id
            ),
            selectedLocation
        ]
        : defaultLocations

    useEffect(() => {

        let cancelled = false

        const fetchWeather = async () => {

            setWeatherLoading(true)

            const results = await Promise.all(

                displayLocations.map(async (location) => {

                    try {

                        const url =
                            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl&timezone=auto`

                        const response = await fetch(url)

                        if (!response.ok) {
                            throw new Error('Weather API error')
                        }

                        const data = await response.json()

                        return {
                            id: location.id,
                            name: location.name,
                            temperature: data.current.temperature_2m,
                            feelsLike: data.current.apparent_temperature,
                            humidity: data.current.relative_humidity_2m,
                            wind: data.current.wind_speed_10m,
                            windDirection: data.current.wind_direction_10m,
                            pressure: data.current.pressure_msl,
                            weatherCode: data.current.weather_code,
                            condition: getWeatherCondition(
                                data.current.weather_code
                            ),
                            icon: getWeatherIcon(
                                data.current.weather_code
                            ),
                            updatedAt: data.current.time,
                            error: false
                        }

                    } catch (err) {

                        return {
                            id: location.id,
                            name: location.name,
                            error: true
                        }

                    }

                })

            )

            if (!cancelled) {

                setWeatherData(prev => {

                    const updated = { ...prev }

                    results.forEach(item => {
                        updated[item.id] = item
                    })

                    return updated

                })

                setWeatherLoading(false)
                setRefreshing(false)

            }

        }

        fetchWeather()

        return () => {
            cancelled = true
        }

    }, [selectedLocation, refreshKey])


    // ===============================
    // SEARCH CITY
    // ===============================

    const searchCity = async () => {

        if (search.trim().length < 2) {

            setError('Please enter at least 2 characters')
            setSearchResults([])
            return

        }

        try {

            setSearchLoading(true)
            setError('')
            setSearchResults([])

            const url =
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(search)}&count=6&language=en&format=json`

            const response = await fetch(url)

            if (!response.ok) {
                throw new Error('Search failed')
            }

            const data = await response.json()

            const results = (data.results || []).map(city => ({
                id: `city-${city.id}`,
                name: city.name,
                latitude: city.latitude,
                longitude: city.longitude,
                country: city.country || '',
                admin1: city.admin1 || ''
            }))

            setSearchResults(results)

            if (!results.length) {
                setError('No locations found. Try another city.')
            }

        } catch (err) {

            setError('Unable to search. Please try again.')

        } finally {

            setSearchLoading(false)

        }

    }

    const selectCity = (city) => {

        setSelectedLocation(city)

        setSearch(city.name)
        setSearchResults([])
        setError('')

    }

    const resetLocations = () => {

        setSelectedLocation(null)
        setSearch('')
        setSearchResults([])
        setError('')

    }

    const refreshWeather = () => {

        setRefreshing(true)
        setRefreshKey(prev => prev + 1)

    }

    const mapLayers = {
        normal: {
            name: 'Normal',
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution: '&copy; OpenStreetMap contributors'
        },

        dark: {
            name: 'Dark',
            url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
            attribution: '&copy; OpenStreetMap &copy; CARTO'
        },

        terrain: {
            name: 'Terrain',
            url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
            attribution: '&copy; OpenTopoMap contributors'
        }
    }

    const activeLayer = mapLayers[mapLayer]

    return (

        <div className="w-full min-w-0 space-y-6">

            {/* HEADER */}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>

                    <h1 className="text-2xl sm:text-3xl font-bold text-white">
                        Weather Maps
                    </h1>

                    <p className="text-slate-400 mt-2">
                        Explore real-time weather conditions across different locations.
                    </p>

                </div>

                <button
                    onClick={refreshWeather}
                    disabled={refreshing}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 transition disabled:opacity-50"
                >

                    <RefreshCw
                        size={17}
                        className={refreshing ? 'animate-spin' : ''}
                    />

                    Refresh Weather

                </button>

            </div>


            {/* SEARCH BAR */}

            <div className="flex flex-col sm:flex-row gap-3">

                <div className="flex-1 relative">

                    <div className="flex gap-2">

                        <div className="flex-1 relative">

                            <Search
                                size={20}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="text"
                                value={search}
                                placeholder="Search any city..."
                                onChange={(e) => {
                                    setSearch(e.target.value)
                                    setSearchResults([])
                                    setError('')
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') searchCity()
                                }}
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-900/70 border border-white/10 text-white outline-none focus:border-indigo-400"
                            />

                        </div>

                        <button
                            onClick={searchCity}
                            disabled={searchLoading}
                            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition disabled:opacity-50"
                        >
                            {searchLoading ? 'Searching...' : 'Search'}
                        </button>

                    </div>


                    {/* SEARCH RESULTS */}

                    {searchResults.length > 0 && (

                        <div className="absolute top-full left-0 right-0 mt-2 z-1000 rounded-xl border border-white/10 bg-slate-900 shadow-2xl overflow-hidden">

                            {searchResults.map(city => (

                                <button
                                    key={city.id}
                                    onClick={() => selectCity(city)}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-white hover:bg-indigo-500/20 transition"
                                >

                                    <MapPin
                                        size={18}
                                        className="text-indigo-400 shrink-0"
                                    />

                                    <div>

                                        <p className="font-medium">
                                            {city.name}
                                        </p>

                                        <p className="text-xs text-slate-400">
                                            {city.admin1
                                                ? `${city.admin1}, `
                                                : ''}
                                            {city.country}
                                        </p>

                                    </div>

                                </button>

                            ))}

                        </div>

                    )}

                    {error && (

                        <p className="text-sm text-red-400 mt-2">
                            {error}
                        </p>

                    )}

                </div>


                {/* MAP LAYER BUTTON */}

                <div className="relative">

                    <button
                        onClick={() => setLayerMenu(prev => !prev)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition"
                    >

                        <Layers size={19} />
                        Map Layers

                    </button>


                    {layerMenu && (

                        <div className="absolute right-0 top-full mt-2 z-1000 w-48 rounded-xl border border-white/10 bg-slate-900 shadow-2xl p-2">

                            <p className="text-xs text-slate-500 uppercase tracking-wider px-3 py-2">
                                Choose Map Style
                            </p>

                            {Object.entries(mapLayers).map(([key, layer]) => (

                                <button
                                    key={key}
                                    onClick={() => {
                                        setMapLayer(key)
                                        setLayerMenu(false)
                                    }}
                                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-white/10 transition"
                                >

                                    {layer.name}

                                    {mapLayer === key && (
                                        <Check size={16} className="text-indigo-400" />
                                    )}

                                </button>

                            ))}

                        </div>

                    )}

                </div>

            </div>


            {/* SELECTED CITY INFO */}

            {selectedLocation && (

                <div className="flex items-center justify-between gap-3 rounded-xl border border-indigo-400/20 bg-indigo-500/10 px-4 py-3">

                    <div className="flex items-center gap-2 min-w-0">

                        <MapPinned
                            size={19}
                            className="text-indigo-400 shrink-0"
                        />

                        <div className="min-w-0">

                            <p className="text-sm text-white font-medium">
                                Showing {selectedLocation.name}
                            </p>

                            <p className="text-xs text-slate-400 truncate">
                                {selectedLocation.country}
                            </p>

                        </div>

                    </div>

                    <button
                        onClick={resetLocations}
                        className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition shrink-0"
                    >

                        <RotateCcw size={14} />
                        Reset

                    </button>

                </div>

            )}


            {/* MAP */}

            <div className="w-full h-100 sm:h-125 lg:h-137.5 rounded-3xl overflow-hidden border border-white/10 shadow-xl relative">

                <MapContainer
                    center={[30.3753, 69.3451]}
                    zoom={5}
                    scrollWheelZoom={true}
                    className="w-full h-full"
                    style={{
                        height: '100%',
                        width: '100%'
                    }}
                >

                    <MapController location={selectedLocation} />

                    <TileLayer
                        key={mapLayer}
                        attribution={activeLayer.attribution}
                        url={activeLayer.url}
                    />


                    {/* CITY MARKERS */}

                    {displayLocations.map(location => {

                        const weather = weatherData[location.id]

                        return (

                            <Marker
                                key={location.id}
                                position={[
                                    location.latitude,
                                    location.longitude
                                ]}
                                icon={customIcon}
                            >

                                <Popup>

                                    <div className="text-slate-900 min-w-37.5">

                                        <h3 className="font-bold text-base">
                                            {location.name}
                                        </h3>

                                        {weather && !weather.error ? (

                                            <>

                                                <p className="text-2xl font-bold mt-2">
                                                    {weather.icon} {weather.temperature}°C
                                                </p>

                                                <p>
                                                    {weather.condition}
                                                </p>

                                                <p className="text-sm mt-1">
                                                    Humidity: {weather.humidity}%
                                                </p>

                                                <p className="text-sm">
                                                    Wind: {weather.wind} km/h
                                                </p>

                                            </>

                                        ) : (

                                            <p className="text-sm mt-2">
                                                {weather?.error
                                                    ? 'Weather unavailable'
                                                    : 'Loading weather...'}
                                            </p>

                                        )}

                                    </div>

                                </Popup>

                            </Marker>

                        )

                    })}

                </MapContainer>


                {/* MAP LEGEND */}

                <div className="absolute bottom-4 left-4 z-500 rounded-xl border border-white/10 bg-slate-950/90 backdrop-blur-xl px-3 py-2">

                    <p className="text-xs text-slate-300 flex items-center gap-2">

                        <MapPin size={14} className="text-indigo-400" />

                        {displayLocations.length} Locations

                    </p>

                </div>

            </div>

            <div>

                <div className="flex items-center justify-between gap-3 mb-4">

                    <div>

                        <h2 className="text-lg sm:text-xl font-semibold text-white">
                            Weather Across Locations
                        </h2>

                        <p className="text-sm text-slate-400 mt-1">
                            Live weather conditions
                        </p>

                    </div>

                    {weatherLoading && (

                        <div className="flex items-center gap-2 text-xs text-slate-400">

                            <RefreshCw size={14} className="animate-spin" />
                            Updating...

                        </div>

                    )}

                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

                    {displayLocations.map(location => {

                        const weather = weatherData[location.id]

                        return (

                            <div
                                key={location.id}
                                className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-5 hover:bg-white/5 transition-all duration-300"
                            >

                                {/* CARD HEADER */}

                                <div className="flex items-center justify-between">

                                    <div className="flex items-center gap-2 text-slate-300 min-w-0">

                                        <MapPin
                                            size={17}
                                            className="text-indigo-400 shrink-0"
                                        />

                                        <span className="font-medium truncate">
                                            {location.name}
                                        </span>

                                    </div>

                                    <CloudSun
                                        size={22}
                                        className="text-sky-400 shrink-0"
                                    />

                                </div>


                                {/* WEATHER DATA */}

                                {weather?.error ? (

                                    <div className="mt-6">

                                        <p className="text-sm text-red-400">
                                            Unable to load weather data.
                                        </p>

                                        <button
                                            onClick={refreshWeather}
                                            className="text-xs text-indigo-400 mt-2 hover:text-indigo-300"
                                        >
                                            Try again
                                        </button>

                                    </div>

                                ) : weather ? (

                                    <>

                                        <div className="flex items-center justify-between mt-5 gap-2">

                                            <div>

                                                <h3 className="text-4xl font-bold text-white">
                                                    {weather.temperature}°
                                                </h3>

                                                <p className="text-xs text-slate-500 mt-1">
                                                    Feels like {weather.feelsLike}°
                                                </p>

                                            </div>

                                            <div className="text-4xl">
                                                {weather.icon}
                                            </div>

                                        </div>


                                        <p className="text-sm text-slate-300 mt-3">
                                            {weather.condition}
                                        </p>


                                        {/* EXTRA WEATHER DETAILS */}

                                        <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-white/10">

                                            <div className="flex items-center gap-2">

                                                <Droplets
                                                    size={17}
                                                    className="text-sky-400"
                                                />

                                                <div>

                                                    <p className="text-xs text-slate-500">
                                                        Humidity
                                                    </p>

                                                    <p className="text-sm text-white font-medium">
                                                        {weather.humidity}%
                                                    </p>

                                                </div>

                                            </div>


                                            <div className="flex items-center gap-2">

                                                <Wind
                                                    size={17}
                                                    className="text-indigo-400"
                                                />

                                                <div>

                                                    <p className="text-xs text-slate-500">
                                                        Wind
                                                    </p>

                                                    <p className="text-sm text-white font-medium">
                                                        {weather.wind} km/h
                                                    </p>

                                                </div>

                                            </div>


                                            <div className="flex items-center gap-2">

                                                <Thermometer
                                                    size={17}
                                                    className="text-orange-400"
                                                />

                                                <div>

                                                    <p className="text-xs text-slate-500">
                                                        Pressure
                                                    </p>

                                                    <p className="text-sm text-white font-medium">
                                                        {weather.pressure} hPa
                                                    </p>

                                                </div>

                                            </div>


                                            <div className="flex items-center gap-2">

                                                <Cloud
                                                    size={17}
                                                    className="text-slate-400"
                                                />

                                                <div>

                                                    <p className="text-xs text-slate-500">
                                                        Wind Direction
                                                    </p>

                                                    <p className="text-sm text-white font-medium">
                                                        {weather.windDirection}°
                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                    </>

                                ) : (

                                    <div className="mt-6 flex items-center gap-2 text-sm text-slate-400">

                                        <RefreshCw
                                            size={15}
                                            className="animate-spin"
                                        />

                                        Loading weather...

                                    </div>

                                )}

                            </div>

                        )

                    })}

                </div>

            </div>

            <div className="flex items-start gap-2 text-xs text-slate-500 pb-2">

                <CloudSun size={16} className="shrink-0 text-sky-400" />

                <p>
                    Weather information is provided by Open-Meteo.
                    Map data and styles are provided by their respective tile providers.
                </p>

            </div>

        </div>

    )

}

export default Maps
