import { Document, Folder, ChatMessage, AnalyticsData } from './blink'

// Sample data for demo
const sampleFolders: Folder[] = [
  {
    id: 'folder_contracts',
    name: 'Contracts',
    userId: '550e8400-e29b-41d4-a716-446655440001',
    createdAt: '2024-01-15T10:30:00Z',
    documentCount: 3
  },
  {
    id: 'folder_templates',
    name: 'Templates',
    userId: '550e8400-e29b-41d4-a716-446655440001',
    createdAt: '2024-01-15T10:30:00Z',
    documentCount: 1
  },
  {
    id: 'folder_ma',
    name: 'M&A Documents',
    userId: '550e8400-e29b-41d4-a716-446655440001',
    createdAt: '2024-01-15T10:30:00Z',
    documentCount: 1
  },
  {
    id: 'folder_employment',
    name: 'Employment',
    userId: '550e8400-e29b-41d4-a716-446655440001',
    createdAt: '2024-01-15T10:30:00Z',
    documentCount: 2
  },
  {
    id: 'folder_ndas',
    name: 'NDAs',
    userId: '550e8400-e29b-41d4-a716-446655440001',
    createdAt: '2024-01-15T10:30:00Z',
    documentCount: 1
  }
]

const sampleDocuments: Document[] = [
  {
    id: 'doc_1',
    name: 'Smith vs. Johnson Contract.pdf',
    type: 'Contract',
    status: 'Analyzed',
    uploadedAt: '2024-01-15T10:30:00Z',
    size: '2.4 MB',
    clauses: 12,
    risks: 2,
    summary: 'Employment contract with standard terms and conditions. Contains non-compete and confidentiality clauses.',
    userId: '550e8400-e29b-41d4-a716-446655440001',
    folderId: 'folder_contracts',
    tags: ['employment', 'non-compete', 'confidentiality'],
    content: `EMPLOYMENT AGREEMENT

This Employment Agreement ("Agreement") is entered into on January 1, 2024, between Smith Corporation, a Delaware corporation ("Company"), and John Johnson ("Employee").

1. EMPLOYMENT TERMS
Company hereby employs Employee, and Employee accepts employment with Company, subject to the terms and conditions set forth in this Agreement.

2. DUTIES AND RESPONSIBILITIES
Employee shall serve as Senior Software Engineer and shall perform such duties as may be assigned by the Company's management.

3. COMPENSATION
Employee shall receive a base salary of $120,000 per year, payable in accordance with Company's standard payroll practices.

4. CONFIDENTIALITY
Employee acknowledges that during employment, Employee may have access to confidential information and trade secrets of the Company.

5. NON-COMPETE
Employee agrees not to engage in any competing business for a period of two (2) years following termination of employment.

6. TERMINATION
Either party may terminate this agreement with thirty (30) days written notice to the other party.`
  },
  {
    id: 'doc_2',
    name: 'Corporate Merger Agreement.docx',
    type: 'M&A',
    status: 'Processing',
    uploadedAt: '2024-01-14T14:20:00Z',
    size: '5.8 MB',
    clauses: 28,
    risks: 5,
    summary: 'Complex merger agreement requiring detailed review of liability and indemnification terms.',
    userId: '550e8400-e29b-41d4-a716-446655440001',
    folderId: 'folder_ma',
    tags: ['merger', 'liability', 'indemnification']
  },
  {
    id: 'doc_3',
    name: 'Employment Contract Template.pdf',
    type: 'Template',
    status: 'Reviewed',
    uploadedAt: '2024-01-13T09:15:00Z',
    size: '1.2 MB',
    clauses: 8,
    risks: 0,
    summary: 'Standard employment contract template with all necessary legal provisions.',
    userId: '550e8400-e29b-41d4-a716-446655440001',
    folderId: 'folder_templates',
    tags: ['template', 'employment', 'standard']
  },
  {
    id: 'doc_4',
    name: 'NDA - Tech Partnership.pdf',
    type: 'NDA',
    status: 'Analyzed',
    uploadedAt: '2024-01-12T16:45:00Z',
    size: '890 KB',
    clauses: 6,
    risks: 1,
    summary: 'Non-disclosure agreement for technology partnership with mutual confidentiality terms.',
    userId: '550e8400-e29b-41d4-a716-446655440001',
    folderId: 'folder_ndas',
    tags: ['nda', 'technology', 'partnership']
  },
  {
    id: 'doc_5',
    name: 'Executive Employment Agreement.pdf',
    type: 'Employment',
    status: 'Analyzed',
    uploadedAt: '2024-01-11T11:30:00Z',
    size: '3.2 MB',
    clauses: 15,
    risks: 3,
    summary: 'Executive-level employment agreement with equity compensation and severance terms.',
    userId: '550e8400-e29b-41d4-a716-446655440001',
    folderId: 'folder_employment',
    tags: ['executive', 'equity', 'severance']
  },
  {
    id: 'doc_6',
    name: 'Software License Agreement.pdf',
    type: 'Contract',
    status: 'Reviewed',
    uploadedAt: '2024-01-10T13:20:00Z',
    size: '1.8 MB',
    clauses: 10,
    risks: 1,
    summary: 'Software licensing agreement with usage restrictions and liability limitations.',
    userId: '550e8400-e29b-41d4-a716-446655440001',
    folderId: 'folder_contracts',
    tags: ['software', 'license', 'liability']
  }
]

const sampleChatMessages: ChatMessage[] = [
  {
    id: 'msg_1',
    type: 'assistant',
    content: "Hello! I'm your AI legal assistant. I can help you analyze documents, answer legal questions, and provide insights about your contracts and legal documents. What would you like to know?",
    timestamp: '2024-01-15T09:00:00Z',
    userId: '550e8400-e29b-41d4-a716-446655440001'
  }
]

// Data service functions
export class DataService {
  private static getStorageKey(key: string): string {
    return `privategpt_${key}`
  }

  // Folders
  static getFolders(): Folder[] {
    const stored = localStorage.getItem(this.getStorageKey('folders'))
    return stored ? JSON.parse(stored) : sampleFolders
  }

  static saveFolder(folder: Folder): void {
    const folders = this.getFolders()
    const index = folders.findIndex(f => f.id === folder.id)
    if (index >= 0) {
      folders[index] = folder
    } else {
      folders.push(folder)
    }
    localStorage.setItem(this.getStorageKey('folders'), JSON.stringify(folders))
  }

  static deleteFolder(folderId: string): void {
    const folders = this.getFolders().filter(f => f.id !== folderId)
    localStorage.setItem(this.getStorageKey('folders'), JSON.stringify(folders))
    
    // Move documents in this folder to root
    const documents = this.getDocuments().map(doc => 
      doc.folderId === folderId ? { ...doc, folderId: undefined } : doc
    )
    localStorage.setItem(this.getStorageKey('documents'), JSON.stringify(documents))
  }

  // Documents
  static getDocuments(): Document[] {
    const stored = localStorage.getItem(this.getStorageKey('documents'))
    return stored ? JSON.parse(stored) : sampleDocuments
  }

  static getDocumentsByFolder(folderId?: string): Document[] {
    return this.getDocuments().filter(doc => doc.folderId === folderId)
  }

  static getDocument(id: string): Document | undefined {
    return this.getDocuments().find(doc => doc.id === id)
  }

  static saveDocument(document: Document): void {
    const documents = this.getDocuments()
    const index = documents.findIndex(d => d.id === document.id)
    if (index >= 0) {
      documents[index] = document
    } else {
      documents.push(document)
    }
    localStorage.setItem(this.getStorageKey('documents'), JSON.stringify(documents))
    
    // Update folder document count
    this.updateFolderCounts()
  }

  static deleteDocument(documentId: string): void {
    const documents = this.getDocuments().filter(d => d.id !== documentId)
    localStorage.setItem(this.getStorageKey('documents'), JSON.stringify(documents))
    this.updateFolderCounts()
  }

  private static updateFolderCounts(): void {
    const folders = this.getFolders()
    const documents = this.getDocuments()
    
    folders.forEach(folder => {
      folder.documentCount = documents.filter(doc => doc.folderId === folder.id).length
    })
    
    localStorage.setItem(this.getStorageKey('folders'), JSON.stringify(folders))
  }

  // Chat messages
  static getChatMessages(): ChatMessage[] {
    const stored = localStorage.getItem(this.getStorageKey('chat_messages'))
    return stored ? JSON.parse(stored) : sampleChatMessages
  }

  static saveChatMessage(message: ChatMessage): void {
    const messages = this.getChatMessages()
    messages.push(message)
    localStorage.setItem(this.getStorageKey('chat_messages'), JSON.stringify(messages))
  }

  static clearChatMessages(): void {
    localStorage.setItem(this.getStorageKey('chat_messages'), JSON.stringify([sampleChatMessages[0]]))
  }

  // Analytics
  static getAnalytics(): AnalyticsData {
    const documents = this.getDocuments()
    const messages = this.getChatMessages()
    
    // Document type distribution
    const typeCount = documents.reduce((acc, doc) => {
      acc[doc.type] = (acc[doc.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topDocumentTypes = Object.entries(typeCount)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
    
    return {
      totalDocuments: documents.length,
      totalQueries: messages.filter(m => m.type === 'user').length,
      timeSaved: Math.floor(documents.length * 2.5), // Estimate 2.5 hours saved per document
      riskAlerts: documents.reduce((sum, doc) => sum + doc.risks, 0),
      documentsThisMonth: documents.filter(doc => {
        const uploadDate = new Date(doc.uploadedAt)
        const now = new Date()
        return uploadDate.getMonth() === now.getMonth() && uploadDate.getFullYear() === now.getFullYear()
      }).length,
      queriesThisMonth: messages.filter(m => {
        if (m.type !== 'user') return false
        const messageDate = new Date(m.timestamp)
        const now = new Date()
        return messageDate.getMonth() === now.getMonth() && messageDate.getFullYear() === now.getFullYear()
      }).length,
      averageProcessingTime: 45, // seconds
      accuracyRate: 97.3,
      topDocumentTypes,
      riskTrends: [] // Would be calculated from historical data
    }
  }

  // Search
  static searchDocuments(query: string): Document[] {
    const documents = this.getDocuments()
    const lowerQuery = query.toLowerCase()
    
    return documents.filter(doc => 
      doc.name.toLowerCase().includes(lowerQuery) ||
      doc.type.toLowerCase().includes(lowerQuery) ||
      doc.summary.toLowerCase().includes(lowerQuery) ||
      doc.tags?.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      doc.content?.toLowerCase().includes(lowerQuery)
    )
  }

  // Initialize data if not exists
  static initializeData(): void {
    if (!localStorage.getItem(this.getStorageKey('folders'))) {
      localStorage.setItem(this.getStorageKey('folders'), JSON.stringify(sampleFolders))
    }
    if (!localStorage.getItem(this.getStorageKey('documents'))) {
      localStorage.setItem(this.getStorageKey('documents'), JSON.stringify(sampleDocuments))
    }
    if (!localStorage.getItem(this.getStorageKey('chat_messages'))) {
      localStorage.setItem(this.getStorageKey('chat_messages'), JSON.stringify(sampleChatMessages))
    }
  }
}

// AI Response Generator
export class AIService {
  static generateResponse(question: string, documents: Document[]): string {
    const lowerQuestion = question.toLowerCase()
    
    if (lowerQuestion.includes('smith') || lowerQuestion.includes('johnson')) {
      return `Based on my analysis of the Smith vs. Johnson contract, here are the key terms:

• **Contract Type**: Employment Agreement
• **Duration**: Indefinite with 30-day termination notice
• **Non-compete**: 2-year restriction (potentially problematic)
• **Confidentiality**: Standard provisions included
• **Compensation**: Base salary of $120,000 per year
• **Termination**: Either party may terminate with 30-day notice

**Risk Analysis:**
I've identified 2 potential risks that need attention:
1. **Non-compete clause duration** - 2 years may be unenforceable in some jurisdictions
2. **Missing IP assignment clause** - Should clarify ownership of work product

**Recommendations:**
• Consider reducing non-compete period to 12 months
• Add intellectual property assignment language
• Review termination notice requirements for compliance

Would you like me to provide specific language suggestions for any of these issues?`
    }
    
    if (lowerQuestion.includes('arbitration')) {
      const contractDocs = documents.filter(doc => doc.type === 'Contract')
      return `I found ${contractDocs.length} contracts in your document library. Here's what I found regarding arbitration clauses:

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
      const totalRisks = documents.reduce((sum, doc) => sum + doc.risks, 0)
      const highRiskDocs = documents.filter(doc => doc.risks > 2)
      
      return `I've identified ${totalRisks} total risks across your document library:

**High Priority Risks:**
${highRiskDocs.map(doc => `• ${doc.name}: ${doc.risks} risks identified`).join('\n')}

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
    
    if (lowerQuestion.includes('termination')) {
      return `Here's a summary of termination clauses across your contracts:

**Employment Contracts:**
• Standard 30-day notice period
• At-will employment with cause provisions
• Severance terms for executive agreements

**Service Agreements:**
• 60-day notice for material breach
• Immediate termination for non-payment

**Partnership Agreements:**
• 90-day notice for convenience
• Immediate termination for cause

**Recommendations:**
• Consider standardizing notice periods
• Add specific termination procedures
• Include post-termination obligations`
    }
    
    if (lowerQuestion.includes('template') || lowerQuestion.includes('standard')) {
      const templates = documents.filter(doc => doc.type === 'Template')
      return `I found ${templates.length} template documents in your library:

${templates.map(doc => `• **${doc.name}**: ${doc.summary}`).join('\n')}

These templates can be used as starting points for new agreements. All templates have been reviewed for compliance and include standard legal provisions.

Would you like me to help you customize any of these templates for a specific use case?`
    }
    
    // Default response
    return `I understand you're asking about legal document analysis. Based on your document library of ${documents.length} documents, I can help you with:

• Contract reviews and clause analysis
• Risk assessments and compliance checks
• Document comparisons and pattern analysis
• Template recommendations and customization

Could you be more specific about what you'd like me to analyze or search for? For example:
- "What are the key terms in [document name]?"
- "Find all contracts with [specific clause type]"
- "What risks are present in [document type]?"
- "Compare termination clauses across contracts"`
  }

  static getSources(question: string, documents: Document[]): Array<{
    documentId: string
    name: string
    type: string
    relevance: number
  }> {
    const lowerQuestion = question.toLowerCase()
    const relevantDocs = documents.filter(doc => {
      const docText = `${doc.name} ${doc.type} ${doc.summary} ${doc.tags?.join(' ') || ''}`.toLowerCase()
      return docText.includes(lowerQuestion.split(' ')[0]) || 
             lowerQuestion.split(' ').some(word => docText.includes(word))
    })
    
    return relevantDocs.slice(0, 3).map((doc, index) => ({
      documentId: doc.id,
      name: doc.name,
      type: doc.type,
      relevance: Math.max(95 - (index * 15), 60)
    }))
  }
}