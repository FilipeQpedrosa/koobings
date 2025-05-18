'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'

interface Metrics {
  totalAppointments: number
  totalRevenue: number
  activeStaff: number
}

export default function DashboardMetrics() {
  const [metrics, setMetrics] = useState<Metrics>({
    totalAppointments: 0,
    totalRevenue: 0,
    activeStaff: 0
  })

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/business/metrics')
        const data = await response.json()
        setMetrics(data)
      } catch (error) {
        console.error('Failed to fetch metrics:', error)
      }
    }

    fetchMetrics()
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-500">Total Appointments</h3>
        <p className="text-2xl font-bold">{metrics.totalAppointments}</p>
      </Card>
      
      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
        <p className="text-2xl font-bold">${metrics.totalRevenue}</p>
      </Card>
      
      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-500">Active Staff</h3>
        <p className="text-2xl font-bold">{metrics.activeStaff}</p>
      </Card>
    </div>
  )
} 