import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';
import { GraduationCap, Users } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState(searchParams.get('role') || 'student');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success('Login successful!');
        navigate(role === 'student' ? '/student/dashboard' : '/alumni/dashboard');
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          setLoading(false);
          return;
        }
        await signup(formData.email, formData.password, role);
        toast.success('Account created successfully!');
        navigate(role === 'student' ? '/student/profile-setup' : '/alumni/profile-setup');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-secondary/30 via-white to-primary/5">
      <Card className="w-full max-w-md shadow-hover">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-black">Welcome Back</CardTitle>
          <CardDescription className="text-base">Connect with mentors and accelerate your career</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={isLogin ? 'login' : 'signup'} onValueChange={(val) => setIsLogin(val === 'login')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger data-testid="login-tab" value="login">Login</TabsTrigger>
              <TabsTrigger data-testid="signup-tab" value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div 
                data-testid="select-student-role"
                onClick={() => setRole('student')}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                  role === 'student' 
                    ? 'border-primary bg-primary/5 shadow-md' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <GraduationCap className={`w-8 h-8 mb-2 mx-auto ${
                  role === 'student' ? 'text-primary' : 'text-muted-foreground'
                }`} />
                <p className="text-center font-medium text-sm">Student</p>
              </div>
              <div 
                data-testid="select-alumni-role"
                onClick={() => setRole('alumni')}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                  role === 'alumni' 
                    ? 'border-primary bg-primary/5 shadow-md' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <Users className={`w-8 h-8 mb-2 mx-auto ${
                  role === 'alumni' ? 'text-primary' : 'text-muted-foreground'
                }`} />
                <p className="text-center font-medium text-sm">Alumni</p>
              </div>
            </div>

            <TabsContent value="login">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    data-testid="email-input"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    data-testid="password-input"
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <Button data-testid="login-submit-btn" type="submit" className="w-full btn-primary bg-primary" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    data-testid="signup-email-input"
                    id="signup-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    data-testid="signup-password-input"
                    id="signup-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    data-testid="confirm-password-input"
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                <Button data-testid="signup-submit-btn" type="submit" className="w-full btn-primary bg-primary" disabled={loading}>
                  {loading ? 'Creating account...' : 'Sign Up'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;