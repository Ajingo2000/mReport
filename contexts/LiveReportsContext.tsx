"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface LiveReport {
  id: number;
  report_id: string;
  report_type: string;
  description: string;
  latitude: number;
  longitude: number;
  location: string;
  created_at: string;
  source_platform: string;
}

interface LiveReportsContextType {
  reports: LiveReport[];
  unreadCount: number;
  addReport: (r: LiveReport) => void;
  markAllRead: () => void;
}

const LiveReportsContext = createContext<LiveReportsContextType>({
  reports: [],
  unreadCount: 0,
  addReport: () => {},
  markAllRead: () => {},
});

export const LiveReportsProvider = ({ children }: { children: React.ReactNode }) => {
  const [reports, setReports] = useState<LiveReport[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const ws = new WebSocket("wss://api.mreport.org/ws/reports/");
    

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "report.created") {
        setReports((prev) => [data.report, ...prev]);
        setUnreadCount((prev) => prev + 1);
      }

      if (data.type === "report.updated") {
        setReports((prev) =>
          prev.map((r) => (r.id === data.report.id ? data.report : r))
        );
      }
    };

    return () => ws.close();
  }, []);

  const addReport = (report: LiveReport) => {
    setReports((prev) => [report, ...prev]);
    setUnreadCount((prev) => prev + 1);
  };

  const markAllRead = () => setUnreadCount(0);

  return (
    <LiveReportsContext.Provider value={{ reports, unreadCount, addReport, markAllRead }}>
      {children}
    </LiveReportsContext.Provider>
  );
};

export const useLiveReports = () => useContext(LiveReportsContext);
