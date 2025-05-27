
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Users, Target, Trophy, Heart } from "lucide-react";

const JoinUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position_interest: '',
    experience_level: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.position_interest) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Submitting join form:', formData);
      
      const { error } = await supabase
        .from('join_submissions')
        .insert([formData]);

      if (error) {
        console.error('Error submitting join form:', error);
        throw error;
      }

      console.log('Join form submitted successfully');
      
      toast({
        title: "Application Submitted!",
        description: "Thank you for your interest. We'll review your application and get back to you soon.",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        position_interest: '',
        experience_level: '',
        message: ''
      });

    } catch (error) {
      console.error('Error submitting join form:', error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="join-us" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-rhino-blue mb-4">Join Nepalese Rhinos FC</h2>
            <p className="text-rhino-gray text-lg">Be part of our football family and help us grow stronger together</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <Card className="text-center">
              <CardContent className="p-6">
                <Users className="text-rhino-red mx-auto mb-4" size={40} />
                <h3 className="text-lg font-bold text-rhino-blue mb-2">Team Spirit</h3>
                <p className="text-rhino-gray">Join a close-knit community that supports each other on and off the field</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Target className="text-rhino-red mx-auto mb-4" size={40} />
                <h3 className="text-lg font-bold text-rhino-blue mb-2">Skill Development</h3>
                <p className="text-rhino-gray">Improve your game with professional coaching and regular training sessions</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Trophy className="text-rhino-red mx-auto mb-4" size={40} />
                <h3 className="text-lg font-bold text-rhino-blue mb-2">Competitive Play</h3>
                <p className="text-rhino-gray">Compete in local leagues and tournaments representing our club with pride</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-rhino-blue">
                <Heart className="text-rhino-red" size={24} />
                Player Registration Form
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="mt-1"
                      placeholder="+61 XXX XXX XXX"
                    />
                  </div>
                  <div>
                    <Label htmlFor="position_interest">Preferred Position *</Label>
                    <Select
                      value={formData.position_interest}
                      onValueChange={(value) => handleSelectChange('position_interest', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="goalkeeper">Goalkeeper</SelectItem>
                        <SelectItem value="defender">Defender</SelectItem>
                        <SelectItem value="midfielder">Midfielder</SelectItem>
                        <SelectItem value="forward">Forward</SelectItem>
                        <SelectItem value="any">Any Position</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="experience_level">Experience Level</Label>
                  <Select
                    value={formData.experience_level}
                    onValueChange={(value) => handleSelectChange('experience_level', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="professional">Semi-Professional/Professional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="message">Tell us about yourself</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="mt-1"
                    placeholder="Tell us about your football background, goals, and why you want to join Nepalese Rhinos FC..."
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-rhino-blue mb-2">What to Expect:</h4>
                  <ul className="text-sm text-rhino-gray space-y-1">
                    <li>• Training sessions: Tuesdays & Thursdays 6:30-8:00 PM, Saturdays 2:00-4:00 PM</li>
                    <li>• Competitive matches on weekends</li>
                    <li>• Team social events and community involvement</li>
                    <li>• Professional coaching and skill development</li>
                    <li>• Annual membership fee applies</li>
                  </ul>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-rhino-red hover:bg-red-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="text-center mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-bold text-rhino-blue mb-2">Questions?</h3>
            <p className="text-rhino-gray mb-4">
              Contact us for more information about joining our team.
            </p>
            <Button variant="outline" className="border-rhino-red text-rhino-red hover:bg-rhino-red hover:text-white">
              <a href="/contact">Contact Us</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinUs;
