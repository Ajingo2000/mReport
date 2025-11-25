import React, { useEffect, useState, useCallback } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ReportNotifications = () => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  // Memoized WebSocket handler to avoid recreation on every render
  const handleWebSocketMessage = useCallback((event) => {
    try {
      const data = JSON.parse(event.data);
      const message = data.message || "New report received";
      setMessages((prevMessages) => [...prevMessages, message].slice(-5)); // Limit to last 5 messages
      toast.success(message, {
        duration: 8000,
        style: {
          border: "1px solid #713200",
          padding: "12px",
          background: "#FFFAEE",
          color: "#713200",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        },
        iconTheme: {
          primary: "#713200",
          secondary: "#FFFAEE",
        },
      });
    } catch (e) {
      setError("Failed to parse WebSocket message");
      toast.error("Error processing notification", { duration: 4000 });
    }
  }, []);

  useEffect(() => {
    const socket = new WebSocket("ws://127.0.0.1:8000/ws/reports/");

    socket.onopen = () => {
      setIsConnected(true);
      setError(null);
      toast.success("Connected to notifications", { duration: 3000 });
    };

    socket.onmessage = handleWebSocketMessage;

    socket.onerror = () => {
      setError("WebSocket connection error");
      toast.error("Connection failed", { duration: 4000 });
    };

    socket.onclose = () => {
      setIsConnected(false);
      setError("WebSocket disconnected");
      toast.error("Disconnected from notifications", { duration: 4000 });
    };

    // Cleanup on unmount
    return () => {
      socket.close();
    };
  }, [handleWebSocketMessage]);

  // Clear notifications manually
  const clearNotifications = () => {
    setMessages([]);
    toast.success("Notifications cleared", { duration: 3000 });
  };

  return (
    <Card className="w-full max-w-md bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between p-4 bg-blue-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Bell className="h-5 w-5" />
          Notifications
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearNotifications}
          className="text-white hover:text-gray-200 hover:bg-blue-700"
          aria-label="Clear notifications"
        >
          Clear
        </Button>
      </CardHeader>
      <CardContent className="p-4 max-h-[300px] overflow-y-auto">
        {error && (
          <div className="text-red-600 dark:text-red-400 text-sm mb-2">{error}</div>
        )}
        {isConnected ? (
          messages.length > 0 ? (
            <ul className="space-y-2">
              {messages.map((message, index) => (
                <li
                  key={index}
                  className="p-2 bg-gray-100 dark:bg-neutral-800 rounded-md text-sm text-gray-800 dark:text-gray-200 shadow-inner"
                >
                  {message}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
              No new notifications yet.
            </p>
          )
        ) : (
          <p className="text-yellow-600 dark:text-yellow-400 text-sm text-center">
            Connecting to notifications...
          </p>
        )}
      </CardContent>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerStyle={{
          top: "4rem",
          right: "1rem",
          zIndex: 50,
        }}
        toastOptions={{
          className: "bg-black text-white rounded-md shadow-lg",
          duration: 5000,
          success: {
            duration: 3000,
            style: {
              background: "#FFFAEE",
              border: "1px solid #713200",
              color: "#713200",
            },
            iconTheme: {
              primary: "#713200",
              secondary: "#FFFAEE",
            },
          },
          error: {
            duration: 4000,
            style: {
              background: "#fee2e2",
              border: "1px solid #dc2626",
              color: "#dc2626",
            },
          },
        }}
      />
    </Card>
  );
};

export default ReportNotifications;