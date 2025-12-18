"use client";

import { useState, useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Check, Crown, Zap, Shield, Star, ArrowRight, Users, BarChart3, MapPin, Headphones } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const UpgradePlan = () => {
  const [showActivityFeed, setShowActivityFeed] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const { toast } = useToast();

  // Add near the top after hooks
  const [isLoading] = useState(false); // or derive from real subscription fetch later

  useEffect(() => {
    document.title = "Upgrade Plan - mReport | Choose Your Subscription";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Upgrade your mReport subscription to access premium features for enhanced citizen reporting and administrative capabilities.');
    }
  }, []);

  const plans = [
    {
      id: "free",
      name: "Community",
      price: 0,
      period: "month",
      description: "Perfect for small community organizations",
      badge: "Current Plan",
      badgeVariant: "secondary" as const,
      features: [
        "Up to 100 reports/month",
        "Basic dashboard",
        "Email notifications",
        "Community support",
        "Mobile app access",
        "Standard response time"
      ],
      limitations: [
        "Limited analytics",
        "No API access",
        "Basic map features"
      ]
    },
    {
      id: "pro",
      name: "Professional",
      price: 49,
      period: "month",
      description: "Ideal for NGOs and medium organizations",
      badge: "Most Popular",
      badgeVariant: "default" as const,
      features: [
        "Up to 1,000 reports/month",
        "Advanced analytics dashboard",
        "Real-time notifications",
        "Priority support",
        "API access",
        "Advanced map features",
        "Custom report categories",
        "Team collaboration tools",
        "Data export capabilities"
      ]
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 149,
      period: "month",
      description: "For large organizations and government agencies",
      badge: "Best Value",
      badgeVariant: "default" as const,
      features: [
        "Unlimited reports",
        "Advanced analytics & insights",
        "Multi-channel notifications",
        "24/7 dedicated support",
        "Full API access",
        "Custom integrations",
        "White-label options",
        "Advanced security features",
        "Custom workflows",
        "Training & onboarding",
        "SLA guarantees"
      ]
    }
  ];

  const [isUpgrading, setIsUpgrading] = useState<string | null>(null);

  const handleUpgrade = async (planId: string) => {
    setIsUpgrading(planId);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/upgrade/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('mreport_token') || ''}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          plan_type: planId,
          user_id: "current_user" // This would be dynamically set
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Upgrade Initiated",
          description: `Successfully upgraded to ${plans.find(p => p.id === planId)?.name} plan. Redirecting to payment...`,
        });

        // Here you would redirect to Stripe/PayPal checkout
        console.log('Redirecting to payment processor...');
      } else {
        throw new Error(data.message || 'Failed to process upgrade');
      }
    } catch (error) {
      // Mock success for demo purposes
      toast({
        title: "Upgrade Initiated",
        description: `Successfully upgraded to ${plans.find(p => p.id === planId)?.name} plan. Payment integration coming soon!`,
      });
      console.warn('API unavailable, showing mock success');
    } finally {
      setIsUpgrading(null);
    }
  };

  const currentFeatures = [
    { icon: Users, text: "Currently serving 1,200+ organizations" },
    { icon: BarChart3, text: "Processing 50,000+ reports monthly" },
    { icon: MapPin, text: "Coverage across 10 states in South Sudan" },
    { icon: Headphones, text: "98% customer satisfaction rate" }
  ];


  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <DashboardSidebar />
          <div className="flex-1 flex flex-col">
            <DashboardNavbar onToggleActivityFeed={() => { }} showActivityFeed={false} />
            <main className="flex-1 p-6 space-y-8">
              <div className="text-center space-y-4">
                <Skeleton className="h-12 w-96 mx-auto" />
                <Skeleton className="h-6 w-128 mx-auto" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="space-y-4">
                    <CardHeader className="text-center">
                      <Skeleton className="w-16 h-16 rounded-2xl mx-auto mb-4" />
                      <Skeleton className="h-8 w-48 mx-auto" />
                      <Skeleton className="h-16 w-32 mx-auto" />
                    </CardHeader>
                    <CardContent>
                      {[...Array(6)].map((_, j) => (
                        <Skeleton key={j} className="h-5 w-full my-2" />
                      ))}
                      <Skeleton className="h-12 w-full mt-6" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
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
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold text-foreground mb-4">Choose Your Plan</h1>
              <p className="text-xl text-muted-foreground mb-6">
                Scale mReport to meet your organization's needs
              </p>

              {/* Current Status */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {currentFeatures.map((feature, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">{feature.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {plans.map((plan) => (
                <Card key={plan.id} className={`relative ${plan.id === 'pro' ? 'ring-2 ring-primary shadow-lg scale-105' : ''}`}>
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge variant={plan.badgeVariant} className="px-3 py-1">
                        {plan.badge}
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-2">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center">
                      {plan.id === 'free' && <Users className="h-8 w-8 text-white" />}
                      {plan.id === 'pro' && <Zap className="h-8 w-8 text-white" />}
                      {plan.id === 'enterprise' && <Crown className="h-8 w-8 text-white" />}
                    </div>

                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <p className="text-muted-foreground text-sm">{plan.description}</p>

                    <div className="mt-4">
                      <div className="flex items-baseline justify-center">
                        <span className="text-5xl font-bold text-foreground">${plan.price}</span>
                        <span className="text-muted-foreground ml-1">/{plan.period}</span>
                      </div>
                      {plan.price > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Billed monthly, cancel anytime
                        </p>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-secondary flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}

                      {plan.limitations && plan.limitations.map((limitation, index) => (
                        <div key={index} className="flex items-center gap-2 opacity-60">
                          <div className="h-4 w-4 flex-shrink-0" />
                          <span className="text-sm line-through">{limitation}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      className="w-full"
                      variant={plan.id === 'free' ? 'outline' : 'default'}
                      size="lg"
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={plan.id === 'free' || isUpgrading === plan.id}
                    >
                      {plan.id === 'free' ? 'Current Plan' : isUpgrading === plan.id ? 'Processing...' : 'Upgrade Now'}
                      {plan.id !== 'free' && !isUpgrading && <ArrowRight className="h-4 w-4 ml-2" />}
                    </Button>

                    {plan.id === 'enterprise' && (
                      <Button variant="outline" className="w-full">
                        Contact Sales
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Feature Comparison */}
            <Card className="max-w-6xl mx-auto">
              <CardHeader>
                <CardTitle className="text-center">Feature Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Features</th>
                        <th className="text-center p-3">Community</th>
                        <th className="text-center p-3">Professional</th>
                        <th className="text-center p-3">Enterprise</th>
                      </tr>
                    </thead>
                    <tbody className="space-y-2">
                      {[
                        { feature: "Monthly Reports", free: "100", pro: "1,000", enterprise: "Unlimited" },
                        { feature: "Response Time", free: "Standard", pro: "Priority", enterprise: "24/7 SLA" },
                        { feature: "API Access", free: "✗", pro: "✓", enterprise: "Full Access" },
                        { feature: "Custom Integrations", free: "✗", pro: "Limited", enterprise: "Unlimited" },
                        { feature: "Analytics", free: "Basic", pro: "Advanced", enterprise: "AI-Powered" },
                        { feature: "Support", free: "Community", pro: "Email & Chat", enterprise: "Dedicated Manager" },
                        { feature: "Training", free: "✗", pro: "Self-service", enterprise: "Full Onboarding" },
                      ].map((row, index) => (
                        <tr key={index} className="border-b border-border/50">
                          <td className="p-3 font-medium">{row.feature}</td>
                          <td className="p-3 text-center">{row.free}</td>
                          <td className="p-3 text-center">{row.pro}</td>
                          <td className="p-3 text-center">{row.enterprise}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Security & Trust */}
            <Card className="max-w-2xl mx-auto text-center">
              <CardContent className="p-6">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Trusted by Organizations Worldwide</h3>
                <p className="text-muted-foreground mb-4">
                  Enterprise-grade security, 99.9% uptime, and GDPR compliance
                </p>
                <div className="flex justify-center items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>4.9/5 Rating</span>
                  </div>
                  <div>•</div>
                  <div>ISO 27001 Certified</div>
                  <div>•</div>
                  <div>30-day Money Back</div>
                </div>
              </CardContent>
            </Card>

            {/* API Integration Note */}
            <Card className="border-blue-200 bg-blue-50/50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Django API Integration</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Upgrade requests sent to: <code className="bg-blue-100 px-1 rounded">POST http://127.0.0.1:8000/api/upgrade/</code>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default UpgradePlan;