export interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: string
  user_id: string
  sources?: string[]
  confidence?: number
}

// Mock chat responses for demo
const mockResponses = [
  "Based on your uploaded documents, I can see several key patterns in your contracts. The TechCorp Software License Agreement contains standard usage rights and termination clauses with low risk level.",
  "I've analyzed your employment contracts and found that most include non-compete clauses. The Jane Smith contract has medium risk due to broad non-compete terms that may need review.",
  "Your NDA for Project Alpha contains strict confidentiality requirements. I recommend reviewing the remedies section as it may be overly broad for your jurisdiction.",
  "I found 3 contracts mentioning liability limitations. The software license has the strongest protection, while the employment contract may need additional liability clauses.",
  "The clause analysis shows that your contracts generally follow industry standards, but I recommend standardizing the termination notice periods across all agreements."
]

let messageHistory: ChatMessage[] = []

export const chatService = {
  async sendMessage(content: string, userId: string = 'demo-user'): Promise<{ userMessage: ChatMessage; assistantMessage: ChatMessage }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date().toISOString(),
      user_id: userId
    }
    
    // Generate mock AI response
    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)]
    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      content: randomResponse,
      role: 'assistant',
      timestamp: new Date().toISOString(),
      user_id: userId,
      sources: ['TechCorp License Agreement', 'Jane Smith Employment Contract'],
      confidence: 0.85 + Math.random() * 0.1
    }
    
    messageHistory.push(userMessage, assistantMessage)
    
    return { userMessage, assistantMessage }
  },

  async getMessages(userId: string = 'demo-user', limit: number = 50): Promise<ChatMessage[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return messageHistory
      .filter(msg => msg.user_id === userId)
      .slice(-limit)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  },

  async clearHistory(userId: string = 'demo-user'): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200))
    messageHistory = messageHistory.filter(msg => msg.user_id !== userId)
  }
}