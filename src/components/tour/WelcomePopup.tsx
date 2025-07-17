import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Play,
  Sparkles,
  Scale,
  Brain,
  Shield,
  Zap,
  ArrowRight,
  X,
} from 'lucide-react'

interface WelcomePopupProps {
  isOpen: boolean
  onClose: () => void
  onStartTour: () => void
  onExploreWithoutTour: () => void
}

export function WelcomePopup({ isOpen, onClose, onStartTour, onExploreWithoutTour }: WelcomePopupProps) {
  const [selectedOption, setSelectedOption] = useState<'tour' | 'explore' | null>(null)

  const handleStartTour = () => {
    setSelectedOption('tour')
    onStartTour()
    onClose()
  }

  const handleExplore = () => {
    setSelectedOption('explore')
    onExploreWithoutTour()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] glass-card border-primary/30 shadow-2xl">
        <DialogHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg animate-glow">
              <Scale className="h-8 w-8" />
            </div>
          </div>
          
          <div>
            <DialogTitle className="text-2xl font-bold flex items-center justify-center gap-2">
              Welcome to PrivateGPT Legal!
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            </DialogTitle>
            <DialogDescription className="text-base mt-2">
              Your AI-powered legal assistant is ready to transform how you work with legal documents.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Features Preview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-4 border-white/10 text-center">
              <Brain className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">AI Analysis</h3>
              <p className="text-xs text-muted-foreground">Instant document insights</p>
            </div>
            <div className="glass-card p-4 border-white/10 text-center">
              <Shield className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Risk Detection</h3>
              <p className="text-xs text-muted-foreground">Identify potential issues</p>
            </div>
            <div className="glass-card p-4 border-white/10 text-center">
              <Zap className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Automation</h3>
              <p className="text-xs text-muted-foreground">Streamline workflows</p>
            </div>
            <div className="glass-card p-4 border-white/10 text-center">
              <Sparkles className="h-8 w-8 text-orange-400 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Smart Search</h3>
              <p className="text-xs text-muted-foreground">Find anything instantly</p>
            </div>
          </div>

          {/* Tour Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">How would you like to get started?</h3>
            
            <div className="grid gap-4">
              {/* Interactive Tour Option */}
              <Card 
                className={`cursor-pointer transition-all duration-300 hover:scale-105 glass-card border-white/20 hover:border-primary/50 ${
                  selectedOption === 'tour' ? 'ring-2 ring-primary bg-primary/10' : ''
                }`}
                onClick={() => setSelectedOption('tour')}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
                      <Play className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">Interactive App Tour</h3>
                        <Badge variant="secondary" className="text-xs">
                          Recommended
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Take a guided 2-minute tour to learn all the key features step by step
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>• 11 interactive steps</span>
                        <span>• Skip anytime</span>
                        <span>• ~2 minutes</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Explore Without Tour Option */}
              <Card 
                className={`cursor-pointer transition-all duration-300 hover:scale-105 glass-card border-white/20 hover:border-primary/50 ${
                  selectedOption === 'explore' ? 'ring-2 ring-primary bg-primary/10' : ''
                }`}
                onClick={() => setSelectedOption('explore')}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/20 text-green-400">
                      <ArrowRight className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">Explore Without Tour</h3>
                      <p className="text-sm text-muted-foreground">
                        Jump right in and discover features at your own pace
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>• Start immediately</span>
                        <span>• Help available anytime</span>
                        <span>• Full access</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 glass-card border-white/20"
            >
              <X className="mr-2 h-4 w-4" />
              Maybe Later
            </Button>
            
            {selectedOption === 'tour' && (
              <Button
                onClick={handleStartTour}
                className="flex-1 btn-premium"
              >
                <Play className="mr-2 h-4 w-4" />
                Start Interactive Tour
              </Button>
            )}
            
            {selectedOption === 'explore' && (
              <Button
                onClick={handleExplore}
                className="flex-1 btn-premium"
              >
                <ArrowRight className="mr-2 h-4 w-4" />
                Explore Now
              </Button>
            )}
            
            {!selectedOption && (
              <Button
                onClick={handleStartTour}
                className="flex-1 btn-premium"
              >
                <Play className="mr-2 h-4 w-4" />
                Start Tour
              </Button>
            )}
          </div>

          {/* Footer Note */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              You can access the tour anytime from the Help menu
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}