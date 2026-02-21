import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        <h1 className="font-display text-4xl font-bold mb-6">About Us</h1>
        <div className="prose prose-lg text-muted-foreground space-y-4">
          <p>
            CareerPilot AI is an AI-powered interview preparation platform built to help job seekers
            crack their dream tech interviews with confidence.
          </p>
          <p>
            Founded in Bangalore, India, we leverage cutting-edge AI technology to simulate realistic
            interview experiences across DevOps, Cloud, Software Engineering, and Data roles.
          </p>
          <p>
            Our mission is to democratize interview preparation and make quality coaching accessible
            to every aspiring tech professional.
          </p>
        </div>
      </div>
    </div>
  );
}
