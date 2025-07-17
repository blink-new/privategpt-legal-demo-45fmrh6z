import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import {
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  FileText,
  TrendingUp,
  BarChart3,
  Download,
  Eye,
  Shield,
  Scale,
  Clock,
  ExternalLink,
  BookOpen,
  Target,
  Zap,
  Brain,
} from 'lucide-react'
import { DataService } from '@/lib/data'
import { Document } from '@/lib/blink'
import { documentService } from '@/lib/documentService'
import { TourButton } from '@/components/tour/TourButton'

interface ClauseAnalysis {
  id: string
  type: string
  content: string
  riskLevel: 'low' | 'medium' | 'high'
  recommendation: string
  documentId: string
  documentName: string
  section: string
  page: number
  confidence: number
  severity?: string
  impact?: string
  likelihood?: string
}

export function ClauseAnalysis() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [clauses, setClauses] = useState<ClauseAnalysis[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>('all')
  const [selectedClause, setSelectedClause] = useState<ClauseAnalysis | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        DataService.initializeData()
        // Load documents from mock service
        const allDocuments = await documentService.getDocuments('demo-user')
        setDocuments(allDocuments)
      } catch (error) {
        console.warn('Failed to load documents:', error)
        // Fallback to local data service
        const allDocuments = DataService.getDocuments()
        setDocuments(allDocuments)
      }
    }
    
    loadData()
    
    // Generate comprehensive clause analysis data
    const sampleClauses: ClauseAnalysis[] = [
      {
        id: 'clause_1',
        type: 'Termination',
        content: 'Either party may terminate this agreement with thirty (30) days written notice to the other party.',
        riskLevel: 'low',
        recommendation: 'Standard termination clause with reasonable notice period. Consider adding specific termination triggers for cause.',
        documentId: 'doc_1',
        documentName: 'Smith vs. Johnson Contract.pdf',
        section: '8.1',
        page: 3,
        confidence: 95,
        severity: 'Low',
        impact: 'Minimal business disruption',
        likelihood: 'Standard practice'
      },
      {
        id: 'clause_2',
        type: 'Non-Compete',
        content: 'Employee agrees not to engage in any competing business for a period of two (2) years following termination of employment.',
        riskLevel: 'high',
        recommendation: 'Consider reducing non-compete period to 12 months for better enforceability. Add geographic limitations and specific industry scope.',
        documentId: 'doc_1',
        documentName: 'Smith vs. Johnson Contract.pdf',
        section: '12.3',
        page: 5,
        confidence: 88,
        severity: 'High',
        impact: 'May be unenforceable',
        likelihood: 'Courts often reject 2+ year terms'
      },
      {
        id: 'clause_3',
        type: 'Confidentiality',
        content: 'Employee acknowledges that during employment, Employee may have access to confidential information and trade secrets of the Company.',
        riskLevel: 'low',
        recommendation: 'Well-structured confidentiality clause with appropriate scope. Consider adding return of materials provision.',
        documentId: 'doc_1',
        documentName: 'Smith vs. Johnson Contract.pdf',
        section: '9.2',
        page: 4,
        confidence: 92,
        severity: 'Low',
        impact: 'Adequate protection',
        likelihood: 'Enforceable as written'
      },
      {
        id: 'clause_4',
        type: 'Indemnification',
        content: 'Company shall indemnify and hold harmless the other party from any claims arising from this agreement.',
        riskLevel: 'medium',
        recommendation: 'Consider adding caps on indemnification liability and excluding certain types of damages (punitive, consequential).',
        documentId: 'doc_2',
        documentName: 'Corporate Merger Agreement.docx',
        section: '15.4',
        page: 12,
        confidence: 85,
        severity: 'Medium',
        impact: 'Unlimited liability exposure',
        likelihood: 'Could result in significant costs'
      },
      {
        id: 'clause_5',
        type: 'Force Majeure',
        content: 'Neither party shall be liable for any failure to perform due to circumstances beyond their reasonable control.',
        riskLevel: 'low',
        recommendation: 'Comprehensive force majeure clause covering standard events. Consider adding pandemic/health emergency provisions.',
        documentId: 'doc_4',
        documentName: 'NDA - Tech Partnership.pdf',
        section: '7.1',
        page: 2,
        confidence: 90,
        severity: 'Low',
        impact: 'Good protection',
        likelihood: 'Modern and comprehensive'
      },
      {
        id: 'clause_6',
        type: 'Liability Limitation',
        content: 'In no event shall either party be liable for indirect, incidental, or consequential damages.',
        riskLevel: 'low',
        recommendation: 'Standard liability limitation clause. Well-drafted and enforceable.',
        documentId: 'doc_6',
        documentName: 'Software License Agreement.pdf',
        section: '11.2',
        page: 6,
        confidence: 94,
        severity: 'Low',
        impact: 'Appropriate risk allocation',
        likelihood: 'Industry standard'
      },
      {
        id: 'clause_7',
        type: 'Intellectual Property',
        content: 'All work product created during employment shall be deemed work made for hire and owned by Company.',
        riskLevel: 'medium',
        recommendation: 'Consider clarifying scope of work product and excluding pre-existing IP and personal projects.',
        documentId: 'doc_5',
        documentName: 'Executive Employment Agreement.pdf',
        section: '6.3',
        page: 4,
        confidence: 87,
        severity: 'Medium',
        impact: 'Overly broad scope',
        likelihood: 'May discourage innovation'
      },
      {
        id: 'clause_8',
        type: 'Dispute Resolution',
        content: 'Any disputes shall be resolved through binding arbitration in accordance with AAA Commercial Rules.',
        riskLevel: 'low',
        recommendation: 'Standard arbitration clause. Consider adding mediation as first step before arbitration.',
        documentId: 'doc_4',
        documentName: 'NDA - Tech Partnership.pdf',
        section: '8.5',
        page: 3,
        confidence: 91,
        severity: 'Low',
        impact: 'Efficient dispute resolution',
        likelihood: 'Cost-effective approach'
      }
    ]
    
    setClauses(sampleClauses)
    if (sampleClauses.length > 0) {
      setSelectedClause(sampleClauses[0])
    }
  }, [])

  const filteredClauses = clauses.filter(clause => {
    const matchesSearch = searchQuery === '' || 
      clause.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clause.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clause.documentName.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesRisk = selectedRiskLevel === 'all' || clause.riskLevel === selectedRiskLevel
    
    return matchesSearch && matchesRisk
  })

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return 'text-red-400 bg-red-500/10 border-red-500/20'
      case 'medium':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/20'
      case 'low':
        return 'text-green-400 bg-green-500/10 border-green-500/20'
      default:
        return 'text-muted-foreground'
    }
  }

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return <AlertTriangle className="h-4 w-4" />
      case 'medium':
        return <Shield className="h-4 w-4" />
      case 'low':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const clauseStats = {
    total: clauses.length,
    high: clauses.filter(c => c.riskLevel === 'high').length,
    medium: clauses.filter(c => c.riskLevel === 'medium').length,
    low: clauses.filter(c => c.riskLevel === 'low').length,
  }

  const clauseTypes = [
    { name: 'Termination', count: clauses.filter(c => c.type === 'Termination').length },
    { name: 'Non-Compete', count: clauses.filter(c => c.type === 'Non-Compete').length },
    { name: 'Confidentiality', count: clauses.filter(c => c.type === 'Confidentiality').length },
    { name: 'Indemnification', count: clauses.filter(c => c.type === 'Indemnification').length },
    { name: 'Force Majeure', count: clauses.filter(c => c.type === 'Force Majeure').length },
    { name: 'Liability Limitation', count: clauses.filter(c => c.type === 'Liability Limitation').length },
    { name: 'Intellectual Property', count: clauses.filter(c => c.type === 'Intellectual Property').length },
    { name: 'Dispute Resolution', count: clauses.filter(c => c.type === 'Dispute Resolution').length },
  ].filter(type => type.count > 0)

  return (
    <div className="flex-1 space-y-6 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clause Analysis</h1>
          <p className="text-muted-foreground">
            AI-powered analysis of legal clauses across your document library
          </p>
        </div>
        <div className="flex items-center gap-3">
          <TourButton />
          <Button variant="outline" size="sm" className="glass-card border-white/20">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button size="sm" className="btn-premium">
            <Brain className="mr-2 h-4 w-4" />
            Re-analyze
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass-card hover:scale-105 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clauses</CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
              <Scale className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clauseStats.total}</div>
            <p className="text-xs text-muted-foreground">
              Across {documents.length} documents
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card hover:scale-105 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk</CardTitle>
            <div className="p-2 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
              <AlertTriangle className="h-4 w-4 text-red-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{clauseStats.high}</div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card hover:scale-105 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medium Risk</CardTitle>
            <div className="p-2 rounded-lg bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
              <Shield className="h-4 w-4 text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-400">{clauseStats.medium}</div>
            <p className="text-xs text-muted-foreground">
              Should be reviewed
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card hover:scale-105 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Risk</CardTitle>
            <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
              <CheckCircle className="h-4 w-4 text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{clauseStats.low}</div>
            <p className="text-xs text-muted-foreground">
              Compliant and standard
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Clause List */}
        <div className="lg:col-span-2">
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search clauses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 glass-card border-white/20"
                  />
                </div>
                <Button variant="outline" size="sm" className="glass-card border-white/20">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-3">
                  {filteredClauses.map((clause, index) => (
                    <Card
                      key={clause.id}
                      className={`cursor-pointer transition-all hover:bg-accent/50 animate-slide-up glass-card border-white/10 ${
                        selectedClause?.id === clause.id ? 'ring-2 ring-primary bg-accent/30' : ''
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                      onClick={() => setSelectedClause(clause)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs glass-card border-white/20">
                              {clause.type}
                            </Badge>
                            <Badge 
                              className={`text-xs border ${getRiskColor(clause.riskLevel)}`}
                            >
                              {getRiskIcon(clause.riskLevel)}
                              {clause.riskLevel.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {clause.confidence}% confidence
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sm mb-3 text-muted-foreground line-clamp-2">
                          "{clause.content}"
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {clause.documentName}
                            </span>
                            <span>§{clause.section}</span>
                          </div>
                          <span>Page {clause.page}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {filteredClauses.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Scale className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No clauses found</p>
                      <p className="text-sm">Try adjusting your search criteria</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Clause Detail Panel */}
        <div className="lg:col-span-2">
          {selectedClause ? (
            <Card className="glass-card">
              <CardHeader className="border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="glass-card border-white/20">{selectedClause.type}</Badge>
                    <Badge className={`border ${getRiskColor(selectedClause.riskLevel)}`}>
                      {getRiskIcon(selectedClause.riskLevel)}
                      {selectedClause.riskLevel.toUpperCase()} RISK
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="glass-card border-white/20">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View in Document
                    </Button>
                    <Button variant="outline" size="sm" className="glass-card border-white/20">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Legal Guide
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-6 p-4">
                    {/* Clause Content */}
                    <div>
                      <h3 className="font-semibold mb-2">Clause Text</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        From {selectedClause.documentName} • Section {selectedClause.section} • Page {selectedClause.page}
                      </p>
                      <div className="bg-muted/30 rounded-lg p-4 text-sm font-mono">
                        "{selectedClause.content}"
                      </div>
                    </div>

                    {/* Risk Assessment */}
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Risk Assessment
                      </h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="font-medium text-muted-foreground">Severity</div>
                            <div className={selectedClause.riskLevel === 'high' ? 'text-red-400' : 
                                         selectedClause.riskLevel === 'medium' ? 'text-orange-400' : 'text-green-400'}>
                              {selectedClause.severity}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium text-muted-foreground">Impact</div>
                            <div>{selectedClause.impact}</div>
                          </div>
                          <div>
                            <div className="font-medium text-muted-foreground">Likelihood</div>
                            <div>{selectedClause.likelihood}</div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">AI Confidence</span>
                            <span className="text-sm text-muted-foreground">{selectedClause.confidence}%</span>
                          </div>
                          <Progress value={selectedClause.confidence} className="h-2" />
                        </div>
                      </div>
                    </div>

                    {/* AI Recommendation */}
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        AI Recommendation
                      </h3>
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <p className="text-sm text-blue-200">
                          {selectedClause.recommendation}
                        </p>
                      </div>
                    </div>

                    {/* Similar Clauses */}
                    <div>
                      <h3 className="font-semibold mb-2">Similar Clauses</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Other {selectedClause.type.toLowerCase()} clauses in your documents
                      </p>
                      <div className="space-y-3">
                        {clauses
                          .filter(c => c.type === selectedClause.type && c.id !== selectedClause.id)
                          .slice(0, 3)
                          .map((clause) => (
                            <div
                              key={clause.id}
                              className="glass-card border-white/10 rounded-lg p-3 cursor-pointer hover:bg-accent/50 transition-colors"
                              onClick={() => setSelectedClause(clause)}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">{clause.documentName}</span>
                                <Badge className={`text-xs border ${getRiskColor(clause.riskLevel)}`}>
                                  {clause.riskLevel.toUpperCase()}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                "{clause.content}"
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          ) : (
            <Card className="glass-card">
              <CardContent className="flex items-center justify-center h-[700px]">
                <div className="text-center">
                  <Scale className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No Clause Selected</h3>
                  <p className="text-muted-foreground">Select a clause from the list to view detailed analysis</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Filter Sidebar */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base">Filter by Risk Level</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedRiskLevel === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedRiskLevel('all')}
              className="glass-card border-white/20"
            >
              All Clauses ({clauseStats.total})
            </Button>
            <Button
              variant={selectedRiskLevel === 'high' ? 'default' : 'ghost'}
              size="sm"
              className="text-red-400 glass-card border-white/20"
              onClick={() => setSelectedRiskLevel('high')}
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              High Risk ({clauseStats.high})
            </Button>
            <Button
              variant={selectedRiskLevel === 'medium' ? 'default' : 'ghost'}
              size="sm"
              className="text-orange-400 glass-card border-white/20"
              onClick={() => setSelectedRiskLevel('medium')}
            >
              <Shield className="mr-2 h-4 w-4" />
              Medium Risk ({clauseStats.medium})
            </Button>
            <Button
              variant={selectedRiskLevel === 'low' ? 'default' : 'ghost'}
              size="sm"
              className="text-green-400 glass-card border-white/20"
              onClick={() => setSelectedRiskLevel('low')}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Low Risk ({clauseStats.low})
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}