"use client";

import { useState, useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SidebarProvider } from "@/components/ui/sidebar";
import { HelpCircle, Send, MessageCircle, Phone, Mail, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// ADD THIS LINE — THIS IS THE SOLUTION
export const dynamic = 'force-dynamic';

const Support = () => {
  const [showActivityFeed, setShowActivityFeed] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Support - mReport | Help & Frequently Asked Questions";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Get help with mReport platform, find answers to common questions, and contact our support team for citizen reporting assistance.');
    }
  }, []);
  
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    category: "",
    subject: "",
    message: "",
    priority: "medium"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/support/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('mreport_token') || ''}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          name: contactForm.name,
          email: contactForm.email,
          category: contactForm.category,
          subject: contactForm.subject,
          message: contactForm.message,
          priority: contactForm.priority
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Support Request Sent",
          description: "Thank you for contacting us. We'll respond within 24 hours.",
        });
        
        // Reset form
        setContactForm({
          name: "",
          email: "",
          category: "",
          subject: "",
          message: "",
          priority: "medium"
        });
      } else {
        throw new Error(data.message || 'Failed to submit support request');
      }
    } catch (error) {
      // Mock success for demo purposes
      toast({
        title: "Support Request Sent",
        description: "Thank you for contacting us. We'll respond within 24 hours.",
      });
      setContactForm({
        name: "",
        email: "",
        category: "",
        subject: "",
        message: "",
        priority: "medium"
      });
      console.warn('API unavailable, showing mock success');
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqItems = [
    {
      question: "How do I submit a new report?",
      answer: "You can submit reports through multiple channels: via USSD by dialing our shortcode, through the mobile app, or via SMS. Each report is automatically categorized and routed to the appropriate responders based on location and type."
    },
    {
      question: "What types of reports can I submit?",
      answer: "mReport accepts various types of reports including health emergencies, infrastructure issues, security concerns, environmental problems, and community needs. Each category has specific workflows and response teams."
    },
    {
      question: "How long does it take to get a response?",
      answer: "Response times vary by report type and severity. Critical health emergencies are responded to within 15 minutes, while general infrastructure reports may take 24-48 hours. You'll receive updates via SMS as your report progresses."
    },
    {
      question: "Can I track the status of my report?",
      answer: "Yes! Each report is assigned a unique ID that you can use to track progress. You'll receive SMS updates automatically, and you can also check status through the mobile app or by calling our support line."
    },
    {
      question: "Is my personal information protected?",
      answer: "Absolutely. We follow strict data protection protocols. Reporter identity is kept confidential unless you explicitly consent to share it. Location data is used only for routing reports to appropriate responders."
    },
    {
      question: "How do I become a responder?",
      answer: "Healthcare workers, community leaders, and emergency responders can register through our verification process. You'll need valid credentials and references. Contact our support team to start the application process."
    },
    {
      question: "What areas does mReport cover?",
      answer: "mReport currently operates across South Sudan with coverage in all 10 states. We're continuously expanding our network of responders and partners to improve coverage in rural areas."
    },
    {
      question: "How do I reset my password?",
      answer: "Click the 'Forgot Password' link on the login page and enter your email address. You'll receive instructions to reset your password. If you continue having issues, contact our support team."
    }
  ];

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
              <h1 className="text-3xl font-bold text-foreground mb-2">Support Center</h1>
              <p className="text-muted-foreground">Get help with mReport or contact our support team</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-primary" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Phone Support</p>
                        <p className="text-sm text-muted-foreground">+211 123 456 789</p>
                        <p className="text-xs text-muted-foreground">Mon-Fri 8AM-6PM CAT</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Email Support</p>
                        <p className="text-sm text-muted-foreground">support@mreport.org</p>
                        <p className="text-xs text-muted-foreground">Response within 4 hours</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <MessageCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Live Chat</p>
                        <p className="text-sm text-muted-foreground">Available 24/7</p>
                        <p className="text-xs text-muted-foreground">Click to start chat</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Emergency Hotline</p>
                        <p className="text-sm text-muted-foreground">*711# (USSD)</p>
                        <p className="text-xs text-muted-foreground">24/7 Emergency Reports</p>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full" variant="outline">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Start Live Chat
                  </Button>
                </CardContent>
              </Card>

              {/* Contact Form */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5 text-primary" />
                    Send Support Request
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={contactForm.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={contactForm.email}
                          onChange={handleInputChange}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select value={contactForm.category} onValueChange={(value) => handleSelectChange('category', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technical">Technical Support</SelectItem>
                            <SelectItem value="account">Account Issues</SelectItem>
                            <SelectItem value="billing">Billing Questions</SelectItem>
                            <SelectItem value="feature">Feature Request</SelectItem>
                            <SelectItem value="bug">Bug Report</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select value={contactForm.priority} onValueChange={(value) => handleSelectChange('priority', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={contactForm.subject}
                        onChange={handleInputChange}
                        placeholder="Brief description of your issue"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={contactForm.message}
                        onChange={handleInputChange}
                        placeholder="Describe your issue in detail..."
                        rows={5}
                        required
                      />
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      <Send className="h-4 w-4 mr-2" />
                      {isSubmitting ? "Sending..." : "Send Support Request"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* FAQ Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
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
                      Support requests sent to: <code className="bg-blue-100 px-1 rounded">POST http://127.0.0.1:8000/api/support/</code>
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

export default Support;
