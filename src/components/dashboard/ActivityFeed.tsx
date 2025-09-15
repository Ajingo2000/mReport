import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, CheckCircle, AlertTriangle, UserPlus, MapPin, Clock } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "report" | "resolution" | "responder" | "alert";
  title: string;
  description: string;
  timestamp: string;
  location?: string;
  priority?: "Low" | "Medium" | "High" | "Critical";
}

const mockActivities: ActivityItem[] = [
  {
    id: "1",
    type: "report",
    title: "New Health Emergency",
    description: "Maternal health emergency reported via USSD",
    timestamp: "2 minutes ago",
    location: "Juba Central Hospital",
    priority: "Critical",
  },
  {
    id: "2",
    type: "resolution",
    title: "Infrastructure Fixed",
    description: "Water pump repair completed",
    timestamp: "15 minutes ago",
    location: "Wau District",
    priority: "High",
  },
  {
    id: "3",
    type: "responder",
    title: "New Responder Online",
    description: "Dr. Sarah Johnson joined the network",
    timestamp: "32 minutes ago",
    location: "Malakal Hospital",
  },
  {
    id: "4",
    type: "report",
    title: "Road Damage Report",
    description: "Main highway blocked due to flooding",
    timestamp: "1 hour ago",
    location: "Bentiu-Juba Road",
    priority: "High",
  },
  {
    id: "5",
    type: "alert",
    title: "System Alert",
    description: "High volume of reports in Juba area",
    timestamp: "2 hours ago",
    location: "Juba",
    priority: "Medium",
  },
  {
    id: "6",
    type: "resolution",
    title: "Medical Supply Delivered",
    description: "Emergency medical supplies distributed",
    timestamp: "3 hours ago",
    location: "Bor Health Center",
    priority: "High",
  },
];

export function ActivityFeed() {
  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "report":
        return Bell;
      case "resolution":
        return CheckCircle;
      case "responder":
        return UserPlus;
      case "alert":
        return AlertTriangle;
      default:
        return Bell;
    }
  };

  const getActivityColor = (type: ActivityItem["type"]) => {
    switch (type) {
      case "report":
        return "text-destructive bg-destructive/10";
      case "resolution":
        return "text-secondary bg-secondary/10";
      case "responder":
        return "text-primary bg-primary/10";
      case "alert":
        return "text-accent bg-accent/10";
      default:
        return "text-muted-foreground bg-muted/10";
    }
  };

  const getPriorityColor = (priority?: ActivityItem["priority"]) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Activity Feed
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="p-6 pt-0 space-y-4">
            {mockActivities.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <div key={activity.id} className="flex gap-3 p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-smooth">
                  <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-foreground">
                          {activity.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {activity.description}
                        </p>
                        {activity.location && (
                          <div className="flex items-center gap-1 mt-2">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {activity.location}
                            </span>
                          </div>
                        )}
                      </div>
                      {activity.priority && (
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getPriorityColor(activity.priority)}`}
                        >
                          {activity.priority}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {activity.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}