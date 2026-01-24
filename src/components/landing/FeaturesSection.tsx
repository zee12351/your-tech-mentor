import { FileText, Target, MessageSquare, BarChart3, Zap, Shield } from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'Resume Analyzer',
    description: 'Get AI-powered analysis of your resume with ATS optimization tips, skill assessment, and personalized improvement suggestions.',
    color: 'primary',
  },
  {
    icon: Target,
    title: 'JD Matcher',
    description: 'Compare your resume against job descriptions to identify skill gaps, matching percentage, and a tailored preparation roadmap.',
    color: 'teal',
  },
  {
    icon: MessageSquare,
    title: 'AI Mock Interview',
    description: 'Practice with realistic AI interviewers for DevOps, Cloud, Software, and Data roles. Get instant, detailed feedback.',
    color: 'primary',
  },
  {
    icon: BarChart3,
    title: 'Performance Reports',
    description: 'Download professional PDF reports with skill ratings, improvement plans, and actionable insights to track your progress.',
    color: 'teal',
  },
  {
    icon: Zap,
    title: 'Real-time Feedback',
    description: 'Receive instant AI feedback on your answers with suggestions for improvement and follow-up questions.',
    color: 'primary',
  },
  {
    icon: Shield,
    title: 'Indian Job Market Focus',
    description: 'Optimized for IT and tech jobs in India with relevant interview patterns, salary benchmarks, and company insights.',
    color: 'teal',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to{' '}
            <span className="text-gradient">Ace Your Interview</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From resume optimization to live mock interviews, we've got your complete interview preparation covered.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="card-feature group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`icon-container${feature.color === 'teal' ? '-teal' : ''} mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="font-display text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
