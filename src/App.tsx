// Updated: src/App.tsx
// Changes:
// 1. Imported PrivateRoute and useUserProfile.
// 2. Grouped all dashboard-related routes under a single /dashboard parent route using PrivateRoute.
//    This protects all dashboard sub-routes efficiently.
// 3. Used nested Routes for dashboard sub-pages (e.g., analytics, map, etc.).
// 4. Added useUserProfile() hook call inside App to proactively fetch/verify user profile on app load if authenticated but no user data is present.
//    This helps catch invalid tokens early (e.g., on page refresh) and triggers logout if necessary via interceptors (see below).
// 5. Kept the catch-all NotFound route at the end.
// 6. No other major changes; this refines routing for auth without overcomplicating.

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute"; // New import
import { useUserProfile } from "./hooks/api/useAuth"; // Assuming useAuth.ts is in hooks/
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import MapView from "./pages/MapView";
import EditProfile from "./pages/EditProfile";
import AccountSettings from "./pages/AccountSettings";
import Support from "./pages/Support";
import UpgradePlan from "./pages/UpgradePlan";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useUserProfile(); // Proactively fetch/verify profile on app load if needed (triggers auth validation)

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected dashboard routes */}
            <Route path="/dashboard" element={<PrivateRoute />}>
              <Route index element={<Dashboard />} /> {/* /dashboard */}
              <Route path="/dashboard/analytics" element={<Analytics />} /> {/* /dashboard/analytics */}
              <Route path="/dashboard/map" element={<MapView />} /> {/* /dashboard/map */}
              <Route path="/dashboard/profile" element={<EditProfile />} /> {/* /dashboard/profile */}
              <Route path="/dashboard/settings" element={<AccountSettings />} /> {/* /dashboard/settings */}
              <Route path="/dashboard/support" element={<Support />} /> {/* /dashboard/support */}
              <Route path="/dashboard/upgrade" element={<UpgradePlan />} /> {/* /dashboard/upgrade */}
            </Route>
            
            {/* Catch-all for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;