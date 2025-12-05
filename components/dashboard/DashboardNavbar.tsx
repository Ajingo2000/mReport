import { Bell, Search, LogOut, User, Menu, Settings, Filter, Plus, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ThemeToggle from "@/components/ThemeToggle";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/hooks";

// In DashboardNavbar.tsx and any other file
import authSlice, { logout, setCurrentSubscription, updateUser } from "@/store/slices/authSlice";
import { AppDispatch } from "@/store/store";
import { SubscriptionType } from "@/types/api";

interface DashboardNavbarProps {
  onToggleActivityFeed?: () => void;
  showActivityFeed?: boolean;
}

export function DashboardNavbar({ onToggleActivityFeed, showActivityFeed }: DashboardNavbarProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, currentSubscription } = useAppSelector((state) => state.auth);
  
  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  // Temporary fix to unblock build
  const handleSubscriptionChange = (value: string) => {
    dispatch(setCurrentSubscription(value as any));
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-3 px-4 lg:px-6">
        {/* Sidebar Toggle */}
        <SidebarTrigger />
        
        {/* Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search"
              className="pl-10 bg-background border-border h-10 rounded-lg"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* Subscription Filter - Mobile Hidden */}
          {user && user.subscriptions.length > 1 && (
            <div className="hidden lg:flex items-center gap-2 mr-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={currentSubscription} onValueChange={handleSubscriptionChange}>
                <SelectTrigger className="w-32 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Reports</SelectItem>
                  <SelectItem value="SRHR">SRHR Only</SelectItem>
                  <SelectItem value="GBV">GBV Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Create New Report */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/dashboard')}
            className="h-10 w-10"
          >
            <Plus className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-10 w-10">
                <Bell className="h-5 w-5" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0 rounded-full"
                >
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-2 text-sm text-muted-foreground">
                <div className="space-y-2">
                  <div className="p-2 rounded bg-muted/50">
                    <p className="font-medium">New Health Report</p>
                    <p className="text-xs">Juba Central - 2 minutes ago</p>
                  </div>
                  <div className="p-2 rounded bg-muted/50">
                    <p className="font-medium">Infrastructure Fixed</p>
                    <p className="text-xs">Wau Road - 1 hour ago</p>
                  </div>
                  <div className="p-2 rounded bg-muted/50">
                    <p className="font-medium">New Responder Online</p>
                    <p className="text-xs">Dr. Sarah - 3 hours ago</p>
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Settings */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/dashboard/settings')}
            className="h-10 w-10"
          >
            <Settings className="h-5 w-5" />
          </Button>

          {/* Help */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/support')}
            className="h-10 w-10"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>

          {/* Dark Mode Toggle - Hidden on mobile */}
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full ml-1">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.profile_picture || undefined}   alt={user?.first_name || 'User'} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user ? 
                      (user.first_name?.[0] || '') + (user.last_name?.[0] || '')
                      : 'U'
                    }
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user
                      ? (
                          `${user.first_name || ''} ${user.last_name || ''}`.trim() ||
                          user.email.split('@')[0] ||
                          'User'
                        )
                      : 'User'
                    }
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || 'user@mreport.org'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
