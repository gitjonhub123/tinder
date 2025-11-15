'use client'

import { useEffect, useState } from 'react'

interface TimerProps {
  initialSeconds: number
  onExpire: () => void
  className?: string
}

export default function Timer({ initialSeconds, onExpire, className = '' }: TimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds)

  useEffect(() => {
    setSeconds(initialSeconds)
  }, [initialSeconds])

  useEffect(() => {
    if (seconds <= 0) {
      onExpire()
      return
    }

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          onExpire()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [seconds, onExpire])

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  const displayTime = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`

  // Color logic: white (normal) → yellow (<10min) → red (<5min)
  let textColor = 'text-white'
  if (seconds < 300) {
    // Less than 5 minutes
    textColor = 'text-atlas-error'
  } else if (seconds < 600) {
    // Less than 10 minutes
    textColor = 'text-atlas-warning'
  }

  return (
    <span className={`font-mono font-bold text-lg ${textColor} ${className}`}>
      Time: {displayTime}
    </span>
  )
}
