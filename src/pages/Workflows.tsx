import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Workflow,
  Plus,
  Play,
  Pause,
  Settings,
  Zap,
  FileText,
  Mail,
  Bell,
  CheckCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react'

const workflows = [
  {
    id: 1,
    name: 'Document Auto-Analysis',
    description: 'Automatically analyze new documents and extract key clauses',
    status: 'active',
    trigger: 'Document Upload',
    actions: ['Analyze Document', 'Extract Clauses', 'Send Email Summary'],
    lastRun: '2 hours ago',
    successRate: 98,
    runsToday: 12,
  },
  {
    id: 2,
    name: 'Risk Alert System',
    description: 'Monitor documents for high-risk clauses and send alerts',
    status: 'active',
    trigger: 'Risk Detection',
    actions: ['Identify Risks', 'Create Alert', 'Notify Team'],
    lastRun: '4 hours ago',
    successRate: 95,
    runsToday: 8,
  },
  {
    id: 3,
    name: 'Contract Renewal Reminder',
    description: 'Send reminders for contracts approaching expiration',
    status: 'paused',
    trigger: 'Schedule (Monthly)',
    actions: ['Check Expiry Dates', 'Generate Report', 'Send Reminders'],
    lastRun: '1 week ago',
    successRate: 100,
    runsToday: 0,
  },
  {
    id: 4,
    name: 'Compliance Check',
    description: 'Regular compliance review of all legal documents',
    status: 'active',
    trigger: 'Schedule (Weekly)',
    actions: ['Scan Documents', 'Check Compliance', 'Generate Report'],
    lastRun: '1 day ago',
    successRate: 92,
    runsToday: 1,
  },
]

const recentRuns = [
  {
    id: 1,
    workflow: 'Document Auto-Analysis',
    status: 'success',
    duration: '2.3s',
    timestamp: '2 hours ago',
    details: 'Analyzed Smith vs. Johnson Contract.pdf',
  },
  {
    id: 2,
    workflow: 'Risk Alert System',
    status: 'success',
    duration: '1.8s',
    timestamp: '4 hours ago',
    details: 'Found 2 high-risk clauses in Corporate Merger Agreement',
  },
  {
    id: 3,
    workflow: 'Document Auto-Analysis',
    status: 'failed',
    duration: '0.5s',
    timestamp: '6 hours ago',
    details: 'Failed to process corrupted PDF file',
  },
  {
    id: 4,
    workflow: 'Compliance Check',
    status: 'success',
    duration: '45.2s',
    timestamp: '1 day ago',
    details: 'Reviewed 47 documents, 3 compliance issues found',
  },
]

export function Workflows() {
  const [selectedWorkflow, setSelectedWorkflow] = useState(workflows[0])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400'
      case 'paused': return 'text-orange-400'
      case 'failed': return 'text-red-400'
      default: return 'text-muted-foreground'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-600" />
      default: return <Clock className="h-4 w-4 text-orange-600" />
    }
  }

  const toggleWorkflow = (workflowId: number) => {
    // Toggle workflow status logic would go here
    console.log('Toggle workflow:', workflowId)
  }

  return (
    <div className="flex-1 space-y-6 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
          <p className="text-muted-foreground">
            Automate your legal document processing and analysis
          </p>
        </div>
        <Button className="btn-premium">
          <Plus className="mr-2 h-4 w-4" />
          Create Workflow
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card hover:scale-105 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
              <Workflow className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              1 paused
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card hover:scale-105 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Runs Today</CardTitle>
            <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
              <Zap className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">21</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-400">+15%</span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card hover:scale-105 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <div className="p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
              <CheckCircle className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-400">+2%</span> this week
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card hover:scale-105 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Runtime</CardTitle>
            <div className="p-2 rounded-lg bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
              <Clock className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2s</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-400">-0.8s</span> improvement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Workflows List */}
        <div className="lg:col-span-2">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Your Workflows</CardTitle>
              <CardDescription>
                Manage and monitor your automated legal workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflows.map((workflow, index) => (
                  <div
                    key={workflow.id}
                    className={`p-4 rounded-lg glass-card border-white/10 cursor-pointer transition-all hover:bg-accent/50 animate-slide-up ${
                      selectedWorkflow.id === workflow.id ? 'ring-2 ring-primary bg-accent/30' : ''
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => setSelectedWorkflow(workflow)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-foreground">{workflow.name}</h3>
                        <Badge
                          variant={workflow.status === 'active' ? 'default' : 'secondary'}
                          className={`glass-card border-white/20 ${getStatusColor(workflow.status)}`}
                        >
                          {workflow.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={workflow.status === 'active'}
                          onCheckedChange={() => toggleWorkflow(workflow.id)}
                        />
                        <Button variant="ghost" size="sm" className="glass-card border-white/10">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {workflow.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Trigger:</span>
                        <span className="ml-2 font-medium text-foreground">{workflow.trigger}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last run:</span>
                        <span className="ml-2 font-medium text-foreground">{workflow.lastRun}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Success rate:</span>
                        <span className="ml-2 font-medium text-green-400">
                          {workflow.successRate}%
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Runs today:</span>
                        <span className="ml-2 font-medium text-foreground">{workflow.runsToday}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workflow Details */}
        <div>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-base">{selectedWorkflow.name}</CardTitle>
              <CardDescription>
                Workflow configuration and actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2 text-foreground">Trigger</h4>
                  <div className="flex items-center gap-2 p-3 glass-card border-white/10 rounded-lg">
                    <Zap className="h-4 w-4 text-blue-400" />
                    <span className="text-sm text-foreground">{selectedWorkflow.trigger}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2 text-foreground">Actions</h4>
                  <div className="space-y-2">
                    {selectedWorkflow.actions.map((action, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 glass-card border-white/10 rounded-lg">
                        {action.includes('Document') && <FileText className="h-4 w-4 text-green-400" />}
                        {action.includes('Email') && <Mail className="h-4 w-4 text-blue-400" />}
                        {action.includes('Alert') && <Bell className="h-4 w-4 text-orange-400" />}
                        {!action.includes('Document') && !action.includes('Email') && !action.includes('Alert') && (
                          <CheckCircle className="h-4 w-4 text-purple-400" />
                        )}
                        <span className="text-sm text-foreground">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-muted-foreground">Status</div>
                    <div className={`capitalize font-medium ${getStatusColor(selectedWorkflow.status)}`}>
                      {selectedWorkflow.status}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-muted-foreground">Success Rate</div>
                    <div className="text-green-400 font-medium">{selectedWorkflow.successRate}%</div>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <Button className="w-full btn-premium" size="sm">
                    <Play className="mr-2 h-4 w-4" />
                    Run Now
                  </Button>
                  <Button variant="outline" className="w-full glass-card border-white/20" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Configure
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Runs */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Recent Workflow Runs</CardTitle>
          <CardDescription>
            Latest executions and their results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentRuns.map((run, index) => (
              <div key={run.id} className="flex items-center justify-between p-4 glass-card border-white/10 rounded-lg animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex items-center gap-4">
                  {getStatusIcon(run.status)}
                  <div>
                    <h4 className="font-medium text-foreground">{run.workflow}</h4>
                    <p className="text-sm text-muted-foreground">{run.details}</p>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <div className="font-medium text-foreground">{run.duration}</div>
                  <div className="text-muted-foreground">{run.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}