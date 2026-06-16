"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useHome } from "@/lib/i18n/home";
import { SectionHeading } from "./section-heading";

export function Faq() {
  const { faq } = useHome();

  return (
    <section id="sss" className="mt-24 scroll-mt-24 sm:mt-28">
      <SectionHeading
        eyebrow={faq.eyebrow}
        title={faq.title}
        subtitle={faq.subtitle}
      />

      <div className="soft-card mt-10 rounded-[28px] px-6 py-2 sm:px-8">
        <Accordion type="single" collapsible className="w-full">
          {faq.items.map((item, i) => (
            <AccordionItem key={item.q} value={`item-${i}`}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
