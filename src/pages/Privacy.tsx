import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        <h1 className="font-display text-4xl font-bold mb-6">Privacy Policy</h1>
        <div className="prose prose-lg text-muted-foreground space-y-4">
          <p>Last updated: February 2026</p>
          <p>
            CareerPilot AI respects your privacy. We collect only the data necessary to provide our
            services, including your email, name, interview responses, and uploaded resumes.
          </p>
          <p>
            We do not sell your personal data to third parties. Your interview data is used solely
            to generate feedback and improve our AI models.
          </p>
          <p>
            For questions about our privacy practices, contact us at{' '}
            <span className="text-primary font-medium">privacy@careerpilot.ai</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
