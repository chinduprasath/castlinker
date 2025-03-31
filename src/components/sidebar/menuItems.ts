import { 
  Home, 
  Film, 
  Users, 
  Book, 
  MessageSquare, 
  User, 
  Settings,
  Bell,
  Shield,
  CreditCard,
  HelpCircle
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
    text: "Messages",
    path: "/chat"
  }
];

// Public pages removed from sidebar
export const pageMenuItems: MenuItem[] = [];

export const accountMenuItems: MenuItem[] = [
  {
    icon: User,
    text: "Profile",
    path: "/profile"
  },
  {
    icon: Settings,
    text: "Settings",
    path: "/settings"
  },
  {
    icon: Bell,
    text: "Notifications",
    path: "/notifications"
  },
  {
    icon: Shield,
    text: "Privacy",
    path: "/privacy"
  },
  {
    icon: CreditCard,
    text: "Billing",
    path: "/billing"
  },
  {
    icon: HelpCircle, 
    text: "Help",
    path: "/help"
  }
];
