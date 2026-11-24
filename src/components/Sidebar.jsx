import React, { useContext } from 'react'
import { Link, NavLink } from 'react-router-dom'
import {
  CloudSun,
  LayoutDashboard,
  Map,
  ChartNoAxesCombined,
  MapPin,
  Settings,
  Thermometer,
  X
} from "lucide-react"
import { SettingsContext } from '../context/SettingsContext'
const Sidebar = ({ isOpen, onClose }) => {
  const { preferences, updateSettings } = useContext(SettingsContext)
  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard, end: true },
    { name: "Maps", path: "/maps", icon: Map },
    { name: "Charts", path: "/charts", icon: ChartNoAxesCombined },
    { name: "Saved Locations", path: "/favourites", icon: MapPin },
    { name: "Settings", path: "/settings", icon: Settings }
  ]

  const navStyle = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300
    ${
      isActive
        ? "bg-indigo-500/10 border-indigo-400/20 text-indigo-300"
        : "border-indigo-200/10 text-slate-400 hover:bg-white/5 hover:text-white"
    }`

  const toggleTemperature = () => {
    updateSettings({
      temperature: preferences.temperature === 'C' ? 'F' : 'C'
    })
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          scrollbar-none
          fixed top-0 bottom-0 left-0 z-50
          w-64 h-screen min-h-screen
          overflow-y-auto
          bg-slate-900/95 lg:bg-slate-900/60
          backdrop-blur-2xl border-r border-white/10
          p-5 shadow-2xl
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          lg:sticky lg:top-0 lg:self-start
          lg:shrink-0 lg:h-screen lg:min-h-screen
        `}
      >

        {/* Logo + Close Button */}
        <div className="flex items-center justify-between mb-10">

          <Link to="/" onClick={onClose}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                <CloudSun size={26} />
              </div>

              <h1 className="text-2xl font-bold tracking-wide">
                SkyView
              </h1>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:bg-white/10"
            aria-label="Close sidebar"
          >
            <X size={22} />
          </button>

        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-3">

          {navItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.end}
                onClick={onClose}
                className={navStyle}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            )
          })}

          {/* Preferences */}
          <div className="my-4 border-t border-white/10" />

          <p className="px-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Preferences
          </p>

          <button
            type="button"
            onClick={toggleTemperature}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-indigo-200/10 text-slate-400 hover:bg-white/5 hover:text-white transition"
            title="Click to change temperature unit"
          >
            <div className="flex items-center gap-3">
              <Thermometer size={20} />
              <span className="font-medium">Temperature</span>
            </div>

            <span className="text-xs text-indigo-300 font-semibold">
              °{preferences.temperature}
            </span>
          </button>

        </nav>
      </aside>
    </>
  )
}

export default Sidebar
