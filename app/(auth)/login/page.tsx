"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { AuthService } from "@/lib/services";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import myLogo from "@/public/images/favicon.png";



const Login = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "Login - mReport | Secure Access to Dashboard";
  }, []);

  // ================================
  // GOOGLE SIGN-IN
  // ================================

  const handleGoogleSignIn = () => {
  window.location.href = `http://127.0.0.1:8000/accounts/google/login/`;
};


  // ================================
  // MAIN LOGIN FUNCTION
  // ================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await AuthService.login(email, password);

      if (!response) {
        throw new Error("No response returned from server.");
      }

      // If login returned but user is not verified
      if (response.needs_verification === true) {
        toast({
          title: "Email Verification Needed",
          description:
            "Please verify your email before logging in. A new link has been sent.",
          variant: "destructive",
        });

        router.push("/email-not-verified");
        return;
      }

      // SUCCESS — redirect to dashboard
      if (response?.user) {
        toast({
          title: "Login Successful",
          description: `Welcome back, ${response.user.first_name || "User"
            }!`,
        });

        router.push("/dashboard");
        return;
      }

      // Unexpected success structure
      toast({
        title: "Login Warning",
        description:
          "Login succeeded but user data was missing. Please try again.",
        variant: "destructive",
      });
    } catch (error: any) {
      console.error("Login Error:", error);

      let message = "Something went wrong. Please try again.";

      // Axios response with backend messages
      if (error.response?.data) {
        const backend = error.response.data;
        message =
          backend.error ||
          backend.detail ||
          backend.message ||
          JSON.stringify(backend);
      } else if (error.message) {
        message = error.message;
      }

      toast({
        title: "Login Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className=" flex items-center justify-center">
              <Image
                src={myLogo}
                alt="Mreport Logo"
                className="w-20 h-20 lg:w-32 lg:h-32"
              />
            </div>
          </div>

          {/* Headings */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back!
            </h1>
            <p className="text-muted-foreground">
              Enter to get unlimited access to data & information.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
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
              <Label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
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
                  className="
                    absolute right-3 top-1/2 -translate-y-1/2 
                    text-muted-foreground hover:text-foreground
                  "
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked as boolean)
                  }
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-normal cursor-pointer"
                >
                  Remember me
                </Label>
              </div>

              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full h-12 text-base"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Log In"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-muted-foreground">
                Or, Login with
              </span>
            </div>
          </div>

          {/* Google Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 border-orange-300 text-orange-700 hover:bg-orange-50 font-medium"
            onClick={handleGoogleSignIn}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#4285F4" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </Button>

          <p className="text-center text-gray-600">
            Don't have an account?{" "}
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
