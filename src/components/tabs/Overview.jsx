import React from 'react'
import { TrendingUp, Users, Zap, DollarSign } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const revenueData = [
  { month: 'Jan', revenue: 0, expenses: 2500 },
  { month: 'Feb', revenue: 2499, expenses: 1800 },
  { month: 'Mar', revenue: 4998, expenses: 2200 },
  { month: 'Apr', revenue: 7497, expenses: 2500 },
]

const StatCard = ({ icon: Icon, label, value, change }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{label}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        {change && <p className="text-xs text-green-600 mt-2">↑ {change}</p>}
      </div>
      <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
        <Icon size={24} className="text-blue-600 dark:text-blue-300" />
      </div>
    </div>
  </div>
)

export default function Overview() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back! Here's your business snapshot.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={DollarSign} label="Monthly Revenue" value="$7,497" change="100% vs last month" />
        <StatCard icon={Users} label="Active Clients" value="3" change="3 new" />
        <StatCard icon={Zap} label="Token Usage" value="$1,250" change="Moderate" />
        <StatCard icon={TrendingUp} label="Profit Margin" value="66.7%" change="+5.2%" />
      </div>

      {/* Revenue Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue vs Expenses</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
