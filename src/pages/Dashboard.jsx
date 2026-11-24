import React from 'react'
import CurrentWeather from "../components/CurrentWeather"
import WeatherChart from "../components/WeatherChart"
import WeeklyForcast from "../components/WeeklyForcast"
import WeatherDetails from "../components/WeatherDetails"
import SunriseSunset from "../components/SunriseSunset"
import HourlyForcast from '../components/HourlyForcast'

const Dashboard = () => {
  return (
    <>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <CurrentWeather />
        <HourlyForcast />
      </div>

      <div className="w-full mb-5">
        <WeeklyForcast />
      </div>
      <div className="w-full mb-5">
        <WeatherChart />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">
        <WeatherDetails />
        <SunriseSunset />

      </div>

    </>
  )
}

export default Dashboard
