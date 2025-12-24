import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

function LineChart({ data, dataKey, name, color = '#3b82f6', height = 300 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="date" 
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
          tickFormatter={(value) => {
            if (!value) return ''
            try {
              // Handle YYYY-MM-DD format
              if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
                const [year, month, day] = value.split('-')
                return `${parseInt(month)}/${parseInt(day)}`
              }
              const date = new Date(value)
              if (!isNaN(date.getTime())) {
                return `${date.getMonth() + 1}/${date.getDate()}`
              }
              return value
            } catch {
              return value
            }
          }}
        />
        <YAxis 
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#fff', 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
          labelFormatter={(value) => {
            if (!value) return ''
            try {
              const date = new Date(value)
              if (isNaN(date.getTime())) {
                return value
              }
              return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            } catch {
              return value
            }
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey={dataKey} 
          name={name}
          stroke={color} 
          strokeWidth={3}
          dot={{ fill: color, r: 4 }}
          activeDot={{ r: 6 }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}

export default LineChart

