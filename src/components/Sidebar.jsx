import React, { useState } from 'react'
import { BarChart3, Users, FileText, Zap, Briefcase, Settings, Moon, Sun, Menu, X } from 'lucide-react'

export default function Sidebar({ activeTab, setActiveTab, darkMode, setDarkMode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'tasks', label: 'Tasks & Projects', icon: Briefcase },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'financial', label: 'Financial', icon: FileText },
    { id: 'tokens', label: 'Token Usage', icon: Zap },
    { id: 'workflows', label: 'Workflows', icon: Settings },
  ]

  const handleTabClick = (tabId) => {
    setActiveTab(tabId)
    setMobileOpen(false)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6 shadow-sm transform transition-transform lg:translate-x-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      } z-40`}>
        <div className="mb-12">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AutomateEdge</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Operations Dashboard</p>
        </div>

        <nav className="space-y-2 mb-12">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                  activeTab === tab.id
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon size={20} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          <span>{darkMode ? 'Light' : 'Dark'}</span>
        </button>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  )
}
