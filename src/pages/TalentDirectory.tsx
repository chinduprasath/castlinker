
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { UserProfile } from "@/types/supabase";

// We're simplifying this component for now to focus on connecting with users
const TalentDirectory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [dbUsers, setDbUsers] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  
  useEffect(() => {
    if (!user) return;

    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        // Get users from profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        if (data) {
          // Filter out the current user
          const filteredUsers = user ? data.filter(u => u.id !== user.id) : data;
          setDbUsers(filteredUsers as UserProfile[]);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error",
          description: "Failed to load users",
          variant: "destructive"
        });
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();

    // Subscribe to changes in profiles table
    const channel = supabase
      .channel('profiles_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'profiles'
      }, () => {
        fetchUsers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  // New function to handle connecting with a database user
  const handleConnectUser = async (userId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You need to be logged in to connect with users",
        variant: "destructive"
      });
      return;
    }

    try {
      // Call the create_dm_chat_room function
      const { data, error } = await supabase
        .rpc('create_dm_chat_room', {
          other_user_id: userId
        }) as { data: any, error: any };
      
      if (error) throw error;
      
      if (data) {
        toast({
          title: "Success",
          description: "Chat created successfully",
        });
        
        // Navigate to chat page
        navigate("/chat");
      }
    } catch (error) {
      console.error('Error connecting with user:', error);
      toast({
        title: "Error",
        description: "Failed to connect with user",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Talent Directory</h1>
      
      {/* Search Bar */}
      <div className="mb-8">
        <Input 
          type="search" 
          placeholder="Search users..." 
          className="max-w-md"
        />
      </div>
      
      {/* User Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loadingUsers ? (
          <p>Loading users...</p>
        ) : dbUsers.length > 0 ? (
          dbUsers.map((dbUser) => (
            <Card key={dbUser.id} className="h-full">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={dbUser.avatar_url} />
                    <AvatarFallback>{dbUser.full_name?.charAt(0) || '?'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-medium">{dbUser.full_name || "User"}</h3>
                    <p className="text-sm text-muted-foreground">{dbUser.role || "Film Professional"}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{dbUser.bio || "No bio available."}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleConnectUser(dbUser.id)}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleConnectUser(dbUser.id)}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Connect
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
};

export default TalentDirectory;
