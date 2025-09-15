import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Lock, User, Shield, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    subscriptions: [] as string[],
    category: "",
    phone_number: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Sign Up - mReport | Join the Humanitarian Response Network";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Create your mReport account to report issues, coordinate responses, and contribute to humanitarian efforts across South Sudan."
      );
    }
  }, []);

  const roles = [
    { value: "citizen", label: "Citizen" },
    { value: "responder", label: "Responder" },
    { value: "admin", label: "Admin" },
  ];

  const subscriptionOptions = [
    { value: "srhr", label: "SRHR (Sexual & Reproductive Health Rights)" },
    { value: "infrastructure", label: "Infrastructure" },
    { value: "emergency", label: "Emergency" },
    { value: "health", label: "Health" },
    { value: "education", label: "Education" },
  ];

  const responderCategories = [
    { value: "damage", label: "Damage Reports" },
    { value: "assistance", label: "Assistance Requests" },
    { value: "srhr", label: "SRHR Needs" },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubscriptionChange = (value: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      subscriptions: checked
        ? [...prev.subscriptions, value]
        : prev.subscriptions.filter((sub) => sub !== value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please check and try again.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // First call: /auth/signup/
      const response = await fetch("http://127.0.0.1:8000/api/auth/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          subscriptions: formData.subscriptions,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // Save token if returned
      if (data.token) {
        localStorage.setItem("mreport_token", data.token);
      }

      // Second call for responders
      if (formData.role === "responder") {
        const responderRes = await fetch("http://127.0.0.1:8000/api/register-responder/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            phone_number: formData.phone_number,
            category: formData.category,
          }),
        });

        if (!responderRes.ok) {
          const errData = await responderRes.json();
          throw new Error(errData.message || "Responder registration failed");
        }
      }

      toast({
        title: "Account Created Successfully",
        description: "Welcome to mReport! Your account has been created.",
      });

      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Signup Failed",
        description:
          error instanceof Error ? error.message : "Unable to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white hover:text-white/80 mb-8 transition-smooth"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <Card className="card-gradient border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">Join mReport</CardTitle>
            <CardDescription className="text-muted-foreground">
              Create your account to start reporting and responding to humanitarian issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-foreground">
                    Username
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-foreground">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleInputChange("role", value)}
                >
                  <SelectTrigger className="w-full">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      <SelectValue placeholder="Select your role" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.role === "responder" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-foreground">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleInputChange("category", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {responderCategories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone_number" className="text-foreground">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="phone_number"
                        type="tel"
                        placeholder="Enter phone number"
                        value={formData.phone_number}
                        onChange={(e) => handleInputChange("phone_number", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Label className="text-foreground">Subscription Categories</Label>
                <p className="text-xs text-muted-foreground">
                  Select the types of reports you want to receive notifications for
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {subscriptionOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.value}
                        checked={formData.subscriptions.includes(option.value)}
                        onCheckedChange={(checked) =>
                          handleSubscriptionChange(option.value, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={option.value}
                        className="text-sm font-normal text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:text-primary-dark font-medium">
                  Sign in here
                </Link>
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-border text-center">
              <p className="text-xs text-muted-foreground">
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
