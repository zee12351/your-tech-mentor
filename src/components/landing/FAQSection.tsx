import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How does the AI mock interview work?',
    answer: 'Our AI interviewer simulates real interview scenarios based on your chosen role (DevOps, Cloud, Software, Data) and difficulty level. It asks relevant questions, provides follow-ups based on your answers, and gives detailed feedback with improvement suggestions.',
  },
  {
    question: 'Is CareerPilot AI suitable for freshers?',
    answer: 'Absolutely! We have a beginner difficulty level specifically designed for freshers and entry-level candidates. The AI adapts its questions and expectations based on experience level.',
  },
  {
    question: 'What file formats are supported for resume upload?',
    answer: 'We support PDF and DOCX formats. Our AI parser extracts text, identifies sections, and provides comprehensive analysis including ATS optimization tips.',
  },
  {
    question: 'Can I get a refund if not satisfied?',
    answer: 'Yes! We offer a 7-day money-back guarantee on all paid plans. If you\'re not satisfied, contact us within 7 days of purchase for a full refund.',
  },
  {
    question: 'How accurate is the JD matching feature?',
    answer: 'Our JD matcher uses advanced AI to compare your skills, experience, and qualifications against job descriptions. It identifies matching skills, skill gaps, and provides a percentage match along with a preparation roadmap.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes, we take data security seriously. All data is encrypted, we follow GDPR guidelines, and we never share your personal information or resumes with third parties.',
  },
  {
    question: 'Can I download my interview reports?',
    answer: 'Pro and Elite users can download professional PDF reports containing performance summaries, skill ratings, improvement plans, and detailed feedback from each interview session.',
  },
  {
    question: 'Which tech roles are supported?',
    answer: 'We support DevOps, Cloud Engineering, Software Development, Data Science/Engineering, Full Stack, Frontend, and Backend development roles. More roles are being added regularly.',
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Got questions? We've got answers. If you can't find what you're looking for, feel free to contact us.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="card-elevated border-none px-6"
              >
                <AccordionTrigger className="hover:no-underline font-display font-semibold text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
