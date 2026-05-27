import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { api } from '../utils/api';
import { Tag, X } from 'lucide-react';

const StudentProfileSetup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    education: '',
    skills: [],
    career_goals: '',
    interests: []
  });
  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  const addInterest = () => {
    if (interestInput.trim() && !formData.interests.includes(interestInput.trim())) {
      setFormData({ ...formData, interests: [...formData.interests, interestInput.trim()] });
      setInterestInput('');
    }
  };

  const removeInterest = (interest) => {
    setFormData({ ...formData, interests: formData.interests.filter(i => i !== interest) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.createStudentProfile(formData);
      toast.success('Profile created successfully!');
      navigate('/student/dashboard');
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
          <CardTitle className="text-3xl font-black">Complete Your Profile</CardTitle>
          <CardDescription>Tell us about yourself to get personalized mentor recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
              <Label htmlFor="education">Education</Label>
              <Input
                data-testid="education-input"
                id="education"
                name="education"
                placeholder="B.Tech Computer Science, XYZ University"
                value={formData.education}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Skills</Label>
              <div className="flex gap-2">
                <Input
                  data-testid="skill-input"
                  placeholder="Add a skill (e.g., Python, React, ML)"
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
              <Label htmlFor="career_goals">Career Goals</Label>
              <Textarea
                data-testid="career-goals-input"
                id="career_goals"
                name="career_goals"
                placeholder="Describe your career aspirations and goals..."
                value={formData.career_goals}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Interests</Label>
              <div className="flex gap-2">
                <Input
                  data-testid="interest-input"
                  placeholder="Add an interest (e.g., AI, Web Dev, Startups)"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                />
                <Button data-testid="add-interest-btn" type="button" onClick={addInterest} variant="outline">
                  <Tag className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.interests.map((interest, index) => (
                  <span key={index} className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    {interest}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeInterest(interest)} />
                  </span>
                ))}
              </div>
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

export default StudentProfileSetup;