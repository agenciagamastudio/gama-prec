interface MetricCardProps {
  title: string
  value: string | number
  icon: string
  color: string
  subtitle?: string
}

export default function MetricCard({
  title,
  value,
  icon,
  color,
  subtitle,
}: MetricCardProps) {
  return (
    <div className={`card ${color}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-600 text-sm mb-2">{title}</p>
          <p className="text-2xl font-bold text-black">{value}</p>
          {subtitle && <p className="text-xs text-gray-600 mt-1">{subtitle}</p>}
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  )
}
