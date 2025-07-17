import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  X,
  Upload,
  FileText,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Brain,
  Zap,
  Play,
  Pause,
  RotateCcw,
  Send,
  Bot,
  User,
  Search,
  Filter,
  ExternalLink,
  Clock,
  Shield,
  TrendingUp,
  BarChart3,
} from 'lucide-react'

interface DemoMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface DemoDocument {
  id: string
  name: string
  type: string
  status: string
  clauses: number
  risks: number
  uploadedAt: string
  size: string
}

const demoDocuments: DemoDocument[] = [
  {
    id: '1',
    name: 'Smith vs. Johnson Contract.pdf',
    type: 'Contract',
    status: 'Analyzed',
    clauses: 12,
    risks: 2,
    uploadedAt: '2024-01-15T10:30:00Z',
    size: '2.4 MB'
  },
  {
    id: '2',
    name: 'Corporate Merger Agreement.docx',
    type: 'M&A',
    status: 'Processing',
    clauses: 28,
    risks: 5,
    uploadedAt: '2024-01-14T14:20:00Z',
    size: '5.8 MB'
  },
  {
    id: '3',
    name: 'NDA - Tech Partnership.pdf',
    type: 'NDA',
    status: 'Analyzed',
    clauses: 6,
    risks: 1,
    uploadedAt: '2024-01-12T16:45:00Z',
    size: '890 KB'
  }
]

const initialMessages: DemoMessage[] = [
  {
    id: '1',
    type: 'assistant',
    content: "Hello! I'm your AI legal assistant. I can help you analyze documents, answer legal questions, and provide insights about your contracts. What would you like to know?",
    timestamp: new Date().toISOString()
  }
]

const suggestedQuestions = [
  "What are the key terms in the Smith vs. Johnson contract?",
  "Find all contracts with arbitration clauses",
  "What risks are present in our recent M&A documents?",
  "Summarize the termination clauses across all contracts"
]

export function InteractiveDemo({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState('upload')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [messages, setMessages] = useState<DemoMessage[]>(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDocument, setSelectedDocument] = useState<DemoDocument | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const simulateUpload = () => {
    setIsUploading(true)
    setUploadProgress(0)
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          setActiveTab('analysis')
          return 100
        }
        return prev + 5
      })
    }, 100)
  }

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return

    const userMessage: DemoMessage = {
      id: `msg_${Date.now()}`,
      type: 'user',
      content,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const response = generateAIResponse(content)
      const assistantMessage: DemoMessage = {
        id: `msg_${Date.now() + 1}`,
        type: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      }
      
      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase()
    
    if (lowerQuestion.includes('smith') || lowerQuestion.includes('johnson')) {
      return `Based on my analysis of the Smith vs. Johnson contract, here are the key terms:

• **Contract Type**: Employment Agreement
• **Duration**: Indefinite with 30-day termination notice
• **Non-compete**: 2-year restriction (potentially problematic)
• **Confidentiality**: Standard provisions included
• **Compensation**: Base salary of $120,000 per year
• **Termination**: Either party may terminate with 30-day notice

I've identified 2 potential risks that need attention, particularly the non-compete clause duration which may be unenforceable in some jurisdictions.`
    }
    
    if (lowerQuestion.includes('arbitration')) {
      return `I found 3 contracts in your document library with arbitration clauses:

**Employment Contracts**
• Standard arbitration for disputes over $10,000
• 30-day notice required before arbitration

**Service Agreements**
• Binding arbitration for all disputes
• AAA Commercial Arbitration Rules specified

**Partnership Agreements**
• Multi-tiered dispute resolution
• Mediation first, then arbitration

Would you like me to analyze the specific arbitration terms in any of these contracts?`
    }
    
    if (lowerQuestion.includes('risk')) {
      return `I've identified 8 total risks across your document library:

**High Priority Risks:**
• Corporate Merger Agreement: 5 risks identified
• Smith vs. Johnson Contract: 2 risks identified

**Common Risk Patterns:**
• Missing indemnification caps in merger agreements
• Overly restrictive non-compete clauses
• Insufficient force majeure provisions

**Recommendations:**
• Standardize indemnification language across contracts
• Review non-compete durations for enforceability
• Add comprehensive force majeure clauses

Shall I provide detailed recommendations for any specific document?`
    }
    
    return `I understand you're asking about legal document analysis. Based on your document library, I can help you with:

• Contract reviews and clause analysis
• Risk assessments and compliance checks
• Document comparisons and pattern analysis
• Template recommendations and customization

Could you be more specific about what you'd like me to analyze?`
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-background rounded-xl border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold">Interactive Demo</h2>
            <p className="text-muted-foreground">Experience PrivateGPT Legal in action</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Demo Content */}
        <div className="h-[calc(90vh-120px)]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <div className="px-6 py-4 border-b">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="upload">1. Upload</TabsTrigger>
                <TabsTrigger value="analysis">2. Analysis</TabsTrigger>
                <TabsTrigger value="chat">3. AI Chat</TabsTrigger>
                <TabsTrigger value="search">4. Search</TabsTrigger>
                <TabsTrigger value="insights">5. Insights</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="upload" className="h-full p-6 m-0">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Document Upload</h3>
                    <p className="text-muted-foreground">Upload legal documents for AI analysis</p>
                  </div>

                  <Card className="border-2 border-dashed border-primary/50">
                    <CardContent className="p-8 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-4 rounded-full bg-primary/10">
                          <Upload className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium mb-2">Drop your legal document here</h4>
                          <p className="text-sm text-muted-foreground mb-4">Supports PDF, DOCX, and more</p>
                          <Button onClick={simulateUpload} disabled={isUploading}>
                            {isUploading ? 'Uploading...' : 'Try Demo Upload'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {isUploading && (
                    <Card className="animate-slide-up">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <FileText className="h-8 w-8 text-blue-500" />
                          <div className="flex-1">
                            <p className="font-medium">Employment_Agreement_Demo.pdf</p>
                            <p className="text-sm text-muted-foreground">2.4 MB • Uploading...</p>
                            <Progress value={uploadProgress} className="mt-2" />
                          </div>
                          <div className="text-sm font-medium">{uploadProgress}%</div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="analysis" className="h-full p-6 m-0">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">AI Analysis Results</h3>
                    <p className="text-muted-foreground">View extracted clauses and identified risks</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-2xl font-bold text-green-500">15</div>
                        <p className="text-sm text-muted-foreground">Clauses Found</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-2xl font-bold text-orange-500">3</div>
                        <p className="text-sm text-muted-foreground">Risks Identified</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-2xl font-bold text-blue-500">92%</div>
                        <p className="text-sm text-muted-foreground">Confidence</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Key Findings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Non-compete clause may be too broad</p>
                            <p className="text-xs text-muted-foreground">Section 4.2 - Consider geographic limitations</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Termination clause is well-defined</p>
                            <p className="text-xs text-muted-foreground">Section 8.1 - Clear notice requirements</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Missing intellectual property clause</p>
                            <p className="text-xs text-muted-foreground">Recommend adding IP assignment terms</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-end">
                    <Button onClick={() => setActiveTab('chat')}>
                      Continue to AI Chat
                      <MessageSquare className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="chat" className="h-full m-0">
                <div className="flex h-full">
                  <div className="flex-1 flex flex-col">
                    <div className="p-4 border-b">
                      <h3 className="text-lg font-semibold">AI Legal Assistant</h3>
                      <p className="text-sm text-muted-foreground">Ask questions about your documents</p>
                    </div>

                    <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            {message.type === 'assistant' && (
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                  <Bot className="h-4 w-4" />
                                </AvatarFallback>
                              </Avatar>
                            )}
                            
                            <div className={`max-w-[80%] ${message.type === 'user' ? 'order-1' : ''}`}>
                              <div
                                className={`rounded-lg p-3 ${
                                  message.type === 'user'
                                    ? 'bg-primary text-primary-foreground ml-auto'
                                    : 'bg-muted'
                                }`}
                              >
                                <div className="whitespace-pre-wrap text-sm">
                                  {message.content}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>{formatTimeAgo(message.timestamp)}</span>
                              </div>
                            </div>

                            {message.type === 'user' && (
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                  <User className="h-4 w-4" />
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        ))}

                        {isTyping && (
                          <div className="flex gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                <Bot className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="bg-muted rounded-lg p-3">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Brain className="h-4 w-4 animate-pulse" />
                                <span>AI is analyzing...</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </ScrollArea>

                    <div className="p-4 border-t">
                      <div className="flex gap-2">
                        <Input
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder="Ask me anything about your legal documents..."
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                          disabled={isTyping}
                        />
                        <Button
                          onClick={() => handleSendMessage(inputValue)}
                          disabled={!inputValue.trim() || isTyping}
                          size="sm"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="w-80 border-l p-4">
                    <h4 className="font-semibold mb-4">Suggested Questions</h4>
                    <div className="space-y-2">
                      {suggestedQuestions.map((question, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          className="w-full justify-start text-left h-auto p-3 text-sm"
                          onClick={() => handleSendMessage(question)}
                          disabled={isTyping}
                        >
                          <Zap className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                          <span className="text-wrap">{question}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="search" className="h-full p-6 m-0">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Smart Document Search</h3>
                    <p className="text-muted-foreground">Search across all your legal documents</p>
                  </div>

                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-10"
                        placeholder="Search for clauses, terms, or document types..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {demoDocuments.map((doc) => (
                      <Card 
                        key={doc.id} 
                        className={`cursor-pointer transition-all hover:bg-accent/50 ${
                          selectedDocument?.id === doc.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setSelectedDocument(doc)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <FileText className="h-8 w-8 text-primary" />
                              <div>
                                <h4 className="font-medium">{doc.name}</h4>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Badge variant="outline">{doc.type}</Badge>
                                  <span>•</span>
                                  <span>{doc.size}</span>
                                  <span>•</span>
                                  <span>{formatTimeAgo(doc.uploadedAt)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{doc.clauses} clauses</div>
                              <div className="text-sm text-muted-foreground">
                                {doc.risks > 0 ? (
                                  <span className="text-orange-400">{doc.risks} risks</span>
                                ) : (
                                  <span className="text-green-400">No risks</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="insights" className="h-full p-6 m-0">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">AI Insights & Analytics</h3>
                    <p className="text-muted-foreground">Intelligent recommendations from your legal documents</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-green-500" />
                          Contract Patterns
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm">Comprehensive clauses</span>
                            <span className="text-sm font-medium">78%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Risk factors present</span>
                            <span className="text-sm font-medium text-orange-500">23%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Standard formatting</span>
                            <span className="text-sm font-medium">95%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5 text-blue-500" />
                          Performance Metrics
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm">Time saved</span>
                            <span className="text-sm font-medium">64 hours</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Documents processed</span>
                            <span className="text-sm font-medium">24</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Accuracy rate</span>
                            <span className="text-sm font-medium text-green-500">97.3%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        Recommended Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-orange-500 mt-2" />
                          <div className="flex-1">
                            <p className="font-medium">Review high-risk documents</p>
                            <p className="text-sm text-muted-foreground">8 documents need immediate attention</p>
                          </div>
                          <Button size="sm" variant="outline">Review</Button>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                          <div className="flex-1">
                            <p className="font-medium">Standardize contract templates</p>
                            <p className="text-sm text-muted-foreground">Create templates from successful contracts</p>
                          </div>
                          <Button size="sm" variant="outline">Create</Button>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                          <div className="flex-1">
                            <p className="font-medium">Set up automated workflows</p>
                            <p className="text-sm text-muted-foreground">Automate processing for faster turnaround</p>
                          </div>
                          <Button size="sm" variant="outline">Setup</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-muted/30">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              This is a demo showcasing PrivateGPT Legal capabilities
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Close Demo
              </Button>
              <Button onClick={() => setActiveTab('upload')}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Restart Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}