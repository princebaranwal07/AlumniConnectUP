import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowRight, Users, MessageCircle, TrendingUp, Video, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-secondary/50 backdrop-blur-sm px-6 py-3 rounded-full mb-8">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Mentorship Platform</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-6 tracking-tight">
              Connect with Alumni.
              <br />
              <span className="bg-gradient-to-r from-primary via-purple-600 to-accent bg-clip-text text-transparent">
                Accelerate Your Career.
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Bridge the gap between aspiring students and successful alumni. Get personalized mentorship,
              career guidance, and industry insights powered by intelligent recommendations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                data-testid="get-started-student-btn"
                onClick={() => navigate('/auth?role=student')}
                size="lg"
                className="btn-primary bg-primary text-primary-foreground text-lg group"
              >
                Get Started as Student
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                data-testid="get-started-alumni-btn"
                onClick={() => navigate('/auth?role=alumni')}
                size="lg"
                variant="outline"
                className="btn-secondary text-lg border-2"
              >
                Join as Alumni Mentor
              </Button>
            </div>
          </motion.div>

          {/* Hero Image Grid */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            <div className="col-span-2 md:col-span-1 h-64 rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300">
              <img 
                src="https://images.unsplash.com/photo-1758270705172-07b53627dfcb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwY29sbGVnZSUyMHN0dWRlbnRzJTIwc3R1ZHlpbmclMjBjb2xsYWJvcmF0aW9ufGVufDB8fHx8MTc2NjE1MTY0OHww&ixlib=rb-4.1.0&q=85" 
                alt="Students collaborating"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="h-64 rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300">
              <img 
                src="https://images.unsplash.com/photo-1565688527174-775059ac429c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwyfHxwcm9mZXNzaW9uYWwlMjBtZW50b3IlMjBhbHVtbmklMjBvZmZpY2UlMjBmcmllbmRseXxlbnwwfHx8fDE3NjYxNTE2NTB8MA&ixlib=rb-4.1.0&q=85" 
                alt="Professional mentors"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="h-64 rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300">
              <img 
                src="https://images.unsplash.com/photo-1652974731232-efc86a9bd985?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwbW9kZXJuJTIwYXJjaGl0ZWN0dXJlJTIwYnJpZ2h0fGVufDB8fHx8MTc2NjE1MTY1MXww&ixlib=rb-4.1.0&q=85" 
                alt="Campus"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-white to-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4">Why Choose Our Platform?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Everything you need to build meaningful mentor-mentee relationships</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: "AI-Powered Matching",
                description: "Get intelligent mentor recommendations based on your skills, goals, and interests using advanced AI algorithms."
              },
              {
                icon: <MessageCircle className="w-8 h-8" />,
                title: "Real-time Chat",
                description: "Connect instantly with your mentors through seamless real-time messaging for quick guidance and support."
              },
              {
                icon: <Video className="w-8 h-8" />,
                title: "Video Calls",
                description: "Have face-to-face conversations with mentors through integrated video calling for deeper connections."
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Community Feed",
                description: "Access valuable insights, career advice, and job opportunities shared by successful alumni."
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Career Guidance",
                description: "Get personalized career advice from industry professionals who have walked the path before you."
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Verified Alumni",
                description: "Connect with verified alumni from top companies ensuring authentic and quality mentorship."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card p-8 rounded-xl shadow-card hover:shadow-hover transition-all duration-300 border border-border"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto bg-gradient-to-r from-primary via-purple-600 to-accent p-12 rounded-3xl text-center text-white shadow-2xl"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6">Ready to Start Your Journey?</h2>
            <p className="text-lg sm:text-xl mb-8 opacity-90">Join thousands of students and alumni building their future together</p>
            <Button 
              data-testid="cta-get-started-btn"
              onClick={() => navigate('/auth')}
              size="lg"
              className="bg-white text-primary hover:bg-white/90 text-lg btn-primary"
            >
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;