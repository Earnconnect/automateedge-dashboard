import React, { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, Clock } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const StatusIcon = ({ status }) => {
  if (status === 'running') return <Clock className="text-blue-600" size={20} />
  if (status === 'completed') return <CheckCircle className="text-green-600" size={20} />
  return <AlertCircle className="text-gray-400" size={20} />
}

const StatusBadge = ({ status }) => {
  const styles = {
    running: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
    completed: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
    idle: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
  }
  return <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>{status}</span>
}

export default function Workflows() {
  const [workflows, setWorkflows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadWorkflows()
  }, [])

  async function loadWorkflows() {
    try {
      const { data, error } = await supabase.from('workflows').select('*').order('created_at', { ascending: false })
      if (!error) {
        setWorkflows(data || [])
      }
    } catch (err) {
      console.error('Error loading workflows:', err)
    } finally {
      setLoading(false)
    }
  }

  const running = workflows.filter(w => w.status === 'running').length
  const completed = workflows.filter(w => w.status === 'completed').length
  const avgSuccessRate = workflows.length > 0 ? (workflows.reduce((sum, w) => sum + (w.success_rate || 0), 0) / workflows.length).toFixed(1) : 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Workflows & Automations</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">n8n pipeline status and performance metrics</p>
      </div>

      {/* Workflow Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Total Workflows</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{workflows.length}</p>
          <p className="text-xs text-gray-500 mt-2">Active & idle</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Running Now</p>
          <p className="text-2xl font-bold text-blue-600 mt-2">{running}</p>
          <p className="text-xs text-gray-500 mt-2">Active processes</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Success Rate</p>
          <p className="text-2xl font-bold text-green-600 mt-2">{avgSuccessRate}%</p>
          <p className="text-xs text-gray-500 mt-2">Average</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Completed</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{completed}</p>
          <p className="text-xs text-gray-500 mt-2">This week</p>
        </div>
      </div>

      {/* Workflows List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center text-gray-500">Loading workflows...</div>
        ) : workflows.length === 0 ? (
          <div className="text-center text-gray-500">No workflows configured</div>
        ) : (
          workflows.map((workflow) => (
            <div key={workflow.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <StatusIcon status={workflow.status} />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{workflow.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Last run: {workflow.last_run ? new Date(workflow.last_run).toLocaleString() : 'Never'} • Avg duration: {workflow.avg_duration}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{workflow.success_rate}%</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Success rate</p>
                  </div>
                  <StatusBadge status={workflow.status} />
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition ${
                    workflow.success_rate >= 98
                      ? 'bg-green-500'
                      : workflow.success_rate >= 95
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${workflow.success_rate}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Error Log */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Errors</h2>
        <div className="space-y-3">
          <div className="p-3 bg-red-50 dark:bg-red-900 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Meeting Transcription Pipeline</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">AssemblyAI timeout on 2026-02-18 at 11:20</p>
          </div>
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Document Ingestion</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Rate limit warning - 2026-02-17 at 14:45</p>
          </div>
        </div>
      </div>

      {/* Performance Tips */}
      <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Optimization Suggestions</h2>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>✓ Implement retry logic for AssemblyAI timeouts</li>
          <li>✓ Add rate limiting to stay under API quotas</li>
          <li>✓ Consider batch processing for better throughput</li>
          <li>✓ Schedule heavy workflows during off-peak hours</li>
        </ul>
      </div>
    </div>
  )
}
