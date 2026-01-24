import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import {
  Rocket,
  MessageSquare,
  FileText,
  Target,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  CreditCard,
  History,
  Crown,
} from 'lucide-react';

export default function Dashboard() {
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const quickActions = [
    {
      icon: MessageSquare,
      title: 'Start Mock Interview',
      description: 'Practice with AI interviewer',
      href: '/interview/new',
      color: 'primary',
    },
    {
      icon: FileText,
      title: 'Analyze Resume',
      description: 'Get AI-powered analysis',
      href: '/resume',
      color: 'teal',
    },
    {
      icon: Target,
      title: 'Match Job Description',
      description: 'Compare resume with JD',
      href: '/jd-match',
      color: 'primary',
    },
    {
      icon: History,
      title: 'Interview History',
      description: 'View past interviews',
      href: '/interviews',
      color: 'teal',
    },
  ];

  const tierColors = {
    free: 'bg-muted text-muted-foreground',
    pro: 'bg-primary/10 text-primary',
    elite: 'bg-gradient-hero text-primary-foreground',
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border p-4 hidden md:flex flex-col">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-8 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
            <Rocket className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold">
            CareerPilot<span className="text-gradient"> AI</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-medium"
          >
            <BarChart3 className="w-5 h-5" />
            Dashboard
          </Link>
          <Link
            to="/interview/new"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
            Mock Interview
          </Link>
          <Link
            to="/resume"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <FileText className="w-5 h-5" />
            Resume Analyzer
          </Link>
          <Link
            to="/jd-match"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Target className="w-5 h-5" />
            JD Matcher
          </Link>
          <Link
            to="/interviews"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <History className="w-5 h-5" />
            History
          </Link>
        </nav>

        {/* Bottom actions */}
        <div className="space-y-1 pt-4 border-t border-border">
          <Link
            to="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold">
              Welcome back, {profile.full_name?.split(' ')[0] || 'there'}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Ready to ace your next interview?
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 ${tierColors[profile.subscription_tier]}`}>
              {profile.subscription_tier === 'elite' && <Crown className="w-4 h-4" />}
              {profile.subscription_tier.charAt(0).toUpperCase() + profile.subscription_tier.slice(1)} Plan
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card-elevated">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Credits Remaining</p>
                <p className="font-display text-3xl font-bold mt-1">{profile.credits_remaining}</p>
              </div>
              <div className="icon-container">
                <CreditCard className="w-6 h-6" />
              </div>
            </div>
            {profile.subscription_tier === 'free' && (
              <Link to="/pricing" className="text-primary text-sm font-medium mt-3 inline-block hover:underline">
                Upgrade for more →
              </Link>
            )}
          </div>

          <div className="card-elevated">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Interviews Completed</p>
                <p className="font-display text-3xl font-bold mt-1">0</p>
              </div>
              <div className="icon-container-teal">
                <MessageSquare className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="card-elevated">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resumes Analyzed</p>
                <p className="font-display text-3xl font-bold mt-1">0</p>
              </div>
              <div className="icon-container">
                <FileText className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="card-elevated">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className="font-display text-3xl font-bold mt-1">--</p>
              </div>
              <div className="icon-container-teal">
                <BarChart3 className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="font-display text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.href}
              className="card-feature group cursor-pointer"
            >
              <div className={`icon-container${action.color === 'teal' ? '-teal' : ''} mb-4 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display font-semibold mb-1">{action.title}</h3>
              <p className="text-sm text-muted-foreground">{action.description}</p>
            </Link>
          ))}
        </div>

        {/* CTA for first interview */}
        <div className="card-elevated bg-gradient-warm p-8 text-center">
          <h3 className="font-display text-2xl font-bold mb-2">
            Ready for your first AI mock interview?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Practice with our AI interviewer and get instant, detailed feedback to improve your interview skills.
          </p>
          <Link to="/interview/new">
            <Button variant="hero" size="lg">
              <Plus className="w-5 h-5" />
              Start Interview Now
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
