import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { EditProfileDialog } from "./EditProfileDialog";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useTheme } from "@/contexts/ThemeContext";

const AboutSection = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { theme } = useTheme();
  
  // In a real app, this data would come from API/context
  const about = {
    bio: `Award-winning actor with over 10 years of experience in film, television, and theater. Specialized in dramatic roles with a strong background in method acting. I've worked with directors such as Christopher Nolan and Denis Villeneuve on major studio productions.
    
    Currently seeking challenging roles that push artistic boundaries. Open to both independent and major studio projects.`,
    details: [
      { label: "Age Range", value: "30-40" },
      { label: "Height", value: "6'1\" (185 cm)" },
      { label: "Weight", value: "180 lbs (82 kg)" },
      { label: "Hair Color", value: "Brown" },
      { label: "Eye Color", value: "Blue" },
      { label: "Languages", value: "English (Native), Spanish (Conversational), French (Basic)" },
      { label: "Union Status", value: "SAG-AFTRA" },
      { label: "Representation", value: "Creative Artists Agency (CAA)" },
    ]
  };

  // Define form for editing about section
  const form = useForm({
    defaultValues: {
      bio: about.bio,
      ageRange: "30-40",
      height: "6'1\" (185 cm)",
      weight: "180 lbs (82 kg)",
      hairColor: "Brown",
      eyeColor: "Blue",
      languages: "English (Native), Spanish (Conversational), French (Basic)",
      unionStatus: "SAG-AFTRA",
      representation: "Creative Artists Agency (CAA)",
    }
  });

  const handleSave = async (data: any) => {
    // In a real application, this would call an API to save the data
    console.log("Saving about data:", data);
    return Promise.resolve();
  };

  return (
    <div className="space-y-6">
      <Card className={`${theme === 'light' ? 'bg-white border-gray-200' : 'bg-card-gradient border-gold/10'} transition-colors`}>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-900' : ''}`}>Biography</h3>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-gold hover:text-gold hover:bg-gold/10"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
          </div>
          <div className={`whitespace-pre-line ${theme === 'light' ? 'text-gray-800' : 'text-foreground/80'}`}>{about.bio}</div>
        </CardContent>
      </Card>
      
      <Card className={`${theme === 'light' ? 'bg-white border-gray-200' : 'bg-card-gradient border-gold/10'} transition-colors`}>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-900' : ''}`}>Details</h3>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-gold hover:text-gold hover:bg-gold/10"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {about.details.map((detail, index) => (
              <div key={index} className="flex">
                <div className={`${theme === 'light' ? 'text-gray-500' : 'text-foreground/60'} w-1/3`}>{detail.label}:</div>
                <div className={`w-2/3 font-medium ${theme === 'light' ? 'text-gray-900' : ''}`}>{detail.value}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <EditProfileDialog
        title="Edit About Information"
        description="Update your biographical information and personal details"
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSave={handleSave}
      >
        <Form {...form}>
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Biography</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Write about yourself..." 
                    className="h-32" 
                    {...field} 
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <FormField
              control={form.control}
              name="ageRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age Range</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="hairColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hair Color</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="eyeColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Eye Color</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="languages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Languages</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="unionStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Union Status</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="representation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Representation</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </Form>
      </EditProfileDialog>
    </div>
  );
};

export default AboutSection;
