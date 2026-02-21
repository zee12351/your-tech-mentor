import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        <h1 className="font-display text-4xl font-bold mb-6">Terms of Service</h1>
        <div className="prose prose-lg text-muted-foreground space-y-4">
          <p>Last updated: February 2026</p>
          <p>
            By using CareerPilot AI, you agree to these terms. Our platform provides AI-powered
            mock interviews and resume analysis for educational and practice purposes.
          </p>
          <p>
            Interview scores and feedback are AI-generated and should be used as guidance, not as
            guarantees of job placement outcomes.
          </p>
          <p>
            For questions, contact us at{' '}
            <span className="text-primary font-medium">legal@careerpilot.ai</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
