import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { toast } from 'sonner';
import { api } from '../utils/api';
import { Newspaper, Loader2, Briefcase, Calendar, Tag as TagIcon } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const Community = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(searchParams.get('create') === 'true');
  const [postData, setPostData] = useState({
    title: '',
    content: '',
    type: 'advice',
    tags: []
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.getPosts();
      setPosts(response.data);
    } catch (error) {
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!postData.title.trim() || !postData.content.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await api.createPost(postData);
      toast.success('Post created successfully!');
      setDialogOpen(false);
      setPostData({ title: '', content: '', type: 'advice', tags: [] });
      fetchPosts();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create post');
    }
  };

  const getPostTypeColor = (type) => {
    const colors = {
      advice: 'bg-primary/10 text-primary',
      opportunity: 'bg-accent/10 text-accent',
      experience: 'bg-purple-100 text-purple-600',
      announcement: 'bg-blue-100 text-blue-600'
    };
    return colors[type] || 'bg-gray-100 text-gray-600';
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black mb-2">Community Feed</h1>
            <p className="text-muted-foreground text-lg">Insights, opportunities, and experiences from alumni</p>
          </div>
          {user?.role === 'alumni' && (
            <Button 
              data-testid="create-post-btn"
              onClick={() => setDialogOpen(true)}
              className="btn-primary bg-primary"
            >
              Create Post
            </Button>
          )}
        </div>

        {/* Posts */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : posts.length > 0 ? (
            posts.map((post, index) => (
              <Card key={index} className="shadow-card hover:shadow-hover transition-all duration-300" data-testid={`post-card-${index}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                      <CardDescription className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          {post.author_name} - {post.author_company}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </CardDescription>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPostTypeColor(post.type)}`}>
                      {post.type}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{post.content}</p>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {post.tags.map((tag, i) => (
                        <span key={i} className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs">
                          <TagIcon className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Newspaper className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No posts yet. Be the first to share!</p>
            </div>
          )}
        </div>

        {/* Create Post Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl" data-testid="create-post-dialog">
            <DialogHeader>
              <DialogTitle>Share Your Experience</DialogTitle>
              <DialogDescription>Post advice, opportunities, or insights for students</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  data-testid="post-title-input"
                  id="title"
                  placeholder="Enter a catchy title"
                  value={postData.title}
                  onChange={(e) => setPostData({ ...postData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Post Type</Label>
                <Select value={postData.type} onValueChange={(value) => setPostData({ ...postData, type: value })}>
                  <SelectTrigger data-testid="post-type-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="advice">Career Advice</SelectItem>
                    <SelectItem value="opportunity">Job Opportunity</SelectItem>
                    <SelectItem value="experience">My Experience</SelectItem>
                    <SelectItem value="announcement">Announcement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  data-testid="post-content-input"
                  id="content"
                  placeholder="Share your thoughts, experiences, or opportunities..."
                  value={postData.content}
                  onChange={(e) => setPostData({ ...postData, content: e.target.value })}
                  rows={8}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button 
                  data-testid="cancel-post-btn"
                  onClick={() => setDialogOpen(false)} 
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button 
                  data-testid="publish-post-btn"
                  onClick={handleCreatePost}
                  className="bg-primary"
                >
                  Publish Post
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Community;