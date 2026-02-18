import React, { useState, useEffect } from 'react'
import { CheckCircle, Clock, AlertCircle, Plus } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import AddTaskModal from '../AddTaskModal'

const StatusBadge = ({ status }) => {
  const styles = {
    completed: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
    'in-progress': 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
    pending: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300',
  }
  return <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>{status}</span>
}

const PriorityBadge = ({ priority }) => {
  const styles = {
    high: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300',
    medium: 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300',
    low: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
  }
  return <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[priority]}`}>{priority}</span>
}

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  
  useEffect(() => {
    loadTasks()
  }, [])

  async function loadTasks() {
    try {
      const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false })
      if (!error) {
        setTasks(data || [])
      }
    } catch (err) {
      console.error('Error loading tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleTaskAdded = () => {
    loadTasks()
  }

  const completed = tasks.filter(t => t.status === 'completed').length
  const inProgress = tasks.filter(t => t.status === 'in-progress').length

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tasks & Projects</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{completed} completed • {inProgress} in progress</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition w-full sm:w-auto justify-center sm:justify-start"
        >
          <Plus size={18} /> New Task
        </button>
      </div>

      <AddTaskModal isOpen={showModal} onClose={() => setShowModal(false)} onTaskAdded={handleTaskAdded} />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm">In Progress</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{inProgress}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Completed</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{completed}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Total Tasks</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">{tasks.length}</p>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm sm:text-base">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Task</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Priority</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">Loading tasks...</td></tr>
              ) : tasks.length === 0 ? (
                <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">No tasks yet</td></tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{task.title}</td>
                    <td className="px-6 py-4"><StatusBadge status={task.status} /></td>
                    <td className="px-6 py-4"><PriorityBadge priority={task.priority} /></td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{task.due_date}</td>
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
