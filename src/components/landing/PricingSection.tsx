import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    description: 'Perfect for trying out CareerPilot',
    features: [
      '1 AI Mock Interview',
      'Basic Resume Analysis',
      'Limited JD Matching',
      'Community Support',
    ],
    cta: 'Start Free',
    featured: false,
  },
  {
    name: 'Pro',
    price: '₹299',
    period: '/month',
    description: 'For serious job seekers',
    features: [
      '10 AI Mock Interviews',
      'Advanced Resume Analysis',
      'Unlimited JD Matching',
      'Downloadable PDF Reports',
      'Email Support',
      'Follow-up Questions',
    ],
    cta: 'Get Pro',
    featured: true,
  },
  {
    name: 'Elite',
    price: '₹999',
    period: '/month',
    description: 'For professionals & power users',
    features: [
      'Unlimited AI Mock Interviews',
      'Premium Resume Analysis',
      'Unlimited JD Matching',
      'Advanced PDF Reports',
      'Priority Support',
      'All Interview Roles',
      'Custom Difficulty Levels',
      'Career Roadmap',
    ],
    cta: 'Go Elite',
    featured: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 section-warm">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Simple, <span className="text-gradient">Affordable</span> Pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose the plan that fits your interview preparation needs. All plans include our core AI technology.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`card-pricing ${plan.featured ? 'featured' : ''}`}
            >
              {plan.featured && (
                <div className="badge-popular">Most Popular</div>
              )}

              <div className="mb-6">
                <h3 className="font-display text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="font-display text-4xl font-extrabold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/signup" className="block">
                <Button
                  variant={plan.featured ? 'hero' : 'outline'}
                  className="w-full"
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Money-back guarantee */}
        <p className="text-center text-muted-foreground mt-12">
          💯 7-day money-back guarantee. No questions asked.
        </p>
      </div>
    </section>
  );
}
