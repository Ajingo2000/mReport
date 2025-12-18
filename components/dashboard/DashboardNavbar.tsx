"use client";

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
import { logout, setCurrentSubscription } from "@/store/slices/authSlice";
import { AppDispatch } from "@/store/store";
import { SubscriptionType } from "@/types/api";
import { useAuth } from "@/contexts/AuthContext";
import { useLiveReports } from "@/contexts/LiveReportsContext";


interface DashboardNavbarProps {
  onToggleActivityFeed?: () => void;
  showActivityFeed?: boolean;
}

export function DashboardNavbar({ onToggleActivityFeed, showActivityFeed }: DashboardNavbarProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  const { unreadCount, reports, markAllRead } = useLiveReports();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const handleSubscriptionChange = (value: string) => {
    dispatch(setCurrentSubscription(value as SubscriptionType));
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
        <div className="flex items-center gap-1 ">

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-10 w-10">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0 rounded-full"
                  >
                    {unreadCount}
                  </Badge>
                )}

              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>
                Notifications
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <div className="p-2 text-sm">
                {reports.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No new notifications</p>
                ) : (
                  <div className="space-y-2">
                    {reports.slice(0, 5).map((r) => (
                      <div
                        key={r.id}
                        className="p-2 rounded bg-muted/50 border border-border"
                      >
                        <p className="font-medium capitalize">{r.report_type} Report</p>
                        <p className="text-xs text-muted-foreground">{r.location}</p>
                        <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={markAllRead} className="text-center">
                Mark all as read
              </DropdownMenuItem>
            </DropdownMenuContent>

          </DropdownMenu>

          {/* Settings */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/dashboard/account-settings')}
            className="h-10 w-10"
          >
            <Settings className="h-5 w-5" />
          </Button>

          {/* Help */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/dashboard/support')}
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
                  <AvatarImage src={user?.profile_picture || ''} alt={user?.first_name || 'User'} />
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
                    {user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'User'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || 'user@mreport.org'}
                  </p>
                  <p className="text-s leading-none">{user?.organization}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/dashboard/edit-profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/dashboard/account-settings')}>
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