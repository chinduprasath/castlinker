
import { Card, CardContent } from "@/components/ui/card";

const AboutSection = () => {
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

  return (
    <div className="space-y-6">
      <Card className="bg-card-gradient border-gold/10">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Biography</h3>
          <div className="whitespace-pre-line text-foreground/80">
            {about.bio}
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-card-gradient border-gold/10">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {about.details.map((detail, index) => (
              <div key={index} className="flex">
                <div className="w-1/3 text-foreground/60">{detail.label}:</div>
                <div className="w-2/3 font-medium">{detail.value}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutSection;
