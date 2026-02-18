import React, { useState } from 'react'
import Dashboard from './components/Dashboard'
import Sidebar from './components/Sidebar'

function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className={`${darkMode ? 'dark' : ''} min-h-screen bg-gray-50 dark:bg-gray-900`}>
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} darkMode={darkMode} setDarkMode={setDarkMode} />
        <main className="flex-1 ml-64">
          <Dashboard activeTab={activeTab} />
        </main>
      </div>
    </div>
  )
}

export default App
