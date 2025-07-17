import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import {
  Send,
  Bot,
  User,
  FileText,
  Sparkles,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Copy,
  ExternalLink,
  Trash2,
  Brain,
  Loader2,
  MessageSquare,
  Search,
  AlertTriangle,
  CheckCircle,
  Zap
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { chatService, ChatMessage } from '@/lib/chatService'
import { documentService, Document } from '@/lib/documentService'

import { toast } from 'sonner'

const suggestedQuestions = [
  "What are the key terms in my recent contracts?",
  "Find all documents with arbitration clauses",
  "What risks are present in my M&A documents?",
  "Summarize the termination clauses across all employment contracts",
  "Are there any missing force majeure provisions?",
  "What's the average contract duration in my agreements?",
  "Which documents need immediate review?",
  "Show me all high-risk clauses",
  "What compliance issues have been identified?",
  "Compare liability terms across my contracts"
]

export function ChatInterface() {
  // Mock user for demo
  const user = { id: 'demo-user', email: 'demo@lawfirm.com' }
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState(`session_${Date.now()}`)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    loadData()
  }, [user])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const loadData = async () => {
    if (!user) return

    try {
      // Load chat history and documents
      const [chatHistory, userDocuments] = await Promise.all([
        chatService.getChatHistory(user.id, sessionId),
        documentService.getDocuments(user.id)
      ])

      setMessages(chatHistory)
      setDocuments(userDocuments)

      // Add welcome message if no chat history
      if (chatHistory.length === 0) {
        const welcomeMessage: ChatMessage = {
          id: `welcome_${Date.now()}`,
          type: 'assistant',
          content: `Hello ${user.displayName}! I'm your AI legal assistant. I can help you analyze your legal documents, answer questions about contracts, identify risks, and much more. 

I have access to ${userDocuments.length} documents in your library. What would you like to know?`,
          timestamp: new Date().toISOString(),
          userId: user.id,
          sessionId
        }
        setMessages([welcomeMessage])
      }
    } catch (error) {
      console.error('Failed to load chat data:', error)
      toast.error('Failed to load chat history')
    }
  }

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !user) return

    setIsLoading(true)
    setInputValue('')

    try {
      // Add user message to UI immediately
      const userMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        type: 'user',
        content,
        timestamp: new Date().toISOString(),
        userId: user.id,
        sessionId
      }

      setMessages(prev => [...prev, userMessage])

      // Send message and get AI response
      const assistantMessage = await chatService.sendMessage(content, sessionId)
      
      // Add assistant message to UI
      setMessages(prev => [...prev, assistantMessage])

      // Focus back to input
      inputRef.current?.focus()

    } catch (error) {
      console.error('Failed to send message:', error)
      toast.error('Failed to send message. Please try again.')
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        type: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again or rephrase your question.',
        timestamp: new Date().toISOString(),
        userId: user.id,
        sessionId
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
    inputRef.current?.focus()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(inputValue)
    }
  }

  const handleClearChat = async () => {
    try {
      setMessages([])
      // Start fresh session
      await loadData()
      toast.success('Chat cleared')
    } catch (error) {
      console.error('Failed to clear chat:', error)
      toast.error('Failed to clear chat')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getDocumentStats = () => {
    const totalClauses = documents.reduce((sum, doc) => sum + doc.clauses, 0)
    const totalRisks = documents.reduce((sum, doc) => sum + doc.risks, 0)
    const highPriorityDocs = documents.filter(doc => doc.priority === 'High' || doc.priority === 'Critical').length
    
    return { totalClauses, totalRisks, highPriorityDocs }
  }

  const stats = getDocumentStats()

  return (
    <div className="flex h-screen bg-background">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Brain className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">AI Legal Assistant</h1>
                <p className="text-sm text-muted-foreground">
                  Enterprise AI powered by advanced language models
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                <Zap className="mr-1 h-3 w-3" />
                Real-time AI
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClearChat}
                className="text-muted-foreground hover:text-foreground"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                New Chat
              </Button>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-6 max-w-4xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 animate-fade-in ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.type === 'assistant' && (
                  <Avatar className="h-10 w-10 mt-1 flex-shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Brain className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-1' : ''}`}>
                  <div
                    className={`rounded-lg p-4 ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted border'
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formatTimestamp(message.timestamp)}</span>
                    
                    {message.type === 'assistant' && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 px-2 hover:bg-accent"
                          title="Good response"
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 px-2 hover:bg-accent"
                          title="Poor response"
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 px-2 hover:bg-accent"
                          onClick={() => copyToClipboard(message.content)}
                          title="Copy response"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                  </div>

                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        Sources ({message.sources.length}):
                      </p>
                      {message.sources.map((source, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-background border rounded-lg text-xs hover:bg-accent/50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{source.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {source.type}
                                </Badge>
                                {source.pageNumber && (
                                  <span className="text-muted-foreground">
                                    Page {source.pageNumber}
                                  </span>
                                )}
                              </div>
                              {source.excerpt && (
                                <p className="text-muted-foreground mt-1 line-clamp-2">
                                  "{source.excerpt}"
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge 
                              variant={source.relevance > 80 ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {source.relevance}% match
                            </Badge>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {message.type === 'user' && (
                  <Avatar className="h-10 w-10 mt-1 flex-shrink-0">
                    <AvatarFallback className="bg-secondary">
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-4 animate-fade-in">
                <Avatar className="h-10 w-10 mt-1">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Brain className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted border rounded-lg p-4 flex-1">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>AI is analyzing your documents and generating response...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2">
              <Textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your legal documents..."
                className="flex-1 min-h-[44px] max-h-32 resize-none"
                disabled={isLoading}
                rows={1}
              />
              <Button
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim() || isLoading}
                size="sm"
                className="px-4 self-end"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Sidebar */}
      <div className="w-80 border-l border-border p-4 space-y-4 overflow-y-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Suggested Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-left h-auto p-3 text-sm hover:bg-accent"
                  onClick={() => handleSuggestionClick(question)}
                  disabled={isLoading}
                >
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-wrap">{question}</span>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Document Library
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total documents</span>
                <span className="font-medium">{documents.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Contracts</span>
                <span className="font-medium">
                  {documents.filter(d => d.type === 'Contract').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">M&A Documents</span>
                <span className="font-medium">
                  {documents.filter(d => d.type === 'M&A').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">NDAs</span>
                <span className="font-medium">
                  {documents.filter(d => d.type === 'NDA').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Employment</span>
                <span className="font-medium">
                  {documents.filter(d => d.type === 'Employment').length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" />
              Analysis Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Questions answered</span>
                <span className="font-medium">
                  {messages.filter(m => m.type === 'user').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total clauses</span>
                <span className="font-medium text-blue-400">
                  {stats.totalClauses}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Risk factors</span>
                <span className="font-medium text-orange-400">
                  {stats.totalRisks}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">High priority docs</span>
                <span className="font-medium text-red-400">
                  {stats.highPriorityDocs}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              AI Capabilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Document analysis & summarization</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Risk identification & assessment</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Clause extraction & comparison</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Legal Q&A with source citations</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Contract pattern analysis</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              Quick Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p>• Be specific in your questions for better results</p>
              <p>• Reference document names or types for targeted analysis</p>
              <p>• Ask about patterns across multiple documents</p>
              <p>• Use follow-up questions to dive deeper</p>
              <p>• Request specific clause types or risk assessments</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}