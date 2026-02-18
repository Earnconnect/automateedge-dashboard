import React, { useState, useEffect } from 'react'
import { TrendingUp, Users, Zap, DollarSign } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { supabase } from '../../lib/supabase'

const staticRevenueData = [
  { month: 'Jan', revenue: 0, expenses: 2500 },
  { month: 'Feb', revenue: 2499, expenses: 1800 },
  { month: 'Mar', revenue: 4998, expenses: 2200 },
  { month: 'Apr', revenue: 7497, expenses: 2500 },
]

const StatCard = ({ icon: Icon, label, value, change }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 lg:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
    <div className="flex items-start lg:items-center justify-between gap-2">
      <div className="flex-1 min-w-0">
        <p className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm truncate">{label}</p>
        <p className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        {change && <p className="text-xs text-green-600 mt-1 lg:mt-2">↑ {change}</p>}
      </div>
      <div className="bg-blue-100 dark:bg-blue-900 p-2 lg:p-3 rounded-lg flex-shrink-0">
        <Icon size={18} className="lg:size-6 text-blue-600 dark:text-blue-300" />
      </div>
    </div>
  </div>
)

export default function Overview() {
  const [stats, setStats] = useState({
    revenue: 0,
    clients: 0,
    tokenCost: 0,
    margin: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    try {
      // Fetch financial data
      const { data: financials } = await supabase.from('financials').select('*')
      const revenue = financials?.filter(f => f.type === 'revenue').reduce((sum, f) => sum + f.amount, 0) || 0
      const expenses = financials?.filter(f => f.type === 'expense').reduce((sum, f) => sum + f.amount, 0) || 0
      
      // Fetch clients
      const { data: clientsData } = await supabase.from('clients').select('*')
      const activeClients = clientsData?.filter(c => c.status === 'active').length || 0
      
      // Fetch token costs
      const { data: tokens } = await supabase.from('token_logs').select('*')
      const tokenCost = tokens?.reduce((sum, t) => sum + t.cost, 0) || 0
      
      const profit = revenue - expenses
      const margin = revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : 0
      
      setStats({
        revenue,
        clients: activeClients,
        tokenCost,
        margin
      })
    } catch (err) {
      console.error('Error loading stats:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back! Here's your business snapshot.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <StatCard icon={DollarSign} label="Monthly Revenue" value={`$${stats.revenue.toLocaleString()}`} change={loading ? '...' : "Live data"} />
        <StatCard icon={Users} label="Active Clients" value={stats.clients} change={loading ? '...' : "Live"} />
        <StatCard icon={Zap} label="Token Usage" value={`$${stats.tokenCost.toFixed(0)}`} change={loading ? '...' : "YTD"} />
        <StatCard icon={TrendingUp} label="Profit Margin" value={`${stats.margin}%`} change={loading ? '...' : "Current"} />
      </div>

      {/* Revenue Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue vs Expenses</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={staticRevenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#3b82f6" />
            <Bar dataKey="expenses" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-6">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition">
          + Add New Task
        </button>
        <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition">
          + Log Revenue
        </button>
        <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition">
          + Add Client
        </button>
        <button className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition">
          + Log Expense
        </button>
      </div>
    </div>
  )
}
