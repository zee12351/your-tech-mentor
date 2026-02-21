import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Careers() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        <h1 className="font-display text-4xl font-bold mb-6">Careers</h1>
        <div className="prose prose-lg text-muted-foreground space-y-4">
          <p>
            We're building the future of interview preparation. If you're passionate about AI,
            education technology, and helping people succeed — we'd love to hear from you.
          </p>
          <p>
            Currently, there are no open positions. Check back soon or reach out at{' '}
            <span className="text-primary font-medium">careers@careerpilot.ai</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
