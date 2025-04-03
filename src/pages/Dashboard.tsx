import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  Film, 
  Star, 
  Users, 
  ChevronRight, 
  Calendar, 
  Clock, 
  DollarSign, 
  Award, 
  Briefcase, 
  MapPin, 
  MessageCircle,
  TrendingUp,
  ArrowRight,
<<<<<<< HEAD
  CheckCircle2,
  Bell
=======
  CheckCircle2
>>>>>>> 4ee9c98 (modified files)
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Actor';

  return (
    <div className="space-y-4 pr-1">
      {/* Header Section */}
      <div className="flex flex-col space-y-1">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold to-gold-light">
                Hello, {firstName}
              </span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's your activity summary and upcoming opportunities
            </p>
          </div>
<<<<<<< HEAD
          <div className="hidden sm:flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-gold/20 text-foreground/80 gap-1">
              <Bell className="h-4 w-4 text-gold" />
              <span className="hidden md:inline">Notifications</span>
            </Button>
            <Button size="sm" className="bg-gold hover:bg-gold/90 text-black gap-1">
              <Film className="h-4 w-4" />
              <span>Browse Jobs</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
=======
>>>>>>> 4ee9c98 (modified files)
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-gold/10 hover:border-gold/30 transition-colors duration-300 shadow-lg bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-2 pt-4 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <span className="text-base font-semibold text-foreground/80">Applications</span>
              </CardTitle>
              <div className="rounded-full bg-gold/10 p-2">
                <Briefcase className="h-4 w-4 text-gold" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="flex flex-col">
              <div className="text-3xl font-bold">12</div>
              <div className="flex items-center mt-1.5">
                <span className="text-xs text-green-500 font-medium flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" /> +2
                </span>
                <span className="text-xs text-muted-foreground ml-1.5">
                  since last week
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-green-500/10 hover:border-green-500/30 transition-colors duration-300 shadow-lg bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-2 pt-4 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <span className="text-base font-semibold text-foreground/80">Profile Views</span>
              </CardTitle>
              <div className="rounded-full bg-green-500/10 p-2">
                <Users className="h-4 w-4 text-green-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="flex flex-col">
              <div className="text-3xl font-bold">245</div>
              <div className="flex items-center mt-1.5">
                <span className="text-xs text-green-500 font-medium flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" /> +18%
                </span>
                <span className="text-xs text-muted-foreground ml-1.5">
                  from last month
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-blue-500/10 hover:border-blue-500/30 transition-colors duration-300 shadow-lg bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-2 pt-4 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <span className="text-base font-semibold text-foreground/80">Callbacks</span>
              </CardTitle>
              <div className="rounded-full bg-blue-500/10 p-2">
                <Star className="h-4 w-4 text-blue-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="flex flex-col">
              <div className="text-3xl font-bold">3</div>
              <div className="flex items-center mt-1.5">
                <span className="text-xs text-green-500 font-medium flex items-center">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> +1
                </span>
                <span className="text-xs text-muted-foreground ml-1.5">
                  new callback this week
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-purple-500/10 hover:border-purple-500/30 transition-colors duration-300 shadow-lg bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-2 pt-4 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <span className="text-base font-semibold text-foreground/80">Activity Score</span>
              </CardTitle>
              <div className="rounded-full bg-purple-500/10 p-2">
                <Activity className="h-4 w-4 text-purple-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="flex flex-col">
              <div className="text-3xl font-bold">89%</div>
              <div className="mt-2">
                <Progress value={89} className="h-1.5 bg-purple-500/20" indicatorClassName="bg-purple-500" />
                <p className="text-xs text-muted-foreground mt-1.5">
                  You're in the top <span className="text-purple-500 font-medium">15%</span> of users
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Section */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        {/* Opportunities Section */}
        <Card className="border-gold/10 lg:col-span-2 shadow-lg bg-card/60 backdrop-blur-sm overflow-hidden">
          <CardHeader className="px-4 py-4 border-b border-border/10 bg-gradient-to-r from-gold/5 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gold/10 p-2">
                  <Film className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <CardTitle className="text-xl">Recent Opportunities</CardTitle>
                  <CardDescription className="mt-0.5">
                    Casting calls that match your profile
                  </CardDescription>
                </div>
              </div>
              <Button variant="outline" size="sm" className="text-xs gap-1 border-gold/20 text-gold hover:text-gold/80 hover:bg-gold/10">
                View all
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/10">
              {[
                {
                  id: 1,
                  title: "Lead Role in 'The Final Act'",
                  type: "Feature Film",
                  location: "Los Angeles, CA",
                  pay: "$1500-2000/day",
                  posted: "2 days ago",
                  desc: "Seeking a talented actor for the lead role in an emotional drama exploring themes of redemption. Must have experience with dramatic performances.",
                  isNew: true
                },
                {
                  id: 2,
                  title: "Supporting Role in 'Urban Stories'",
                  type: "TV Series",
                  location: "New York, NY",
                  pay: "$800-1200/day",
                  posted: "1 week ago",
                  desc: "Looking for a diverse cast for a new anthology series about city life. Multiple roles available for various episodes.",
                  isNew: false
                },
                {
                  id: 3,
                  title: "Commercial for National Brand",
                  type: "Commercial",
                  location: "Remote/Virtual",
                  pay: "$3000 flat",
                  posted: "3 days ago",
                  desc: "Seeking actors for a national commercial campaign. Must be comfortable with product demonstration and have a natural on-camera presence.",
                  isNew: true
                }
              ].map((job) => (
                <div key={job.id} className="hover:bg-card/80 transition-colors p-4">
                  <div className="flex items-start space-x-3">
                    <div className="rounded-md bg-card flex-shrink-0 h-14 w-14 flex items-center justify-center border border-gold/20">
                      <Film className="h-7 w-7 text-gold" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-base leading-tight">{job.title}</h3>
                            {job.isNew && (
                              <Badge variant="outline" className="bg-green-500/10 border-green-500/20 text-green-500 text-[10px] rounded-sm py-0 h-5">
                                New
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {job.location}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Briefcase className="h-3 w-3" />
                              {job.type}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <DollarSign className="h-3 w-3" />
                              {job.pay}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {job.posted}
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{job.desc}</p>
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <Button variant="outline" size="sm" className="h-8 border-gold/20 text-gold">Details</Button>
                        <Button size="sm" className="h-8 bg-gold hover:bg-gold/90 text-black">Apply</Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Messages & Schedule */}
        <div className="space-y-4">
          {/* Recent Messages */}
          <Card className="border-blue-500/10 shadow-lg bg-card/60 backdrop-blur-sm overflow-hidden">
            <CardHeader className="px-4 py-4 border-b border-border/10 bg-gradient-to-r from-blue-500/5 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-blue-500/10 p-2">
                    <MessageCircle className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Messages</CardTitle>
                    <CardDescription className="mt-0.5">
                      Your latest conversations
                    </CardDescription>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-xs gap-1 border-blue-500/20 text-blue-500 hover:text-blue-500/80 hover:bg-blue-500/10">
                  View all
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/10">
                {[
                  {id: 1, name: "Jane Director", time: "2h ago", msg: "Thanks for your audition submission. I'd like to discuss the role with you."},
                  {id: 2, name: "Mark Producer", time: "1d ago", msg: "Your portfolio is impressive. We're casting for a new project and think you might be a fit."},
                  {id: 3, name: "Sarah Casting", time: "2d ago", msg: "Congratulations! You've been selected for a callback for the 'City Nights' production."}
                ].map((msg) => (
                  <div key={msg.id} className="p-3 hover:bg-card/80 transition-colors group cursor-pointer">
                    <div className="flex items-start space-x-3">
                      <div className="rounded-full h-10 w-10 bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:border-blue-500/40 transition-colors flex-shrink-0">
                        <span className="text-xs font-medium text-blue-500">{msg.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium leading-none text-sm group-hover:text-blue-500 transition-colors">{msg.name}</p>
                          <p className="text-[10px] text-muted-foreground">{msg.time}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{msg.msg}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Calendar Events */}
          <Card className="border-gold/10 shadow-lg bg-card/60 backdrop-blur-sm overflow-hidden">
            <CardHeader className="px-4 py-4 border-b border-border/10 bg-gradient-to-r from-gold/5 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-gold/10 p-2">
                    <Calendar className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Upcoming</CardTitle>
                    <CardDescription className="mt-0.5">
                      Your scheduled events
                    </CardDescription>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-xs gap-1 border-gold/20 text-gold hover:text-gold/80 hover:bg-gold/10">
                  Calendar
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/10">
                <div className="p-3 hover:bg-card/80 transition-colors">
                  <div className="flex gap-2">
                    <div className="flex flex-col items-center justify-center bg-gold/5 p-2 rounded-md border border-gold/20 w-14 h-16 flex-shrink-0">
                      <span className="text-xs font-medium text-gold">OCT</span>
                      <span className="text-xl font-bold">15</span>
                      <span className="text-[10px] text-muted-foreground">TUE</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium text-sm">Callback Audition</h3>
                        <Badge variant="outline" className="bg-blue-500/10 border-blue-500/20 text-blue-500 text-[10px] rounded-sm py-0 h-5">
                          10:30 AM
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">"City Lights" - Second round</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <MapPin className="h-2.5 w-2.5" />
                          Westwood Studios
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Clock className="h-2.5 w-2.5" />
                          75 min
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 hover:bg-card/80 transition-colors">
                  <div className="flex gap-2">
                    <div className="flex flex-col items-center justify-center bg-gold/5 p-2 rounded-md border border-gold/20 w-14 h-16 flex-shrink-0">
                      <span className="text-xs font-medium text-gold">OCT</span>
                      <span className="text-xl font-bold">18</span>
                      <span className="text-[10px] text-muted-foreground">FRI</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium text-sm">Portfolio Review</h3>
                        <Badge variant="outline" className="bg-green-500/10 border-green-500/20 text-green-500 text-[10px] rounded-sm py-0 h-5">
                          2:00 PM
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">With Creative Talent Agency</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <MapPin className="h-2.5 w-2.5" />
                          Virtual Meeting
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Clock className="h-2.5 w-2.5" />
                          60 min
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
