import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth';
import { Rocket, Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    const { error } = await signUp(email, password, fullName);

    if (error) {
      toast({
        title: 'Signup failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Account created!',
        description: 'Welcome to CareerPilot AI. Redirecting...',
      });
      navigate('/dashboard');
    }

    setLoading(false);
  };

  const benefits = [
    '1 Free AI Mock Interview',
    'Resume Analysis & Scoring',
    'JD Matching & Skill Gap Analysis',
    'Personalized Improvement Tips',
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
              <Rocket className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold">
              CareerPilot<span className="text-gradient"> AI</span>
            </span>
          </Link>

          <h1 className="font-display text-3xl font-bold mb-2">Create your account</h1>
          <p className="text-muted-foreground mb-8">
            Start your journey to cracking tech interviews
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="hero" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Creating account...' : 'Get Started Free'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <p className="text-center text-muted-foreground mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel - Benefits */}
      <div className="hidden lg:flex flex-1 section-warm items-center justify-center p-12">
        <div className="max-w-md">
          <h2 className="font-display text-3xl font-bold mb-6">
            What you get with your free account
          </h2>
          <ul className="space-y-4">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                </div>
                <span className="text-lg">{benefit}</span>
              </li>
            ))}
          </ul>
          
          <div className="mt-12 p-6 bg-card rounded-2xl shadow-card">
            <p className="text-muted-foreground text-sm mb-2">Join thousands who already improved their interview skills</p>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-hero border-2 border-card"
                  />
                ))}
              </div>
              <p className="font-semibold text-sm">10,000+ users</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
