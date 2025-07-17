import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Upload,
  FileText,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Zap,
  FileCheck,
  Search,
  Activity,
  Brain,
  Shield,
  Users,
  Target,
  Sparkles,
  ArrowRight,
  Plus,
  Eye,
  Download,
  X
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { documentService, analyticsService, Document, AnalyticsData } from '@/lib/blink'

import { DocumentUpload } from '@/components/upload/DocumentUpload'
import { toast } from 'sonner'

const quickActions = [
  {
    title: 'Upload Document',
    description: 'Add new legal documents for AI analysis',
    icon: Upload,
    action: '/documents',
    color: 'bg-blue-500',
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    title: 'Ask AI Assistant',
    description: 'Get instant answers about your legal documents',
    icon: MessageSquare,
    action: '/chat',
    color: 'bg-green-500',
    gradient: 'from-green-500 to-green-600'
  },
  {
    title: 'Search Documents',
    description: 'Find specific clauses or information quickly',
    icon: Search,
    action: '/search',
    color: 'bg-purple-500',
    gradient: 'from-purple-500 to-purple-600'
  },
  {
    title: 'Analyze Clauses',
    description: 'Review contract clauses and identify risks',
    icon: FileCheck,
    action: '/clauses',
    color: 'bg-orange-500',
    gradient: 'from-orange-500 to-orange-600'
  },
]

export function ModernDashboard() {
  // Mock user for demo
  const user = { id: 'demo-user', email: 'demo@lawfirm.com', displayName: 'Demo User' }
  const [documents, setDocuments] = useState<Document[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showUpload, setShowUpload] = useState(false)

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      
      // Always use demo data since database is not available
      const [userDocuments, analyticsData] = await Promise.all([
        documentService.getDocuments(user.id),
        analyticsService.getAnalytics(user.id)
      ])

      setDocuments(userDocuments)
      setAnalytics(analyticsData)
      
      // Track dashboard view (demo mode)
      await analyticsService.trackEvent('dashboard_viewed')
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      toast.error('Failed to load dashboard data')
      
      // Final fallback to empty state
      setDocuments([])
      setAnalytics({
        totalDocuments: 0,
        totalQueries: 0,
        timeSaved: 0,
        riskAlerts: 0,
        documentsThisMonth: 0,
        queriesThisMonth: 0,
        averageProcessingTime: 0,
        accuracyRate: 0,
        topDocumentTypes: [],
        riskTrends: []
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDocumentUpload = (document: Document) => {
    setDocuments(prev => [document, ...prev])
    setShowUpload(false)
    toast.success('Document uploaded and analyzed successfully!')
    
    // Reload analytics to reflect new document
    loadData()
  }

  const getRecentDocuments = () => {
    return documents
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
      .slice(0, 5)
  }

  const getRecentActivity = () => {
    const activities = []
    
    // Add document activities
    documents.forEach(doc => {
      if (doc.status === 'Analyzed') {
        activities.push({
          id: `doc_${doc.id}`,
          type: 'document_analyzed',
          title: 'Document analysis completed',
          description: `${doc.name} - ${doc.clauses} clauses identified, ${doc.risks} risks flagged`,
          timestamp: doc.analyzedAt || doc.uploadedAt,
          icon: CheckCircle,
          color: 'text-green-400',
          priority: doc.priority
        })
      }
      
      if (doc.risks > 0) {
        activities.push({
          id: `risk_${doc.id}`,
          type: 'risk_detected',
          title: 'Risk factors detected',
          description: `${doc.name} - ${doc.risks} ${doc.risks === 1 ? 'risk' : 'risks'} requiring attention`,
          timestamp: doc.analyzedAt || doc.uploadedAt,
          icon: AlertTriangle,
          color: 'text-orange-400',
          priority: doc.priority
        })
      }
    })

    // Sort by timestamp and return recent ones
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 8)
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    const diffInWeeks = Math.floor(diffInDays / 7)
    return `${diffInWeeks}w ago`
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'text-red-500'
      case 'High': return 'text-orange-500'
      case 'Medium': return 'text-yellow-500'
      case 'Low': return 'text-green-500'
      default: return 'text-muted-foreground'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Analyzed': return 'text-green-500'
      case 'Processing': return 'text-blue-500'
      case 'Failed': return 'text-red-500'
      case 'Reviewed': return 'text-purple-500'
      default: return 'text-muted-foreground'
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50 animate-pulse" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">Failed to load dashboard data</p>
          <Button onClick={loadData} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.displayName}
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your legal documents and AI assistant.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <BarChart3 className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button 
            size="sm" 
            onClick={() => setShowUpload(true)}
            className="btn-premium"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Upload Legal Document</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowUpload(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <DocumentUpload onUploadComplete={handleDocumentUpload} />
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:bg-accent/50 transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalDocuments}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-400">+{analytics.documentsThisMonth}</span> this month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:bg-accent/50 transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Queries</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalQueries}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-400">+{analytics.queriesThisMonth}</span> this month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:bg-accent/50 transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.timeSaved}h</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-400">+{Math.floor(analytics.documentsThisMonth * 2.5)}h</span> this month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:bg-accent/50 transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.riskAlerts}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-orange-400">Active monitoring</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-500" />
              Processing Speed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.averageProcessingTime}s</div>
            <p className="text-xs text-muted-foreground">Average analysis time</p>
            <Progress value={85} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-green-500" />
              AI Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.accuracyRate}%</div>
            <p className="text-xs text-muted-foreground">Analysis accuracy rate</p>
            <Progress value={analytics.accuracyRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-500" />
              Security Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.9%</div>
            <p className="text-xs text-muted-foreground">Enterprise security</p>
            <Progress value={99.9} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Get started with common tasks and AI-powered workflows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Link
                key={action.action}
                to={action.action}
                className="group"
              >
                <div className="flex flex-col items-center gap-3 rounded-lg border p-4 text-center transition-all hover:bg-accent hover:scale-105 animate-fade-in">
                  <div className={`rounded-lg p-3 bg-gradient-to-r ${action.gradient} text-white group-hover:scale-110 transition-transform shadow-lg`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium group-hover:text-accent-foreground">
                      {action.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recent">Recent Documents</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Documents</CardTitle>
              <CardDescription>
                Your latest uploaded and analyzed legal documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {getRecentDocuments().map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent/50 transition-colors animate-fade-in"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{doc.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {doc.type}
                            </Badge>
                            <Badge 
                              variant={doc.priority === 'Critical' ? 'destructive' : 
                                     doc.priority === 'High' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {doc.priority}
                            </Badge>
                            <span>•</span>
                            <span>{formatTimeAgo(doc.uploadedAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right text-sm">
                          <div className="font-medium">{doc.clauses} clauses</div>
                          <div className="text-muted-foreground">
                            {doc.risks > 0 ? (
                              <span className="text-orange-400">{doc.risks} risks</span>
                            ) : (
                              <span className="text-green-400">No risks</span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Badge
                            variant={
                              doc.status === 'Analyzed'
                                ? 'default'
                                : doc.status === 'Processing'
                                ? 'secondary'
                                : doc.status === 'Failed'
                                ? 'destructive'
                                : 'outline'
                            }
                            className="text-xs"
                          >
                            {doc.status === 'Analyzed' && <CheckCircle className="mr-1 h-3 w-3" />}
                            {doc.status}
                          </Badge>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {documents.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No documents uploaded yet</h3>
                      <p className="text-sm mb-4">Upload your first legal document to get started with AI analysis</p>
                      <Button onClick={() => setShowUpload(true)} className="btn-premium">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Document
                      </Button>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest AI analysis results and system activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {getRecentActivity().map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 rounded-lg border p-4 animate-fade-in">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        activity.type === 'document_analyzed' ? 'bg-green-500/10' : 'bg-orange-500/10'
                      }`}>
                        <activity.icon className={`h-5 w-5 ${activity.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.description}
                        </p>
                        {activity.priority && (
                          <Badge 
                            variant={activity.priority === 'Critical' ? 'destructive' : 
                                   activity.priority === 'High' ? 'default' : 'secondary'}
                            className="text-xs mt-1"
                          >
                            {activity.priority} Priority
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatTimeAgo(activity.timestamp)}
                      </div>
                    </div>
                  ))}

                  {getRecentActivity().length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Activity className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No recent activity</h3>
                      <p className="text-sm">Activity will appear here as you use the AI assistant</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Insights & Recommendations</CardTitle>
              <CardDescription>
                Intelligent analysis and patterns from your legal documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-6">
                  {analytics.topDocumentTypes.length > 0 && (
                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium mb-3 flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-blue-500" />
                        Document Type Distribution
                      </h3>
                      <div className="space-y-2">
                        {analytics.topDocumentTypes.map((type, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm">{type.type}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-muted rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full" 
                                  style={{ width: `${(type.count / analytics.totalDocuments) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{type.count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      Contract Analysis Insights
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span>{Math.floor((documents.filter(d => d.clauses > 10).length / Math.max(documents.length, 1)) * 100)}% of contracts include comprehensive clause structures</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-orange-400" />
                        <span>{Math.floor((documents.filter(d => d.risks > 0).length / Math.max(documents.length, 1)) * 100)}% have identified risk factors</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Brain className="h-4 w-4 text-blue-400" />
                        <span>AI confidence rate: {analytics.accuracyRate}% across all analyses</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-500" />
                      Recommended Actions
                    </h3>
                    <div className="space-y-3">
                      {documents.filter(d => d.risks > 2).length > 0 && (
                        <div className="flex items-start gap-3">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 mt-0.5">
                            <AlertTriangle className="h-3 w-3 text-red-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Review high-risk documents</p>
                            <p className="text-xs text-muted-foreground">
                              {documents.filter(d => d.risks > 2).length} documents need immediate attention
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 mt-0.5">
                          <Plus className="h-3 w-3 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Standardize contract templates</p>
                          <p className="text-xs text-muted-foreground">
                            Create templates based on your most successful contracts
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 mt-0.5">
                          <Zap className="h-3 w-3 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Set up automated workflows</p>
                          <p className="text-xs text-muted-foreground">
                            Automate document processing for faster turnaround
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {documents.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Brain className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No insights available yet</h3>
                      <p className="text-sm mb-4">Upload documents to see AI-powered insights and recommendations</p>
                      <Button onClick={() => setShowUpload(true)} className="btn-premium">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload First Document
                      </Button>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}