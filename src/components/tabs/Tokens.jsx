import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { supabase } from '../../lib/supabase'

const staticTokenData = [
  { day: 'Mon', openai: 120, claude: 95, assemblyai: 45 },
  { day: 'Tue', openai: 140, claude: 110, assemblyai: 50 },
  { day: 'Wed', openai: 130, claude: 105, assemblyai: 48 },
  { day: 'Thu', openai: 150, claude: 120, assemblyai: 55 },
  { day: 'Fri', openai: 160, claude: 130, assemblyai: 60 },
]

export default function Tokens() {
  const [tokenLogs, setTokenLogs] = useState([])
  const [costBreakdown, setCostBreakdown] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTokenData()
  }, [])

  async function loadTokenData() {
    try {
      const { data, error } = await supabase.from('token_logs').select('*').order('date', { ascending: false })
      if (!error && data) {
        setTokenLogs(data)
        
        // Calculate cost by service
        const breakdown = {}
        data.forEach(log => {
          breakdown[log.service] = (breakdown[log.service] || 0) + log.cost
        })
        
        const colors = { openai: '#3b82f6', claude: '#8b5cf6', assemblyai: '#ec4899' }
        const costData = Object.entries(breakdown).map(([service, cost]) => ({
          name: service === 'openai' ? 'OpenAI' : service === 'claude' ? 'Claude/Anthropic' : 'AssemblyAI',
          value: cost,
          color: colors[service]
        }))
        setCostBreakdown(costData)
      }
    } catch (err) {
      console.error('Error loading token data:', err)
    } finally {
      setLoading(false)
    }
  }

  const totalTokenCost = costBreakdown.reduce((sum, item) => sum + item.value, 0)
  const costPerDay = (totalTokenCost / 5).toFixed(2)
  const projectedMonthly = (costPerDay * 30).toFixed(0)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Token & API Usage</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Track LLM and API costs across services</p>
      </div>

      {/* Cost Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm">This Week</p>
          <p className="text-2xl font-bold text-blue-600 mt-2">${totalTokenCost}</p>
          <p className="text-xs text-gray-500 mt-2">All services</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Daily Avg</p>
          <p className="text-2xl font-bold text-orange-600 mt-2">${costPerDay}</p>
          <p className="text-xs text-gray-500 mt-2">Running rate</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Projected Monthly</p>
          <p className="text-2xl font-bold text-red-600 mt-2">${projectedMonthly}</p>
          <p className="text-xs text-gray-500 mt-2">At current rate</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm">YTD Total</p>
          <p className="text-2xl font-bold text-purple-600 mt-2">$1,250</p>
          <p className="text-xs text-gray-500 mt-2">Since Jan 1</p>
        </div>
      </div>

      {/* Daily Token Usage */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Daily Token Spend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={staticTokenData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="openai" stackId="a" fill="#3b82f6" />
            <Bar dataKey="claude" stackId="a" fill="#8b5cf6" />
            <Bar dataKey="assemblyai" stackId="a" fill="#ec4899" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Cost Breakdown */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cost by Service</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={costBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: $${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {costBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Service Details */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : costBreakdown.length === 0 ? (
            <div className="text-center text-gray-500">No token data</div>
          ) : (
            costBreakdown.map((service) => (
              <div key={service.name} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{service.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {service.name === 'OpenAI' && 'LLM tokens'}
                      {service.name === 'Claude/Anthropic' && 'LLM tokens'}
                      {service.name === 'AssemblyAI' && 'Audio minutes'}
                    </p>
                  </div>
                  <span className="text-lg font-bold" style={{ color: service.color }}>
                    ${service.value.toFixed(0)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Cost Optimization Tips */}
      <div className="bg-green-50 dark:bg-green-900 rounded-lg p-6 border border-green-200 dark:border-green-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Cost Optimization Tips</h2>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>✓ Use Claude Haiku for simpler tasks (70% cheaper than Opus)</li>
          <li>✓ Batch process documents to reduce API calls</li>
          <li>✓ Implement caching for frequently accessed data</li>
          <li>✓ Monitor token usage weekly to catch anomalies</li>
        </ul>
      </div>
    </div>
  )
}
