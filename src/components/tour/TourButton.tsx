import { Button } from '@/components/ui/button'
import { Play, HelpCircle } from 'lucide-react'
import { useTour } from '@/contexts/TourContext'
import { cn } from '@/lib/utils'

interface TourButtonProps {
  className?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'default' | 'lg'
}

export function TourButton({ className, variant = 'outline', size = 'sm' }: TourButtonProps) {
  const { startTour } = useTour()

  return (
    <Button
      variant={variant}
      size={size}
      onClick={startTour}
      className={cn('glass-card border-white/20', className)}
    >
      <Play className="mr-2 h-4 w-4" />
      Take Tour
    </Button>
  )
}

export function TourHelpButton({ className }: { className?: string }) {
  const { startTour } = useTour()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={startTour}
      className={cn('glass-card border-white/20', className)}
      title="Take interactive tour"
    >
      <HelpCircle className="h-4 w-4" />
    </Button>
  )
}