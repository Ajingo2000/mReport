import { useState, useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { User, Camera, Save, Mail, Phone, MapPin, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/hooks/api/useAuth"; // Import useUserProfile for fetching user data
import { apiClient } from "@/lib/api"; // Import apiClient for updates

const EditProfile = () => {
  const [showActivityFeed, setShowActivityFeed] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const { data: userData, isLoading: loading, error } = useUserProfile(); // Fetch user profile

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    organization: "", // Not in backend; add to CustomUser if needed
    role: "",
    location: "", // Not in backend; add if needed
    bio: "", // Not in backend; add if needed
    avatar: "", // Not in backend; add ImageField if needed
    category: "", // For responders
  });

  // Load fetched data into form
  useEffect(() => {
    if (userData) {
      setFormData({
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        email: userData.email || "",
        phone_number: "", // Fetch from /responder-details/ if responder
        organization: "",
        role: userData.role || "",
        location: "",
        bio: "",
        avatar: userData.avatar || "",
        category: "", // Fetch if responder
      });

      // If role is responder, fetch additional details
      if (userData.role === "responder") {
        fetchResponderDetails();
      }
    }
  }, [userData]);

  const fetchResponderDetails = async () => {
    try {
      const response = await apiClient.get('/responder-details/');
      const responderData = response.data;
      setFormData((prev) => ({
        ...prev,
        phone_number: responderData.phone_number || "",
        category: responderData.category || "",
      }));
    } catch (err) {
      toast({
        title: "Error",
        description: "Could not load responder details.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      // Update user profile
      await apiClient.patch('/users/update/', {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        // Add organization, location, bio if added to backend
      });

      // If responder, update responder details
      if (formData.role === "responder") {
        await apiClient.patch('/responder-details/', {
          phone_number: formData.phone_number,
          category: formData.category,
        });
      }

      // Handle avatar upload if implemented (multipart form)

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not update profile.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (error) {
    return <div>Error loading profile: {error.message}</div>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />

        <div className="flex-1 flex flex-col">
          <DashboardNavbar
            onToggleActivityFeed={() => setShowActivityFeed(!showActivityFeed)}
            showActivityFeed={showActivityFeed}
          />

          <main className="flex-1 p-6 space-y-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">Edit Profile</h1>
              <p className="text-muted-foreground">Update your personal information and preferences</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Profile Picture Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5 text-primary" />
                    Profile Picture
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={formData.avatar} alt={`${formData.first_name} ${formData.last_name}`} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {formData.first_name?.[0] + formData.last_name?.[0] || "AU"}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" className="w-full">
                    <Camera className="h-4 w-4 mr-2" />
                    Change Picture
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Recommended: Square image, at least 400x400px
                  </p>
                </CardContent>
              </Card>

              {/* Profile Form */}
              <Card className="xl:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="space-y-2">
                          <div className="h-4 bg-muted animate-pulse rounded w-1/4" />
                          <div className="h-10 bg-muted animate-pulse rounded" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="first_name">First Name</Label>
                          <Input
                            id="first_name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            placeholder="Enter your first name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last_name">Last Name</Label>
                          <Input
                            id="last_name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            placeholder="Enter your last name"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="pl-10"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>

                      {formData.role === "responder" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone_number">Phone Number</Label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="phone_number"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleInputChange}
                                className="pl-10"
                                placeholder="+211 123 456 789"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Input
                              id="category"
                              name="category"
                              value={formData.category}
                              onChange={handleInputChange}
                              placeholder="Your category"
                            />
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="organization">Organization</Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="organization"
                            name="organization"
                            value={formData.organization}
                            onChange={handleInputChange}
                            className="pl-10"
                            placeholder="Your organization"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className="pl-10"
                            placeholder="City, Country"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role">Role/Position</Label>
                        <Input
                          id="role"
                          name="role"
                          value={formData.role}
                          readOnly // Role is typically not editable
                          className="bg-muted"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          placeholder="Tell us a bit about yourself..."
                          rows={4}
                        />
                      </div>

                      <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline">
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isUpdating}>
                          <Save className="h-4 w-4 mr-2" />
                          {isUpdating ? "Updating..." : "Save Changes"}
                        </Button>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default EditProfile;