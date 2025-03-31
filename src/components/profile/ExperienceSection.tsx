
import { Card, CardContent } from "@/components/ui/card";

const ExperienceSection = () => {
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

  return (
    <div className="space-y-8">
      {/* Film Experience */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-gold">Film</h3>
        <div className="space-y-4">
          {experiences.film.map((exp, index) => (
            <Card key={index} className="bg-card-gradient border-gold/10">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                  <h4 className="text-lg font-medium">{exp.title}</h4>
                  <span className="text-foreground/60 text-sm">{exp.year}</span>
                </div>
                <p className="text-gold mb-2">{exp.role}</p>
                <div className="flex flex-col md:flex-row gap-2 md:gap-6 text-sm text-foreground/70 mb-4">
                  <span>Director: {exp.director}</span>
                  <span>Production: {exp.company}</span>
                </div>
                <p className="text-foreground/80 text-sm">{exp.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Television Experience */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-gold">Television</h3>
        <div className="space-y-4">
          {experiences.television.map((exp, index) => (
            <Card key={index} className="bg-card-gradient border-gold/10">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                  <h4 className="text-lg font-medium">{exp.title}</h4>
                  <span className="text-foreground/60 text-sm">{exp.year}</span>
                </div>
                <p className="text-gold mb-2">{exp.role}</p>
                <div className="flex flex-col md:flex-row gap-2 md:gap-6 text-sm text-foreground/70 mb-4">
                  <span>Director: {exp.director}</span>
                  <span>Network: {exp.company}</span>
                </div>
                <p className="text-foreground/80 text-sm">{exp.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Theater Experience */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-gold">Theater</h3>
        <div className="space-y-4">
          {experiences.theater.map((exp, index) => (
            <Card key={index} className="bg-card-gradient border-gold/10">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                  <h4 className="text-lg font-medium">{exp.title}</h4>
                  <span className="text-foreground/60 text-sm">{exp.year}</span>
                </div>
                <p className="text-gold mb-2">{exp.role}</p>
                <div className="flex flex-col md:flex-row gap-2 md:gap-6 text-sm text-foreground/70 mb-4">
                  <span>Director: {exp.director}</span>
                  <span>Company: {exp.company}</span>
                </div>
                <p className="text-foreground/80 text-sm">{exp.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExperienceSection;
