import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Rocket,
  ArrowLeft,
  Download,
  Share2,
  Star,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface Interview {
  id: string;
  role_type: string;
  difficulty: string;
  status: string;
  overall_score: number | null;
  feedback_summary: string | null;
  skill_ratings: Record<string, number> | null;
  improvement_plan: string[] | null;
  started_at: string;
  completed_at: string | null;
}

export default function InterviewReport() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchInterview = async () => {
      const { data, error } = await supabase
        .from('interviews')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error || !data) {
        toast({
          title: 'Report not found',
          description: 'Redirecting to dashboard',
          variant: 'destructive',
        });
        navigate('/dashboard');
        return;
      }

      if (data.status !== 'completed') {
        navigate(`/interview/${id}`);
        return;
      }

      setInterview({
        ...data,
        skill_ratings: data.skill_ratings as Record<string, number> | null,
        improvement_plan: data.improvement_plan as string[] | null,
      });
      setLoading(false);
    };

    fetchInterview();
  }, [id, user, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading report...
        </div>
      </div>
    );
  }

  if (!interview) return null;

  const roleLabels: Record<string, string> = {
    devops: 'DevOps Engineer',
    cloud: 'Cloud Engineer',
    software: 'Software Engineer',
    data: 'Data Engineer',
    fullstack: 'Full Stack Developer',
    frontend: 'Frontend Developer',
    backend: 'Backend Developer',
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Improvement';
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
                Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
                <Rocket className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold">Interview Report</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="default" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Score Card */}
        <div className="card-elevated text-center mb-8 py-12">
          <p className="text-muted-foreground mb-2">Your Interview Score</p>
          <div className="relative inline-block mb-4">
            <svg className="w-40 h-40" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(interview.overall_score || 0) * 2.83} 283`}
                transform="rotate(-90 50 50)"
                className={getScoreColor(interview.overall_score || 0)}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`font-display text-4xl font-bold ${getScoreColor(interview.overall_score || 0)}`}>
                {interview.overall_score || 0}
              </span>
            </div>
          </div>
          <p className={`font-display text-xl font-semibold ${getScoreColor(interview.overall_score || 0)}`}>
            {getScoreLabel(interview.overall_score || 0)}
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
            <span>{roleLabels[interview.role_type]}</span>
            <span>•</span>
            <span className="capitalize">{interview.difficulty}</span>
            <span>•</span>
            <span>{new Date(interview.completed_at || '').toLocaleDateString()}</span>
          </div>
        </div>

        {/* Skill Ratings */}
        {interview.skill_ratings && (
          <div className="card-elevated mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-5 h-5 text-primary" />
              <h2 className="font-display text-xl font-bold">Skill Ratings</h2>
            </div>
            <div className="space-y-4">
              {Object.entries(interview.skill_ratings).map(([skill, rating]) => (
                <div key={skill}>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium capitalize">{skill.replace(/_/g, ' ')}</span>
                    <span className={`font-semibold ${getScoreColor(rating as number)}`}>
                      {rating}/100
                    </span>
                  </div>
                  <div className="progress-warm">
                    <div
                      className="progress-warm-fill"
                      style={{ width: `${rating}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Feedback Summary */}
        {interview.feedback_summary && (
          <div className="card-elevated mb-8">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-success" />
              <h2 className="font-display text-xl font-bold">Feedback Summary</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {interview.feedback_summary}
            </p>
          </div>
        )}

        {/* Improvement Plan */}
        {interview.improvement_plan && interview.improvement_plan.length > 0 && (
          <div className="card-elevated mb-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="font-display text-xl font-bold">Improvement Plan</h2>
            </div>
            <ul className="space-y-3">
              {interview.improvement_plan.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-sm font-semibold">
                    {index + 1}
                  </div>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* CTA */}
        <div className="text-center">
          <Link to="/interview/new">
            <Button variant="hero" size="lg">
              Start Another Interview
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
