import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Refund() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        <h1 className="font-display text-4xl font-bold mb-6">Refund Policy</h1>
        <div className="prose prose-lg text-muted-foreground space-y-4">
          <p>Last updated: February 2026</p>
          <p>
            We offer a 7-day money-back guarantee on all paid plans. If you're not satisfied with
            CareerPilot AI, contact our support team within 7 days of purchase for a full refund.
          </p>
          <p>
            Refund requests can be sent to{' '}
            <span className="text-primary font-medium">support@careerpilot.ai</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
