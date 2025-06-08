
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Send } from "lucide-react";
import { toast } from "sonner";

const NewsletterSubscription = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [preferences, setPreferences] = useState({
    news: true,
    matches: true,
    events: true,
  });

  const subscribeMutation = useMutation({
    mutationFn: async (subscriptionData: {
      email: string;
      name?: string;
      preferences: Record<string, boolean>;
    }) => {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert({
          email: subscriptionData.email,
          name: subscriptionData.name || null,
          preferences: subscriptionData.preferences,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      setEmail("");
      setName("");
      setPreferences({ news: true, matches: true, events: true });
      toast.success("Successfully subscribed to our newsletter!");
    },
    onError: (error: any) => {
      console.error('Error subscribing to newsletter:', error);
      if (error.code === '23505') { // Unique constraint violation
        toast.error("This email is already subscribed to our newsletter.");
      } else {
        toast.error("Failed to subscribe. Please try again.");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    subscribeMutation.mutate({
      email: email.trim(),
      name: name.trim() || undefined,
      preferences,
    });
  };

  const handlePreferenceChange = (key: string, checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: checked,
    }));
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-rhino-red text-white">
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Newsletter Subscription
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <p className="text-rhino-gray mb-6">
          Stay updated with the latest news, match reports, and club events. 
          Subscribe to our newsletter and never miss an update!
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Your email address *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Input
              type="text"
              placeholder="Your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-rhino-blue">
              What would you like to receive?
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="news"
                  checked={preferences.news}
                  onCheckedChange={(checked) => 
                    handlePreferenceChange('news', checked as boolean)
                  }
                />
                <label htmlFor="news" className="text-sm text-rhino-gray">
                  Club News & Updates
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="matches"
                  checked={preferences.matches}
                  onCheckedChange={(checked) => 
                    handlePreferenceChange('matches', checked as boolean)
                  }
                />
                <label htmlFor="matches" className="text-sm text-rhino-gray">
                  Match Reports & Fixtures
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="events"
                  checked={preferences.events}
                  onCheckedChange={(checked) => 
                    handlePreferenceChange('events', checked as boolean)
                  }
                />
                <label htmlFor="events" className="text-sm text-rhino-gray">
                  Club Events & Activities
                </label>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={subscribeMutation.isPending}
            className="w-full bg-rhino-red hover:bg-red-700"
          >
            <Send className="h-4 w-4 mr-2" />
            {subscribeMutation.isPending ? "Subscribing..." : "Subscribe to Newsletter"}
          </Button>
        </form>

        <p className="text-xs text-rhino-gray mt-4 text-center">
          We respect your privacy. You can unsubscribe at any time.
        </p>
      </CardContent>
    </Card>
  );
};

export default NewsletterSubscription;
