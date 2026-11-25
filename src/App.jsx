import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import MainLayout from './Layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import Favourites from './pages/Favourites'
import Maps from './pages/Maps'
import Charts from './pages/Charts'
import SettingsProvider from './context/SettingsContext'
import WeatherProvider from './context/WeatherContext'
import FavouritesProvider from './context/FavouritesContext'

const App = () => {
  return (
    <SettingsProvider>
      <FavouritesProvider>
        <WeatherProvider>
          <Router>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path='/' element={<Dashboard />} />
                <Route path='/charts' element={<Charts />} />
                <Route path='/maps' element={<Maps />} />
                <Route path='/favourites' element={<Favourites />} />
                <Route path='/settings' element={<Settings />} />
              </Route>
            </Routes>
          </Router>
        </WeatherProvider>
      </FavouritesProvider>
    </SettingsProvider>
  )
}

export default App
