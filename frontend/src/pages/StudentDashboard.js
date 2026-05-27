import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { api } from '../utils/api';
import { Sparkles, Users, MessageCircle, TrendingUp, Loader2 } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recsLoading, setRecsLoading] = useState(false);

  

  const fetchData = async () => {
    try {
      const [profileRes, mentorsRes] = await Promise.all([
        api.getStudentProfile(user.id).catch(() => null),
        api.getMyMentors().catch(() => ({ data: [] }))
      ]);
      
      if (profileRes) {
        setProfile(profileRes.data);
      }
      setMentors(mentorsRes.data || []);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchRecommendations = async () => {
    setRecsLoading(true);
    try {
      const response = await api.getRecommendations();
      setRecommendations(response.data);
      toast.success('AI recommendations loaded!');
    } catch (error) {
      toast.error('Failed to load recommendations');
    } finally {
      setRecsLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Card className="max-w-md text-center">
            <CardHeader>
              <CardTitle>Complete Your Profile</CardTitle>
              <CardDescription>Set up your profile to get started with mentorship</CardDescription>
            </CardHeader>
            <CardContent>
              <Button data-testid="setup-profile-btn" onClick={() => navigate('/student/profile-setup')} className="btn-primary bg-primary">
                Setup Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-black mb-2">Welcome back, {profile.name}!</h1>
          <p className="text-muted-foreground text-lg">Here's your mentorship journey at a glance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-card hover:shadow-hover transition-all duration-300" data-testid="mentors-count-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Mentors</CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mentors.length}</div>
              <p className="text-xs text-muted-foreground">Connected mentors guiding you</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-hover transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Skills</CardTitle>
              <TrendingUp className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{profile.skills?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Skills in your profile</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-hover transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageCircle className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Unread messages</p>
            </CardContent>
          </Card>
        </div>

        {/* AI Recommendations */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  AI-Powered Mentor Recommendations
                </CardTitle>
                <CardDescription>Find the perfect mentors based on your goals and skills</CardDescription>
              </div>
              <Button 
                data-testid="get-recommendations-btn"
                onClick={fetchRecommendations} 
                disabled={recsLoading}
                className="btn-primary bg-primary"
              >
                {recsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Get Recommendations'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.map((alumni, index) => (
                  <Card key={index} className="card-interactive" data-testid={`recommendation-card-${index}`}>
                    <CardHeader>
                      <CardTitle className="text-lg">{alumni.name}</CardTitle>
                      <CardDescription>{alumni.designation} at {alumni.company}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1">
                          {alumni.skills?.slice(0, 3).map((skill, i) => (
                            <span key={i} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">{alumni.years_of_experience} years experience</p>
                        <Button 
                          data-testid={`view-profile-${index}`}
                          onClick={() => navigate(`/mentorship?alumni=${alumni.user_id}`)}
                          className="w-full mt-2"
                          variant="outline"
                        >
                          View Profile
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Click &quot;Get Recommendations&quot; to discover perfect mentors for you</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Mentors */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>My Mentors</CardTitle>
            <CardDescription>Alumni currently mentoring you</CardDescription>
          </CardHeader>
          <CardContent>
            {mentors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mentors.map((mentor, index) => (
                  <Card key={index} className="card-interactive" data-testid={`mentor-card-${index}`}>
                    <CardHeader>
                      <CardTitle className="text-lg">{mentor.name}</CardTitle>
                      <CardDescription>{mentor.company}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        data-testid={`chat-mentor-${index}`}
                        onClick={() => navigate(`/chat/${mentor.user_id}`)}
                        className="w-full"
                        variant="outline"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Chat
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>You don't have any mentors yet</p>
                <Button 
                  data-testid="find-mentors-btn"
                  onClick={() => navigate('/mentorship')}
                  className="mt-4 btn-primary bg-primary"
                >
                  Find Mentors
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            data-testid="find-mentors-action-btn"
            onClick={() => navigate('/mentorship')}
            className="h-24 text-lg btn-primary bg-primary"
          >
            <Users className="w-6 h-6 mr-2" />
            Find Mentors
          </Button>
          <Button 
            data-testid="community-feed-btn"
            onClick={() => navigate('/community')}
            className="h-24 text-lg btn-secondary"
            variant="outline"
          >
            <TrendingUp className="w-6 h-6 mr-2" />
            Community Feed
          </Button>
          <Button 
            data-testid="view-profile-btn"
            onClick={() => navigate('/student/profile')}
            className="h-24 text-lg btn-secondary"
            variant="outline"
          >
            View My Profile
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
