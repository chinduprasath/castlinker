import { 
  Home, 
  Film, 
  Users, 
  Book, 
  MessageSquare,
  Bell,
  FolderKanban,
  FileText,
  Ticket,
  Clapperboard
} from 'lucide-react';

export type MenuItem = {
  icon: any;
  text: string;
  path: string;
};

export const mainMenuItems: MenuItem[] = [
  {
    icon: Home,
    text: "Dashboard",
    path: "/dashboard"
  },
  {
    icon: Film,
    text: "Jobs",
    path: "/jobs"
  },
  {
    icon: FolderKanban,
    text: "Collaborate",
    path: "/collaborate"
  },
  {
    icon: FileText,
    text: "Posts",
    path: "/posts"
  },
  {
    icon: Clapperboard,
    text: "Reels",
    path: "/reels"
  },
  {
    icon: Users,
    text: "Talent Directory",
    path: "/talent-directory"
  },
  {
    icon: Book,
    text: "Industry Hub",
    path: "/industry-hub"
  },
  {
    icon: MessageSquare,
    text: "Connections",
    path: "/chat"
  },
  {
    icon: Bell,
    text: "Notifications",
    path: "/notifications"
  }
];

// Public pages removed from sidebar
export const pageMenuItems: MenuItem[] = [];

// Account menu items have been moved to the TopBar dropdown
export const accountMenuItems: MenuItem[] = [];
