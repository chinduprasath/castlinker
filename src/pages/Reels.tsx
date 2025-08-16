import { useEffect, useMemo, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, Eye, Verified, Filter, Bookmark, MoreVertical, Play, Pause, FileText } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { Post, fetchPosts, togglePostLike, checkIfLiked } from "@/services/postsService";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const CATEGORY_OPTIONS = [
  "All",
  "Writers",
  "Actors",
  "Singers",
  "Designers",
  "Directors",
  "Editors",
  "Producers",
  "Cinematographers",
];

const SORT_OPTIONS = [
  { label: "Latest", value: "latest" },
  { label: "Most Viewed", value: "views" },
  { label: "Most Liked", value: "likes" },
  { label: "Trending", value: "trending" },
];

function MediaPreview({ post }: { post: Post }) {
  const [hover, setHover] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (post.media_type === "video" && videoRef.current) {
      if (hover) {
        videoRef.current.muted = true;
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
    if (post.media_type === "audio" && audioRef.current) {
      if (hover) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [hover, post.media_type]);

  const type = (post.media_type || "").toLowerCase();

  return (
    <div
      className="relative aspect-video w-full overflow-hidden rounded-md bg-muted"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
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
          <video
            ref={videoRef}
            src={post.media_url}
            className="h-full w-full object-cover"
            preload="metadata"
            playsInline
          />
        ) : type === "audio" ? (
          <div className="flex h-full w-full items-center justify-center p-4">
            <audio ref={audioRef} src={post.media_url} preload="none" />
            <Button size="sm" variant="secondary" className="gap-2">
              {hover ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {hover ? "Pause" : "Preview"}
            </Button>
          </div>
        ) : type === "document" ? (
          <div className="flex h-full w-full flex-col items-center justify-center text-muted-foreground">
            <FileText className="mb-2 h-8 w-8" />
            <span className="text-xs">Document</span>
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
}: {
  post: Post;
  liked: boolean;
  onToggleLike: (postId: string) => void;
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
          <MediaPreview post={post} />

          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
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

            <div className="shrink-0">
              <Badge variant="outline" className="text-[10px]">
                {post.category}
              </Badge>
            </div>
          </div>

          <p className="line-clamp-2 text-xs text-foreground/80">{post.description}</p>

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
                <span>Share</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-7 px-2 text-xs" asChild>
                <Link to={`/posts/${post.id}`}>View Details</Link>
              </Button>

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
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>{format(new Date(post.created_at), "MMM dd, yyyy")}</span>
            {post.external_url && (
              <a
                href={post.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate text-primary underline-offset-2 hover:underline"
              >
                External link
              </a>
            )}
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
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("latest");
  const [visibleCount, setVisibleCount] = useState(12);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

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
        const data = await fetchPosts();
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
      const inCat = category === "All" || (p.category || "").toLowerCase().includes(category.toLowerCase());
      const inSearch =
        !q ||
        (p.title || "").toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q) ||
        (p.creator_name || "").toLowerCase().includes(q);
      return inCat && inSearch;
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
  }, [posts, search, category, sortBy]);

  const visiblePosts = filtered.slice(0, visibleCount);

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

  if (loading) {
    return (
      <main className="container mx-auto max-w-7xl p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
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
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
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
              <ShowcaseCard key={post.id} post={post} liked={!!likedMap[post.id]} onToggleLike={handleToggleLike} />
            ))}
          </div>
        )}

        {visibleCount < filtered.length && (
          <div className="mt-6 flex justify-center">
            <Button variant="secondary" onClick={() => setVisibleCount((v) => v + 12)}>
              Load more
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}
