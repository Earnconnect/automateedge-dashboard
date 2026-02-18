import React from 'react'
import { CheckCircle, AlertCircle, Clock } from 'lucide-react'

const workflows = [
  { id: 1, name: 'Document Ingestion Pipeline', status: 'running', lastRun: '2026-02-18 11:45', successRate: 98.5, avgDuration: '2.3s' },
  { id: 2, name: 'RAG Search Indexing', status: 'completed', lastRun: '2026-02-18 10:30', successRate: 100, avgDuration: '15.2s' },
  { id: 3, name: 'Meeting Transcription & Analysis', status: 'running', lastRun: '2026-02-18 12:00', successRate: 96.2, avgDuration: '45.1s' },
  { id: 4, name: 'Client Report Generation', status: 'completed', lastRun: '2026-02-17 18:20', successRate: 99.1, avgDuration: '8.5s' },
  { id: 5, name: 'Email Automation', status: 'idle', lastRun: '2026-02-17 09:00', successRate: 100, avgDuration: '1.2s' },
]

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
  const running = workflows.filter(w => w.status === 'running').length
  const completed = workflows.filter(w => w.status === 'completed').length
  const avgSuccessRate = (workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length).toFixed(1)

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
        {workflows.map((workflow) => (
          <div key={workflow.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <StatusIcon status={workflow.status} />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{workflow.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Last run: {workflow.lastRun} • Avg duration: {workflow.avgDuration}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{workflow.successRate}%</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Success rate</p>
                </div>
                <StatusBadge status={workflow.status} />
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition ${
                  workflow.successRate >= 98
                    ? 'bg-green-500'
                    : workflow.successRate >= 95
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${workflow.successRate}%` }}
              />
            </div>
          </div>
        ))}
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
