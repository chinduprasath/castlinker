
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

type UsersByRole = {
  role: string;
  count: number;
};

interface UserDataVizProps {
  usersByRole: UsersByRole[];
  isLoading: boolean;
}

const UserDataViz = ({ usersByRole, isLoading }: UserDataVizProps) => {
  const [selectedProfession, setSelectedProfession] = useState<string>("all");
  
  // Filter users by profession
  const filteredUsersByRole = selectedProfession === "all" 
    ? usersByRole 
    : usersByRole.filter(item => item.role === selectedProfession);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Users by Profession</CardTitle>
            <CardDescription>Breakdown of user professional roles</CardDescription>
          </div>
          
          {/* Profession filter */}
          <Select
            value={selectedProfession}
            onValueChange={setSelectedProfession}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by profession" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Professions</SelectItem>
              <SelectItem value="actor">Actors</SelectItem>
              <SelectItem value="director">Directors</SelectItem>
              <SelectItem value="producer">Producers</SelectItem>
              <SelectItem value="writer">Writers</SelectItem>
              <SelectItem value="cinematographer">Cinematographers</SelectItem>
              <SelectItem value="agency">Agencies</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Loading user data...</p>
            </div>
          ) : filteredUsersByRole.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredUsersByRole}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="role" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Number of Users" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No user data available for the selected profession.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserDataViz;
