import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { AlertTriangle, Check, FileText, Flag, MessageSquare, Search, Trash, X } from "lucide-react";

// Mock data for content moderation
const mockReportedContent = [
  {
    id: "post-1",
    title: "Unprofessional Behavior on Set",
    type: "post",
    author: "John Smith",
    reportCount: 5,
    date: "2023-09-15",
    reason: "Inappropriate content",
    excerpt: "This director was extremely unprofessional during the entire shoot...",
    status: "pending"
  },
  {
    id: "comment-1",
    title: "Reply to Job Posting",
    type: "comment",
    author: "Emma Johnson",
    reportCount: 3,
    date: "2023-09-18", 
    reason: "Spam/Scam",
    excerpt: "Check out this website to get more auditions instantly...",
    status: "pending"
  },
  {
    id: "post-2",
    title: "Fake Casting Call",
    type: "post",
    author: "Robert Davis",
    reportCount: 12,
    date: "2023-09-10",
    reason: "Misleading information",
    excerpt: "Casting call for major studio film. Send photos to personal email...",
    status: "pending"
  },
  {
    id: "job-1",
    title: "Background Actors Needed",
    type: "job",
    author: "Central Casting",
    reportCount: 2,
    date: "2023-09-20",
    reason: "Suspicious activity",
    excerpt: "Looking for background actors for upcoming film. Payment in exposure...",
    status: "pending"
  }
];

const mockContentQueue = [
  {
    id: "post-3",
    title: "Industry Workshop Announcement",
    type: "post",
    author: "Talent Academy",
    date: "2023-09-21",
    excerpt: "Join our exclusive workshop with top industry professionals...",
    status: "pending"
  },
  {
    id: "job-2",
    title: "Lead Role in Indie Film",
    type: "job",
    author: "Independent Productions",
    date: "2023-09-22",
    excerpt: "Seeking actors for lead roles in independent feature film shooting in October...",
    status: "pending"
  },
  {
    id: "event-1",
    title: "Networking Mixer for Film Professionals",
    type: "event",
    author: "Film Industry Network",
    date: "2023-09-23",
    excerpt: "Monthly networking event for actors, directors, and producers...",
    status: "pending"
  }
];

const ContentModeration = () => {
  const [reportedContent, setReportedContent] = useState(mockReportedContent);
  const [contentQueue, setContentQueue] = useState(mockContentQueue);
  const [searchTerm, setSearchTerm] = useState("");

  const handleApprove = (id: string, contentType: "reported" | "queue") => {
    if (contentType === "reported") {
      setReportedContent(reportedContent.filter(item => item.id !== id));
    } else {
      setContentQueue(contentQueue.filter(item => item.id !== id));
    }
    
    toast({
      title: "Content approved",
      description: "The content has been approved and published.",
      duration: 3000,
    });
  };

  const handleReject = (id: string, contentType: "reported" | "queue") => {
    if (contentType === "reported") {
      setReportedContent(reportedContent.filter(item => item.id !== id));
    } else {
      setContentQueue(contentQueue.filter(item => item.id !== id));
    }
    
    toast({
      title: "Content rejected",
      description: "The content has been rejected and removed.",
      duration: 3000,
    });
  };

  const filteredReportedContent = reportedContent.filter(
    item => item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           item.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredContentQueue = contentQueue.filter(
    item => item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           item.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "post":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "comment":
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case "job":
        return <FileText className="h-4 w-4 text-purple-500" />;
      case "event":
        return <FileText className="h-4 w-4 text-orange-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold gold-gradient-text">Content Moderation</h1>
      <p className="text-muted-foreground">Review and moderate user-generated content.</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search content..."
              className="w-64 pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-1">
            <Check className="h-4 w-4" /> Approve All
          </Button>
        </div>
      </div>

      <Tabs defaultValue="reported">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="reported" className="flex items-center gap-2">
            <Flag className="h-4 w-4" /> Reported Content
            <Badge variant="secondary" className="ml-1">{reportedContent.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="queue" className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> Content Queue
            <Badge variant="secondary" className="ml-1">{contentQueue.length}</Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="reported" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Reported Content</CardTitle>
              <CardDescription>Review content that has been flagged by users</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-300px)] w-full">
                <div className="divide-y divide-border">
                  {filteredReportedContent.length > 0 ? (
                    filteredReportedContent.map((item) => (
                      <div key={item.id} className="p-4 hover:bg-muted/30">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-2">
                            <div className="mt-0.5">{getTypeIcon(item.type)}</div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{item.title}</h3>
                                <Badge variant="outline" className="text-xs bg-red-500/10 text-red-500 border-red-500/20">
                                  {item.reportCount} {item.reportCount === 1 ? 'report' : 'reports'}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-3 mt-1">
                                <p className="text-xs text-muted-foreground">by {item.author}</p>
                                <p className="text-xs text-muted-foreground">posted {item.date}</p>
                                <p className="text-xs text-muted-foreground">reason: {item.reason}</p>
                              </div>
                              <p className="text-sm mt-2 text-muted-foreground">{item.excerpt}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => handleReject(item.id, "reported")}
                            >
                              <Trash className="h-4 w-4 mr-1" /> Reject
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-green-500 hover:text-green-600 hover:bg-green-50"
                              onClick={() => handleApprove(item.id, "reported")}
                            >
                              <Check className="h-4 w-4 mr-1" /> Approve
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8">
                      <AlertTriangle className="h-12 w-12 text-muted-foreground mb-2" />
                      <h3 className="font-medium text-lg">No Reported Content</h3>
                      <p className="text-muted-foreground text-center mt-1">
                        {searchTerm ? "No results match your search" : "There are no flagged items requiring review"}
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="queue" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Content Queue</CardTitle>
              <CardDescription>Review new content waiting for approval</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-300px)] w-full">
                <div className="divide-y divide-border">
                  {filteredContentQueue.length > 0 ? (
                    filteredContentQueue.map((item) => (
                      <div key={item.id} className="p-4 hover:bg-muted/30">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-2">
                            <div className="mt-0.5">{getTypeIcon(item.type)}</div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{item.title}</h3>
                                <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-500 border-amber-500/20">
                                  Awaiting Approval
                                </Badge>
                              </div>
                              <div className="flex items-center gap-3 mt-1">
                                <p className="text-xs text-muted-foreground">by {item.author}</p>
                                <p className="text-xs text-muted-foreground">submitted {item.date}</p>
                              </div>
                              <p className="text-sm mt-2 text-muted-foreground">{item.excerpt}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => handleReject(item.id, "queue")}
                            >
                              <X className="h-4 w-4 mr-1" /> Reject
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-green-500 hover:text-green-600 hover:bg-green-50"
                              onClick={() => handleApprove(item.id, "queue")}
                            >
                              <Check className="h-4 w-4 mr-1" /> Approve
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8">
                      <Check className="h-12 w-12 text-muted-foreground mb-2" />
                      <h3 className="font-medium text-lg">No Pending Content</h3>
                      <p className="text-muted-foreground text-center mt-1">
                        {searchTerm ? "No results match your search" : "All content has been reviewed"}
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentModeration;
