import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { logger } from '@/lib/logger'

interface HealthStatus {
  status: string
  timestamp: string
  uptime: number
  checks: {
    database: { status: string; message: string }
    redis: { status: string; message: string }
    memory: { status: string; message: string; details?: Record<string, string> }
  }
  responseTime: string
}

export function MonitoringDashboard() {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await fetch('/api/health')
        const data = await response.json()
        setHealth(data)
      } catch (err) {
        const error = err as Error
        logger.error('Failed to fetch health status', error)
        setError(error.message)
      }
    }

    fetchHealth()
    const interval = setInterval(fetchHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        Error loading monitoring data: {error}
      </div>
    )
  }

  if (!health) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">System Monitoring</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="font-semibold mb-2">System Status</h3>
          <Badge
            variant={health.status === 'healthy' ? 'success' : 'destructive'}
          >
            {health.status}
          </Badge>
          <p className="mt-2 text-sm text-gray-600">
            Uptime: {Math.floor(health.uptime / 3600)}h {Math.floor((health.uptime % 3600) / 60)}m
          </p>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-2">Database</h3>
          <Badge
            variant={health.checks.database.status === 'healthy' ? 'success' : 'destructive'}
          >
            {health.checks.database.status}
          </Badge>
          <p className="mt-2 text-sm text-gray-600">{health.checks.database.message}</p>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-2">Redis</h3>
          <Badge
            variant={health.checks.redis.status === 'healthy' ? 'success' : 'destructive'}
          >
            {health.checks.redis.status}
          </Badge>
          <p className="mt-2 text-sm text-gray-600">{health.checks.redis.message}</p>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="font-semibold mb-2">Memory Status</h3>
        <div className="space-y-2">
          <Badge
            variant={health.checks.memory.status === 'healthy' ? 'success' : 'destructive'}
          >
            {health.checks.memory.status}
          </Badge>
          <p className="text-sm text-gray-600">{health.checks.memory.message}</p>
          {health.checks.memory.details && (
            <div className="text-xs text-gray-500">
              {Object.entries(health.checks.memory.details).map(([key, value]) => (
                <div key={key}>{key}: {value}</div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-2">Response Time</h3>
        <p className="text-lg font-mono">{health.responseTime}</p>
      </Card>

      <div className="mt-4 text-sm text-gray-500">
        Last updated: {new Date(health.timestamp).toLocaleString()}
      </div>
    </div>
  )
} 