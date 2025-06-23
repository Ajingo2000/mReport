"use client";

import StoreProvider from "@/state/redux";
import { AuthProvider } from "./(auth)/authProvider"; // Your own DRF-based auth context

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <AuthProvider>{children}</AuthProvider>
    </StoreProvider>
  );
};

export default Providers;
