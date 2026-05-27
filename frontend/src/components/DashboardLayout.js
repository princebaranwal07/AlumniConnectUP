import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { LogOut, Home, Users, MessageCircle, Newspaper, UserCircle, Shield } from 'lucide-react';
import { toast } from 'sonner';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const studentNav = [
    { icon: Home, label: 'Dashboard', path: '/student/dashboard' },
    { icon: Users, label: 'Find Mentors', path: '/mentorship' },
    { icon: MessageCircle, label: 'Messages', path: '/messages' },
    { icon: Newspaper, label: 'Community', path: '/community' },
    { icon: UserCircle, label: 'Profile', path: '/student/profile' },
  ];

  const alumniNav = [
    { icon: Home, label: 'Dashboard', path: '/alumni/dashboard' },
    { icon: Users, label: 'My Mentees', path: '/alumni/mentees' },
    { icon: MessageCircle, label: 'Messages', path: '/messages' },
    { icon: Newspaper, label: 'Community', path: '/community' },
    { icon: UserCircle, label: 'Profile', path: '/alumni/profile' },
  ];

  const adminNav = [
    { icon: Shield, label: 'Admin Panel', path: '/admin/dashboard' },
  ];

  const navItems = user?.role === 'student' ? studentNav : user?.role === 'alumni' ? alumniNav : adminNav;

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/10 via-white to-primary/5">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <h1 
                data-testid="app-logo"
                className="text-2xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent cursor-pointer"
                onClick={() => navigate('/')}
              >
                AlumniConnect
              </h1>
              <div className="hidden md:flex gap-1">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={index}
                      data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
                      onClick={() => navigate(item.path)}
                      variant="ghost"
                      className="gap-2"
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{user?.email}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
              <Button 
                data-testid="logout-btn"
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;