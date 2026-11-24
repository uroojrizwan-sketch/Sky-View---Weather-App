import React, {
  useState,
  useEffect,
  useRef,
  useContext
} from 'react'
import { Search, MapPin, Loader2 } from 'lucide-react'
import { SettingsContext } from '../context/SettingsContext'
const SearchBar = () => {
  const { updateSettings } = useContext(SettingsContext)
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [error, setError] = useState('')
  const searchRef = useRef(null)

  // Fetch city suggestions from Open-Meteo
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([])
      setShowSuggestions(false)
      setActiveIndex(-1)
      return
    }

    const controller = new AbortController()

    const timer = setTimeout(async () => {
      try {
        setLoading(true)
        setError('')

        const params = new URLSearchParams({
          name: query.trim(),
          count: '6',
          language: 'en',
          format: 'json'
        })

        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?${params}`,
          { signal: controller.signal }
        )

        if (!response.ok) {
          throw new Error('Unable to search cities.')
        }

        const data = await response.json()

        setSuggestions(data.results || [])
        setShowSuggestions(true)
        setActiveIndex(-1)

      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('Unable to fetch city suggestions.')
          setSuggestions([])
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }, 350)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }

  }, [query])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target)
      ) {
        setShowSuggestions(false)
        setActiveIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  // Select city
  const handleSelectCity = (city) => {
    updateSettings({
      city: city.name
    })

    setQuery('')
    setSuggestions([])
    setShowSuggestions(false)
    setActiveIndex(-1)
    setError('')
  }

  // Search first suggestion on form submit
  const handleSearch = (e) => {
    e.preventDefault()

    if (suggestions.length > 0) {
      handleSelectCity(
        suggestions[activeIndex >= 0 ? activeIndex : 0]
      )
    }
  }

  // Keyboard navigation
  const handleKeyDown = (e) => {

    if (e.key === 'ArrowDown') {
      e.preventDefault()

      if (suggestions.length === 0) return

      setShowSuggestions(true)

      setActiveIndex(prev =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      )
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()

      if (suggestions.length === 0) return

      setShowSuggestions(true)

      setActiveIndex(prev =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      )
    }

    if (e.key === 'Enter') {
      if (suggestions.length > 0) {
        e.preventDefault()

        handleSelectCity(
          suggestions[activeIndex >= 0 ? activeIndex : 0]
        )
      }
    }

    if (e.key === 'Escape') {
      setShowSuggestions(false)
      setActiveIndex(-1)
    }
  }

  return (
    <div
      ref={searchRef}
      className="relative z-100 w-full sm:w-72 lg:w-80"
    >

      {/* Search Input */}
      <form
        onSubmit={handleSearch}
        className="relative z-100"
      >

        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl focus-within:border-indigo-400/50 z-100 transition-all duration-300">

          {loading ? (
            <Loader2
              size={20}
              className="text-indigo-400 z-100 animate-spin shrink-0"
            />
          ) : (
            <Search
              size={20}
              className="text-slate-400 z-100 shrink-0"
            />
          )}

          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActiveIndex(-1)
              setShowSuggestions(true)
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowSuggestions(true)
              }
            }}
            placeholder="Search your city..."
            autoComplete="off"
            className="w-full min-w-0 bg-transparent z-100 outline-none text-white placeholder:text-slate-500"
            aria-label="Search city"
            aria-expanded={showSuggestions}
            aria-controls="city-suggestions"
            aria-activedescendant={
              activeIndex >= 0
                ? `city-option-${activeIndex}`
                : undefined
            }
          />

        </div>

      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && query.trim() && (
        <div
          id="city-suggestions"
          className="absolute top-full left-0 right-0 mt-2 z-999 rounded-2xl border border-white/10 bg-slate-900 shadow-2xl overflow-hidden"
        >

          {loading && suggestions.length === 0 && (
            <div className="p-4 text-sm text-slate-400 text-center">
              Searching cities...
            </div>
          )}

          {!loading && error && (
            <div className="p-4 text-sm text-red-400 text-center">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            suggestions.length === 0 && (
              <div className="p-4 text-sm text-slate-400 text-center">
                No cities found.
              </div>
            )}

          {suggestions.map((city, index) => (
            <button
              key={`${city.id}-${city.name}`}
              id={`city-option-${index}`}
              type="button"
              onClick={() => handleSelectCity(city)}
              onMouseEnter={() => setActiveIndex(index)}
              className={`w-full flex items-center gap-3 p-4 text-left border-b border-white/5 last:border-0 transition ${
                activeIndex === index
                  ? 'bg-indigo-500/20'
                  : 'hover:bg-white/10'
              }`}
            >

              <MapPin
                size={18}
                className="text-indigo-400 shrink-0"
              />

              <div className="min-w-0 ">

                <p className="text-sm font-medium text-white truncate">
                  {city.name}
                </p>

                <p className="text-xs text-slate-400 truncate">
                  {[
                    city.admin1,
                    city.country
                  ].filter(Boolean).join(', ')}
                </p>

              </div>

            </button>
          ))}

        </div>
      )}

    </div>
  )
}

export default SearchBar
