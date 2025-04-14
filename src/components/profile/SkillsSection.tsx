
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { EditProfileDialog } from "./EditProfileDialog";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useForm } from "react-hook-form";

const SkillsSection = () => {
  const [isEditingActing, setIsEditingActing] = useState(false);
  const [isEditingTechnical, setIsEditingTechnical] = useState(false);
  const [isEditingSpecial, setIsEditingSpecial] = useState(false);
  const [isEditingPhysical, setIsEditingPhysical] = useState(false);
  
  // In a real app, this data would come from API/context
  const skills = {
    acting: [
      { name: "Method Acting", level: 90 },
      { name: "Improvisation", level: 85 },
      { name: "Voice Control", level: 75 },
      { name: "Character Development", level: 95 },
      { name: "Emotional Range", level: 88 }
    ],
    technical: [
      { name: "Stage Combat", level: 70 },
      { name: "Stunt Work", level: 65 },
      { name: "Dialect/Accent Work", level: 80 },
      { name: "Camera Awareness", level: 85 }
    ],
    specialSkills: [
      "Horseback Riding",
      "Swimming",
      "Classical Piano",
      "Fluent in Spanish",
      "Martial Arts (Karate)",
      "Ballroom Dancing",
      "Fencing",
      "Stage Combat",
      "Professional Singing (Tenor)"
    ],
    physicalAttributes: [
      { name: "Height", value: "6'1\" (185 cm)" },
      { name: "Weight", value: "180 lbs (82 kg)" },
      { name: "Build", value: "Athletic" },
      { name: "Hair Color", value: "Brown" },
      { name: "Eye Color", value: "Blue" }
    ]
  };

  // Forms for each section
  const actingForm = useForm({
    defaultValues: {
      acting: skills.acting.map(skill => ({
        name: skill.name,
        level: skill.level
      }))
    }
  });

  const technicalForm = useForm({
    defaultValues: {
      technical: skills.technical.map(skill => ({
        name: skill.name,
        level: skill.level
      }))
    }
  });

  const specialSkillsForm = useForm({
    defaultValues: {
      specialSkills: skills.specialSkills.join(", ")
    }
  });

  const physicalAttributesForm = useForm({
    defaultValues: {
      height: "6'1\" (185 cm)",
      weight: "180 lbs (82 kg)",
      build: "Athletic",
      hairColor: "Brown",
      eyeColor: "Blue"
    }
  });

  const handleSaveActing = async (data: any) => {
    console.log("Saving acting skills:", data);
    return Promise.resolve();
  };

  const handleSaveTechnical = async (data: any) => {
    console.log("Saving technical skills:", data);
    return Promise.resolve();
  };

  const handleSaveSpecialSkills = async (data: any) => {
    console.log("Saving special skills:", data);
    return Promise.resolve();
  };

  const handleSavePhysical = async (data: any) => {
    console.log("Saving physical attributes:", data);
    return Promise.resolve();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Acting Skills */}
      <Card className="bg-card-gradient border-gold/10">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Acting Skills</h3>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-gold hover:text-gold hover:bg-gold/10"
              onClick={() => setIsEditingActing(true)}
            >
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
          </div>
          <div className="space-y-4">
            {skills.acting.map((skill) => (
              <div key={skill.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-foreground/80">{skill.name}</span>
                  <span className="text-gold">{skill.level}%</span>
                </div>
                <Progress 
                  value={skill.level} 
                  className="h-2 bg-cinematic-dark"
                  indicatorClassName="bg-gradient-to-r from-gold-light to-gold"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Technical Skills */}
      <Card className="bg-card-gradient border-gold/10">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Technical Skills</h3>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-gold hover:text-gold hover:bg-gold/10"
              onClick={() => setIsEditingTechnical(true)}
            >
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
          </div>
          <div className="space-y-4">
            {skills.technical.map((skill) => (
              <div key={skill.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-foreground/80">{skill.name}</span>
                  <span className="text-gold">{skill.level}%</span>
                </div>
                <Progress 
                  value={skill.level} 
                  className="h-2 bg-cinematic-dark"
                  indicatorClassName="bg-gradient-to-r from-gold-light to-gold"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Special Skills */}
      <Card className="bg-card-gradient border-gold/10">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Special Skills</h3>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-gold hover:text-gold hover:bg-gold/10"
              onClick={() => setIsEditingSpecial(true)}
            >
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.specialSkills.map((skill, index) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-cinematic-dark/70 text-foreground/80 text-sm rounded-full border border-gold/10"
              >
                {skill}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Physical Attributes */}
      <Card className="bg-card-gradient border-gold/10">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Physical Attributes</h3>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-gold hover:text-gold hover:bg-gold/10"
              onClick={() => setIsEditingPhysical(true)}
            >
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
          </div>
          <div className="space-y-3">
            {skills.physicalAttributes.map((attribute, index) => (
              <div key={index} className="flex border-b border-gold/10 pb-2 last:border-0">
                <div className="w-1/3 text-foreground/60">{attribute.name}:</div>
                <div className="w-2/3 font-medium">{attribute.value}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialogs */}
      <EditProfileDialog
        title="Edit Acting Skills"
        description="Update your acting skills and proficiency levels"
        isOpen={isEditingActing}
        onClose={() => setIsEditingActing(false)}
        onSave={handleSaveActing}
      >
        <Form {...actingForm}>
          {skills.acting.map((skill, index) => (
            <div key={index} className="space-y-4">
              <FormField
                control={actingForm.control}
                name={`acting.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skill Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={actingForm.control}
                name={`acting.${index}.level`}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between">
                      <FormLabel>Proficiency Level</FormLabel>
                      <span className="text-sm text-gold">{field.value}%</span>
                    </div>
                    <FormControl>
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        defaultValue={[field.value]}
                        onValueChange={(vals) => field.onChange(vals[0])}
                        className="py-4"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {index < skills.acting.length - 1 && <hr className="border-gold/10 my-4" />}
            </div>
          ))}
        </Form>
      </EditProfileDialog>

      <EditProfileDialog
        title="Edit Technical Skills"
        description="Update your technical skills and proficiency levels"
        isOpen={isEditingTechnical}
        onClose={() => setIsEditingTechnical(false)}
        onSave={handleSaveTechnical}
      >
        <Form {...technicalForm}>
          {skills.technical.map((skill, index) => (
            <div key={index} className="space-y-4">
              <FormField
                control={technicalForm.control}
                name={`technical.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skill Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={technicalForm.control}
                name={`technical.${index}.level`}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between">
                      <FormLabel>Proficiency Level</FormLabel>
                      <span className="text-sm text-gold">{field.value}%</span>
                    </div>
                    <FormControl>
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        defaultValue={[field.value]}
                        onValueChange={(vals) => field.onChange(vals[0])}
                        className="py-4"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {index < skills.technical.length - 1 && <hr className="border-gold/10 my-4" />}
            </div>
          ))}
        </Form>
      </EditProfileDialog>

      <EditProfileDialog
        title="Edit Special Skills"
        description="Update your special skills (comma-separated)"
        isOpen={isEditingSpecial}
        onClose={() => setIsEditingSpecial(false)}
        onSave={handleSaveSpecialSkills}
      >
        <Form {...specialSkillsForm}>
          <FormField
            control={specialSkillsForm.control}
            name="specialSkills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Skills</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Separate skills with commas"
                    className="h-32"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </Form>
      </EditProfileDialog>

      <EditProfileDialog
        title="Edit Physical Attributes"
        description="Update your physical attributes"
        isOpen={isEditingPhysical}
        onClose={() => setIsEditingPhysical(false)}
        onSave={handleSavePhysical}
      >
        <Form {...physicalAttributesForm}>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={physicalAttributesForm.control}
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
              control={physicalAttributesForm.control}
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
              control={physicalAttributesForm.control}
              name="build"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Build</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={physicalAttributesForm.control}
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
              control={physicalAttributesForm.control}
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
          </div>
        </Form>
      </EditProfileDialog>
    </div>
  );
};

export default SkillsSection;
