import React, { useState, useEffect } from 'react';
import { Search, Filter, Heart, Star, MapPin, Eye, MessageSquare, UserPlus, Award, Briefcase, Clock, ChevronDown, ChevronUp, Users, SlidersHorizontal, Grid, List, ArrowUpDown, CheckCircle, Crown, ExternalLink, Calendar, Bookmark, Share2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useTalentDirectory } from '@/hooks/useTalentDirectory';
import { useAuth } from '@/contexts/AuthContext';
import { PROFESSION_OPTIONS } from '@/types/talent';
import { toast } from 'sonner';
import TalentProfileModal from '@/components/talent/TalentProfileModal';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/integrations/firebase/client';
import { collection, addDoc, deleteDoc, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Textarea } from '@/components/ui/textarea';

const TalentDirectory = () => {
  const [isGridView, setIsGridView] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const { 
    talents,
    filters,
    updateFilters,
    locations,
    resetFilters,
    PROFESSION_OPTIONS: professionOptions,
    likedProfiles,
    wishlistedProfiles,
    totalCount,
    pageSize,
    currentPage,
    totalPages,
    toggleLike,
    toggleWishlist,
    sendConnectionRequest,
    shareProfile,
    sendMessage,
    changePage
  } = useTalentDirectory();
  const { user } = useAuth();
  const { toast: useToastHook } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [connectionRequests, setConnectionRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareProfileId, setShareProfileId] = useState<string | null>(null);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageProfile, setMessageProfile] = useState<any>(null);
  const [messageSubject, setMessageSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [saving, setSaving] = useState<string | null>(null);
  const [liking, setLiking] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
    fetchConnectionRequests();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Fetch all users from users (not users_management)
      const usersCollection = collection(db, 'users');
      const querySnapshot = await getDocs(usersCollection);
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Filter: Only show users with a valid email and name (likely real/authenticated users)
      const filtered = usersData.filter(u => {
        const name = (u as any).name;
        const email = (u as any).email;
        return name && email && name !== 'N/A' && email !== 'N/A' && name.trim() !== '' && email.trim() !== '';
      });
      setUsers(filtered);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchConnectionRequests = async () => {
    // Fetch connection requests for the current user
    if (!user) return;
    const requestsCollection = collection(db, 'connection_requests');
    const q = query(requestsCollection, where('requesterId', '==', user.id));
    const querySnapshot = await getDocs(q);
    setConnectionRequests(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleConnect = async (targetUser) => {
    if (!user) return;
    try {
      const requestsCollection = collection(db, 'connection_requests');
      await addDoc(requestsCollection, {
        requesterId: user.id,
        recipientId: targetUser.id,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
      toast.success('Connection request sent!');
      fetchConnectionRequests();
    } catch (error) {
      toast.error('Failed to send connection request.');
    }
  };

  const getConnectionStatus = (targetUserId) => {
    const req = connectionRequests.find(
      (r) => r.recipientId === targetUserId && r.requesterId === user?.id
    );
    return req ? req.status : null;
  };

  const filteredUsers = searchTerm.trim() === ''
    ? users
    : users.filter(u => u.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleOpenProfile = (profileId: string) => {
    setSelectedProfileId(profileId);
    setProfileOpen(true);
  };

  const handleCloseProfile = () => {
    setProfileOpen(false);
    setSelectedProfileId(null);
  };

  const isLiked = (profileId: string) => likedProfiles.includes(profileId);
  const isWishlisted = (profileId: string) => wishlistedProfiles.includes(profileId);

  const handleShare = (profile) => {
    setShareProfileId(profile.id);
    setShareModalOpen(true);
  };

  const handleCopyProfileLink = (profileId) => {
    const url = `${window.location.origin}/profile/${profileId}`;
    navigator.clipboard.writeText(url);
    toast.success('Profile link copied!');
  };

  const handleMessage = (profile) => {
    setMessageProfile(profile);
    setMessageSubject('');
    setMessageBody('');
    setMessageModalOpen(true);
  };

  const handleSendMessage = async () => {
    if (!user || !messageProfile) return;
    if (!messageBody.trim()) return toast.error('Message required');
    try {
      const inboxRef = collection(db, 'talent_inbox');
      await addDoc(inboxRef, {
        sender_id: user.id,
        recipient_id: messageProfile.id,
        subject: messageSubject,
        message: messageBody,
        created_at: new Date().toISOString(),
        status: 'unread',
      });
      toast.success('Message sent!');
      setMessageModalOpen(false);
    } catch (e) {
      toast.error('Failed to send message');
    }
  };

  const handleLike = async (profile) => {
    if (!user) return toast.error('Login required');
    setLiking(profile.id);
    try {
      // Toggle like in Firestore (per user)
      const likesRef = collection(db, 'talent_likes');
      const q = query(likesRef, where('profile_id', '==', profile.id), where('user_id', '==', user.id));
      const snap = await getDocs(q);
      if (!snap.empty) {
        // Unlike
        await deleteDoc(doc(db, 'talent_likes', snap.docs[0].id));
        toast.success('Unliked');
      } else {
        // Like
        await addDoc(likesRef, { profile_id: profile.id, user_id: user.id, created_at: new Date().toISOString() });
        toast.success('Liked');
      }
      fetchUsers(); // Refresh like count
    } catch (e) {
      toast.error('Failed to update like');
    } finally {
      setLiking(null);
    }
  };

  const handleSave = async (profile) => {
    if (!user) return toast.error('Login required');
    setSaving(profile.id);
    try {
      // Toggle save in Firestore (per user)
      const savesRef = collection(db, 'talent_saves');
      const q = query(savesRef, where('profile_id', '==', profile.id), where('user_id', '==', user.id));
      const snap = await getDocs(q);
      if (!snap.empty) {
        await deleteDoc(doc(db, 'talent_saves', snap.docs[0].id));
        toast.success('Removed from saved');
      } else {
        await addDoc(savesRef, { profile_id: profile.id, user_id: user.id, created_at: new Date().toISOString() });
        toast.success('Saved');
      }
    } catch (e) {
      toast.error('Failed to update saved');
    } finally {
      setSaving(null);
    }
  };

  const handleWishlist = (profileId: string) => {
    toggleWishlist(profileId);
  };

  const handlePageChange = (newPage: number) => {
    changePage(newPage);
  };

  const handleViewProfile = (profile) => {
    navigate(`/profile/${profile.id}`);
  };

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold gold-gradient-text mb-2">Talent Directory</h1>
      <p className="text-muted-foreground mb-8 text-lg">Discover and connect with talented film industry professionals from around the world.</p>
      <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
        <Input
          type="search"
          placeholder="Search by name, role, or keyword..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[220px]"
        />
        <Select onValueChange={(value) => updateFilters({ sortBy: value })}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Highest Rated" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="experience">Experience</SelectItem>
            <SelectItem value="reviews">Reviews</SelectItem>
            <SelectItem value="likes">Likes</SelectItem>
            <SelectItem value="nameAsc">Name (A-Z)</SelectItem>
            <SelectItem value="nameDesc">Name (Z-A)</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={() => setShowFilters(true)}>
          <Filter className="h-4 w-4 mr-2" /> Filters
        </Button>
      </div>
      <div className="mb-4 text-lg font-medium">
        Found <span className="text-gold">{filteredUsers.length}</span> talents
      </div>
      {isLoading ? (
        <div className="text-center py-8">Loading talents...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-8">No talents found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((u) => (
            <Card key={u.id} className="rounded-xl border border-[#bfa14a] bg-[#181818] p-4 flex flex-col shadow-sm min-h-[300px] max-w-full">
              {/* Top Section */}
              <div className="flex items-center mb-3">
                <Avatar className="h-12 w-12 border border-[#bfa14a] mr-3">
                  <AvatarImage src={u.avatar_url} alt={u.name} />
                  <AvatarFallback className="text-base font-semibold text-[#bfa14a] bg-[#181818]">{u.name?.slice(0,2).toUpperCase() || 'NA'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-[1rem] text-white truncate max-w-[100px]">{u.name}</span>
                      <span className="flex items-center gap-1 text-xs text-[#b3b3b3] mt-0.5">
                        <MapPin className="h-3 w-3 mr-0.5" />{u.location || 'Remote'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 ml-2">
                      <span className="flex items-center gap-1 text-[#bfa14a] font-medium text-sm"><Star className="h-4 w-4" />5</span>
                      <span className="flex items-center gap-1 text-red-400 font-medium text-sm"><Heart className="h-4 w-4" />2</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Experience Section */}
              <div className="flex items-center mb-3 mt-1">
                <span className="uppercase text-xs text-[#b3b3b3] tracking-wide mr-2">Experience</span>
                <span className="font-semibold text-white text-xs">years</span>
              </div>
              {/* Action Buttons Row 1 */}
              <div className="flex flex-wrap gap-2 mb-2">
                <Button variant="outline" className="flex-1 min-w-[90px] max-w-[120px] rounded-md border-[#bfa14a] text-white font-normal text-xs flex items-center justify-center gap-1 py-1 px-2 h-8 hover:bg-[#bfa14a] hover:text-black transition-colors" onClick={() => handleLike(u)}>
                  <Heart className="h-3 w-3" />{liking === u.id ? 'Unliking...' : 'Like'}
                </Button>
                <Button variant="outline" className="flex-1 min-w-[90px] max-w-[120px] rounded-md border-[#bfa14a] text-white font-normal text-xs flex items-center justify-center gap-1 py-1 px-2 h-8 hover:bg-[#bfa14a] hover:text-black transition-colors" onClick={() => handleSave(u)}>
                  <Bookmark className="h-3 w-3" />{saving === u.id ? 'Saving...' : 'Save'}
                </Button>
                <Button variant="outline" className="flex-1 min-w-[90px] max-w-[120px] rounded-md border-[#bfa14a] text-white font-normal text-xs flex items-center justify-center gap-1 py-1 px-2 h-8 hover:bg-[#bfa14a] hover:text-black transition-colors" onClick={() => handleShare(u)}>
                  <Share2 className="h-3 w-3" />{shareModalOpen ? 'Sharing...' : 'Share'}
                </Button>
              </div>
              {/* Action Buttons Row 2 */}
              <div className="flex flex-wrap gap-2 mt-auto">
                <Button variant="outline" className="flex-1 min-w-[90px] max-w-[120px] rounded-md bg-black text-white font-normal text-xs flex items-center justify-center gap-1 py-1 px-2 h-8 border border-black hover:bg-[#222] transition-colors" onClick={() => handleMessage(u)}>
                  <MessageSquare className="h-3 w-3" />{messageModalOpen ? 'Sending...' : 'Message'}
                </Button>
                <Button
                  variant="default"
                  className="flex-1 min-w-[90px] max-w-[120px] rounded-md bg-[#bfa14a] text-black font-normal text-xs flex items-center justify-center gap-1 py-1 px-2 h-8 border border-[#bfa14a] hover:bg-[#e2b93b] transition-colors"
                  onClick={() => handleConnect(u)}
                  disabled={getConnectionStatus(u.id) === 'pending'}
                >
                  <UserPlus className="h-3 w-3" />{getConnectionStatus(u.id) === 'pending' ? 'Requested' : 'Connect'}
                </Button>
                <Button variant="default" className="flex-1 min-w-[90px] max-w-[120px] rounded-md bg-[#bfa14a] text-black font-normal text-xs flex items-center justify-center gap-1 py-1 px-2 h-8 border border-[#bfa14a] hover:bg-[#e2b93b] transition-colors" onClick={() => handleViewProfile(u)}>
                  <Eye className="h-3 w-3" />View Profile
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      <Dialog open={showFilters} onOpenChange={setShowFilters}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Filters</DialogTitle>
            <DialogDescription>Customize your talent search</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Label>Role</Label>
            <Select onValueChange={(value: string) => updateFilters({ profession: value })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {['Actor', 'Director', 'Producer', 'Writer', 'Editor', 'Cinematographer'].map((role) => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowFilters(false)}>Close</Button>
            <Button onClick={() => { setShowFilters(false); resetFilters(); }}>Reset Filters</Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Button onClick={() => handleCopyProfileLink(shareProfileId)}>Copy Profile Link</Button>
            <div className="flex gap-2">
              <Button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(window.location.origin + '/profile/' + shareProfileId)}`)}>WhatsApp</Button>
              <Button onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin + '/profile/' + shareProfileId)}`)}>LinkedIn</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={messageModalOpen} onOpenChange={setMessageModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Subject (optional)" value={messageSubject} onChange={e => setMessageSubject(e.target.value)} />
            <Textarea placeholder="Type your message..." value={messageBody} onChange={e => setMessageBody(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMessageModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSendMessage}>Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TalentDirectory;
