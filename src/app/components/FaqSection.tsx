import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  faqs: FaqItem[];
  className?: string;
}

export function FaqSection({ faqs, className }: Readonly<FaqSectionProps>) {
  // JSON-LD FAQPage schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <section className={className}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <h2 className="mb-6 text-2xl font-bold">Frequently Asked Questions</h2>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq) => (
          <AccordionItem key={faq.question} value={faq.question}>
            <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
