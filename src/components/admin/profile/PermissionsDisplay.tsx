
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ShieldCheck } from "lucide-react";
import { AdminPermission } from "@/types/rbacTypes";

interface PermissionsDisplayProps {
  adminRole?: any;
  adminUser?: {
    permissions?: AdminPermission[];
    role?: string;
  };
}

const PermissionsDisplay: React.FC<PermissionsDisplayProps> = ({ adminRole, adminUser }) => {
  const renderPermissions = () => {
    if (!adminUser?.permissions || adminUser.permissions.length === 0) {
      return (
        <p className="text-muted-foreground">
          No specific permissions found. You may have full access as an administrator.
        </p>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {adminUser.permissions.map((permission: AdminPermission, index: number) => (
          <Card key={index} className="bg-background/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-md capitalize">{permission.module}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-y-1">
                <div className="flex items-center gap-1 text-sm">
                  {permission.can_view ? 
                    <Check size={16} className="text-green-500" /> : 
                    <span className="w-4 h-4 flex items-center justify-center text-muted-foreground">-</span>
                  }
                  <span>View</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  {permission.can_create ? 
                    <Check size={16} className="text-green-500" /> : 
                    <span className="w-4 h-4 flex items-center justify-center text-muted-foreground">-</span>
                  }
                  <span>Create</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  {permission.can_edit ? 
                    <Check size={16} className="text-green-500" /> : 
                    <span className="w-4 h-4 flex items-center justify-center text-muted-foreground">-</span>
                  }
                  <span>Edit</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  {permission.can_delete ? 
                    <Check size={16} className="text-green-500" /> : 
                    <span className="w-4 h-4 flex items-center justify-center text-muted-foreground">-</span>
                  }
                  <span>Delete</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Role & Permissions</CardTitle>
        <CardDescription>Your access level and permissions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-lg font-medium">Current Role</h3>
          <div className="mt-2 p-3 rounded-lg bg-gold/5 border border-gold/10">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-gold" />
              <span className="font-medium">{adminRole?.name || adminUser?.role || "Administrator"}</span>
            </div>
            {adminRole?.description && (
              <p className="mt-1 text-sm text-muted-foreground">{adminRole.description}</p>
            )}
          </div>
        </div>
        
        <h3 className="text-lg font-medium mb-2">Your Permissions</h3>
        {renderPermissions()}
      </CardContent>
    </Card>
  );
};

export default PermissionsDisplay;
