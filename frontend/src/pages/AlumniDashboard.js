import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { api } from '../utils/api';
import { Users, MessageCircle, Clock, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const AlumniDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);



  const fetchData = useCallback(async () => {
    try {
      const [profileRes, requestsRes, menteesRes] = await Promise.all([
        api.getAlumniProfile(user.id).catch(() => null),
        api.getIncomingRequests().catch(() => ({ data: [] })),
        api.getMyMentees().catch(() => ({ data: [] }))
      ]);
      
      if (profileRes) {
        setProfile(profileRes.data);
      }
      setRequests(requestsRes.data || []);
      setMentees(menteesRes.data || []);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  },[]);
    useEffect(() => {
    fetchData();
  }, [fetchData]);
  const handleAccept = async (requestId) => {
    try {
      await api.acceptRequest(requestId);
      toast.success('Request accepted!');
      fetchData();
    } catch (error) {
      toast.error('Failed to accept request');
    }
  };

  const handleReject = async (requestId) => {
    try {
      await api.rejectRequest(requestId);
      toast.success('Request rejected');
      fetchData();
    } catch (error) {
      toast.error('Failed to reject request');
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
              <CardDescription>Set up your alumni profile to start mentoring students</CardDescription>
            </CardHeader>
            <CardContent>
              <Button data-testid="setup-profile-btn" onClick={() => navigate('/alumni/profile-setup')} className="btn-primary bg-primary">
                Setup Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const pendingRequests = requests.filter(r => r.status === 'pending');

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-black mb-2">Welcome back, {profile.name}!</h1>
          <p className="text-muted-foreground text-lg">Guide the next generation of professionals</p>
          {!user.verified && (
            <div className="mt-4 p-4 bg-accent/10 border border-accent/30 rounded-lg flex items-start gap-3" data-testid="verification-pending-alert">
              <AlertCircle className="w-5 h-5 text-accent mt-0.5" />
              <div>
                <p className="font-medium text-accent">Account Verification Pending</p>
                <p className="text-sm text-muted-foreground">Your account is awaiting admin verification. You'll be able to receive mentorship requests once verified.</p>
              </div>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-card hover:shadow-hover transition-all duration-300" data-testid="mentees-count-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Mentees</CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mentees.length}</div>
              <p className="text-xs text-muted-foreground">Students you're mentoring</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-hover transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <Clock className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pendingRequests.length}</div>
              <p className="text-xs text-muted-foreground">Awaiting your response</p>
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

        {/* Mentorship Requests */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Mentorship Requests</CardTitle>
            <CardDescription>Students seeking your guidance</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingRequests.length > 0 ? (
              <div className="space-y-4">
                {pendingRequests.map((request, index) => (
                  <Card key={index} className="border-2" data-testid={`request-card-${index}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium">Request from Student</p>
                          <p className="text-sm text-muted-foreground mt-1">{request.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(request.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            data-testid={`accept-request-${index}`}
                            onClick={() => handleAccept(request.id)}
                            size="sm"
                            className="bg-primary"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            data-testid={`reject-request-${index}`}
                            onClick={() => handleReject(request.id)}
                            size="sm"
                            variant="outline"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Decline
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No pending requests at the moment</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Mentees */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>My Mentees</CardTitle>
            <CardDescription>Students you're currently mentoring</CardDescription>
          </CardHeader>
          <CardContent>
            {mentees.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mentees.map((mentee, index) => (
                  <Card key={index} className="card-interactive" data-testid={`mentee-card-${index}`}>
                    <CardHeader>
                      <CardTitle className="text-lg">{mentee.name}</CardTitle>
                      <CardDescription>{mentee.education}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1">
                          {mentee.skills?.slice(0, 3).map((skill, i) => (
                            <span key={i} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                        <Button 
                          data-testid={`chat-mentee-${index}`}
                          onClick={() => navigate(`/chat/${mentee.user_id}`)}
                          className="w-full mt-2"
                          variant="outline"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Chat
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>You don't have any mentees yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            data-testid="create-post-btn"
            onClick={() => navigate('/community?create=true')}
            className="h-24 text-lg btn-primary bg-primary"
          >
            <MessageCircle className="w-6 h-6 mr-2" />
            Share Your Experience
          </Button>
          <Button 
            data-testid="view-profile-btn"
            onClick={() => navigate('/alumni/profile')}
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

export default AlumniDashboard;
