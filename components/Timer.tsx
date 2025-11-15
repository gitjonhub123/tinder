'use client'

interface TimerProps {
  initialSeconds: number
  onExpire: () => void
  className?: string
}

export default function Timer({ initialSeconds, onExpire, className = '' }: TimerProps) {
  // Timer is now a "dumb" display component - parent manages countdown
  // Just display the time passed from parent
  const minutes = Math.floor(initialSeconds / 60)
  const remainingSeconds = initialSeconds % 60
  const displayTime = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`

  // Color logic: white (normal) → yellow (<10min) → red (<5min)
  let textColor = 'text-white'
  if (initialSeconds < 300) {
    // Less than 5 minutes
    textColor = 'text-atlas-error'
  } else if (initialSeconds < 600) {
    // Less than 10 minutes
    textColor = 'text-atlas-warning'
  }

  return (
    <div className={`flex items-center ${className}`}>
      <span className={`font-mono font-bold text-lg ${textColor}`}>
        {displayTime}
      </span>
    </div>
  )
}
