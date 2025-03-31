import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Calendar, BookOpen, Film, Award, Star, Play, ArrowRight, FileText, MapPin, Download } from "lucide-react";

const IndustryHub = () => {
  const newsItems = [
    {
      id: "n1",
      title: "New Tax Incentives for Independent Filmmakers Announced",
      excerpt: "The government has unveiled new tax incentives aimed at boosting independent film production across the country.",
      date: "August 25, 2023",
      readTime: "5 min read",
      category: "Industry News",
      image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000",
      author: {
        name: "Emily Robertson",
        avatar: "/placeholder.svg"
      }
    },
    {
      id: "n2",
      title: "Major Studio Announces Open Casting Call for Upcoming Sci-Fi Epic",
      excerpt: "Universal Pictures is hosting an open casting call for both lead and supporting roles in their upcoming sci-fi franchise.",
      date: "August 22, 2023",
      readTime: "4 min read",
      category: "Casting News",
      image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1000",
      author: {
        name: "Marcus Lee",
        avatar: "/placeholder.svg"
      }
    },
    {
      id: "n3",
      title: "Streaming Platforms Increasingly Financing Independent Cinema",
      excerpt: "Streaming giants are ramping up their investment in independent productions, changing the landscape of film financing.",
      date: "August 20, 2023",
      readTime: "7 min read",
      category: "Industry Analysis",
      image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000",
      author: {
        name: "Sophia Martinez",
        avatar: "/placeholder.svg"
      }
    }
  ];
  
  const upcomingEvents = [
    {
      id: "e1",
      title: "Virtual Acting Workshop with Award-Winning Coach",
      date: "September 15, 2023",
      time: "3:00 PM - 5:00 PM PST",
      type: "Workshop",
      image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1000"
    },
    {
      id: "e2",
      title: "Scriptwriting Masterclass: Creating Compelling Characters",
      date: "September 22, 2023",
      time: "1:00 PM - 4:00 PM PST",
      type: "Masterclass",
      image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=1000"
    },
    {
      id: "e3",
      title: "Film Industry Networking Mixer",
      date: "October 5, 2023",
      time: "7:00 PM - 10:00 PM PST",
      type: "Networking",
      image: "https://images.unsplash.com/photo-1511795409834-c5f272cb6e74?q=80&w=1000"
    }
  ];
  
  const courses = [
    {
      id: "c1",
      title: "The Complete Actor's Toolkit",
      instructor: "James Morrison",
      lessons: 24,
      hours: 8.5,
      level: "Intermediate",
      rating: 4.8,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=1000"
    },
    {
      id: "c2",
      title: "Mastering the Audition Process",
      instructor: "Lisa Wong",
      lessons: 18,
      hours: 6,
      level: "All Levels",
      rating: 4.9,
      reviews: 203,
      image: "https://images.unsplash.com/photo-1616469829941-c7200edec809?q=80&w=1000"
    },
    {
      id: "c3",
      title: "Film Production Fundamentals",
      instructor: "Michael Stevens",
      lessons: 32,
      hours: 12,
      level: "Beginner",
      rating: 4.7,
      reviews: 189,
      image: "https://images.unsplash.com/photo-1617419086540-51320e8c1766?q=80&w=1000"
    }
  ];
  
  const resources = [
    {
      id: "r1",
      title: "Ultimate Guide to Self-Tape Auditions",
      type: "Guide",
      downloads: 1245,
      image: "https://images.unsplash.com/photo-1581557991964-125469da3b8a?q=80&w=1000"
    },
    {
      id: "r2",
      title: "Contract Templates for Film Professionals",
      type: "Templates",
      downloads: 986,
      image: "https://images.unsplash.com/photo-1589330694153-ded1c381b91e?q=80&w=1000"
    },
    {
      id: "r3",
      title: "Film Industry Salary Report 2023",
      type: "Report",
      downloads: 1578,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000"
    }
  ];

  return (
    <div className="space-y-4 pr-1">
      {/* Header Section */}
      <div className="flex flex-col space-y-1">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold to-gold-light">
                Industry Hub
              </span>
            </h1>
            <p className="text-muted-foreground mt-1">
            Stay informed, learn, and grow with the latest news, events, and educational resources from the film industry.
          </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Button size="sm" className="bg-gold hover:bg-gold/90 text-black gap-1">
              <Film className="h-4 w-4" />
              <span>Submit News</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
        </div>
        
      <Tabs defaultValue="news" className="mb-6">
        <TabsList className="bg-cinematic-dark/50 border border-gold/10 w-full justify-start mb-6">
            <TabsTrigger value="news" className="data-[state=active]:text-gold data-[state=active]:border-gold data-[state=active]:bg-transparent border-b-2 border-transparent">
              News & Insights
            </TabsTrigger>
            <TabsTrigger value="events" className="data-[state=active]:text-gold data-[state=active]:border-gold data-[state=active]:bg-transparent border-b-2 border-transparent">
              Events & Webinars
            </TabsTrigger>
            <TabsTrigger value="courses" className="data-[state=active]:text-gold data-[state=active]:border-gold data-[state=active]:bg-transparent border-b-2 border-transparent">
              Courses
            </TabsTrigger>
            <TabsTrigger value="resources" className="data-[state=active]:text-gold data-[state=active]:border-gold data-[state=active]:bg-transparent border-b-2 border-transparent">
              Resources
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="news">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Featured Article */}
            <div className="lg:col-span-3 bg-card border border-gold/10 rounded-xl overflow-hidden shadow-lg">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div 
                    className="h-64 lg:h-auto bg-cover bg-center" 
                    style={{ backgroundImage: "url(https://images.unsplash.com/photo-1493804714600-6edb1cd93080?q=80&w=1000)" }}
                  ></div>
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="bg-gold/20 text-gold px-2 py-0.5 rounded-full text-xs font-medium">
                        Featured
                      </span>
                      <span className="text-sm text-foreground/60">Industry Analysis</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-4">The Changing Landscape of Film Distribution in 2023</h2>
                    <p className="text-foreground/70 mb-6">
                      With the rise of streaming platforms and the aftermath of the pandemic, 
                      the film distribution model is experiencing unprecedented changes. This in-depth 
                      analysis explores the new opportunities and challenges for filmmakers.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">By Jonathan Davis</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-foreground/60">
                        <Clock className="h-4 w-4" />
                        <span>10 min read</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Regular News Items */}
              {newsItems.map((item) => (
              <Card key={item.id} className="bg-card border-gold/10 overflow-hidden shadow-lg">
                  <div 
                    className="h-48 bg-cover bg-center" 
                    style={{ backgroundImage: `url(${item.image})` }}
                  ></div>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-foreground/60">{item.category}</span>
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                    <CardDescription>{item.excerpt}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={item.author.avatar} />
                        <AvatarFallback>{item.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs">{item.author.name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-foreground/60">
                      <Clock className="h-3 w-3" />
                      <span>{item.readTime}</span>
                    </div>
                  </CardFooter>
                </Card>
              ))}
              
              <div className="lg:col-span-3 text-center mt-4">
                <Button variant="outline" className="border-gold/30 hover:border-gold">
                  View All Articles
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="events">
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Featured Event */}
              <div className="lg:col-span-2 bg-card border border-gold/10 rounded-xl overflow-hidden shadow-lg">
                  <div className="grid grid-cols-1 lg:grid-cols-5">
                    <div 
                      className="h-64 lg:h-auto lg:col-span-2 bg-cover bg-center" 
                      style={{ backgroundImage: "url(https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000)" }}
                    ></div>
                    <div className="p-8 lg:col-span-3">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="bg-gold/20 text-gold px-2 py-0.5 rounded-full text-xs font-medium">
                          Featured Event
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold mb-4">International Film Casting Conference 2023</h2>
                      <p className="text-foreground/70 mb-6">
                        Join industry leaders, casting directors, and fellow actors for a two-day 
                        conference focused on the future of casting in a global film industry. 
                        Network with professionals and attend workshops led by renowned casting directors.
                      </p>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-gold" />
                          <div>
                            <p className="text-sm font-medium">October 15-16, 2023</p>
                            <p className="text-xs text-foreground/60">9:00 AM - 5:00 PM</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-gold" />
                          <div>
                            <p className="text-sm font-medium">Los Angeles Convention Center</p>
                            <p className="text-xs text-foreground/60">Los Angeles, CA</p>
                          </div>
                        </div>
                      </div>
                      <Button className="bg-gold hover:bg-gold-dark text-cinematic">
                        Register Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-4">Upcoming Events</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {upcomingEvents.map((event) => (
                <Card key={event.id} className="bg-card border-gold/10 overflow-hidden shadow-lg">
                    <div 
                      className="h-40 bg-cover bg-center" 
                      style={{ backgroundImage: `url(${event.image})` }}
                    ></div>
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-gold/20 text-gold px-2 py-0.5 rounded-full text-xs font-medium">
                          {event.type}
                        </span>
                      </div>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-foreground/60" />
                        <span className="text-sm">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-foreground/60" />
                        <span className="text-sm">{event.time}</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full border-gold/30 hover:border-gold">
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              <div className="text-center mt-8">
                <Button variant="outline" className="border-gold/30 hover:border-gold">
                  View All Events
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="courses">
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Featured Course */}
              <div className="lg:col-span-2 bg-card border border-gold/10 rounded-xl overflow-hidden shadow-lg">
                  <div className="grid grid-cols-1 lg:grid-cols-5">
                    <div 
                      className="h-64 lg:h-auto lg:col-span-2 bg-cover bg-center" 
                      style={{ backgroundImage: "url(https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=1000)" }}
                    ></div>
                    <div className="p-8 lg:col-span-3">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="bg-gold/20 text-gold px-2 py-0.5 rounded-full text-xs font-medium">
                          Featured Course
                        </span>
                        <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full text-xs font-medium">
                          PRO
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold mb-2">Method Acting Masterclass: From Theory to Practice</h2>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-gold" />
                          <Star className="h-4 w-4 text-gold" />
                          <Star className="h-4 w-4 text-gold" />
                          <Star className="h-4 w-4 text-gold" />
                          <Star className="h-4 w-4 text-gold" />
                          <span className="ml-2 text-sm">5.0 (324 reviews)</span>
                        </div>
                      </div>
                      <p className="text-foreground/70 mb-6">
                        Learn the techniques and principles of method acting from acclaimed 
                        actor and coach Robert Williams. This comprehensive course covers 
                        everything from emotional memory to character development.
                      </p>
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center">
                          <p className="text-lg font-bold">36</p>
                          <p className="text-xs text-foreground/60">Lessons</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold">14.5</p>
                          <p className="text-xs text-foreground/60">Hours</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold">Advanced</p>
                          <p className="text-xs text-foreground/60">Level</p>
                        </div>
                      </div>
                      <Button className="bg-gold hover:bg-gold-dark text-cinematic">
                        <Play className="mr-2 h-4 w-4" />
                        Start Learning
                      </Button>
                  </div>
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-4">Popular Courses</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <Card key={course.id} className="bg-card border-gold/10 overflow-hidden shadow-lg">
                    <div 
                      className="h-40 bg-cover bg-center relative" 
                      style={{ backgroundImage: `url(${course.image})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-cinematic to-transparent"></div>
                      <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-cinematic-dark/70 px-2 py-1 rounded-full">
                        <Play className="h-3 w-3 text-gold" />
                        <span className="text-xs">{course.lessons} lessons</span>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <CardDescription>By {course.instructor}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-gold" />
                          <span className="text-sm">{course.rating} ({course.reviews})</span>
                        </div>
                        <span className="text-sm">{course.hours} hours</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full text-xs font-medium">
                          {course.level}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-gold hover:bg-gold-dark text-cinematic">
                        Enroll Now
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              <div className="text-center mt-8">
                <Button variant="outline" className="border-gold/30 hover:border-gold">
                  Browse All Courses
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="resources">
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Resource Categories */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-card border border-gold/10 rounded-xl p-6 text-center">
                    <BookOpen className="h-10 w-10 text-gold mx-auto mb-4" />
                    <h3 className="font-bold mb-2">Guides & Tutorials</h3>
                    <p className="text-sm text-foreground/70">Step-by-step instructions for film professionals</p>
                  </div>
                <div className="bg-card border border-gold/10 rounded-xl p-6 text-center">
                    <FileText className="h-10 w-10 text-gold mx-auto mb-4" />
                    <h3 className="font-bold mb-2">Templates</h3>
                    <p className="text-sm text-foreground/70">Professional documents for various purposes</p>
                  </div>
                <div className="bg-card border border-gold/10 rounded-xl p-6 text-center">
                    <Film className="h-10 w-10 text-gold mx-auto mb-4" />
                    <h3 className="font-bold mb-2">Industry Reports</h3>
                    <p className="text-sm text-foreground/70">In-depth analysis and market insights</p>
                  </div>
                <div className="bg-card border border-gold/10 rounded-xl p-6 text-center">
                    <Award className="h-10 w-10 text-gold mx-auto mb-4" />
                    <h3 className="font-bold mb-2">Career Resources</h3>
                    <p className="text-sm text-foreground/70">Tools to advance your film career</p>
                  </div>
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-4">Popular Downloads</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {resources.map((resource) => (
                <Card key={resource.id} className="bg-card border-gold/10 overflow-hidden shadow-lg">
                    <div 
                      className="h-40 bg-cover bg-center" 
                      style={{ backgroundImage: `url(${resource.image})` }}
                    ></div>
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-gold/20 text-gold px-2 py-0.5 rounded-full text-xs font-medium">
                          {resource.type}
                        </span>
                      </div>
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <Download className="h-4 w-4 text-foreground/60" />
                        <span className="text-sm">{resource.downloads} downloads</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full border-gold/30 hover:border-gold">
                        Download
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              <div className="text-center mt-8">
                <Button variant="outline" className="border-gold/30 hover:border-gold">
                  View All Resources
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
      <div className="bg-card border border-gold/10 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Subscribe to Industry Updates</h2>
          <p className="text-foreground/80 mb-6 max-w-2xl mx-auto">
            Stay updated with the latest news, events, and resources from the film industry. 
            No spam, just valuable content delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <Input 
              placeholder="Enter your email address" 
              className="bg-cinematic-dark/50 border-gold/10 focus:border-gold"
            />
            <Button className="bg-gold hover:bg-gold-dark text-cinematic">
              Subscribe
            </Button>
          </div>
        </div>
    </div>
  );
};

export default IndustryHub;
