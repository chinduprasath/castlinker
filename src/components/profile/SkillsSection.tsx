
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const SkillsSection = () => {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Acting Skills */}
      <Card className="bg-card-gradient border-gold/10">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Acting Skills</h3>
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
          <h3 className="text-lg font-semibold mb-4">Technical Skills</h3>
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
          <h3 className="text-lg font-semibold mb-4">Special Skills</h3>
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
          <h3 className="text-lg font-semibold mb-4">Physical Attributes</h3>
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
    </div>
  );
};

export default SkillsSection;
