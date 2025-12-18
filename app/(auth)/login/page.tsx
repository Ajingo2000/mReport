"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { AuthService } from "@/lib/services";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false); // NEW

  useEffect(() => {
    if (!loading && user) {
      setIsRedirecting(true); // Show loading during redirect
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleSubmit2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await AuthService.login(email, password);
      if (!res || !res.user) throw new Error("Unexpected server response.");

      if (!res.user.email_verified) {
        toast({
          title: "Email Not Verified",
          description: "Please check your inbox to verify your email.",
          variant: "destructive",
        });
      }

      toast({
        title: "Welcome Back!",
        description: `Hello, ${res.user.first_name || "User"}!`,
      });

      setIsRedirecting(true); // Trigger redirect loading
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login Error:", error);

      // Extract backend message
      const backendError = error.response?.data?.error;
      const message = backendError || error.message || "Login failed. Please try again.";
      setErrorMessage(message);

      toast({
        title: "Login Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  // -------------------------------------------------------
  // If already logged in, redirect automatically
  // -------------------------------------------------------
  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  // -------------------------------------------------------
  // Google OAuth redirect — ALWAYS use backend domain
  // -------------------------------------------------------
  const handleGoogleSignIn = () => {
    const backend = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "");
    window.location.href = `${backend}/accounts/google/login/`;
  };

  // -------------------------------------------------------
  // Primary login function
  // -------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await AuthService.login(email, password);

      if (!res || !res.user) {
        throw new Error("Unexpected server response.");
      }

      // ---------------------------------------------------
      // WARN UNVERIFIED USERS — your chosen behaviour
      // ---------------------------------------------------
      if (!res.user.email_verified === false) {
        toast({
          title: "Email Not Verified",
          description:
            "Your email address has not been verified yet. Please check your inbox.",
          variant: "destructive",
        });

      }

      // ---------------------------------------------------
      // SUCCESS
      // ---------------------------------------------------
      toast({
        title: "Welcome Back!",
        description: `Hello, ${res.user.first_name || "User"}!`,
      });

      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login Error:", error);

      // Extract backend message
      const backendError = error.response?.data?.error;
      const message = backendError || error.message || "Login failed. Please try again.";
      setErrorMessage(message);

      toast({
        title: "Login Failed",
        description: message,
        variant: "destructive",
      });
    }
    finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------
  // UI
  // -------------------------------------------------------
  // ==================== FULL SCREEN LOADING DURING REDIRECT ====================
  if (isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-orange-600 mx-auto" />
          <p className="text-lg text-foreground">Taking you to your dashboard...</p>
        </div>
      </div>
    );
  } else return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">

          {/* Logo */}
          <div className="flex justify-center">
            <Link href="/">
              <Image
                src="/images/favicon.png"
                width={128}
                height={128}
                priority
                alt="mReport Logo"
                className="w-20 h-20 lg:w-32 lg:h-32"
              />
            </Link>
          </div>

          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-foreground">Welcome back!</h1>
            <p className="text-muted-foreground">
              Log in to access your dashboard.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit2} className="space-y-6">

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">
                Password <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="">{errorMessage && (
              <p className="text-red-500 text-sm mb-2">{errorMessage}</p>
            )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember">Remember me</Label>
              </div>

              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full h-12 bg-orange-600 text-white rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Log In"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-4 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="flex justify-center items-center w-full h-12 border-2 border-orange-300 text-orange-700 hover:bg-orange-50 rounded-lg font-medium shadow-lg"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#4285F4" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          {/* Footer */}
          <p className="text-center text-gray-600">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-orange-600 font-bold hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
