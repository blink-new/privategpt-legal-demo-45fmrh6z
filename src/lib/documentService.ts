export interface Document {
  id: string
  title: string
  content?: string
  file_path?: string
  file_url?: string
  file_size?: number
  file_type?: string
  status: 'processing' | 'completed' | 'error'
  summary?: string
  key_clauses?: string[]
  risk_level?: 'low' | 'medium' | 'high'
  created_at: string
  updated_at: string
  user_id: string
  tags?: string[]
  case_name?: string
  matter_type?: string
}

// Mock data for demo
const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Software License Agreement - TechCorp',
    content: 'This Software License Agreement...',
    file_path: 'contracts/techcorp-license.pdf',
    file_url: 'https://example.com/techcorp-license.pdf',
    file_size: 245760,
    file_type: 'application/pdf',
    status: 'completed',
    summary: 'Standard software license agreement with TechCorp including usage rights, limitations, and termination clauses.',
    key_clauses: ['Usage Rights', 'Termination', 'Liability Limitation', 'Intellectual Property'],
    risk_level: 'low',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    user_id: 'demo-user',
    tags: ['Software', 'License', 'TechCorp'],
    case_name: 'TechCorp Licensing',
    matter_type: 'Contract Review'
  },
  {
    id: '2',
    title: 'Employment Contract - Jane Smith',
    content: 'This Employment Agreement...',
    file_path: 'hr/jane-smith-employment.pdf',
    file_url: 'https://example.com/jane-smith-employment.pdf',
    file_size: 189440,
    file_type: 'application/pdf',
    status: 'completed',
    summary: 'Employment contract for Jane Smith including compensation, benefits, and non-compete clauses.',
    key_clauses: ['Compensation', 'Benefits', 'Non-Compete', 'Confidentiality'],
    risk_level: 'medium',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    user_id: 'demo-user',
    tags: ['Employment', 'HR', 'Contract'],
    case_name: 'Jane Smith Hiring',
    matter_type: 'Employment'
  },
  {
    id: '3',
    title: 'NDA - Confidential Project Alpha',
    content: 'This Non-Disclosure Agreement...',
    file_path: 'ndas/project-alpha-nda.pdf',
    file_url: 'https://example.com/project-alpha-nda.pdf',
    file_size: 156672,
    file_type: 'application/pdf',
    status: 'processing',
    summary: 'Non-disclosure agreement for Project Alpha with strict confidentiality requirements.',
    key_clauses: ['Confidentiality', 'Term', 'Remedies', 'Jurisdiction'],
    risk_level: 'high',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    user_id: 'demo-user',
    tags: ['NDA', 'Confidential', 'Project Alpha'],
    case_name: 'Project Alpha',
    matter_type: 'NDA'
  }
]

export const documentService = {
  async uploadDocument(file: File, metadata: { case_name?: string; matter_type?: string; tags?: string[] }) {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const newDoc: Document = {
      id: Date.now().toString(),
      title: file.name,
      file_path: `uploads/${file.name}`,
      file_url: URL.createObjectURL(file),
      file_size: file.size,
      file_type: file.type,
      status: 'processing',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: 'demo-user',
      ...metadata
    }
    
    mockDocuments.unshift(newDoc)
    
    // Simulate processing completion
    setTimeout(() => {
      const doc = mockDocuments.find(d => d.id === newDoc.id)
      if (doc) {
        doc.status = 'completed'
        doc.summary = `AI-generated summary for ${file.name}`
        doc.key_clauses = ['Sample Clause 1', 'Sample Clause 2']
        doc.risk_level = 'low'
        doc.updated_at = new Date().toISOString()
      }
    }, 3000)
    
    return newDoc
  },

  async getDocument(id: string): Promise<Document | null> {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockDocuments.find(doc => doc.id === id) || null
  },

  async updateDocument(id: string, updates: Partial<Document>): Promise<Document | null> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const docIndex = mockDocuments.findIndex(doc => doc.id === id)
    if (docIndex !== -1) {
      mockDocuments[docIndex] = { ...mockDocuments[docIndex], ...updates, updated_at: new Date().toISOString() }
      return mockDocuments[docIndex]
    }
    return null
  },

  async deleteDocument(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const docIndex = mockDocuments.findIndex(doc => doc.id === id)
    if (docIndex !== -1) {
      mockDocuments.splice(docIndex, 1)
      return true
    }
    return false
  },

  async getDocuments(userId: string = 'demo-user'): Promise<Document[]> {
    await new Promise(resolve => setTimeout(resolve, 800))
    return mockDocuments.filter(doc => doc.user_id === userId)
  },

  async searchDocuments(query: string, userId: string = 'demo-user'): Promise<Document[]> {
    await new Promise(resolve => setTimeout(resolve, 600))
    const lowerQuery = query.toLowerCase()
    return mockDocuments.filter(doc => 
      doc.user_id === userId && (
        doc.title.toLowerCase().includes(lowerQuery) ||
        doc.summary?.toLowerCase().includes(lowerQuery) ||
        doc.content?.toLowerCase().includes(lowerQuery) ||
        doc.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
      )
    )
  }
}