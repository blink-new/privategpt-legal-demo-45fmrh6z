import { createContext, useContext, useState, ReactNode } from 'react'

interface TourContextType {
  showTour: boolean
  startTour: () => void
  closeTour: () => void
  completeTour: () => void
}

const TourContext = createContext<TourContextType | undefined>(undefined)

export function useTour() {
  const context = useContext(TourContext)
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider')
  }
  return context
}

interface TourProviderProps {
  children: ReactNode
}

export function TourProvider({ children }: TourProviderProps) {
  const [showTour, setShowTour] = useState(false)

  const startTour = () => {
    setShowTour(true)
  }

  const closeTour = () => {
    setShowTour(false)
  }

  const completeTour = () => {
    localStorage.setItem('privategpt-tour-seen', 'true')
    setShowTour(false)
  }

  const value = {
    showTour,
    startTour,
    closeTour,
    completeTour
  }

  return (
    <TourContext.Provider value={value}>
      {children}
    </TourContext.Provider>
  )
}