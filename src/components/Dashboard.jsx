import React from 'react'
import Overview from './tabs/Overview'
import Tasks from './tabs/Tasks'
import Clients from './tabs/Clients'
import Financial from './tabs/Financial'
import Tokens from './tabs/Tokens'
import Workflows from './tabs/Workflows'

export default function Dashboard({ activeTab }) {
  const renderTab = () => {
    switch(activeTab) {
      case 'overview':
        return <Overview />
      case 'tasks':
        return <Tasks />
      case 'clients':
        return <Clients />
      case 'financial':
        return <Financial />
      case 'tokens':
        return <Tokens />
      case 'workflows':
        return <Workflows />
      default:
        return <Overview />
    }
  }

  return (
    <div className="p-8">
      {renderTab()}
    </div>
  )
}
