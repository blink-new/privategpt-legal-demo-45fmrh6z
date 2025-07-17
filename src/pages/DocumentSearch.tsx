import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Search,
  Filter,
  FileText,
  Calendar,
  Tag,
  ExternalLink,
  Clock,
  TrendingUp,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const searchResults = [
  {
    id: 1,
    title: 'Termination Clause - Smith vs. Johnson Contract',
    snippet: 'Either party may terminate this agreement with thirty (30) days written notice to the other party...',
    document: 'Smith vs. Johnson Contract.pdf',
    type: 'Contract',
    page: 3,
    section: '8.1',
    relevance: 95,
    lastModified: '2024-01-15',
  },
  {
    id: 2,
    title: 'Arbitration Provision - Corporate Merger Agreement',
    snippet: 'Any dispute arising under this Agreement shall be resolved through binding arbitration...',
    document: 'Corporate Merger Agreement.docx',
    type: 'M&A',
    page: 12,
    section: '15.3',
    relevance: 89,
    lastModified: '2024-01-14',
  },
  {
    id: 3,
    title: 'Confidentiality Terms - NDA Tech Partnership',
    snippet: 'Recipient agrees to maintain in confidence all Confidential Information received...',
    document: 'NDA - Tech Partnership.pdf',
    type: 'NDA',
    page: 2,
    section: '3.1',
    relevance: 87,
    lastModified: '2024-01-12',
  },
]

const recentSearches = [
  'termination clauses',
  'arbitration provisions',
  'force majeure',
  'indemnification',
  'non-compete agreements',
]

const popularSearches = [
  'liability limitations',
  'payment terms',
  'intellectual property',
  'governing law',
  'dispute resolution',
]

export function DocumentSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState('all')
  const [dateRange, setDateRange] = useState('all')
  const [documentType, setDocumentType] = useState('all')
  const [results, setResults] = useState(searchResults)
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = () => {
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    // Simulate search
    setTimeout(() => {
      setResults(searchResults)
      setIsSearching(false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="flex h-screen">
      {/* Search Interface */}
      <div className="flex-1 flex flex-col">
        <div className="p-6 border-b border-border/40">
          <h1 className="text-2xl font-bold mb-4">Document Search</h1>
          
          {/* Search Bar */}
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search across all legal documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-9"
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <Select value={searchType} onValueChange={setSearchType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Search type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All content</SelectItem>
                <SelectItem value="clauses">Clauses only</SelectItem>
                <SelectItem value="terms">Key terms</SelectItem>
                <SelectItem value="risks">Risk factors</SelectItem>
              </SelectContent>
            </Select>

            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="contract">Contracts</SelectItem>
                <SelectItem value="nda">NDAs</SelectItem>
                <SelectItem value="template">Templates</SelectItem>
                <SelectItem value="ma">M&A</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="week">Past week</SelectItem>
                <SelectItem value="month">Past month</SelectItem>
                <SelectItem value="quarter">Past quarter</SelectItem>
                <SelectItem value="year">Past year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search Results */}
        <div className="flex-1 p-6">
          {searchQuery ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Found {results.length} results for "{searchQuery}"
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Sort by:</span>
                  <Select defaultValue="relevance">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="document">Document</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                {results.map((result) => (
                  <Card key={result.id} className="hover:bg-accent/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-medium text-primary hover:underline cursor-pointer">
                            {result.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {result.snippet}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Badge variant="outline" className="text-xs">
                            {result.relevance}% match
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          <span>{result.document}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          <span>{result.type}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>Page {result.page}, Section {result.section}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{result.lastModified}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Search your legal documents</h3>
              <p className="text-muted-foreground mb-6">
                Find specific clauses, terms, or information across all your documents
              </p>
              
              <div className="max-w-md mx-auto">
                <Input
                  placeholder="Try searching for 'termination clauses'..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search Sidebar */}
      <div className="w-80 border-l border-border/40 p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Searches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentSearches.map((search, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-sm h-8"
                  onClick={() => setSearchQuery(search)}
                >
                  <Clock className="mr-2 h-3 w-3" />
                  {search}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Popular Searches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {popularSearches.map((search, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-sm h-8"
                  onClick={() => setSearchQuery(search)}
                >
                  <TrendingUp className="mr-2 h-3 w-3" />
                  {search}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Search Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium">Use quotes for exact phrases</p>
                <p className="text-muted-foreground">"force majeure clause"</p>
              </div>
              <div>
                <p className="font-medium">Use AND/OR for complex searches</p>
                <p className="text-muted-foreground">termination AND notice</p>
              </div>
              <div>
                <p className="font-medium">Search by document type</p>
                <p className="text-muted-foreground">type:contract liability</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}