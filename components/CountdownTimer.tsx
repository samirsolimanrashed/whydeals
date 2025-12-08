'use client'

import { useEffect, useState } from 'react'

interface CountdownTimerProps {
  endTime: Date | string
  className?: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  expired: boolean
}

export function CountdownTimer({ endTime, className = '' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft())

  function calculateTimeLeft(): TimeLeft {
    const end = new Date(endTime).getTime()
    const now = new Date().getTime()
    const difference = end - now

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      expired: false,
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [endTime])

  if (timeLeft.expired) {
    return (
      <div className={`text-error-red font-semibold ${className}`}>
        Deal Expired
      </div>
    )
  }

  return (
    <div className={`flex gap-2 items-center ${className}`}>
      {timeLeft.days > 0 && (
        <div className="flex flex-col items-center px-2 py-1 rounded border border-neutral-black text-neutral-black dark:border-neutral-700 dark:bg-neutral-900 dark:text-white">
          <span className="text-lg font-bold">{timeLeft.days}</span>
          <span className="text-xs">days</span>
        </div>
      )}
      <div className="flex flex-col items-center px-2 py-1 rounded border border-neutral-black text-neutral-black dark:border-neutral-700 dark:bg-neutral-900 dark:text-white">
        <span className="text-lg font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
        <span className="text-xs">hrs</span>
      </div>
      <span className="text-xl font-bold text-foreground">:</span>
      <div className="flex flex-col items-center px-2 py-1 rounded border border-neutral-black text-neutral-black dark:border-neutral-700 dark:bg-neutral-900 dark:text-white">
        <span className="text-lg font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span className="text-xs">min</span>
      </div>
      <span className="text-xl font-bold text-foreground">:</span>
      <div className="flex flex-col items-center px-2 py-1 rounded border border-neutral-black text-neutral-black dark:border-neutral-700 dark:bg-neutral-900 dark:text-white">
        <span className="text-lg font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
        <span className="text-xs">sec</span>
      </div>
    </div>
  )
}
