import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { toast } from 'sonner';
import { api } from '../utils/api';
import { Search, Loader2, Briefcase, Award, Calendar, Send } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const Mentorship = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState({ skills: '', company: '' });
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  /**
   * ✅ SEARCH MENTORS (MEMOIZED)
   */
  const searchMentors = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.searchMentors(searchQuery);
      setMentors(response.data || []);
    } catch (error) {
      toast.error('Failed to search mentors');
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  /**
   * ✅ INITIAL SEARCH ON PAGE LOAD
   */
  useEffect(() => {
    searchMentors();
  }, [searchMentors]);

  /**
   * ✅ AUTO OPEN DIALOG IF ?alumni=ID EXISTS
   */
  useEffect(() => {
    const alumniId = searchParams.get('alumni');
    if (alumniId && mentors.length > 0) {
      const mentor = mentors.find(m => m.user_id === alumniId);
      if (mentor) {
        setSelectedMentor(mentor);
        setDialogOpen(true);
      }
    }
  }, [mentors, searchParams]);

  /**
   * ✅ SEND MENTORSHIP REQUEST
   */
  const handleSendRequest = async () => {
    if (!requestMessage.trim()) {
      toast.error('Please write a message');
      return;
    }

    try {
      await api.createMentorshipRequest({
        alumni_id: selectedMentor.user_id,
        message: requestMessage,
      });

      toast.success('Request sent successfully!');
      setDialogOpen(false);
      setRequestMessage('');
      setSelectedMentor(null);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to send request');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-black mb-2">Find Mentors</h1>
          <p className="text-muted-foreground text-lg">
            Connect with experienced alumni to guide your career
          </p>
        </div>

        {/* Search */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search Mentors
            </CardTitle>
            <CardDescription>Filter mentors by skills or company</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Skills</Label>
                <Input
                  placeholder="React, Python"
                  value={searchQuery.skills}
                  onChange={(e) =>
                    setSearchQuery({ ...searchQuery, skills: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Company</Label>
                <Input
                  placeholder="Google, Microsoft"
                  value={searchQuery.company}
                  onChange={(e) =>
                    setSearchQuery({ ...searchQuery, company: e.target.value })
                  }
                />
              </div>

              <div className="flex items-end">
                <Button
                  onClick={searchMentors}
                  disabled={loading}
                  className="w-full bg-primary"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Search className="w-4 h-4 mr-2" />
                  )}
                  Search
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mentors List */}
        <div>
          <h2 className="text-2xl font-bold mb-4">
            Available Mentors ({mentors.length})
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : mentors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentors.map((mentor, index) => (
                <Card key={index} className="shadow-card">
                  <CardHeader>
                    <CardTitle>{mentor.name}</CardTitle>
                    <CardDescription>
                      {mentor.designation} at {mentor.company}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        {mentor.years_of_experience} years experience
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Graduated {mentor.graduation_year}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {mentor.skills?.slice(0, 5).map((skill, i) => (
                        <span
                          key={i}
                          className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <Button
                      className="w-full bg-primary"
                      onClick={() => {
                        setSelectedMentor(mentor);
                        setDialogOpen(true);
                      }}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Request Mentorship
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              No mentors found
            </div>
          )}
        </div>

        {/* Request Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Mentorship</DialogTitle>
              <DialogDescription>
                Send a message to {selectedMentor?.name}
              </DialogDescription>
            </DialogHeader>

            <Textarea
              placeholder="Introduce yourself..."
              rows={5}
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-primary" onClick={handleSendRequest}>
                Send
              </Button>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </DashboardLayout>
  );
};

export default Mentorship;
