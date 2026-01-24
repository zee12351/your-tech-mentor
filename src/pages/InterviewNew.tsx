import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Rocket,
  ArrowLeft,
  ArrowRight,
  Cloud,
  Server,
  Code,
  Database,
  Layout,
  Layers,
  Terminal,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const roles = [
  { id: 'devops', label: 'DevOps Engineer', icon: Server },
  { id: 'cloud', label: 'Cloud Engineer', icon: Cloud },
  { id: 'software', label: 'Software Engineer', icon: Code },
  { id: 'data', label: 'Data Engineer', icon: Database },
  { id: 'fullstack', label: 'Full Stack Developer', icon: Layers },
  { id: 'frontend', label: 'Frontend Developer', icon: Layout },
  { id: 'backend', label: 'Backend Developer', icon: Terminal },
] as const;

const difficulties = [
  { id: 'beginner', label: 'Beginner', description: 'For freshers & entry-level (0-2 years)' },
  { id: 'intermediate', label: 'Intermediate', description: 'For mid-level (2-5 years)' },
  { id: 'advanced', label: 'Advanced', description: 'For senior roles (5+ years)' },
] as const;

export default function InterviewNew() {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleStartInterview = async () => {
    if (!user) {
      toast({
        title: 'Please login',
        description: 'You need to be logged in to start an interview',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    if (!selectedRole || !selectedDifficulty) {
      toast({
        title: 'Missing selection',
        description: 'Please select a role and difficulty level',
        variant: 'destructive',
      });
      return;
    }

    if (profile && profile.credits_remaining <= 0) {
      toast({
        title: 'No credits remaining',
        description: 'Please upgrade your plan to continue',
        variant: 'destructive',
      });
      navigate('/pricing');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('interviews')
        .insert({
          user_id: user.id,
          role_type: selectedRole,
          difficulty: selectedDifficulty,
          job_description: jobDescription || null,
          status: 'in_progress',
        })
        .select()
        .single();

      if (error) throw error;

      // Deduct credit
      await supabase
        .from('profiles')
        .update({ credits_remaining: (profile?.credits_remaining || 1) - 1 })
        .eq('user_id', user.id);

      toast({
        title: 'Interview started!',
        description: 'Good luck with your mock interview',
      });

      navigate(`/interview/${data.id}`);
    } catch (error) {
      console.error('Error starting interview:', error);
      toast({
        title: 'Failed to start interview',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
                <Rocket className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold">New Interview</span>
            </div>
          </div>
          {profile && (
            <div className="text-sm text-muted-foreground">
              Credits: <span className="font-semibold text-foreground">{profile.credits_remaining}</span>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">
            Configure Your Mock Interview
          </h1>
          <p className="text-muted-foreground">
            Select your target role and difficulty level to begin
          </p>
        </div>

        {/* Role Selection */}
        <div className="mb-8">
          <Label className="text-lg font-display font-semibold mb-4 block">
            Select Your Target Role
          </Label>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  selectedRole === role.id
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    selectedRole === role.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    <role.icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium">{role.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="mb-8">
          <Label className="text-lg font-display font-semibold mb-4 block">
            Select Difficulty Level
          </Label>
          <div className="grid sm:grid-cols-3 gap-3">
            {difficulties.map((diff) => (
              <button
                key={diff.id}
                onClick={() => setSelectedDifficulty(diff.id)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  selectedDifficulty === diff.id
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                <p className="font-semibold mb-1">{diff.label}</p>
                <p className="text-sm text-muted-foreground">{diff.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Optional JD */}
        <div className="mb-8">
          <Label className="text-lg font-display font-semibold mb-2 block">
            Job Description (Optional)
          </Label>
          <p className="text-sm text-muted-foreground mb-4">
            Paste a specific job description to tailor the interview questions
          </p>
          <Textarea
            placeholder="Paste the job description here for more relevant questions..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="min-h-[120px]"
          />
        </div>

        {/* Start Button */}
        <Button
          variant="hero"
          size="xl"
          className="w-full"
          onClick={handleStartInterview}
          disabled={!selectedRole || !selectedDifficulty || loading}
        >
          {loading ? 'Starting Interview...' : 'Start Mock Interview'}
          <ArrowRight className="w-5 h-5" />
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-4">
          This will use 1 interview credit from your account
        </p>
      </main>
    </div>
  );
}
