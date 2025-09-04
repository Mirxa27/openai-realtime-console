import { Clock } from 'lucide-react'

interface MinutesDisplayProps {
  minutes: number
}

export function MinutesDisplay({ minutes }: MinutesDisplayProps) {
  const getColor = () => {
    if (minutes > 50) return 'text-green-400'
    if (minutes > 20) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="absolute top-4 right-4 glass rounded-full px-3 py-1.5 flex items-center gap-2">
      <Clock className={`w-4 h-4 ${getColor()}`} />
      <span className={`text-sm font-medium ${getColor()}`}>
        {minutes} min
      </span>
    </div>
  )
}