import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Search,
  FileCheck,
  Workflow,
  BarChart3,
  Settings,
  Scale,
  Bell,
  ChevronLeft,
  ChevronRight,

  User,
  Moon,
  Sun,
  Sparkles,
  Shield,
  HelpCircle,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

const navigationItems = [
  {
    title: 'Overview',
    items: [
      { title: 'Dashboard', url: '/', icon: LayoutDashboard, tourId: 'nav-dashboard' },
      { title: 'Documents', url: '/documents', icon: FileText, tourId: 'nav-documents' },
      { title: 'AI Assistant', url: '/chat', icon: MessageSquare, badge: 'New', tourId: 'nav-chat' },
    ],
  },
  {
    title: 'Analysis',
    items: [
      { title: 'Search', url: '/search', icon: Search, tourId: 'nav-search' },
      { title: 'Clause Analysis', url: '/clauses', icon: FileCheck, tourId: 'nav-clauses' },
      { title: 'Workflows', url: '/workflows', icon: Workflow, tourId: 'nav-workflows' },
    ],
  },
  {
    title: 'Insights',
    items: [
      { title: 'Analytics', url: '/analytics', icon: BarChart3, tourId: 'nav-analytics' },
      { title: 'Settings', url: '/settings', icon: Settings, tourId: 'nav-settings' },
    ],
  },
]

interface ModernSidebarProps {
  className?: string
}

export function ModernSidebar({ className }: ModernSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const location = useLocation()
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  // Mock profile data for prototype
  const profile = {
    display_name: 'Demo User',
    role: 'Senior Partner',
    firm_name: 'Demo Law Firm',
    avatar_url: undefined
  }

  return (
    <div
      className={cn(
        'glass-sidebar h-screen flex flex-col transition-all duration-300 ease-in-out border-r border-white/10',
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3 animate-slide-in-left">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
                <Scale className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold">PrivateGPT Legal</h2>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  AI Assistant
                </p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCollapse}
            className="h-8 w-8 p-0 hover:bg-white/10 glass-card border-white/10"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-6">
          {navigationItems.map((group) => (
            <div key={group.title}>
              {!isCollapsed && (
                <h3 className="px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  {group.title}
                </h3>
              )}
              <div className="space-y-1 px-2">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.url
                  return (
                    <Link
                      key={item.title}
                      to={item.url}
                      data-tour={item.tourId}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative',
                        isActive
                          ? 'bg-primary/20 text-primary border border-primary/30 shadow-lg'
                          : 'hover:bg-white/10 text-muted-foreground hover:text-foreground',
                        isCollapsed && 'justify-center'
                      )}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1">{item.title}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="text-xs glass-card border-white/20">
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                      {isCollapsed && (
                        <div className="absolute left-16 bg-popover text-popover-foreground px-3 py-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap glass-card border-white/20 shadow-xl">
                          {item.title}
                          {item.badge && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Theme Toggle */}
      <div className="px-4 py-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className={cn(
            'w-full justify-start gap-3 hover:bg-white/10 glass-card border-white/10',
            isCollapsed && 'justify-center'
          )}
        >
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {!isCollapsed && (
            <span className="text-sm">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          )}
        </Button>
      </div>

      <Separator className="bg-white/10" />

      {/* User Profile */}
      <div className="p-4">
        {isCollapsed ? (
          <div className="flex justify-center group relative">
            <Avatar className="h-8 w-8 ring-2 ring-primary/20">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                {profile?.display_name?.charAt(0) || 'D'}
              </AvatarFallback>
            </Avatar>
            <div className="absolute left-16 bg-popover text-popover-foreground px-3 py-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap glass-card border-white/20 shadow-xl">
              {profile?.display_name || 'Demo User'}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                  {profile?.display_name?.charAt(0) || 'D'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {profile?.display_name || 'Demo User'}
                </p>
                <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  {profile?.role || 'Lawyer'}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Bell className="h-3 w-3 text-muted-foreground" />
                </Button>
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              </div>
            </div>
            
            {profile?.firm_name && (
              <div className="glass-card p-2 border-white/10 rounded-lg">
                <p className="text-xs text-muted-foreground truncate">
                  {profile.firm_name}
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex-1 justify-center gap-1 hover:bg-white/10 glass-card border-white/10 text-xs px-2"
                >
                  <User className="h-3 w-3" />
                  <span className="hidden sm:inline">Profile</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex-1 justify-center gap-1 hover:bg-white/10 glass-card border-white/10 text-xs px-2"
                >
                  <HelpCircle className="h-3 w-3" />
                  <span className="hidden sm:inline">Help</span>
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-center gap-2 hover:bg-primary/10 text-primary hover:text-primary glass-card border-white/10 text-xs"
              >
                <Sparkles className="h-3 w-3" />
                Demo
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}