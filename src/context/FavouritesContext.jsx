import React, {
  createContext,
  useCallback,
  useEffect,
  useState
} from 'react'
export const FavouritesContext = createContext(null)
const FavouritesProvider = ({ children }) => {

  const [favourites, setFavourites] = useState(() => {
    try {
      const saved = localStorage.getItem('weatherFavourites')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // localStorage
  useEffect(() => {
    localStorage.setItem(
      'weatherFavourites',
      JSON.stringify(favourites)
    )
  }, [favourites])

  const isFavourite = useCallback((city) => {
    return favourites.some(item =>
      item.latitude === city.latitude &&
      item.longitude === city.longitude
    )
  }, [favourites])

  const addFavourite = useCallback((city) => {

    if (!city?.name || city.latitude == null || city.longitude == null) {
      return
    }

    setFavourites(prev => {

      const exists = prev.some(item =>
        item.latitude === city.latitude &&
        item.longitude === city.longitude
      )

      if (exists) return prev

      return [
        ...prev,
        {
          id: `${city.latitude}-${city.longitude}`,
          name: city.name,
          country: city.country || '',
          latitude: city.latitude,
          longitude: city.longitude
        }
      ]
    })

  }, [])

  // Remove city from favourites
  const removeFavourite = useCallback((id) => {
    setFavourites(prev =>
      prev.filter(city => city.id !== id)
    )
  }, [])

  // Toggle favourite
  const toggleFavourite = useCallback((city) => {

    const exists = favourites.some(item =>
      item.latitude === city.latitude &&
      item.longitude === city.longitude
    )

    if (exists) {
      const id = `${city.latitude}-${city.longitude}`
      removeFavourite(id)
    } else {
      addFavourite(city)
    }

  }, [favourites, addFavourite, removeFavourite])

  return (
    <FavouritesContext.Provider
      value={{
        favourites,
        addFavourite,
        removeFavourite,
        isFavourite,
        toggleFavourite
      }}
    >
      {children}
    </FavouritesContext.Provider>
  )
}

export default FavouritesProvider
