'use client'

import Timer from './Timer'

interface HeaderProps {
  title?: string
  timerSeconds?: number
  onTimerExpire?: () => void
}

export default function Header({ title = 'Atlas Assessment', timerSeconds, onTimerExpire }: HeaderProps) {
  return (
    <header className="bg-atlas-blue h-[60px] flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-50">
      <h1 className="text-white text-xl font-semibold">{title}</h1>
      {timerSeconds !== undefined && onTimerExpire && (
        <Timer initialSeconds={timerSeconds} onExpire={onTimerExpire} />
      )}
    </header>
  )
}
