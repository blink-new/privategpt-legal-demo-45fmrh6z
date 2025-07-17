import { ChatMessage, Document } from './blink'

const DEMO_USER = {
  id: 'demo-user',
  email: 'demo@lawfirm.com',
  displayName: 'Demo User'
}

// Chat service with demo AI responses
export const chatService = {
  async sendMessage(content: string, sessionId?: string): Promise<ChatMessage> {
    const user = DEMO_USER
    
    // Create user message (local only)
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      type: 'user',
      content,
      timestamp: new Date().toISOString(),
      userId: user.id,
      sessionId: sessionId || `session_${Date.now()}`
    }

    // Get user's documents for context (from local data)
    const { documentService } = await import('./blink')
    const documents = await documentService.getDocuments(user.id)
    
    // Generate demo AI response
    const aiResponse = this.generateDemoResponse(content, documents)

    // Find relevant sources
    const sources = this.findRelevantSources(content, documents)

    // Create AI response (local only)
    const assistantMessage: ChatMessage = {
      id: `msg_${Date.now() + 1}`,
      type: 'assistant',
      content: aiResponse,
      timestamp: new Date().toISOString(),
      userId: user.id,
      sessionId: sessionId || `session_${Date.now()}`,
      sources: sources.map(source => ({
        documentId: source.id,
        name: source.name,
        type: source.type,
        relevance: this.calculateRelevance(content, source),
        excerpt: source.content?.substring(0, 200) || source.summary
      }))
    }

    // Save to local storage for demo
    const { DataService } = await import('./data')
    DataService.saveChatMessage(userMessage)
    DataService.saveChatMessage(assistantMessage)

    return assistantMessage
  },

  generateDemoResponse(question: string, documents: Document[]): string {
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
    // Use local storage for demo
    const { DataService } = await import('./data')
    return DataService.getChatMessages()
  }
}