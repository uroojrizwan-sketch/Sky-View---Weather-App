import React, { useContext } from 'react'
import {
  Bell,
  BellOff,
  MapPin,
  Menu
} from "lucide-react"
import SearchBar from './SearchBar'
import { SettingsContext } from '../context/SettingsContext'
const Navbar = ({ onMenuClick }) => {
  const { preferences, updateSettings } = useContext(SettingsContext)
  const toggleNotifications = () => {
    updateSettings({
      notifications: !preferences.notifications
    })
  }
  return (
    <header className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 px-5 sm:px-8 py-5 border-b border-white/5 bg-slate-900/30 backdrop-blur-xl">

      {/* Left Section */}
      <div className="flex items-start gap-3">

        <button
          onClick={onMenuClick}
          className="lg:hidden mt-1 p-2 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 transition"
          aria-label="Open sidebar"
        >
          <Menu size={23} />
        </button>

        <div>
          <p className="text-sm text-slate-400">
            Discover the sky
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold tracking-wide text-white/80">
            Weather Today
          </h2>

          <div className="flex items-center gap-2 mt-2 text-sm text-slate-400">
            <MapPin size={15} className="text-indigo-300" />
            <span className="font-medium">
              {preferences.city}
            </span>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 sm:gap-4 flex-wrap">

        <SearchBar />

        {/* Temperature Unit */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">

          <button
            onClick={() => updateSettings({ temperature: 'C' })}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
              preferences.temperature === 'C'
                ? "bg-indigo-500/20 text-indigo-300"
                : "text-slate-400 hover:text-white"
            }`}
          >
            °C
          </button>

          <button
            onClick={() => updateSettings({ temperature: 'F' })}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
              preferences.temperature === 'F'
                ? "bg-indigo-500/20 text-indigo-300"
                : "text-slate-400 hover:text-white"
            }`}
          >
            °F
          </button>

        </div>

        {/* Notification Mute / Unmute */}
        <button
          type="button"
          onClick={toggleNotifications}
          className={`relative w-11 h-11 rounded-xl border border-white/10 flex items-center justify-center transition ${
            preferences.notifications
              ? "bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20"
              : "bg-white/5 text-slate-500 hover:bg-white/10"
          }`}
          aria-label={
            preferences.notifications
              ? "Mute notifications"
              : "Unmute notifications"
          }
          title={
            preferences.notifications
              ? "Mute notifications"
              : "Unmute notifications"
          }
        >
          {preferences.notifications
            ? <Bell size={20} />
            : <BellOff size={20} />
          }

          {preferences.notifications && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border border-slate-900" />
          )}
        </button>

      </div>
    </header>
  )
}

export default Navbar
