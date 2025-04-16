
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { AdminTeamRole, TeamMember } from "@/types/adminTypes";
import { roles } from "@/lib/adminPermissions";

interface TeamMemberListProps {
  teamMembers: TeamMember[];
  loading: boolean;
  canEditRoles: boolean;
  onEditRole: (member: TeamMember) => void;
}

const TeamMemberList = ({ 
  teamMembers, 
  loading, 
  canEditRoles, 
  onEditRole 
}: TeamMemberListProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMembers = teamMembers.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return "bg-red-500/10 text-red-500 border-red-500/30";
      case 'content_manager':
        return "bg-blue-500/10 text-blue-500 border-blue-500/30";
      case 'recruiter':
        return "bg-green-500/10 text-green-500 border-green-500/30";
      case 'moderator':
        return "bg-orange-500/10 text-orange-500 border-orange-500/30";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/30";
    }
  };

  const renderRoleBadge = (role: string) => {
    const roleInfo = roles.find(r => r.id === role) || { name: role, permissions: [] };
    return (
      <Badge className={getRoleColor(role)}>
        {roleInfo.name}
        <span className="ml-1 text-xs opacity-70">({roleInfo.permissions.length})</span>
      </Badge>
    );
  };

  return (
    <>
      <div className="flex justify-between items-center mt-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search team members..."
            className="pl-10 bg-background/50 border-gold/10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="rounded-md border border-gold/10 overflow-hidden mt-4">
        <Table>
          <TableHeader className="bg-card">
            <TableRow>
              <TableHead>Team Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  Loading team members...
                </TableCell>
              </TableRow>
            ) : filteredMembers.length > 0 ? (
              filteredMembers.map(member => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8 border border-gold/10">
                        <AvatarImage src={member.avatar_url || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{renderRoleBadge(member.role)}</TableCell>
                  <TableCell>{new Date(member.joined_date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    {canEditRoles && (
                      <Button 
                        variant="ghost" 
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-gold"
                        onClick={() => onEditRole(member)}
                      >
                        <span className="sr-only">Edit role</span>
                        Edit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  No team members found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default TeamMemberList;
