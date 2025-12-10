"use client";
export const dynamic = "force-dynamic";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryProvider } from "@/contexts/QueryProvider";
import { LiveReportsProvider } from "@/contexts/LiveReportsContext";

// This runs ONCE when the store is created
store.dispatch({ type: "theme/initializeTheme" });

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <QueryProvider>
        <AuthProvider>

          {/* ✅ WEBSOCKET PROVIDER ADDED HERE */}
          <LiveReportsProvider>
            {children}
          </LiveReportsProvider>

        </AuthProvider>
      </QueryProvider>
    </Provider>
  );
}
