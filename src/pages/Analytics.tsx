import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BarChart3,
  TrendingUp,
  FileText,
  Clock,
  Users,
  AlertTriangle,
  Download,
  Calendar,
} from 'lucide-react'

export function Analytics() {
  return (
    <div className="flex-1 space-y-6 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Insights and performance metrics for your legal document management
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Last 30 days
          </Button>
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents Processed</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127h</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2</span> new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">+3</span> new this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Document Processing Trends</CardTitle>
                <CardDescription>
                  Monthly document analysis volume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Chart visualization would appear here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Risk Distribution</CardTitle>
                <CardDescription>
                  Breakdown of risk levels across documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm">High Risk</span>
                    </div>
                    <div className="text-sm font-medium">23 (18%)</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-sm">Medium Risk</span>
                    </div>
                    <div className="text-sm font-medium">45 (36%)</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Low Risk</span>
                    </div>
                    <div className="text-sm font-medium">58 (46%)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top Document Types</CardTitle>
              <CardDescription>
                Most frequently processed document categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">Employment Contracts</div>
                      <div className="text-sm text-muted-foreground">Legal agreements</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">342</div>
                    <div className="text-sm text-muted-foreground">27%</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium">NDAs</div>
                      <div className="text-sm text-muted-foreground">Non-disclosure agreements</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">289</div>
                    <div className="text-sm text-muted-foreground">23%</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="font-medium">Service Agreements</div>
                      <div className="text-sm text-muted-foreground">Service contracts</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">234</div>
                    <div className="text-sm text-muted-foreground">19%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Processing Speed</CardTitle>
                <CardDescription>
                  Average time to analyze documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Small documents (&lt;1MB)</span>
                    <Badge variant="outline">1.2s avg</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Medium documents (1-5MB)</span>
                    <Badge variant="outline">3.4s avg</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Large documents (&gt;5MB)</span>
                    <Badge variant="outline">8.7s avg</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Accuracy Metrics</CardTitle>
                <CardDescription>
                  AI analysis accuracy rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Clause extraction</span>
                    <Badge variant="default" className="bg-green-600">97.3%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Risk identification</span>
                    <Badge variant="default" className="bg-green-600">94.8%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Document classification</span>
                    <Badge variant="default" className="bg-green-600">99.1%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">User Activity</CardTitle>
              <CardDescription>
                Most active users and their contributions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                      JD
                    </div>
                    <div>
                      <div className="font-medium">John Doe</div>
                      <div className="text-sm text-muted-foreground">Senior Partner</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">234 documents</div>
                    <div className="text-sm text-muted-foreground">89 queries</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground text-sm font-medium">
                      SM
                    </div>
                    <div>
                      <div className="font-medium">Sarah Miller</div>
                      <div className="text-sm text-muted-foreground">Associate</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">187 documents</div>
                    <div className="text-sm text-muted-foreground">156 queries</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-accent-foreground text-sm font-medium">
                      RJ
                    </div>
                    <div>
                      <div className="font-medium">Robert Johnson</div>
                      <div className="text-sm text-muted-foreground">Paralegal</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">145 documents</div>
                    <div className="text-sm text-muted-foreground">203 queries</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">System Performance</CardTitle>
                <CardDescription>
                  Overall system health and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Uptime</span>
                    <Badge variant="default" className="bg-green-600">99.9%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Response time</span>
                    <Badge variant="outline">1.2s avg</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Error rate</span>
                    <Badge variant="outline">0.1%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Cost Savings</CardTitle>
                <CardDescription>
                  Estimated time and cost savings from automation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">$47,230</div>
                    <div className="text-sm text-muted-foreground">Total savings this month</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-medium">127 hours</div>
                      <div className="text-muted-foreground">Time saved</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">$372/hr</div>
                      <div className="text-muted-foreground">Avg. rate</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}