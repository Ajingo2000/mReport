// app/(protected)/layout.tsx  ← FINAL VERSION
"use client";
export const dynamic = 'force-dynamic';

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryProvider } from "@/contexts/QueryProvider";

// This runs ONCE when the store is created — even before any component mounts
store.dispatch({ type: 'theme/initializeTheme' });

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <QueryProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </QueryProvider>
    </Provider>
  );
}
