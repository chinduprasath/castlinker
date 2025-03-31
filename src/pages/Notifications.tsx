import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const notifications = [
  {
    id: 1,
    type: "job",
    title: "New job opportunity",
    message: "A new casting call for 'The Last Adventure' has been posted matching your profile.",
    time: "Just now",
    read: false
  },
  {
    id: 2,
    type: "message",
    title: "New message from Sarah Johnson",
    message: "Thanks for your audition. We would like to invite you for a callback.",
    time: "2 hours ago",
    read: false
  },
  {
    id: 3,
    type: "system",
    title: "Profile update reminder",
    message: "Your profile hasn't been updated in 30 days. Keep it fresh to get more opportunities!",
    time: "1 day ago",
    read: true
  },
  {
    id: 4,
    type: "job",
    title: "Job application update",
    message: "Your application for 'City Lights' has been reviewed by the casting director.",
    time: "3 days ago",
    read: true
  }
];

const Notifications = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <Button variant="outline">Mark all as read</Button>
      </div>
      
      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card key={notification.id} className={notification.read ? "opacity-70" : ""}>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle className="text-lg">{notification.title}</CardTitle>
                <span className="text-sm text-muted-foreground">{notification.time}</span>
              </div>
              <CardDescription>
                {notification.type === "job" && (
                  <span className="inline-block bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full mr-2">
                    Job
                  </span>
                )}
                {notification.type === "message" && (
                  <span className="inline-block bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full mr-2">
                    Message
                  </span>
                )}
                {notification.type === "system" && (
                  <span className="inline-block bg-yellow-500/20 text-yellow-400 text-xs px-2 py-0.5 rounded-full mr-2">
                    System
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>{notification.message}</p>
              <div className="flex justify-end mt-2">
                {!notification.read && (
                  <Button variant="ghost" size="sm">
                    Mark as read
                  </Button>
                )}
                <Button variant="link" size="sm" className="text-primary">
                  View details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Notifications; 