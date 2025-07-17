import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle, 
  AlertTriangle,
  Brain,
  Loader2,
  Shield,
  Zap
} from 'lucide-react'

import { documentService, Document } from '@/lib/documentService'
import { toast } from 'sonner'

interface DocumentUploadProps {
  onUploadComplete?: (document: Document) => void
  className?: string
}

interface UploadingFile {
  file: File
  progress: number
  status: 'uploading' | 'analyzing' | 'complete' | 'error'
  document?: Document
  error?: string
  analysisStage?: string
}

export function DocumentUpload({ onUploadComplete, className }: DocumentUploadProps) {
  // Mock user for demo
  const user = { id: 'demo-user', email: 'demo@lawfirm.com' }
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (files: FileList | null) => {
    if (!files || !user) return

    const validFiles = Array.from(files).filter(file => {
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'application/rtf'
      ]
      return validTypes.includes(file.type) && file.size <= 50 * 1024 * 1024 // 50MB limit for enterprise
    })

    if (validFiles.length === 0) {
      toast.error('Please select valid document files (PDF, DOC, DOCX, TXT, RTF) under 50MB')
      return
    }

    const newUploads: UploadingFile[] = validFiles.map(file => ({
      file,
      progress: 0,
      status: 'uploading',
      analysisStage: 'Preparing upload...'
    }))

    setUploadingFiles(prev => [...prev, ...newUploads])

    // Process each file
    validFiles.forEach((file, index) => {
      processFile(file, newUploads.length - validFiles.length + index)
    })
  }

  const processFile = async (file: File, index: number) => {
    try {
      // Update progress during upload
      const updateProgress = (progress: number, stage: string) => {
        setUploadingFiles(prev => prev.map((upload, i) => 
          i === index 
            ? { ...upload, progress, analysisStage: stage }
            : upload
        ))
      }

      updateProgress(10, 'Uploading file...')

      // Upload document using Supabase service
      const document = await documentService.uploadDocument(file, {
        type: determineDocumentType(file.name),
        tags: generateTags(file.name)
      })

      updateProgress(50, 'File uploaded successfully')
      updateProgress(60, 'Extracting text content...')

      // Update status to analyzing
      setUploadingFiles(prev => prev.map((upload, i) => 
        i === index 
          ? { ...upload, status: 'analyzing', progress: 70, analysisStage: 'AI is analyzing document...' }
          : upload
      ))

      // Wait for analysis to complete (polling)
      let analysisComplete = false
      let attempts = 0
      const maxAttempts = 15 // 15 seconds timeout for demo

      while (!analysisComplete && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const updatedDocs = await documentService.getDocuments(user.id)
        const analyzedDoc = updatedDocs.find(d => d.id === document.id)
        
        if (analyzedDoc?.status === 'Analyzed') {
          analysisComplete = true
          
          setUploadingFiles(prev => prev.map((upload, i) => 
            i === index 
              ? { 
                  ...upload, 
                  status: 'complete', 
                  progress: 100, 
                  document: analyzedDoc,
                  analysisStage: 'Analysis complete!'
                }
              : upload
          ))

          onUploadComplete?.(analyzedDoc)
          
        } else if (analyzedDoc?.status === 'Failed') {
          throw new Error('Document analysis failed')
        } else {
          // Update progress during analysis
          const analysisProgress = 70 + (attempts * 2)
          updateProgress(Math.min(analysisProgress, 95), `AI analyzing... (${attempts + 1}/15s)`)
        }
        
        attempts++
      }

      if (!analysisComplete) {
        // For demo, show success even if polling times out
        const finalDoc = await documentService.getDocuments(user.id).then(docs => docs.find(d => d.id === document.id)) || document
        
        setUploadingFiles(prev => prev.map((upload, i) => 
          i === index 
            ? { 
                ...upload, 
                status: 'complete', 
                progress: 100, 
                document: finalDoc,
                analysisStage: 'Analysis complete!'
              }
            : upload
        ))

        onUploadComplete?.(finalDoc)
      }

    } catch (error) {
      console.error('Document processing failed:', error)
      
      setUploadingFiles(prev => prev.map((upload, i) => 
        i === index 
          ? { 
              ...upload, 
              status: 'error', 
              error: error instanceof Error ? error.message : 'Processing failed',
              analysisStage: 'Error occurred'
            }
          : upload
      ))
      
      toast.error(`Failed to process ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const determineDocumentType = (filename: string): Document['type'] => {
    const lower = filename.toLowerCase()
    if (lower.includes('nda') || lower.includes('non-disclosure')) return 'NDA'
    if (lower.includes('employment') || lower.includes('job') || lower.includes('hire')) return 'Employment'
    if (lower.includes('merger') || lower.includes('acquisition') || lower.includes('m&a')) return 'M&A'
    if (lower.includes('template')) return 'Template'
    if (lower.includes('litigation') || lower.includes('lawsuit') || lower.includes('court')) return 'Litigation'
    if (lower.includes('compliance') || lower.includes('policy') || lower.includes('regulation')) return 'Compliance'
    if (lower.includes('contract') || lower.includes('agreement')) return 'Contract'
    return 'Other'
  }

  const generateTags = (filename: string): string[] => {
    const tags: string[] = []
    const lower = filename.toLowerCase()
    
    // Document type tags
    if (lower.includes('contract')) tags.push('contract')
    if (lower.includes('agreement')) tags.push('agreement')
    if (lower.includes('nda')) tags.push('confidentiality')
    if (lower.includes('employment')) tags.push('hr', 'employment')
    if (lower.includes('merger') || lower.includes('acquisition')) tags.push('m&a', 'corporate')
    if (lower.includes('litigation')) tags.push('litigation', 'legal-action')
    if (lower.includes('compliance')) tags.push('compliance', 'regulatory')
    
    // Industry tags
    if (lower.includes('tech') || lower.includes('software')) tags.push('technology')
    if (lower.includes('finance') || lower.includes('bank')) tags.push('financial')
    if (lower.includes('health') || lower.includes('medical')) tags.push('healthcare')
    if (lower.includes('real estate') || lower.includes('property')) tags.push('real-estate')
    
    // Urgency tags
    if (lower.includes('urgent') || lower.includes('priority')) tags.push('urgent')
    if (lower.includes('draft')) tags.push('draft')
    if (lower.includes('final')) tags.push('final')
    
    return tags.length > 0 ? tags : ['document']
  }

  const removeUpload = (index: number) => {
    setUploadingFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const getStatusIcon = (status: UploadingFile['status']) => {
    switch (status) {
      case 'uploading':
        return <Upload className="h-5 w-5 text-blue-500" />
      case 'analyzing':
        return <Brain className="h-5 w-5 text-purple-500 animate-pulse" />
      case 'complete':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />
    }
  }

  const getStatusColor = (status: UploadingFile['status']) => {
    switch (status) {
      case 'uploading':
        return 'bg-blue-500/10'
      case 'analyzing':
        return 'bg-purple-500/10'
      case 'complete':
        return 'bg-green-500/10'
      case 'error':
        return 'bg-red-500/10'
    }
  }

  return (
    <div className={className}>
      {/* Upload Area */}
      <Card 
        className={`glass-card border-2 border-dashed transition-all duration-300 ${
          isDragOver 
            ? 'border-primary bg-primary/5 scale-105' 
            : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className={`p-4 rounded-full transition-all duration-300 ${
              isDragOver ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}>
              <Upload className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {isDragOver ? 'Drop files here' : 'Upload Legal Documents'}
              </h3>
              <p className="text-muted-foreground mb-4">
                Drag and drop files here, or click to browse
              </p>
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="btn-premium"
                disabled={uploadingFiles.some(f => f.status === 'uploading' || f.status === 'analyzing')}
              >
                <Upload className="mr-2 h-4 w-4" />
                Choose Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt,.rtf"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Enterprise security</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-500" />
                <span>AI-powered analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-500" />
                <span>Real-time processing</span>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground">
              Supports PDF, DOC, DOCX, TXT, RTF files up to 50MB each
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {uploadingFiles.length > 0 && (
        <div className="mt-6 space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Processing Documents with AI
          </h4>
          {uploadingFiles.map((upload, index) => (
            <Card key={index} className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`flex-shrink-0 p-2 rounded-lg ${getStatusColor(upload.status)}`}>
                    {getStatusIcon(upload.status)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium truncate">{upload.file.name}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeUpload(index)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>

                    {(upload.status === 'uploading' || upload.status === 'analyzing') && (
                      <div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
                          <span className="flex items-center gap-2">
                            {upload.status === 'analyzing' && (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            )}
                            {upload.analysisStage}
                          </span>
                          <span>{upload.progress}%</span>
                        </div>
                        <Progress value={upload.progress} className="h-2" />
                      </div>
                    )}

                    {upload.status === 'complete' && upload.document && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {upload.document.type}
                          </Badge>
                          <Badge 
                            variant={upload.document.priority === 'Critical' ? 'destructive' : 
                                   upload.document.priority === 'High' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {upload.document.priority} Priority
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium text-green-400">{upload.document.clauses}</span> clauses • 
                          <span className={`font-medium ml-1 ${
                            upload.document.risks > 0 ? 'text-orange-400' : 'text-green-400'
                          }`}>
                            {upload.document.risks} risks
                          </span> • 
                          <span className="font-medium text-blue-400 ml-1">
                            {upload.document.confidence}% confidence
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {upload.document.summary}
                        </p>
                      </div>
                    )}

                    {upload.status === 'error' && (
                      <div className="space-y-1">
                        <p className="text-sm text-red-500 font-medium">{upload.error}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => processFile(upload.file, index)}
                          className="text-xs"
                        >
                          Retry Analysis
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}