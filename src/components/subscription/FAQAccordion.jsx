"use client";

import { Accordion, AccordionItem } from "@heroui/react";

export default function FAQAccordion() {
  const faqs = [
    {
      key: "1",
      title: "Why is this a one-time payment?",
      content: "We believe in clear, transparent pricing. By paying once, you unlock Premium permanently without worrying about recurring monthly subscriptions or hidden fees."
    },
    {
      key: "2",
      title: "What happens after payment?",
      content: "Your account is upgraded to Premium instantly after a successful transaction. You will immediately gain access to unlimited publishing, premium prompts, and private content."
    },
    {
      key: "3",
      title: "Can I still use the free version?",
      content: "Absolutely! You are not forced to upgrade. Free users can continue using the platform, but will be limited to publishing a maximum of 3 prompts and will not have access to premium or private content."
    }
  ];

  return (
    <Accordion variant="splitted" className="w-full flex flex-col gap-3">
      {faqs.map((faq) => (
        <AccordionItem 
          key={faq.key} 
          aria-label={faq.title} 
          title={<span className="text-white font-medium text-base">{faq.title}</span>}
          className="bg-[#0a0a0c]/80 border border-white/5 hover:border-white/10 shadow-inner rounded-2xl px-2"
          indicator={<span className="text-zinc-500">+</span>}
        >
          <p className="text-zinc-400 text-sm leading-relaxed pb-4 px-2">
            {faq.content}
          </p>
        </AccordionItem>
      ))}
    </Accordion>
  );
}