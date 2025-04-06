
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Filter, 
  MoreHorizontal, 
  Search, 
  Trash2, 
  ThumbsUp,
  Eye,
  Flag
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { ContentItem } from '@/lib/adminTypes';

const ContentModeration = () => {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<ContentItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('content_moderation')
          .select('*')
          .order('reported_at', { ascending: false });
        
        if (error) throw error;
        
        setContentItems(data as ContentItem[]);
        setFilteredItems(data as ContentItem[]);
      } catch (error) {
        console.error('Error fetching content:', error);
        toast({
          title: "Error",
          description: "Failed to load content moderation data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContent();
  }, [toast]);

  useEffect(() => {
    let filtered = [...contentItems];
    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        item => 
          item.title.toLowerCase().includes(term) || 
          item.content_type.toLowerCase().includes(term) || 
          item.reason?.toLowerCase().includes(term)
      );
    }
    
    if (activeTab !== 'all') {
      filtered = filtered.filter(item => item.status === activeTab);
    }
    
    setFilteredItems(filtered);
  }, [searchTerm, activeTab, contentItems]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-amber-500 hover:bg-amber-600 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>Pending</span>
        </Badge>;
      case 'approved':
        return <Badge className="bg-green-500 hover:bg-green-600 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          <span>Approved</span>
        </Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 hover:bg-red-600 flex items-center gap-1">
          <Trash2 className="h-3 w-3" />
          <span>Rejected</span>
        </Badge>;
      case 'resolved':
        return <Badge className="bg-blue-500 hover:bg-blue-600 flex items-center gap-1">
          <ThumbsUp className="h-3 w-3" />
          <span>Resolved</span>
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'job_post':
        return <Badge variant="outline" className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
          </svg>
          <span>Job Post</span>
        </Badge>;
      case 'profile':
        return <Badge variant="outline" className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>
          </svg>
          <span>Profile</span>
        </Badge>;
      case 'forum_post':
        return <Badge variant="outline" className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <span>Forum Post</span>
        </Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const handleApprove = (id: string) => {
    toast({
      title: "Content Approved",
      description: "The content has been approved and will remain visible",
    });
  };

  const handleReject = (id: string) => {
    toast({
      title: "Content Rejected",
      description: "The content has been rejected and is now hidden",
      variant: "destructive",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold gold-gradient-text">Content Moderation</h1>
            <p className="text-muted-foreground">Review and moderate reported content</p>
          </div>
        </div>
        
        <Card className="border-gold/10 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Reported Content</CardTitle>
                <CardDescription>
                  {!isLoading && 
                    `${filteredItems.length} ${filteredItems.length === 1 ? 'item' : 'items'} ${
                      activeTab !== 'all' ? `(${activeTab})` : ''
                    }`
                  }
                </CardDescription>
              </div>
              <div className="w-full sm:w-64">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reports..."
                    className="pl-9 bg-background/60 w-full"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="all" className="mt-4" onValueChange={handleTabChange}>
              <TabsList className="grid grid-cols-4 mb-2">
                <TabsTrigger value="all" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
                  All
                </TabsTrigger>
                <TabsTrigger value="pending" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
                  Pending
                </TabsTrigger>
                <TabsTrigger value="resolved" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
                  Resolved
                </TabsTrigger>
                <TabsTrigger value="rejected" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
                  Rejected
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reported</TableHead>
                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array(5).fill(0).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    filteredItems.length > 0 ? (
                      filteredItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.title}</TableCell>
                          <TableCell>{getContentTypeIcon(item.content_type)}</TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {item.reason || 'No reason provided'}
                          </TableCell>
                          <TableCell>{getStatusBadge(item.status)}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(item.reported_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="flex gap-2 text-green-500 focus:text-green-500"
                                    onClick={() => handleApprove(item.id)}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                    <span>Approve</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="flex gap-2">
                                    <Flag className="h-4 w-4" />
                                    <span>Flag for Review</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="flex gap-2 text-red-500 focus:text-red-500"
                                    onClick={() => handleReject(item.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span>Reject</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          {searchTerm 
                            ? 'No content found matching your search.' 
                            : activeTab !== 'all' 
                              ? `No ${activeTab} content to show.` 
                              : 'No content to moderate at this time.'}
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ContentModeration;
