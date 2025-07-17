import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Upload,
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Folder,
  FolderPlus,
  FolderOpen,
  Trash2,
  Move,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { DataService } from '@/lib/data'
import { Document, Folder as FolderType } from '@/lib/blink'
import { TourButton } from '@/components/tour/TourButton'

export function DocumentViewer() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [folders, setFolders] = useState<FolderType[]>([])
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [selectedFolder, setSelectedFolder] = useState<string | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    name: '',
    type: 'Contract' as Document['type'],
    folderId: undefined as string | undefined
  })

  const loadData = () => {
    try {
      const allFolders = DataService.getFolders()
      const allDocuments = DataService.getDocuments()
      setFolders(allFolders)
      setDocuments(allDocuments)
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  useEffect(() => {
    try {
      DataService.initializeData()
      const allFolders = DataService.getFolders()
      const allDocuments = DataService.getDocuments()
      setFolders(allFolders)
      setDocuments(allDocuments)
      
      // Set initial document if none selected
      if (allDocuments.length > 0) {
        setSelectedDocument(allDocuments[0])
      }
    } catch (error) {
      console.error('Error initializing data:', error)
    }
  }, [])

  const filteredDocuments = documents.filter(doc => {
    const matchesFolder = selectedFolder === undefined || doc.folderId === selectedFolder
    const matchesSearch = searchQuery === '' || 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFolder && matchesSearch
  })

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return
    
    const newFolder: FolderType = {
      id: `folder_${Date.now()}`,
      name: newFolderName,
      userId: 'demo_user',
      createdAt: new Date().toISOString(),
      documentCount: 0
    }
    
    DataService.saveFolder(newFolder)
    setNewFolderName('')
    setShowNewFolderDialog(false)
    loadData()
  }

  const handleDeleteFolder = (folderId: string) => {
    DataService.deleteFolder(folderId)
    if (selectedFolder === folderId) {
      setSelectedFolder(undefined)
    }
    loadData()
  }

  const handleUploadDocument = () => {
    if (!uploadForm.name.trim()) return
    
    const newDocument: Document = {
      id: `doc_${Date.now()}`,
      name: uploadForm.name,
      type: uploadForm.type,
      status: 'Processing',
      uploadedAt: new Date().toISOString(),
      size: `${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 9) + 1} MB`,
      clauses: Math.floor(Math.random() * 20) + 5,
      risks: Math.floor(Math.random() * 4),
      summary: 'Document is being processed by AI for analysis and clause extraction.',
      userId: 'demo_user',
      folderId: uploadForm.folderId,
      tags: []
    }
    
    DataService.saveDocument(newDocument)
    setUploadForm({ name: '', type: 'Contract', folderId: undefined })
    setShowUploadDialog(false)
    setIsUploading(true)
    
    // Simulate processing
    setTimeout(() => {
      newDocument.status = 'Analyzed'
      newDocument.summary = `AI analysis complete. Document contains ${newDocument.clauses} clauses with ${newDocument.risks} potential risks identified.`
      DataService.saveDocument(newDocument)
      setIsUploading(false)
      loadData()
    }, 3000)
    
    loadData()
  }

  const handleDeleteDocument = (documentId: string) => {
    DataService.deleteDocument(documentId)
    if (selectedDocument?.id === documentId) {
      const remainingDocs = documents.filter(d => d.id !== documentId)
      setSelectedDocument(remainingDocs.length > 0 ? remainingDocs[0] : null)
    }
    loadData()
  }

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'Analyzed':
        return <CheckCircle className="h-3 w-3" />
      case 'Processing':
        return <Clock className="h-3 w-3 animate-spin" />
      case 'Reviewed':
        return <CheckCircle className="h-3 w-3" />
      default:
        return <AlertTriangle className="h-3 w-3" />
    }
  }

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'Analyzed':
        return 'default'
      case 'Processing':
        return 'secondary'
      case 'Reviewed':
        return 'outline'
      default:
        return 'destructive'
    }
  }

  return (
    <div className="flex h-full bg-background min-h-screen">
      {/* Sidebar with Folders */}
      <div className="w-64 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Folders</h2>
            <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
              <DialogTrigger asChild>
                <Button size="sm" variant="ghost">
                  <FolderPlus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Folder</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="folder-name">Folder Name</Label>
                    <Input
                      id="folder-name"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      placeholder="Enter folder name..."
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowNewFolderDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateFolder}>Create</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            <Button
              variant={selectedFolder === undefined ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setSelectedFolder(undefined)}
            >
              <FolderOpen className="mr-2 h-4 w-4" />
              All Documents
              <Badge variant="outline" className="ml-auto">
                {documents.length}
              </Badge>
            </Button>
            
            {folders.map((folder) => (
              <ContextMenu key={folder.id}>
                <ContextMenuTrigger>
                  <Button
                    variant={selectedFolder === folder.id ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedFolder(folder.id)}
                  >
                    <Folder className="mr-2 h-4 w-4" />
                    {folder.name}
                    <Badge variant="outline" className="ml-auto">
                      {folder.documentCount}
                    </Badge>
                  </Button>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem onClick={() => handleDeleteFolder(folder.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Folder
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Document List */}
      <div className="w-1/3 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">
              {selectedFolder ? folders.find(f => f.id === selectedFolder)?.name : 'All Documents'}
            </h1>
            <div className="flex items-center gap-2">
              <TourButton />
              <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                <DialogTrigger asChild>
                  <Button size="sm" disabled={isUploading}>
                    <Upload className="mr-2 h-4 w-4" />
                    {isUploading ? 'Processing...' : 'Upload'}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Document</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="doc-name">Document Name</Label>
                      <Input
                        id="doc-name"
                        value={uploadForm.name}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter document name..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="doc-type">Document Type</Label>
                      <Select
                        value={uploadForm.type}
                        onValueChange={(value) => setUploadForm(prev => ({ ...prev, type: value as Document['type'] }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Contract">Contract</SelectItem>
                          <SelectItem value="M&A">M&A</SelectItem>
                          <SelectItem value="Template">Template</SelectItem>
                          <SelectItem value="NDA">NDA</SelectItem>
                          <SelectItem value="Employment">Employment</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="doc-folder">Folder</Label>
                      <Select
                        value={uploadForm.folderId || 'none'}
                        onValueChange={(value) => setUploadForm(prev => ({ 
                          ...prev, 
                          folderId: value === 'none' ? undefined : value 
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Folder</SelectItem>
                          {folders.map(folder => (
                            <SelectItem key={folder.id} value={folder.id}>
                              {folder.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleUploadDocument}>Upload</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            {filteredDocuments.map((doc) => (
              <ContextMenu key={doc.id}>
                <ContextMenuTrigger>
                  <Card
                    className={`cursor-pointer transition-all hover:bg-accent/50 ${
                      selectedDocument?.id === doc.id ? 'ring-2 ring-primary bg-accent/30' : ''
                    }`}
                    onClick={() => setSelectedDocument(doc)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <Badge variant="outline" className="text-xs">
                            {doc.type}
                          </Badge>
                        </div>
                        <Badge
                          variant={getStatusColor(doc.status)}
                          className="text-xs"
                        >
                          {getStatusIcon(doc.status)}
                          {doc.status}
                        </Badge>
                      </div>
                      
                      <h3 className="font-medium text-sm mb-1 line-clamp-2">{doc.name}</h3>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                        <span>{doc.size}</span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2 text-xs">
                        <span className="text-muted-foreground">{doc.clauses} clauses</span>
                        {doc.risks > 0 ? (
                          <span className="text-orange-400 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {doc.risks} risks
                          </span>
                        ) : (
                          <span className="text-green-400 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            No risks
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem onClick={() => setSelectedDocument(doc)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Document
                  </ContextMenuItem>
                  <ContextMenuItem>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => handleDeleteDocument(doc.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))}
            
            {filteredDocuments.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No documents found</p>
                <p className="text-sm">Try adjusting your search or upload a new document</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Document Viewer */}
      <div className="flex-1 flex flex-col">
        {selectedDocument ? (
          <>
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{selectedDocument.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    Uploaded on {new Date(selectedDocument.uploadedAt).toLocaleDateString()} • {selectedDocument.size}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Share</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-400"
                        onClick={() => handleDeleteDocument(selectedDocument.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            <div className="flex-1 p-4">
              <Tabs defaultValue="summary" className="h-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="clauses">Clauses</TabsTrigger>
                  <TabsTrigger value="risks">Risks</TabsTrigger>
                  <TabsTrigger value="full">Full Text</TabsTrigger>
                </TabsList>

                <TabsContent value="summary" className="space-y-4 h-full">
                  <ScrollArea className="h-full">
                    <div className="space-y-4 pr-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Document Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            {selectedDocument.summary}
                          </p>
                          
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <div className="font-medium">Document Type</div>
                              <div className="text-muted-foreground">{selectedDocument.type}</div>
                            </div>
                            <div>
                              <div className="font-medium">Total Clauses</div>
                              <div className="text-muted-foreground">{selectedDocument.clauses}</div>
                            </div>
                            <div>
                              <div className="font-medium">Risk Level</div>
                              <div className={selectedDocument.risks > 0 ? 'text-orange-400' : 'text-green-400'}>
                                {selectedDocument.risks > 0 ? `${selectedDocument.risks} risks found` : 'Low risk'}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Key Highlights</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                              <span>Standard termination clauses present</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                              <span>Confidentiality provisions included</span>
                            </li>
                            {selectedDocument.risks > 0 && (
                              <>
                                <li className="flex items-start gap-2">
                                  <AlertTriangle className="h-4 w-4 text-orange-400 mt-0.5" />
                                  <span>Non-compete clause may be overly restrictive</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <AlertTriangle className="h-4 w-4 text-orange-400 mt-0.5" />
                                  <span>Missing force majeure provision</span>
                                </li>
                              </>
                            )}
                          </ul>
                        </CardContent>
                      </Card>

                      {selectedDocument.tags && selectedDocument.tags.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">Tags</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-2">
                              {selectedDocument.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="clauses" className="space-y-4 h-full">
                  <ScrollArea className="h-full">
                    <div className="space-y-4 pr-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Extracted Clauses</CardTitle>
                          <CardDescription>
                            AI-identified legal clauses and their analysis
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium">Termination Clause</h4>
                                <Badge variant="outline">Standard</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                "Either party may terminate this agreement with thirty (30) days written notice..."
                              </p>
                              <div className="text-xs text-muted-foreground">
                                Section 8.1 • Page 3
                              </div>
                            </div>

                            {selectedDocument.risks > 0 && (
                              <div className="border rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-medium">Non-Compete Clause</h4>
                                  <Badge variant="destructive">High Risk</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  "Employee agrees not to engage in any competing business for a period of two (2) years..."
                                </p>
                                <div className="text-xs text-muted-foreground">
                                  Section 12.3 • Page 5
                                </div>
                              </div>
                            )}

                            <div className="border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium">Confidentiality Clause</h4>
                                <Badge variant="default">Compliant</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                "Employee shall maintain confidentiality of all proprietary information..."
                              </p>
                              <div className="text-xs text-muted-foreground">
                                Section 9.2 • Page 4
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="risks" className="space-y-4 h-full">
                  <ScrollArea className="h-full">
                    <div className="space-y-4 pr-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Risk Analysis</CardTitle>
                          <CardDescription>
                            Potential legal risks and recommendations
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {selectedDocument.risks > 0 ? (
                            <div className="space-y-4">
                              <div className="border border-orange-500/20 rounded-lg p-4 bg-orange-500/5">
                                <div className="flex items-start gap-3">
                                  <AlertTriangle className="h-5 w-5 text-orange-400 mt-0.5" />
                                  <div className="flex-1">
                                    <h4 className="font-medium text-orange-300">Overly Restrictive Non-Compete</h4>
                                    <p className="text-sm text-orange-200/80 mt-1">
                                      The two-year non-compete period may be unenforceable in some jurisdictions.
                                    </p>
                                    <div className="mt-2">
                                      <Badge variant="outline" className="text-xs border-orange-500/30">
                                        Recommendation: Reduce to 12 months
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="border border-orange-500/20 rounded-lg p-4 bg-orange-500/5">
                                <div className="flex items-start gap-3">
                                  <AlertTriangle className="h-5 w-5 text-orange-400 mt-0.5" />
                                  <div className="flex-1">
                                    <h4 className="font-medium text-orange-300">Missing Force Majeure</h4>
                                    <p className="text-sm text-orange-200/80 mt-1">
                                      No force majeure clause to protect against unforeseeable circumstances.
                                    </p>
                                    <div className="mt-2">
                                      <Badge variant="outline" className="text-xs border-orange-500/30">
                                        Recommendation: Add standard force majeure provision
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-400" />
                              <p className="text-green-400 font-medium">No risks identified</p>
                              <p className="text-sm text-muted-foreground">This document appears to be compliant with standard legal requirements.</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="full" className="space-y-4 h-full">
                  <ScrollArea className="h-full">
                    <div className="space-y-4 pr-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Full Document Text</CardTitle>
                          <CardDescription>
                            Complete extracted text with AI annotations
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-muted/30 rounded-lg p-4 text-sm font-mono">
                            <div className="space-y-4 whitespace-pre-wrap">
                              {selectedDocument.content || `Document content for ${selectedDocument.name} would appear here. This is a demo version showing the structure and layout of the full document text extraction feature.

The AI would extract and display the complete text content of the uploaded document, maintaining formatting and structure while highlighting important clauses and sections.`}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">No Document Selected</h3>
              <p className="text-muted-foreground">Select a document from the list to view its details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}