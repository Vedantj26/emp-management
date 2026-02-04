'use client'

import { useGlobalLoader } from '@/hooks/use-global-loader'
import { cn } from '@/lib/utils'

export default function GlobalLoadingOverlay() {
  const isLoading = useGlobalLoader()

  return (
    <div
      className={cn(
        'fixed inset-0 z-[110] bg-transparent transition-opacity duration-200',
        isLoading ? 'pointer-events-auto opacity-100 cursor-wait' : 'pointer-events-none opacity-0',
      )}
      aria-hidden
    />
  )
}
