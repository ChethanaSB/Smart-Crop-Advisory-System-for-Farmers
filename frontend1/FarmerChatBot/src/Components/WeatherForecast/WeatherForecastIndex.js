import React from 'react'
import Navbar from '../HomePage/Navbar'
import Footer from '../HomePage/Footer'
import WeatherCard from './WeatherCard'

function WeatherForecastIndex() {
  return (
    <div>
      <Navbar />
      <WeatherCard />
      <Footer />
    </div>
  )
}

export default WeatherForecastIndex
