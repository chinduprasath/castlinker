import { useEffect, useMemo, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, Eye, Verified, Filter, Bookmark, MoreVertical, Play, Pause, FileText, User, Music, Video, Image, File } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useAuth } from "@/hooks/useAuth";
import { Post, fetchPosts, togglePostLike, checkIfLiked } from "@/services/postsService";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ProfileModal } from "@/components/reels/ProfileModal";
import { ImageModal } from "@/components/reels/ImageModal";
import { VideoModal } from "@/components/reels/VideoModal";
import { DocumentModal } from "@/components/reels/DocumentModal";
import { AudioModal } from "@/components/reels/AudioModal";
import { dummyReelsData } from "@/utils/dummyReelsData";

const MEDIA_TYPE_OPTIONS = [
  { label: "All", value: "all", icon: Filter },
  { label: "Images", value: "image", icon: Image },
  { label: "Videos", value: "video", icon: Video },
  { label: "Documents", value: "document", icon: File },
  { label: "Scripts", value: "script", icon: FileText },
  { label: "Audio", value: "audio", icon: Music },
];

const CATEGORY_OPTIONS = [
  "All",
  "Photography",
  "Fashion", 
  "Cinematography",
  "Performance",
  "Education",
  "Writing",
  "Music",
  "Behind the Scenes",
];

const SORT_OPTIONS = [
  { label: "Latest", value: "latest" },
  { label: "Most Viewed", value: "views" },
  { label: "Most Liked", value: "likes" },
  { label: "Trending", value: "trending" },
];

function MediaPreview({ 
  post, 
  onMediaClick 
}: { 
  post: Post;
  onMediaClick: () => void;
}) {
  const [hover, setHover] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const type = (post.media_type || "").toLowerCase();

  const handleAudioToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (isAudioPlaying) {
      audio.pause();
      setIsAudioPlaying(false);
    } else {
      audio.play();
      setIsAudioPlaying(true);
    }
  };

  return (
    <div
      className="relative aspect-video w-full overflow-hidden rounded-md bg-muted cursor-pointer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onMediaClick}
    >
      {post.media_url ? (
        type === "image" ? (
          <img
            src={post.media_url}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : type === "video" ? (
          <div className="relative h-full w-full">
            <img
              src={post.media_url}
              alt={post.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="rounded-full bg-white/90 p-3">
                <Play className="h-6 w-6 text-black ml-1" />
              </div>
            </div>
          </div>
        ) : type === "audio" ? (
          <div className="flex h-full w-full items-center justify-center p-4 bg-gradient-to-br from-primary/10 to-primary/30">
            <audio 
              ref={audioRef} 
              src={post.media_url} 
              preload="none"
              onEnded={() => setIsAudioPlaying(false)}
            />
            <Button 
              size="lg" 
              variant="secondary" 
              className="gap-2 rounded-full"
              onClick={handleAudioToggle}
            >
              {isAudioPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              {isAudioPlaying ? "Pause" : "Play"}
            </Button>
          </div>
        ) : type === "document" || type === "script" ? (
          <div className="flex h-full w-full flex-col items-center justify-center text-muted-foreground bg-gradient-to-br from-muted to-muted/50">
            <FileText className="mb-2 h-12 w-12" />
            <span className="text-sm font-medium">{type === "script" ? "Script" : "Document"}</span>
          </div>
        ) : (
          <img
            src={post.media_url}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        )
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center text-muted-foreground">
          <FileText className="mb-2 h-8 w-8" />
          <span className="text-xs">No media</span>
        </div>
      )}
    </div>
  );
}

function ShowcaseCard({
  post,
  liked,
  onToggleLike,
  onViewProfile,
  onMediaClick,
}: {
  post: Post;
  liked: boolean;
  onToggleLike: (postId: string) => void;
  onViewProfile: () => void;
  onMediaClick: () => void;
}) {
  const creatorName = post.creator_name || "Anonymous";
  const creatorRole = post.creator_profession || "Talent";
  const likeCount = post.like_count ?? 0;
  const views = (post as any).views_count || (post as any).view_count || 0;
  const comments = (post as any).comments_count || 0;
  const isVerified = (post as any).creator_verified || (post as any).verified || false;

  return (
    <Card className="group flex h-full flex-col overflow-hidden">
      <CardContent className="p-3">
        <div className="space-y-3">
          <MediaPreview post={post} onMediaClick={onMediaClick} />

          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="line-clamp-1 text-sm font-semibold">{post.title}</h3>
              <div className="mt-1 flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={undefined} alt={creatorName} />
                  <AvatarFallback className="text-[10px]">
                    {creatorName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span className="truncate">{creatorName}</span>
                  <span>•</span>
                  <span className="truncate">{creatorRole}</span>
                  {isVerified && (
                    <Badge variant="secondary" className="ml-1 inline-flex items-center gap-1">
                      <Verified className="h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          <p className="line-clamp-2 text-xs text-foreground/80">{post.description}</p>

          {/* Icons Row */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{views}</span>
              </div>
              <button
                className={cn(
                  "flex items-center gap-1 transition-colors",
                  liked ? "text-primary" : "hover:text-foreground"
                )}
                onClick={() => onToggleLike(post.id)}
              >
                <Heart className={cn("h-4 w-4", liked && "fill-current")} />
                <span>{likeCount}</span>
              </button>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span>{comments}</span>
              </div>
              <div className="flex items-center gap-1">
                <Share2 className="h-4 w-4" />
                <span>{Math.floor(Math.random() * 20) + 5}</span>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="gap-2">
                  <Bookmark className="h-4 w-4" />
                  Save Post
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  Report/Flag
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Bottom Row: Date and View Profile Button */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {format(new Date(post.created_at), "MMM dd, yyyy")}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-7 px-3 text-xs"
              onClick={onViewProfile}
            >
              <User className="h-3 w-3 mr-1" />
              View Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Reels() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [mediaType, setMediaType] = useState("all");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  const POSTS_PER_PAGE = 12;

  // Modal states
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; title: string } | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<{ url: string; title: string; type: 'document' | 'script' } | null>(null);
  const [selectedAudio, setSelectedAudio] = useState<{ url: string; title: string } | null>(null);

  // Basic SEO
  useEffect(() => {
    document.title = "Reels – Talent Showcase Feed";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Discover and showcase cine talents: writers, actors, singers, designers and more. Browse media previews and engage with posts.");

    const rel = document.querySelector('link[rel="canonical"]');
    if (!rel) {
      const link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      link.setAttribute("href", window.location.origin + "/reels");
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use dummy data instead of fetchPosts for demo
        const data = dummyReelsData;
        setPosts(data);
        // Preload likes for current user
        if (user?.id) {
          const results = await Promise.all(
            data.map(async (p) => ({ id: p.id, liked: await checkIfLiked(p.id, user.id!) }))
          );
          const map: Record<string, boolean> = {};
          results.forEach((r) => (map[r.id] = r.liked));
          setLikedMap(map);
        }
      } catch (e: any) {
        setError(e?.message || "Failed to load posts");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.id]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let arr = posts.filter((p) => {
      const inMediaType = mediaType === "all" || (p.media_type || "").toLowerCase() === mediaType;
      const inCat = category === "All" || (p.category || "").toLowerCase().includes(category.toLowerCase());
      const inSearch =
        !q ||
        (p.title || "").toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q) ||
        (p.creator_name || "").toLowerCase().includes(q);
      return inMediaType && inCat && inSearch;
    });

    switch (sortBy) {
      case "likes":
        arr = arr.sort((a, b) => (b.like_count || 0) - (a.like_count || 0));
        break;
      case "views":
        arr = arr.sort(
          (a: any, b: any) => (b.views_count || b.view_count || 0) - (a.views_count || a.view_count || 0)
        );
        break;
      case "trending":
        arr = arr.sort((a: any, b: any) => {
          const score = (x: any) => (x.like_count || 0) * 2 + (x.views_count || x.view_count || 0) * 0.2 - (Date.now() - new Date(x.created_at).getTime()) / 1e9;
          return score(b) - score(a);
        });
        break;
      default:
        arr = arr.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    return arr;
  }, [posts, search, mediaType, category, sortBy]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, mediaType, category, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const visiblePosts = filtered.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const handleToggleLike = async (postId: string) => {
    if (!user?.id) {
      toast({ title: "Login required", description: "Please login to like posts.", variant: "destructive" });
      return;
    }
    const prev = likedMap[postId] || false;
    setLikedMap({ ...likedMap, [postId]: !prev });
    const result = await togglePostLike(postId, user.id);
    if (result === null) {
      // revert on error
      setLikedMap({ ...likedMap, [postId]: prev });
      toast({ title: "Failed", description: "Could not update like.", variant: "destructive" });
    }
  };

  const handleViewProfile = (post: Post) => {
    setSelectedProfile({
      name: post.creator_name || "Anonymous",
      profession: post.creator_profession || "Talent",
      verified: (post as any).creator_verified || false,
      bio: "Passionate creator dedicated to producing high-quality content and connecting with audiences through meaningful storytelling.",
      location: "Los Angeles, CA",
      joinDate: "January 2023",
      followers: Math.floor(Math.random() * 5000) + 1000,
      following: Math.floor(Math.random() * 1000) + 100,
      posts: Math.floor(Math.random() * 50) + 10,
      likes: Math.floor(Math.random() * 10000) + 1000,
    });
  };

  const handleMediaClick = (post: Post) => {
    const type = (post.media_type || "").toLowerCase();
    
    switch (type) {
      case "image":
        setSelectedImage({ url: post.media_url || "", title: post.title });
        break;
      case "video":
        setSelectedVideo({ url: post.media_url || "", title: post.title });
        break;
      case "document":
        setSelectedDocument({ url: post.media_url || "", title: post.title, type: "document" });
        break;
      case "script":
        setSelectedDocument({ url: post.media_url || "", title: post.title, type: "script" });
        break;
      case "audio":
        setSelectedAudio({ url: post.media_url || "", title: post.title });
        break;
    }
  };

  if (loading) {
    return (
      <main className="container mx-auto max-w-7xl p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Card key={i} className="h-72 animate-pulse" />
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto max-w-7xl p-4">
        <p className="text-destructive">{error}</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-7xl p-4">
      <header className="sticky top-0 z-20 mb-4 rounded-md border bg-background/95 p-3 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <h1 className="sr-only">Talent showcase posts</h1>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <div className="relative">
              <Input
                placeholder="Search by title, description, or creator"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-8"
              />
              <Filter className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
          <div className="flex w-full gap-2 sm:w-auto">
            <Select value={mediaType} onValueChange={setMediaType}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Media Type" />
              </SelectTrigger>
              <SelectContent className="bg-background border">
                {MEDIA_TYPE_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-background border">
                {CATEGORY_OPTIONS.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-background border">
                {SORT_OPTIONS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <section aria-label="Posts feed" className="">
        {visiblePosts.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">No posts found.</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visiblePosts.map((post) => (
              <ShowcaseCard 
                key={post.id} 
                post={post} 
                liked={!!likedMap[post.id]} 
                onToggleLike={handleToggleLike}
                onViewProfile={() => handleViewProfile(post)}
                onMediaClick={() => handleMediaClick(post)}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(currentPage - 1);
                      }}
                    />
                  </PaginationItem>
                )}
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(pageNum);
                        }}
                        isActive={currentPage === pageNum}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(currentPage + 1);
                      }}
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </section>

      {/* Modals */}
      {selectedProfile && (
        <ProfileModal
          isOpen={!!selectedProfile}
          onClose={() => setSelectedProfile(null)}
          profile={selectedProfile}
        />
      )}

      {selectedImage && (
        <ImageModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage.url}
          title={selectedImage.title}
        />
      )}

      {selectedVideo && (
        <VideoModal
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          videoUrl={selectedVideo.url}
          title={selectedVideo.title}
        />
      )}

      {selectedDocument && (
        <DocumentModal
          isOpen={!!selectedDocument}
          onClose={() => setSelectedDocument(null)}
          documentUrl={selectedDocument.url}
          title={selectedDocument.title}
          type={selectedDocument.type}
        />
      )}

      {selectedAudio && (
        <AudioModal
          isOpen={!!selectedAudio}
          onClose={() => setSelectedAudio(null)}
          audioUrl={selectedAudio.url}
          title={selectedAudio.title}
        />
      )}
    </main>
  );
}
