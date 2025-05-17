import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface LineChartProps {
  data: Array<{
    timestamp: number
    value: number
  }>
  xKey: string
  yKey: string
  label: string
}

export function LineChart({ data, xKey, yKey, label }: LineChartProps) {
  const formattedData = data.map(point => ({
    ...point,
    timestamp: new Date(point.timestamp).toLocaleTimeString()
  }))

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="timestamp" 
            label={{ value: 'Time', position: 'bottom' }}
          />
          <YAxis
            label={{ 
              value: label, 
              angle: -90, 
              position: 'insideLeft' 
            }}
          />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#2563eb" 
            strokeWidth={2}
            dot={false}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
} 