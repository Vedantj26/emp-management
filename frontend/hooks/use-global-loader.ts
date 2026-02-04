'use client'

import * as React from 'react'

type Listener = () => void

let activeRequests = 0
const listeners: Listener[] = []

function notify() {
  listeners.forEach((listener) => listener())
}

export function startGlobalLoader() {
  if (typeof window === 'undefined') return
  activeRequests += 1
  notify()
}

export function stopGlobalLoader() {
  if (typeof window === 'undefined') return
  activeRequests = Math.max(0, activeRequests - 1)
  notify()
}

export function useGlobalLoader() {
  const [isLoading, setIsLoading] = React.useState(activeRequests > 0)

  React.useEffect(() => {
    const onChange = () => setIsLoading(activeRequests > 0)
    listeners.push(onChange)
    return () => {
      const index = listeners.indexOf(onChange)
      if (index > -1) listeners.splice(index, 1)
    }
  }, [])

  return isLoading
}
