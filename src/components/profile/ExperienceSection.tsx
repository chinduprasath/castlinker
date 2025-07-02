import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Plus } from "lucide-react";
import { EditProfileDialog } from "./EditProfileDialog";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useTheme } from "@/contexts/ThemeContext";

const ExperienceSection = () => {
  const [editingExperience, setEditingExperience] = useState<{type: string, index: number} | null>(null);
  const [isAddingExperience, setIsAddingExperience] = useState<string | null>(null);
  
  // In a real app, this data would come from API/context
  const experiences = {
    film: [
      {
        title: "The Last Journey",
        role: "Supporting Actor (Mark Reynolds)",
        director: "Christopher Stevens",
        company: "Universal Pictures",
        year: "2022",
        description: "Played a pivotal supporting role in this award-winning drama. Character required deep emotional range and physical transformation."
      },
      {
        title: "City Lights",
        role: "Lead Actor (David Mitchell)",
        director: "Sarah Johnson",
        company: "Paramount Pictures",
        year: "2021",
        description: "Starred as the protagonist in this critically acclaimed urban drama. Role involved extensive dialogue in multiple languages and challenging emotional scenes."
      },
      {
        title: "Eternal Echo",
        role: "Supporting Actor (Officer James)",
        director: "Michael Rodriguez",
        company: "Warner Bros",
        year: "2020",
        description: "Played a police officer in this science fiction thriller. Role included various stunt sequences and combat scenes."
      }
    ],
    television: [
      {
        title: "Criminal Minds",
        role: "Guest Star (Episode: 'Shadows')",
        director: "Various",
        company: "CBS",
        year: "2021",
        description: "Appeared as a complex antagonist in this long-running crime drama series."
      },
      {
        title: "The Morning Show",
        role: "Recurring Role (5 Episodes)",
        director: "Various",
        company: "Apple TV+",
        year: "2019-2020",
        description: "Played a recurring character across multiple episodes of this award-winning drama series."
      }
    ],
    theater: [
      {
        title: "Hamlet",
        role: "Hamlet",
        director: "Elizabeth Taylor",
        company: "Broadway Theater Company",
        year: "2019",
        description: "Lead role in this contemporary adaptation of Shakespeare's classic. Performed for a three-month run to sold-out audiences."
      },
      {
        title: "Death of a Salesman",
        role: "Biff Loman",
        director: "Robert Wilson",
        company: "West End Production",
        year: "2018",
        description: "Supporting role in this classic Arthur Miller play. Production received critical acclaim and multiple award nominations."
      }
    ]
  };

  // Form for editing experience
  const experienceForm = useForm({
    defaultValues: {
      title: "",
      role: "",
      director: "",
      company: "",
      year: "",
      description: ""
    }
  });

  const { theme } = useTheme();

  // Set form values when editing an experience
  const handleEdit = (type: string, index: number) => {
    const experience = experiences[type as keyof typeof experiences][index];
    experienceForm.reset({
      title: experience.title,
      role: experience.role,
      director: experience.director,
      company: experience.company,
      year: experience.year,
      description: experience.description
    });
    setEditingExperience({ type, index });
  };

  // Set empty form values when adding a new experience
  const handleAdd = (type: string) => {
    experienceForm.reset({
      title: "",
      role: "",
      director: "",
      company: "",
      year: "",
      description: ""
    });
    setIsAddingExperience(type);
  };

  const handleSaveExperience = async (data: any) => {
    if (editingExperience) {
      console.log(`Updating ${editingExperience.type} experience at index ${editingExperience.index}:`, data);
    } else if (isAddingExperience) {
      console.log(`Adding new ${isAddingExperience} experience:`, data);
    }
    return Promise.resolve();
  };

  const closeEditingDialogs = () => {
    setEditingExperience(null);
    setIsAddingExperience(null);
  };

  // Helper function to render experience cards
  const renderExperienceCards = (type: string, data: typeof experiences.film) => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gold">{type.charAt(0).toUpperCase() + type.slice(1)}</h3>
        <Button 
          variant="outline" 
          size="sm"
          className="text-gold border-gold/30 hover:bg-gold/10"
          onClick={() => handleAdd(type)}
        >
          <Plus className="h-4 w-4 mr-1" /> Add {type.charAt(0).toUpperCase() + type.slice(1)} Experience
        </Button>
      </div>
      <div className="space-y-4">
        {data.map((exp, index) => (
          <Card key={index} className={`${theme === 'light' ? 'bg-white border-gray-200' : 'bg-card-gradient border-gold/10'} transition-colors`}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                <h4 className={`text-lg font-medium ${theme === 'light' ? 'text-gray-900' : ''}`}>{exp.title}</h4>
                <div className="flex items-center gap-2">
                  <span className={`${theme === 'light' ? 'text-gray-500' : 'text-foreground/60'} text-sm`}>{exp.year}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-gold hover:text-gold hover:bg-gold/10"
                    onClick={() => handleEdit(type, index)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-gold mb-2">{exp.role}</p>
              <div className={`flex flex-col md:flex-row gap-2 md:gap-6 text-sm ${theme === 'light' ? 'text-gray-700' : 'text-foreground/70'} mb-4`}>
                <span>Director: {exp.director}</span>
                <span>{type === 'television' ? 'Network' : 'Production'}: {exp.company}</span>
              </div>
              <p className={`${theme === 'light' ? 'text-gray-800' : 'text-foreground/80'} text-sm`}>{exp.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Film Experience */}
      {renderExperienceCards("film", experiences.film)}
      
      {/* Television Experience */}
      {renderExperienceCards("television", experiences.television)}
      
      {/* Theater Experience */}
      {renderExperienceCards("theater", experiences.theater)}

      {/* Edit Experience Dialog */}
      <EditProfileDialog
        title={editingExperience ? `Edit ${editingExperience.type.charAt(0).toUpperCase() + editingExperience.type.slice(1)} Experience` : `Add New ${isAddingExperience ? isAddingExperience.charAt(0).toUpperCase() + isAddingExperience.slice(1) : ''} Experience`}
        description={editingExperience ? "Update your experience information" : "Add a new experience to your profile"}
        isOpen={!!editingExperience || !!isAddingExperience}
        onClose={closeEditingDialogs}
        onSave={handleSaveExperience}
      >
        <Form {...experienceForm}>
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={experienceForm.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={experienceForm.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Role</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={experienceForm.control}
                name="director"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Director</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={experienceForm.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Production Company</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={experienceForm.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={experienceForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your role and experience..." 
                      className="h-24" 
                      {...field} 
                    />
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

export default ExperienceSection;
