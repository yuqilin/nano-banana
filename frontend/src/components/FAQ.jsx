import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { mockFAQs } from '../data/mockData';

const FAQ = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-[#FAF7F0] to-orange-50/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <Badge variant="outline" className="text-orange-600 border-orange-300 bg-orange-50 px-4 py-2 text-sm font-medium">
              FAQs
            </Badge>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
        </div>

        <Card className="border-2 border-orange-200/50 bg-white/90 backdrop-blur-sm shadow-xl">
          <CardContent className="p-8">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {mockFAQs.map((faq) => (
                <AccordionItem 
                  key={faq.id} 
                  value={`item-${faq.id}`}
                  className="border border-orange-200/50 rounded-lg px-6 data-[state=open]:bg-orange-50/50 transition-colors"
                >
                  <AccordionTrigger className="text-left hover:no-underline hover:text-orange-700 transition-colors py-6">
                    <span className="font-semibold text-lg">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 text-gray-700 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-16 py-12 border-t border-orange-200">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">🍌</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              Nano Banana
            </span>
          </div>
          <p className="text-gray-600 text-sm">
            © 2024 Nano Banana AI. All rights reserved. Transform your images with the future of AI editing.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;