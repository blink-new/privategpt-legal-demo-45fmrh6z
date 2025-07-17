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
  Users,
  BarChart3,
  Zap,
  FileCheck,
  Search,
  Plus,
  Activity,
  Brain,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { DataService } from '@/lib/data'
import { Document, AnalyticsData } from '@/lib/blink'
import { documentService } from '@/lib/documentService'

const quickActions = [
  {
    title: 'Upload Document',
    description: 'Add new legal documents for AI analysis',
    icon: Upload,
    action: 'documents',
    color: 'bg-blue-500',
  },
  {
    title: 'Ask AI Assistant',
    description: 'Get instant answers about your legal documents',
    icon: MessageSquare,
    action: 'chat',
    color: 'bg-green-500',
  },
  {
    title: 'Search Documents',
    description: 'Find specific clauses or information quickly',
    icon: Search,
    action: 'search',
    color: 'bg-purple-500',
  },
  {
    title: 'Analyze Clauses',
    description: 'Review contract clauses and identify risks',
    icon: FileCheck,
    action: 'clauses',
    color: 'bg-orange-500',
  },
]

export function Dashboard() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Load documents from mock service
      const mockDocuments = await documentService.getDocuments('demo-user')
      
      // Convert to dashboard format
      const convertedDocs = mockDocuments.map(doc => ({
        id: doc.id,
        name: doc.title,
        type: doc.matter_type || 'Contract' as any,
        status: doc.status === 'completed' ? 'Analyzed' : doc.status === 'processing' ? 'Processing' : 'Uploaded' as any,
        uploadedAt: doc.created_at,
        analyzedAt: doc.updated_at,
        size: doc.file_size ? `${(doc.file_size / 1024 / 1024).toFixed(1)} MB` : '0 MB',
        clauses: doc.key_clauses?.length || Math.floor(Math.random() * 15) + 5,
        risks: doc.risk_level === 'high' ? 3 : doc.risk_level === 'medium' ? 1 : 0,
        summary: doc.summary || '',
        content: doc.content,
        userId: doc.user_id,
        folderId: undefined,
        tags: doc.tags || [],
        fileUrl: doc.file_url,
        confidence: 0.85 + Math.random() * 0.1,
        priority: 'Medium' as any,
        assignedTo: undefined,
        reviewedBy: undefined,
        metadata: {}
      }))
      
      setDocuments(convertedDocs)
      
      // Mock analytics data
      const analyticsData = {
        totalDocuments: convertedDocs.length,
        documentsThisMonth: Math.floor(convertedDocs.length * 0.3),
        totalQueries: 47,
        queriesThisMonth: 12,
        timeSaved: convertedDocs.length * 2.5,
        riskAlerts: convertedDocs.filter(d => d.risks > 0).length,
        averageProcessingTime: 3.2,
        accuracyScore: 94.5
      }
      
      setAnalytics(analyticsData)
    } catch (error) {
      console.warn('Failed to load data:', error)
      // Fallback to demo data
      DataService.initializeData()
      const allDocuments = DataService.getDocuments()
      const analyticsData = DataService.getAnalytics()
      setDocuments(allDocuments)
      setAnalytics(analyticsData)
    }
  }

  const handleFileUpload = () => {
    setIsUploading(true)
    setUploadProgress(0)
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
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
          timestamp: doc.uploadedAt,
          icon: CheckCircle,
          color: 'text-green-400',
        })
      }
    })

    // Sort by timestamp and return recent ones
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5)
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  if (!analytics) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50 animate-pulse" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your legal documents.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <BarChart3 className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button size="sm" onClick={handleFileUpload}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <Card className="border-blue-500/20 bg-blue-500/5 animate-fade-in">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-300">Uploading and analyzing document...</p>
                <Progress value={uploadProgress} className="mt-2" />
              </div>
              <div className="text-sm text-blue-200">{uploadProgress}%</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:bg-accent/50 transition-colors">
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

        <Card className="hover:bg-accent/50 transition-colors">
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

        <Card className="hover:bg-accent/50 transition-colors">
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

        <Card className="hover:bg-accent/50 transition-colors">
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

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Get started with common tasks and workflows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Link
                key={action.action}
                to={`/${action.action}`}
                className="group"
              >
                <div className="flex flex-col items-center gap-3 rounded-lg border p-4 text-center transition-all hover:bg-accent hover:scale-105 animate-fade-in">
                  <div className={`rounded-lg p-2 ${action.color} text-white group-hover:scale-110 transition-transform`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium group-hover:text-accent-foreground">
                      {action.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
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
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{doc.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {doc.type}
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
                        <Badge
                          variant={
                            doc.status === 'Analyzed'
                              ? 'default'
                              : doc.status === 'Processing'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {doc.status === 'Analyzed' && <CheckCircle className="mr-1 h-3 w-3" />}
                          {doc.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  {documents.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No documents uploaded yet</p>
                      <p className="text-sm">Upload your first legal document to get started</p>
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
                Latest actions and AI interactions in your workspace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {getRecentActivity().map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 rounded-lg border p-4 animate-fade-in">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10`}>
                        <activity.icon className={`h-4 w-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.description}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatTimeAgo(activity.timestamp)}
                      </div>
                    </div>
                  ))}

                  {getRecentActivity().length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No recent activity</p>
                      <p className="text-sm">Activity will appear here as you use the system</p>
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
              <CardTitle>AI Insights</CardTitle>
              <CardDescription>
                Intelligent recommendations and patterns from your legal documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-6">
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-2">Contract Pattern Analysis</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Based on your {documents.length} documents, here are some patterns we've identified:
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-400" />
                        <span>{Math.floor((documents.filter(d => d.clauses > 10).length / documents.length) * 100) || 78}% of contracts include comprehensive clause structures</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-400" />
                        <span>{Math.floor((documents.filter(d => d.risks > 0).length / documents.length) * 100) || 23}% have identified risk factors</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-400" />
                        <span>Most documents follow standard legal formatting</span>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-2">Recommended Actions</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 mt-0.5">
                          <Plus className="h-3 w-3 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Review high-risk documents</p>
                          <p className="text-xs text-muted-foreground">
                            {documents.filter(d => d.risks > 2).length} documents need attention
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 mt-0.5">
                          <Plus className="h-3 w-3 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Standardize contract templates</p>
                          <p className="text-xs text-muted-foreground">
                            Create templates based on your most successful contracts
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 mt-0.5">
                          <Plus className="h-3 w-3 text-purple-600" />
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
                    <div className="text-center py-8 text-muted-foreground">
                      <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No insights available yet</p>
                      <p className="text-sm">Upload documents to see AI-powered insights and recommendations</p>
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