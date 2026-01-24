import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Sparkles, CheckCircle2 } from 'lucide-react';

export function HeroSection() {
  const highlights = [
    'AI-Powered Mock Interviews',
    'Resume Analysis & ATS Optimization',
    'Personalized Improvement Plans',
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-warm" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-8 animate-fade-in-up">
            <Sparkles className="w-4 h-4" />
            <span>Trusted by 10,000+ Job Seekers in India</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Crack Your Next{' '}
            <span className="text-gradient">Tech Interview</span>{' '}
            with AI
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Practice with AI interviewers tailored for DevOps, Cloud, Software, and Data roles. 
            Get instant feedback, improve your skills, and land your dream job.
          </p>

          {/* Highlights */}
          <div className="flex flex-wrap justify-center gap-4 mb-10 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            {highlights.map((highlight, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm font-medium text-foreground"
              >
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span>{highlight}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Link to="/signup">
              <Button variant="hero" size="xl" className="group">
                Try Free Interview
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="heroOutline" size="xl" className="group">
              <Play className="w-5 h-5" />
              Watch Demo
            </Button>
          </div>

          {/* Social Proof */}
          <div className="mt-12 pt-8 border-t border-border/50 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <p className="text-sm text-muted-foreground mb-4">
              Helped candidates get placed at
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {['Google', 'Microsoft', 'Amazon', 'Flipkart', 'Infosys', 'TCS'].map((company) => (
                <span key={company} className="font-display font-bold text-lg text-foreground/70">
                  {company}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="hidden lg:block absolute left-10 top-1/3 animate-float">
          <div className="card-elevated p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="font-semibold text-sm">Interview Passed!</p>
                <p className="text-xs text-muted-foreground">Score: 92/100</p>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block absolute right-10 top-1/2 animate-float" style={{ animationDelay: '1s' }}>
          <div className="card-elevated p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">AI Feedback</p>
                <p className="text-xs text-muted-foreground">Ready in seconds</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
