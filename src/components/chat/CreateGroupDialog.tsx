import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateGroup: (groupName: string, members: string[]) => void;
  connectedUsers: Array<{
    id: string;
    name: string;
    avatar: string;
    online?: boolean;
    role?: string;
  }>;
}

export default function CreateGroupDialog({ 
  open, 
  onOpenChange, 
  onCreateGroup,
  connectedUsers = []
}: CreateGroupDialogProps) {
  const [groupName, setGroupName] = useState("");
  const [memberInput, setMemberInput] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const handleAddMember = () => {
    if (memberInput.trim() && !selectedMembers.includes(memberInput.trim())) {
      setSelectedMembers([...selectedMembers, memberInput.trim()]);
      setMemberInput("");
    }
  };

  const handleRemoveMember = (member: string) => {
    setSelectedMembers(selectedMembers.filter(m => m !== member));
  };

  const handleCreateGroup = () => {
    if (groupName.trim() && selectedMembers.length > 0) {
      onCreateGroup(groupName.trim(), selectedMembers);
      // Reset form
      setGroupName("");
      setSelectedMembers([]);
      setMemberInput("");
      onOpenChange(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddMember();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-yellow-600 dark:text-yellow-400">Create Group Chat</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="groupName">Group Name</Label>
            <Input
              id="groupName"
              placeholder="Enter group name..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="focus-visible:ring-yellow-200 dark:focus-visible:ring-yellow-700"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="members">Add Members</Label>
            <div className="flex gap-2">
              <Input
                id="members"
                placeholder="Enter username or phone number..."
                value={memberInput}
                onChange={(e) => setMemberInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="focus-visible:ring-yellow-200 dark:focus-visible:ring-yellow-700"
              />
              <Button 
                type="button" 
                onClick={handleAddMember}
                variant="outline"
                size="icon"
                className="shrink-0"
              >
                <UserPlus size={16} />
              </Button>
            </div>
          </div>

          {selectedMembers.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Members ({selectedMembers.length})</Label>
              <div className="flex flex-wrap gap-2">
                {selectedMembers.map((member) => (
                  <Badge 
                    key={member} 
                    variant="secondary" 
                    className="flex items-center gap-1"
                  >
                    {member}
                    <X 
                      size={12} 
                      className="cursor-pointer hover:text-red-500" 
                      onClick={() => handleRemoveMember(member)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {connectedUsers.length > 0 && (
            <div className="space-y-2">
              <Label>Quick Add Connected Users</Label>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {connectedUsers.map((user) => (
                  <div 
                    key={user.id}
                    className="flex items-center justify-between p-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs">
                        {user.name.charAt(0)}
                      </div>
                      <span className="text-sm">{user.name}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (!selectedMembers.includes(user.name)) {
                          setSelectedMembers([...selectedMembers, user.name]);
                        }
                      }}
                      disabled={selectedMembers.includes(user.name)}
                    >
                      {selectedMembers.includes(user.name) ? 'Added' : 'Add'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateGroup}
            disabled={!groupName.trim() || selectedMembers.length === 0}
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            Create Group
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}