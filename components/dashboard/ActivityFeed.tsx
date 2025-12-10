"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, CheckCircle, AlertTriangle, UserPlus, MapPin, Clock } from "lucide-react";
import { useLiveReports } from "@/contexts/LiveReportsContext";

interface ActivityItem {
  id: string;
  type: "report" | "resolution" | "responder" | "alert";
  title: string;
  description: string;
  timestamp: string;
  location?: string;
  priority?: "Low" | "Medium" | "High" | "Critical";
}


export function ActivityFeed() {
  const { reports } = useLiveReports();

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

            {reports.map((report) => {
              const Icon = Bell;

              return (
                <div key={report.id} className="flex gap-3 p-3 rounded-lg border hover:bg-muted/30 transition-smooth">
                  <div className="p-2 rounded-full bg-destructive/10 text-destructive">
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="flex-1">
                    <h4 className="text-sm font-medium capitalize">{report.report_type} Report</h4>
                    <p className="text-xs text-muted-foreground mt-1">{report.description}</p>

                    <div className="flex items-center gap-1 mt-2">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{report.location}</span>
                    </div>

                    <div className="flex items-center gap-1 mt-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {new Date(report.created_at).toLocaleString()}
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