'use client'

import { useState, useEffect } from 'react'

interface CountdownTimerProps {
  endDate: Date | string
  onComplete?: () => void
}

export default function CountdownTimer({ endDate, onComplete }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const end = new Date(endDate).getTime()
      const now = new Date().getTime()
      const difference = end - now

      if (difference <= 0) {
        setIsExpired(true)
        if (onComplete) {
          onComplete()
        }
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        }
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      }
    }

    setTimeLeft(calculateTimeLeft())
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [endDate, onComplete])

  if (isExpired) {
    return (
      <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg text-center">
        <span className="font-semibold">Deal Expired</span>
      </div>
    )
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <p className="text-sm text-gray-600 mb-2 text-center">Time Remaining</p>
      <div className="flex justify-center space-x-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{timeLeft.days}</div>
          <div className="text-xs text-gray-500">Days</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{String(timeLeft.hours).padStart(2, '0')}</div>
          <div className="text-xs text-gray-500">Hours</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{String(timeLeft.minutes).padStart(2, '0')}</div>
          <div className="text-xs text-gray-500">Minutes</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{String(timeLeft.seconds).padStart(2, '0')}</div>
          <div className="text-xs text-gray-500">Seconds</div>
        </div>
      </div>
    </div>
  )
}

