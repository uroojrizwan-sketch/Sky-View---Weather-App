import React, { useContext } from 'react'
import {
  Bell,
  BellOff,
  Settings as SettingsIcon,
  Thermometer,
  Sun,
  Moon,
  MapPin
} from 'lucide-react'
import { SettingsContext } from '../context/SettingsContext'
const Settings = () => {
  const { preferences, updateSettings } = useContext(SettingsContext)
  return (
    <div className="w-full space-y-6 text-white">
      <div>
        <div className="flex items-center gap-3">
          <SettingsIcon size={28} className="text-indigo-400" />

          <h1 className="text-2xl sm:text-3xl font-bold">
            Settings
          </h1>
        </div>

        <p className="text-slate-400 mt-2">
          Manage your application preferences.
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-5 sm:p-6">

        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
            <Thermometer size={23} className="text-indigo-400" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              Temperature Scale
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Choose your preferred temperature unit.
            </p>
          </div>
        </div>

        <div className="flex gap-3">

          <button
            onClick={() => updateSettings({ temperature: 'C' })}
            className={`px-5 py-3 rounded-xl border transition ${
              preferences.temperature === 'C'
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
            }`}
          >
            Celsius (°C)
          </button>

          <button
            onClick={() => updateSettings({ temperature: 'F' })}
            className={`px-5 py-3 rounded-xl border transition ${
              preferences.temperature === 'F'
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
            }`}
          >
            Fahrenheit (°F)
          </button>

        </div>
      </div>

      {/* Theme Settings */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-5 sm:p-6">

        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
            {preferences.theme === 'Dark'
              ? <Moon size={23} className="text-indigo-400" />
              : <Sun size={23} className="text-amber-400" />
            }
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              Appearance
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Choose between dark and light mode.
            </p>
          </div>
        </div>

        <div className="flex gap-3">

          <button
            onClick={() => updateSettings({ theme: 'Dark' })}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition ${
              preferences.theme === 'Dark'
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
            }`}
          >
            <Moon size={18} />
            Dark Mode
          </button>

          <button
            onClick={() => updateSettings({ theme: 'Light' })}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition ${
              preferences.theme === 'Light'
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
            }`}
          >
            <Sun size={18} />
            Light Mode
          </button>

        </div>
      </div>

      {/* Notification Settings */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-5 sm:p-6">

        <div className="flex flex-wrap items-center justify-between gap-4">

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              {preferences.notifications
                ? <Bell size={23} className="text-indigo-400" />
                : <BellOff size={23} className="text-slate-400" />
              }
            </div>

            <div>
              <h2 className="text-lg font-semibold">
                Notifications
              </h2>

              <p className="text-sm text-slate-400 mt-1">
                Enable or mute weather notifications.
              </p>
            </div>

          </div>

          <button
            type="button"
            role="switch"
            aria-checked={preferences.notifications}
            onClick={() => updateSettings({
              notifications: !preferences.notifications
            })}
            className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
              preferences.notifications
                ? 'bg-indigo-600'
                : 'bg-slate-600'
            }`}
            aria-label="Toggle notifications"
          >
            <span
              className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${
                preferences.notifications
                  ? 'left-8'
                  : 'left-1'
              }`}
            />
          </button>

        </div>

        <div className="mt-5 pt-4 border-t border-white/10">
          <p className={`text-sm font-medium ${
            preferences.notifications
              ? 'text-emerald-400'
              : 'text-slate-400'
          }`}>
            {preferences.notifications
              ? 'Notifications are enabled.'
              : 'Notifications are currently muted.'
            }
          </p>
        </div>

      </div>

      {/* Location Settings */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-5 sm:p-6">

        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
            <MapPin size={23} className="text-indigo-400" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              Default Location
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Your preferred weather location.
            </p>
          </div>
        </div>

        <input
          type="text"
          value={preferences.city}
          onChange={(e) => updateSettings({ city: e.target.value })}
          placeholder="Enter city name"
          className="w-full sm:max-w-sm px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-indigo-500"
        />

      </div>

    </div>
  )
}

export default Settings
