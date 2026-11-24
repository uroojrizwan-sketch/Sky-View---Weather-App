const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search'
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast'
export const fetchWeatherByCity = async (city, temperatureUnit = 'C', signal) => {
  const geoParams = new URLSearchParams({
    name: city,
    count: '1',
    language: 'en',
    format: 'json'
  })

  const geoResponse = await fetch(
    `${GEOCODING_API}?${geoParams}`,
    { signal }
  )

  if (!geoResponse.ok) {
    throw new Error('Unable to search for this city.')
  }

  const geoData = await geoResponse.json()

  if (!geoData.results || geoData.results.length === 0) {
    throw new Error(`City "${city}" was not found.`)
  }

  const location = geoData.results[0]

  // api parameters
  const weatherParams = new URLSearchParams({
    latitude: location.latitude,
    longitude: location.longitude,

    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'cloud_cover',
      'pressure_msl',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m'
    ].join(','),

    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'precipitation_probability',
      'precipitation',
      'weather_code',
      'wind_speed_10m',
      'wind_direction_10m',
      'visibility',
      'pressure_msl',
      'cloud_cover'
    ].join(','),

    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max'
    ].join(','),

    temperature_unit:
      temperatureUnit === 'F' ? 'fahrenheit' : 'celsius',

    timezone: 'auto',
    forecast_days: '7'
  })

  const weatherResponse = await fetch(
    `${WEATHER_API}?${weatherParams}`,
    { signal }
  )

  if (!weatherResponse.ok) {
    throw new Error('Unable to fetch weather data.')
  }

  const weatherData = await weatherResponse.json()

  return {
    location: {
      name: location.name,
      country: location.country,
      latitude: location.latitude,
      longitude: location.longitude
    },
    ...weatherData
  }
}
