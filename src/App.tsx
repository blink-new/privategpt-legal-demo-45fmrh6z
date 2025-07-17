import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { AppTour } from '@/components/tour/AppTour'
import { WelcomePopup } from '@/components/tour/WelcomePopup'
import { TourProvider, useTour } from '@/contexts/TourContext'
import { ModernSidebar } from '@/components/layout/ModernSidebar'
import { ModernDashboard } from '@/pages/ModernDashboard'
import { DocumentViewer } from '@/pages/DocumentViewer'
import { ChatInterface } from '@/pages/ChatInterface'
import { DocumentSearch } from '@/pages/DocumentSearch'
import { ClauseAnalysis } from '@/pages/ClauseAnalysis'
import { Workflows } from '@/pages/Workflows'
import { Analytics } from '@/pages/Analytics'
import { Settings } from '@/pages/Settings'
import { Toaster } from '@/components/ui/sonner'

function AppContent() {
  const { showTour, startTour, closeTour, completeTour } = useTour()
  const [showWelcome, setShowWelcome] = useState(false)
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false)

  // Check if user has seen the welcome popup
  useEffect(() => {
    const welcomeSeen = localStorage.getItem('privategpt-welcome-seen')
    setHasSeenWelcome(!!welcomeSeen)
  }, [])

  // Show welcome popup for new users
  useEffect(() => {
    if (!hasSeenWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(true)
      }, 1500) // Delay to let the dashboard load
      
      return () => clearTimeout(timer)
    }
  }, [hasSeenWelcome])

  const handleWelcomeClose = () => {
    localStorage.setItem('privategpt-welcome-seen', 'true')
    setHasSeenWelcome(true)
    setShowWelcome(false)
  }

  const handleStartTour = () => {
    startTour()
  }

  return (
    <div className="flex min-h-screen bg-gradient-mesh">
      <ModernSidebar />
      <main className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<ModernDashboard />} />
          <Route path="/documents" element={<DocumentViewer />} />
          <Route path="/chat" element={<ChatInterface />} />
          <Route path="/search" element={<DocumentSearch />} />
          <Route path="/clauses" element={<ClauseAnalysis />} />
          <Route path="/workflows" element={<Workflows />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>

      {/* Welcome Popup */}
      <WelcomePopup
        isOpen={showWelcome}
        onClose={handleWelcomeClose}
        onStartTour={handleStartTour}
        onExploreWithoutTour={handleWelcomeClose}
      />

      {/* App Tour */}
      <AppTour
        isOpen={showTour}
        onClose={closeTour}
        onComplete={completeTour}
      />
    </div>
  )
}

function App() {
  // Apply dark theme by default
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])
  
  return (
    <Router>
      <TourProvider>
        <AppContent />
        <Toaster />
      </TourProvider>
    </Router>
  )
}

export default App