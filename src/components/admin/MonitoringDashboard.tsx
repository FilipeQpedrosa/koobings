import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LineChart } from '@/components/ui/charts'
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

interface MetricPoint {
  timestamp: number
  value: number
}

interface SystemMetrics {
  cpu: MetricPoint[]
  memory: MetricPoint[]
  responseTime: MetricPoint[]
}

export function MonitoringDashboard() {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: [],
    memory: [],
    responseTime: []
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await fetch('/api/health')
        const data = await response.json()
        setHealth(data)
        
        // Update metrics
        const now = Date.now()
        setMetrics(prev => ({
          cpu: [...prev.cpu.slice(-30), { timestamp: now, value: Math.random() * 100 }],
          memory: [...prev.memory.slice(-30), {
            timestamp: now,
            value: parseInt(data.checks.memory.details?.heapUsed || '0')
          }],
          responseTime: [...prev.responseTime.slice(-30), {
            timestamp: now,
            value: parseInt(data.responseTime)
          }]
        }))
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Memory Usage</h3>
          <LineChart
            data={metrics.memory}
            xKey="timestamp"
            yKey="value"
            label="Memory (MB)"
          />
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-4">Response Time</h3>
          <LineChart
            data={metrics.responseTime}
            xKey="timestamp"
            yKey="value"
            label="Response Time (ms)"
          />
        </Card>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Last updated: {new Date(health.timestamp).toLocaleString()}
      </div>
    </div>
  )
} 