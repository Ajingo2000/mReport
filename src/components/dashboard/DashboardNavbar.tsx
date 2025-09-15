import { Bell, Search, LogOut, User, Menu, Settings } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks"; // Import hooks
import { logout } from "@/store/slices/authSlice"; // Import logout action

interface DashboardNavbarProps {
 onToggleActivityFeed?: () => void;
 showActivityFeed?: boolean;
}

export function DashboardNavbar({ onToggleActivityFeed, showActivityFeed }: DashboardNavbarProps) {
 const navigate = useNavigate();
 const dispatch = useAppDispatch();
 
 // Get user from Redux state
 const user = useAppSelector((state) => state.auth.user);

 // Compute initials from name or username
 const getInitials = (name: string | undefined) => {
 if (!name) return "AU"; // Fallback
 return name
 .split(" ")
 .map((part) => part[0])
 .join("")
 .toUpperCase()
 .slice(0, 2);
 };

 const handleLogout = () => {
 dispatch(logout()); // Dispatch logout action to clear state and storage
 navigate("/login"); // Redirect to login
 };

 if (!user) {
 // Optional: Handle loading or unauthenticated state
 return null;
 }

 return (
 <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
 <div className="flex h-16 items-center gap-4 px-6">
 {/* Sidebar Toggle */}
 <SidebarTrigger className="lg:hidden" />
 
 {/* Search */}
 <div className="flex-1 max-w-md">
 <div className="relative">
 <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
 <Input
 placeholder="Search reports, locations..."
 className="pl-10 bg-muted/50 border-muted-foreground/20 focus:bg-background"
 />
 </div>
 </div>

 {/* Actions */}
 <div className="flex items-center gap-3">
 {/* Activity Feed Toggle */}
 {onToggleActivityFeed && (
 <Button
 variant="ghost"
 size="sm"
 onClick={onToggleActivityFeed}
 className="hidden xl:flex"
 >
 {showActivityFeed ? "Hide Activity" : "Show Activity"}
 </Button>
 )}

 {/* Notifications */}
 <DropdownMenu>
 <DropdownMenuTrigger asChild>
 <Button variant="ghost" size="icon" className="relative">
 <Bell className="h-5 w-5" />
 <Badge 
 variant="destructive" 
 className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
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

 {/* User Menu */}
 <DropdownMenu>
 <DropdownMenuTrigger asChild>
 <Button variant="ghost" className="relative h-10 w-10 rounded-full">
 <Avatar className="h-10 w-10">
 <AvatarImage src={user.avatar || ""} alt={user.username} />
 <AvatarFallback className="bg-primary text-primary-foreground">
 {getInitials(user.first_name || user.username)}
 </AvatarFallback>
 </Avatar>
 </Button>
 </DropdownMenuTrigger>
 <DropdownMenuContent className="w-56" align="end" forceMount>
 <DropdownMenuLabel className="font-normal">
 <div className="flex flex-col space-y-1">
 <p className="text-sm font-medium leading-none">{user.first_name || user.username}</p>
 <p className="text-xs leading-none text-muted-foreground">
 {user.email}
 </p>
 </div>
 </DropdownMenuLabel>
 <DropdownMenuSeparator />
 <DropdownMenuItem>
 <User className="mr-2 h-4 w-4" />
 <span>Profile</span>
 </DropdownMenuItem>
 <DropdownMenuItem>
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