import React, { useState, useEffect } from 'react'
import { Plus, TrendingUp } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import AddClientModal from '../AddClientModal'

const HealthScore = ({ score }) => {
  const colors = score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600'
  return <span className={`font-bold text-lg ${colors}`}>{score}%</span>
}

export default function Clients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    loadClients()
  }, [])

  async function loadClients() {
    try {
      const { data, error } = await supabase.from('clients').select('*').eq('status', 'active')
      if (!error) {
        setClients(data || [])
      }
    } catch (err) {
      console.error('Error loading clients:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleClientAdded = () => {
    loadClients()
  }

  const totalMRR = clients.reduce((sum, c) => sum + (c.mrr_value || 0), 0)
  const activeCount = clients.length

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Clients</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{activeCount} active clients • ${totalMRR.toLocaleString()} MRR</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition w-full sm:w-auto justify-center sm:justify-start"
        >
          <Plus size={18} /> Add Client
        </button>
      </div>

      <AddClientModal isOpen={showModal} onClose={() => setShowModal(false)} onClientAdded={handleClientAdded} />

      {/* Client Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Active Clients</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{activeCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Total MRR</p>
          <p className="text-2xl font-bold text-green-600 mt-1">${totalMRR.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Avg. Client Value</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">${Math.round(totalMRR / activeCount)}</p>
        </div>
      </div>

      {/* Clients List */}
      <div className="grid gap-6">
        {loading ? (
          <div className="text-center text-gray-500">Loading clients...</div>
        ) : clients.length === 0 ? (
          <div className="text-center text-gray-500">No active clients yet</div>
        ) : (
          clients.map((client) => (
            <div key={client.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{client.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Product: {client.product}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Joined: {client.join_date}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">${client.mrr_value?.toLocaleString()}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Monthly</div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                  {client.status}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Health:</span>
                  <HealthScore score={client.health_score || 85} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pipeline */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp size={20} /> Sales Pipeline
        </h2>
        <div className="space-y-3">
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Enterprise Client Prospects</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">5 leads in discovery phase</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Upsell Opportunities</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">2 clients considering Lodigi upgrade</p>
          </div>
        </div>
      </div>
    </div>
  )
}
