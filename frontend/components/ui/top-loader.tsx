'use client'

import { useGlobalLoader } from '@/hooks/use-global-loader'
import { cn } from '@/lib/utils'

export default function TopLoader() {
  const isLoading = useGlobalLoader()

  return (
    <div
      className={cn(
        'pointer-events-none fixed left-0 top-0 z-[120] h-[4px] w-full overflow-hidden bg-black/5 transition-opacity duration-200',
        !isLoading && 'opacity-0',
      )}
      aria-hidden
    >
      <div className="top-loader-bar h-full w-[45%] bg-gradient-to-r from-emerald-400 via-sky-400 to-emerald-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
    </div>
  )
}
