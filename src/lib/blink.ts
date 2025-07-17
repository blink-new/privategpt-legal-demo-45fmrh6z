import { createClient } from '@blinkdotnew/sdk'

// Initialize Blink client for demo (no auth required for demo)
export const blink = createClient({
  projectId: 'privategpt-legal-demo-45fmrh6z',
  authRequired: false
})

// Mock user for demo purposes
const DEMO_USER = {
  id: 'demo-user',
  email: 'demo@lawfirm.com',
  displayName: 'Demo User'
}

// Enhanced document types for enterprise use
export interface Document {
  id: string
  name: string
  type: 'Contract' | 'M&A' | 'Template' | 'NDA' | 'Employment' | 'Litigation' | 'Compliance' | 'Other'
  status: 'Processing' | 'Analyzed' | 'Reviewed' | 'Failed' | 'Archived'
  uploadedAt: string
  analyzedAt?: string
  size: string
  clauses: number
  risks: number
  summary: string
  content?: string
  userId: string
  folderId?: string
  tags?: string[]
  fileUrl?: string
  confidence: number
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  assignedTo?: string
  reviewedBy?: string
  metadata?: Record<string, any>
}

// Folder structure for organization
export interface Folder {
  id: string
  name: string
  parentId?: string
  userId: string
  createdAt: string
  documentCount: number
  color?: string
  description?: string
}

// Enhanced chat message with context
export interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: string
  userId: string
  sessionId?: string
  sources?: Array<{
    documentId: string
    name: string
    type: string
    relevance: number
    excerpt: string
    pageNumber?: number
  }>
  metadata?: Record<string, any>
}

// Document clause analysis
export interface DocumentClause {
  id: string
  documentId: string
  type: string
  content: string
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical'
  confidence: number
  pageNumber?: number
  suggestions?: string[]
  category: string
}

// Workflow automation
export interface Workflow {
  id: string
  name: string
  description?: string
  triggerType: 'document_upload' | 'schedule' | 'manual' | 'risk_detected'
  triggerConfig: Record<string, any>
  actions: Array<{
    type: 'notify' | 'assign' | 'analyze' | 'archive' | 'email'
    config: Record<string, any>
  }>
  isActive: boolean
  userId: string
  createdAt: string
  lastRun?: string
}

// Analytics and reporting
export interface AnalyticsData {
  totalDocuments: number
  totalQueries: number
  timeSaved: number
  riskAlerts: number
  documentsThisMonth: number
  queriesThisMonth: number
  averageProcessingTime: number
  accuracyRate: number
  topDocumentTypes: Array<{ type: string; count: number }>
  riskTrends: Array<{ date: string; count: number }>
}

// User profile with enterprise features
export interface UserProfile {
  id: string
  userId: string
  displayName: string
  email: string
  role: 'admin' | 'lawyer' | 'paralegal' | 'compliance' | 'user'
  firmName?: string
  department?: string
  permissions: string[]
  preferences: Record<string, any>
  avatarUrl?: string
  createdAt: string
  lastActive: string
}

// Document service with real AI integration
export const documentService = {
  async uploadDocument(file: File, metadata?: Partial<Document>): Promise<Document> {
    try {
      // Upload file to Blink storage
      const { publicUrl } = await blink.storage.upload(
        file,
        `documents/${Date.now()}-${file.name}`,
        { upsert: true }
      )

      // Extract text content from document
      const extractedText = await blink.data.extractFromBlob(file)

      // Create document record in database
      const document = await blink.db.documents.create({
        id: `doc_${Date.now()}`,
        name: file.name,
        type: metadata?.type || 'Other',
        status: 'Processing',
        fileUrl: publicUrl,
        content: extractedText,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        clauses: 0,
        risks: 0,
        summary: '',
        confidence: 0,
        priority: 'Medium',
        userId: DEMO_USER.id,
        folderId: metadata?.folderId,
        tags: metadata?.tags || [],
        metadata: {
          originalName: file.name,
          mimeType: file.type,
          uploadedAt: new Date().toISOString()
        }
      })

      // Start AI analysis in background
      this.analyzeDocument(document.id)

      return document
    } catch (error) {
      console.error('Document upload failed:', error)
      throw new Error('Failed to upload document')
    }
  },

  async analyzeDocument(documentId: string): Promise<void> {
    try {
      const document = await blink.db.documents.list({
        where: { id: documentId }
      })

      if (!document.length) throw new Error('Document not found')

      const doc = document[0]

      // Use AI to analyze document content
      const analysisPrompt = `
        Analyze this legal document and provide:
        1. Document type classification
        2. Key clauses identification
        3. Risk assessment
        4. Summary
        5. Confidence score

        Document content:
        ${doc.content}
      `

      const { object: analysis } = await blink.ai.generateObject({
        prompt: analysisPrompt,
        schema: {
          type: 'object',
          properties: {
            documentType: { 
              type: 'string',
              enum: ['Contract', 'M&A', 'Template', 'NDA', 'Employment', 'Litigation', 'Compliance', 'Other']
            },
            clauses: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: { type: 'string' },
                  content: { type: 'string' },
                  riskLevel: { type: 'string', enum: ['Low', 'Medium', 'High', 'Critical'] },
                  confidence: { type: 'number' },
                  category: { type: 'string' }
                }
              }
            },
            risks: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  description: { type: 'string' },
                  severity: { type: 'string', enum: ['Low', 'Medium', 'High', 'Critical'] },
                  recommendation: { type: 'string' }
                }
              }
            },
            summary: { type: 'string' },
            confidence: { type: 'number' },
            priority: { type: 'string', enum: ['Low', 'Medium', 'High', 'Critical'] }
          },
          required: ['documentType', 'clauses', 'risks', 'summary', 'confidence', 'priority']
        }
      })

      // Update document with analysis results
      await blink.db.documents.update(documentId, {
        type: analysis.documentType,
        status: 'Analyzed',
        clauses: analysis.clauses.length,
        risks: analysis.risks.filter(r => r.severity !== 'Low').length,
        summary: analysis.summary,
        confidence: analysis.confidence,
        priority: analysis.priority,
        analyzedAt: new Date().toISOString()
      })

      // Save individual clauses
      for (const clause of analysis.clauses) {
        await blink.db.documentClauses.create({
          id: `clause_${Date.now()}_${Math.random()}`,
          documentId,
          type: clause.type,
          content: clause.content,
          riskLevel: clause.riskLevel,
          confidence: clause.confidence,
          category: clause.category,
          userId: doc.userId
        })
      }

      // Track analytics
      await blink.db.analyticsEvents.create({
        id: `event_${Date.now()}`,
        userId: doc.userId,
        eventType: 'document_analyzed',
        eventData: {
          documentId,
          documentType: analysis.documentType,
          clauseCount: analysis.clauses.length,
          riskCount: analysis.risks.length,
          confidence: analysis.confidence
        }
      })

    } catch (error) {
      console.error('Document analysis failed:', error)
      
      // Update document status to failed
      await blink.db.documents.update(documentId, {
        status: 'Failed',
        metadata: { error: error.message }
      })
    }
  },

  async getDocuments(userId?: string): Promise<Document[]> {
    // Always use fallback data for demo since database is not available
    try {
      const { DataService } = await import('./data')
      DataService.initializeData()
      return DataService.getDocuments()
    } catch (error) {
      console.error('Failed to load demo data:', error)
      return []
    }
  },

  async searchDocuments(query: string, filters?: {
    type?: string
    status?: string
    dateRange?: { start: string; end: string }
  }): Promise<Document[]> {
    const user = DEMO_USER.id
    
    // Use AI to enhance search query
    const enhancedQuery = await blink.ai.generateText({
      prompt: `Convert this search query into relevant legal document search terms: "${query}"`
    })

    const whereClause: any = { userId: user }

    if (filters?.type) {
      whereClause.type = filters.type
    }

    if (filters?.status) {
      whereClause.status = filters.status
    }

    const documents = await blink.db.documents.list({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    })

    // Filter by content relevance using AI
    const relevantDocs = []
    for (const doc of documents) {
      if (doc.content?.toLowerCase().includes(query.toLowerCase()) ||
          doc.name.toLowerCase().includes(query.toLowerCase()) ||
          doc.summary.toLowerCase().includes(query.toLowerCase())) {
        relevantDocs.push(doc)
      }
    }

    return relevantDocs
  },

  async deleteDocument(documentId: string): Promise<void> {
    // Delete associated clauses first
    const clauses = await blink.db.documentClauses.list({
      where: { documentId }
    })

    for (const clause of clauses) {
      await blink.db.documentClauses.delete(clause.id)
    }

    // Delete document
    await blink.db.documents.delete(documentId)
  }
}

// Import chat service from separate file
export { chatService } from './chatService'

// Legacy chat service (kept for compatibility)
const legacyChatService = {
  async sendMessage(content: string, sessionId?: string): Promise<ChatMessage> {
    const user = DEMO_USER
    
    // Save user message
    const userMessage = await blink.db.chatMessages.create({
      id: `msg_${Date.now()}`,
      type: 'user',
      content,
      userId: user.id,
      sessionId: sessionId || `session_${Date.now()}`
    })

    // Get user's documents for context
    const documents = await documentService.getDocuments(user.id)
    
    // Create context from documents
    const documentContext = documents.map(doc => 
      `Document: ${doc.name} (${doc.type})\nSummary: ${doc.summary}\nContent: ${doc.content?.substring(0, 1000)}...`
    ).join('\n\n')

    // Generate AI response with document context
    const { text: aiResponse } = await blink.ai.generateText({
      prompt: `You are a legal AI assistant. Answer the user's question based on their legal documents.

User Question: ${content}

Available Documents:
${documentContext}

Provide a helpful, accurate response based on the documents. If you reference specific documents, mention them by name.`,
      maxTokens: 1000
    })

    // Find relevant sources
    const sources = this.findRelevantSources(content, documents)

    // Save AI response
    const assistantMessage = await blink.db.chatMessages.create({
      id: `msg_${Date.now() + 1}`,
      type: 'assistant',
      content: aiResponse,
      userId: user.id,
      sessionId: sessionId || `session_${Date.now()}`,
      sources: sources.map(source => ({
        documentId: source.id,
        name: source.name,
        type: source.type,
        relevance: this.calculateRelevance(content, source),
        excerpt: source.content?.substring(0, 200) || source.summary
      }))
    })

    return assistantMessage
  },

  findRelevantSources(query: string, documents: Document[]): Document[] {
    const queryLower = query.toLowerCase()
    
    return documents
      .filter(doc => 
        doc.content?.toLowerCase().includes(queryLower) ||
        doc.name.toLowerCase().includes(queryLower) ||
        doc.summary.toLowerCase().includes(queryLower) ||
        doc.tags?.some(tag => tag.toLowerCase().includes(queryLower))
      )
      .slice(0, 5) // Limit to top 5 sources
  },

  calculateRelevance(query: string, document: Document): number {
    const queryLower = query.toLowerCase()
    let score = 0

    // Check name relevance
    if (document.name.toLowerCase().includes(queryLower)) score += 30

    // Check summary relevance
    if (document.summary.toLowerCase().includes(queryLower)) score += 25

    // Check content relevance
    if (document.content?.toLowerCase().includes(queryLower)) score += 20

    // Check tags relevance
    if (document.tags?.some(tag => tag.toLowerCase().includes(queryLower))) score += 15

    // Boost recent documents
    const daysSinceUpload = (Date.now() - new Date(document.uploadedAt).getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceUpload < 30) score += 10

    return Math.min(score, 100)
  },

  async getChatHistory(userId?: string, sessionId?: string): Promise<ChatMessage[]> {
    const user = userId || DEMO_USER.id
    
    const whereClause: any = { userId: user }
    if (sessionId) {
      whereClause.sessionId = sessionId
    }

    return await blink.db.chatMessages.list({
      where: whereClause,
      orderBy: { createdAt: 'asc' },
      limit: 100
    })
  }
}

// Analytics service
export const analyticsService = {
  async getAnalytics(userId?: string): Promise<AnalyticsData> {
    // Always use fallback data for demo since database is not available
    try {
      const { DataService } = await import('./data')
      DataService.initializeData()
      return DataService.getAnalytics()
    } catch (error) {
      console.error('Failed to load demo analytics:', error)
      // Return empty analytics as final fallback
      return {
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
      }
    }
  },

  async trackEvent(eventType: string, eventData?: any): Promise<void> {
    // Skip database tracking for demo mode
    console.log('Demo mode: Event tracked locally:', { eventType, eventData })
    // Silently succeed for demo mode
  }
}

// Workflow service
export const workflowService = {
  async createWorkflow(workflow: Omit<Workflow, 'id' | 'userId' | 'createdAt'>): Promise<Workflow> {
    const user = DEMO_USER
    
    return await blink.db.workflows.create({
      id: `workflow_${Date.now()}`,
      ...workflow,
      userId: user.id
    })
  },

  async executeWorkflow(workflowId: string, triggerData?: any): Promise<void> {
    const workflows = await blink.db.workflows.list({
      where: { id: workflowId, isActive: true }
    })

    if (!workflows.length) return

    const workflow = workflows[0]

    for (const action of workflow.actions) {
      await this.executeAction(action, triggerData)
    }

    // Update last run time
    await blink.db.workflows.update(workflowId, {
      lastRun: new Date().toISOString()
    })
  },

  async executeAction(action: any, data?: any): Promise<void> {
    switch (action.type) {
      case 'notify':
        // Send notification
        await blink.notifications.email({
          to: action.config.email,
          subject: action.config.subject,
          html: action.config.message
        })
        break
      
      case 'assign':
        // Assign document to user
        if (data?.documentId) {
          await blink.db.documents.update(data.documentId, {
            assignedTo: action.config.userId
          })
        }
        break
      
      // Add more action types as needed
    }
  }
}

// All services are already exported above