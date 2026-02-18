import React, { useState, useEffect } from 'react'
import { Plus, Download } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { supabase } from '../../lib/supabase'

const staticProfitData = [
  { month: 'Jan', revenue: 0, expenses: 2500, profit: -2500 },
  { month: 'Feb', revenue: 2499, expenses: 1800, profit: 699 },
  { month: 'Mar', revenue: 4998, expenses: 2200, profit: 2798 },
  { month: 'Apr', revenue: 7497, expenses: 2500, profit: 4997 },
]

export default function Financial() {
  const [transactions, setTransactions] = useState([])
  const [stats, setStats] = useState({ revenue: 0, expenses: 0, profit: 0, margin: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFinancials()
  }, [])

  async function loadFinancials() {
    try {
      const { data, error } = await supabase.from('financials').select('*').order('date', { ascending: false })
      if (!error && data) {
        setTransactions(data)
        const revenue = data.filter(f => f.type === 'revenue').reduce((sum, f) => sum + f.amount, 0)
        const expenses = data.filter(f => f.type === 'expense').reduce((sum, f) => sum + f.amount, 0)
        const profit = revenue - expenses
        const margin = revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : 0
        setStats({ revenue, expenses, profit, margin })
      }
    } catch (err) {
      console.error('Error loading financials:', err)
    } finally {
      setLoading(false)
    }
  }

  const totalRevenue = stats.revenue
  const totalExpenses = stats.expenses
  const profit = stats.profit
  const margin = stats.margin

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Financial Overview</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Revenue, expenses, and profitability tracking</p>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Total Revenue (YTD)</p>
          <p className="text-2xl font-bold text-green-600 mt-2">${totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-2">+200% growth</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Total Expenses (YTD)</p>
          <p className="text-2xl font-bold text-red-600 mt-2">${totalExpenses.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-2">API & infrastructure</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Net Profit</p>
          <p className="text-2xl font-bold text-blue-600 mt-2">${profit.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-2">Margin: {margin}%</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Monthly Burn</p>
          <p className="text-2xl font-bold text-orange-600 mt-2">${totalExpenses.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-2">Operating costs</p>
        </div>
      </div>

      {/* Profit Trend Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profitability Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={staticProfitData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
            <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} />
            <Line type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Tax Prep Summary */}
      <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tax Preparation Summary</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-700 dark:text-gray-300">Gross Income (YTD)</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">${totalRevenue}</p>
          </div>
          <div>
            <p className="text-gray-700 dark:text-gray-300">Deductible Expenses</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">${totalExpenses}</p>
          </div>
          <div>
            <p className="text-gray-700 dark:text-gray-300">Taxable Income</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">${profit}</p>
          </div>
          <div>
            <p className="text-gray-700 dark:text-gray-300">Est. Tax (20%)</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">${(profit * 0.2).toFixed(0)}</p>
          </div>
        </div>
        <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition">
          <Download size={18} /> Export Tax Report
        </button>
      </div>

      {/* Expense Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Expenses</h2>
          <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-3 text-sm rounded-lg flex items-center gap-2 transition">
            <Plus size={16} /> Add Expense
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr><td colSpan="3" className="px-6 py-4 text-center text-gray-500">Loading...</td></tr>
              ) : transactions.length === 0 ? (
                <tr><td colSpan="3" className="px-6 py-4 text-center text-gray-500">No transactions</td></tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{tx.category}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">${tx.amount}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{tx.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
