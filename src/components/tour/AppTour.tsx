import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  X,
  ArrowRight,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface TourStep {
  id: string
  title: string
  description: string
  target: string
  position: 'top' | 'bottom' | 'left' | 'right'
  action?: 'click' | 'hover' | 'focus'
  delay?: number
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to PrivateGPT Legal! 🎉',
    description: 'Let me show you around your new AI-powered legal assistant. This tour will take about 2 minutes.',
    target: 'body',
    position: 'bottom',
    delay: 8000,
  },
  {
    id: 'sidebar',
    title: 'Navigation Sidebar',
    description: 'Your main navigation hub. Access all features from here. You can collapse it by clicking the arrow.',
    target: '[data-tour="nav-dashboard"]',
    position: 'right',
    delay: 10000,
  },
  {
    id: 'dashboard',
    title: 'Dashboard Overview',
    description: 'Your command center showing document stats, recent activity, and quick actions.',
    target: '[data-tour="dashboard-stats"]',
    position: 'bottom',
    delay: 10000,
  },
  {
    id: 'upload',
    title: 'Document Upload',
    description: 'Upload legal documents here for AI analysis. Supports PDF, DOCX, and more.',
    target: '[data-tour="upload-button"]',
    position: 'bottom',
    action: 'hover',
    delay: 10000,
  },
  {
    id: 'chat',
    title: 'AI Assistant',
    description: 'Ask questions about your documents and get instant, intelligent answers.',
    target: '[data-tour="nav-chat"]',
    position: 'right',
    delay: 10000,
  },
  {
    id: 'documents',
    title: 'Document Management',
    description: 'View, organize, and analyze all your legal documents in one place.',
    target: '[data-tour="nav-documents"]',
    position: 'right',
    delay: 10000,
  },
  {
    id: 'search',
    title: 'Smart Search',
    description: 'Find specific clauses, cases, or information across all your documents instantly.',
    target: '[data-tour="nav-search"]',
    position: 'right',
    delay: 10000,
  },
  {
    id: 'clauses',
    title: 'Clause Analysis',
    description: 'AI-powered clause extraction and risk assessment for your contracts.',
    target: '[data-tour="nav-clauses"]',
    position: 'right',
    delay: 10000,
  },
  {
    id: 'workflows',
    title: 'Workflow Automation',
    description: 'Automate repetitive tasks and create custom workflows for your legal processes.',
    target: '[data-tour="nav-workflows"]',
    position: 'right',
    delay: 10000,
  },
  {
    id: 'analytics',
    title: 'Analytics & Insights',
    description: 'Track your productivity, document patterns, and get AI-powered insights.',
    target: '[data-tour="nav-analytics"]',
    position: 'right',
    delay: 10000,
  },
  {
    id: 'complete',
    title: 'You\'re All Set! ✨',
    description: 'You\'re ready to transform your legal practice with AI. Start by uploading your first document!',
    target: 'body',
    position: 'bottom',
    delay: 8000,
  },
]

interface AppTourProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

export function AppTour({ isOpen, onClose, onComplete }: AppTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [highlightedElement, setHighlightedElement] = useState<Element | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  const currentTourStep = tourSteps[currentStep]

  useEffect(() => {
    if (!isOpen) return

    const updateHighlight = () => {
      const step = tourSteps[currentStep]
      const element = document.querySelector(step.target)
      
      if (element && step.target !== 'body') {
        setHighlightedElement(element)
        
        // Calculate tooltip position with screen boundary checks
        const rect = element.getBoundingClientRect()
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
        
        const tooltipWidth = 384 // max-w-sm = 24rem = 384px
        const tooltipHeight = 400 // increased estimated height
        const padding = 20
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight
        
        let x = 0, y = 0
        
        switch (step.position) {
          case 'right':
            x = rect.right + scrollLeft + padding
            y = rect.top + scrollTop + rect.height / 2 - tooltipHeight / 2
            
            // Check right boundary - if not enough space, position to left
            if (x + tooltipWidth > viewportWidth - padding) {
              x = rect.left + scrollLeft - tooltipWidth - padding
            }
            break
          case 'left':
            x = rect.left + scrollLeft - tooltipWidth - padding
            y = rect.top + scrollTop + rect.height / 2 - tooltipHeight / 2
            
            // Check left boundary - if not enough space, position to right
            if (x < padding) {
              x = rect.right + scrollLeft + padding
            }
            break
          case 'top':
            x = rect.left + scrollLeft + rect.width / 2 - tooltipWidth / 2
            y = rect.top + scrollTop - tooltipHeight - padding
            
            // Check top boundary - if not enough space, position below
            if (y < scrollTop + padding) {
              y = rect.bottom + scrollTop + padding
            }
            break
          case 'bottom':
            x = rect.left + scrollLeft + rect.width / 2 - tooltipWidth / 2
            y = rect.bottom + scrollTop + padding
            
            // Check bottom boundary - if not enough space, position above
            if (y + tooltipHeight > scrollTop + viewportHeight - padding) {
              y = rect.top + scrollTop - tooltipHeight - padding
            }
            break
        }
        
        // Final boundary checks for horizontal positioning
        if (x < padding) {
          x = padding
        } else if (x + tooltipWidth > viewportWidth - padding) {
          x = viewportWidth - tooltipWidth - padding
        }
        
        // Final boundary checks for vertical positioning
        if (y < scrollTop + padding) {
          y = scrollTop + padding
        } else if (y + tooltipHeight > scrollTop + viewportHeight - padding) {
          y = scrollTop + viewportHeight - tooltipHeight - padding
        }
        
        setTooltipPosition({ x, y })
        
        // Scroll element into view
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        
        // Perform action if specified
        if (step.action === 'hover') {
          element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
        }
      } else {
        setHighlightedElement(null)
        setTooltipPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
      }
    }

    updateHighlight()
    
    // Auto-advance if playing (with proper delay in milliseconds)
    if (isPlaying && currentStep < tourSteps.length - 1) {
      intervalRef.current = setTimeout(() => {
        setCurrentStep(prev => prev + 1)
      }, currentTourStep.delay || 10000) // Default 10 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current)
      }
    }
  }, [currentStep, isPlaying, isOpen])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowRight':
          nextStep()
          break
        case 'ArrowLeft':
          prevStep()
          break
        case ' ':
          e.preventDefault()
          togglePlayPause()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentStep])

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      completeTour()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const restartTour = () => {
    setCurrentStep(0)
    setIsPlaying(true)
  }

  const completeTour = () => {
    onComplete()
    onClose()
  }

  const skipTour = () => {
    onClose()
  }

  if (!isOpen) return null

  const getTooltipClasses = () => {
    const baseClasses = 'fixed z-[1002] max-w-sm'
    
    switch (currentTourStep.position) {
      case 'right':
        return `${baseClasses} -translate-y-1/2`
      case 'left':
        return `${baseClasses} -translate-y-1/2 -translate-x-full`
      case 'top':
        return `${baseClasses} -translate-x-1/2 -translate-y-full`
      case 'bottom':
        return `${baseClasses} -translate-x-1/2`
      default:
        return `${baseClasses} -translate-x-1/2 -translate-y-1/2`
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="tour-overlay fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]"
        onClick={skipTour}
      />

      {/* Highlight */}
      {highlightedElement && (
        <div
          className="tour-highlight fixed pointer-events-none z-[1001] rounded-lg transition-all duration-500"
          style={{
            left: highlightedElement.getBoundingClientRect().left - 4,
            top: highlightedElement.getBoundingClientRect().top - 4,
            width: highlightedElement.getBoundingClientRect().width + 8,
            height: highlightedElement.getBoundingClientRect().height + 8,
          }}
        />
      )}

      {/* Tooltip */}
      <Card
        className={cn(
          getTooltipClasses(),
          'glass-card border-primary/30 shadow-2xl animate-scale-in'
        )}
        style={{
          left: tooltipPosition.x,
          top: tooltipPosition.y,
        }}
      >
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {currentStep + 1} of {tourSteps.length}
              </Badge>
              {currentStep === tourSteps.length - 1 && (
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={skipTour}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-foreground">
              {currentTourStep.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {currentTourStep.description}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePlayPause}
                className="h-8 w-8 p-0"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={restartTour}
                className="h-8 w-8 p-0"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="h-8 px-3"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              
              {currentStep === tourSteps.length - 1 ? (
                <Button
                  size="sm"
                  onClick={completeTour}
                  className="btn-premium h-8 px-4"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Get Started
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={nextStep}
                  className="btn-premium h-8 px-3"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{Math.round(((currentStep + 1) / tourSteps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5">
              <div
                className="bg-primary h-1.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Keyboard Shortcuts Hint */}
      <div className="fixed bottom-4 right-4 z-[1002]">
        <Card className="glass-card border-white/10">
          <CardContent className="p-3">
            <div className="text-xs text-muted-foreground space-y-1">
              <div>← → Navigate</div>
              <div>Space Play/Pause</div>
              <div>Esc Exit</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}