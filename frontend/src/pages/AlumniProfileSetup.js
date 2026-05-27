import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { toast } from 'sonner';
import { api } from '../utils/api';
import { Tag, X } from 'lucide-react';

const AlumniProfileSetup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    graduation_year: new Date().getFullYear(),
    company: '',
    designation: '',
    skills: [],
    years_of_experience: 0,
    mentorship_available: true,
    bio: '',
    linkedin_url: ''
  });
  const [skillInput, setSkillInput] = useState('');

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.createAlumniProfile(formData);
      toast.success('Profile created successfully! Awaiting admin verification.');
      navigate('/alumni/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-secondary/30 via-white to-primary/5">
      <Card className="w-full max-w-2xl shadow-hover">
        <CardHeader>
          <CardTitle className="text-3xl font-black">Complete Your Alumni Profile</CardTitle>
          <CardDescription>Share your experience to help guide the next generation</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  data-testid="name-input"
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="graduation_year">Graduation Year</Label>
                <Input
                  data-testid="graduation-year-input"
                  id="graduation_year"
                  name="graduation_year"
                  type="number"
                  placeholder="2020"
                  value={formData.graduation_year}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Current Company</Label>
                <Input
                  data-testid="company-input"
                  id="company"
                  name="company"
                  placeholder="Google, Microsoft, etc."
                  value={formData.company}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input
                  data-testid="designation-input"
                  id="designation"
                  name="designation"
                  placeholder="Software Engineer, Product Manager"
                  value={formData.designation}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="years_of_experience">Years of Experience</Label>
              <Input
                data-testid="experience-input"
                id="years_of_experience"
                name="years_of_experience"
                type="number"
                placeholder="5"
                value={formData.years_of_experience}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Skills</Label>
              <div className="flex gap-2">
                <Input
                  data-testid="skill-input"
                  placeholder="Add a skill (e.g., Python, Leadership, AI)"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <Button data-testid="add-skill-btn" type="button" onClick={addSkill} variant="outline">
                  <Tag className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skills.map((skill, index) => (
                  <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    {skill}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeSkill(skill)} />
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                data-testid="bio-input"
                id="bio"
                name="bio"
                placeholder="Tell students about your journey..."
                value={formData.bio}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin_url">LinkedIn URL (Optional)</Label>
              <Input
                data-testid="linkedin-input"
                id="linkedin_url"
                name="linkedin_url"
                placeholder="https://linkedin.com/in/yourprofile"
                value={formData.linkedin_url}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label htmlFor="mentorship_available" className="font-medium">Available for Mentorship</Label>
                <p className="text-sm text-muted-foreground">Students can send you mentorship requests</p>
              </div>
              <Switch
                data-testid="mentorship-switch"
                id="mentorship_available"
                checked={formData.mentorship_available}
                onCheckedChange={(checked) => setFormData({ ...formData, mentorship_available: checked })}
              />
            </div>

            <Button data-testid="create-profile-btn" type="submit" className="w-full btn-primary bg-primary" disabled={loading}>
              {loading ? 'Creating Profile...' : 'Create Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlumniProfileSetup;