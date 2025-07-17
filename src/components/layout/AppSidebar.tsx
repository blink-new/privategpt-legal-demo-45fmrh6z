import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
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
  User,
  Bell,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

const navigationItems = [
  {
    title: 'Overview',
    items: [
      { title: 'Dashboard', url: '/', icon: LayoutDashboard },
      { title: 'Documents', url: '/documents', icon: FileText },
      { title: 'AI Assistant', url: '/chat', icon: MessageSquare },
    ],
  },
  {
    title: 'Analysis',
    items: [
      { title: 'Search', url: '/search', icon: Search },
      { title: 'Clause Analysis', url: '/clauses', icon: FileCheck },
      { title: 'Workflows', url: '/workflows', icon: Workflow },
    ],
  },
  {
    title: 'Insights',
    items: [
      { title: 'Analytics', url: '/analytics', icon: BarChart3 },
      { title: 'Settings', url: '/settings', icon: Settings },
    ],
  },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar className="border-r border-border/40">
      <SidebarHeader className="border-b border-border/40 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Scale className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">PrivateGPT Legal</h2>
            <p className="text-xs text-muted-foreground">AI Assistant</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navigationItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-xs font-medium text-muted-foreground px-3 py-2">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = location.pathname === item.url
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className="w-full justify-start gap-3 px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <Link to={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                          {item.title === 'AI Assistant' && (
                            <Badge variant="secondary" className="ml-auto text-xs">
                              New
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              JD
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">John Doe</p>
            <p className="text-xs text-muted-foreground truncate">Senior Partner</p>
          </div>
          <div className="flex items-center gap-1">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <Badge variant="destructive" className="h-2 w-2 p-0 rounded-full" />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}