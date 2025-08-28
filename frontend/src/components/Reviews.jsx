import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { mockReviews } from '../data/mockData';
import { Quote } from 'lucide-react';

const Reviews = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-orange-50/30 to-[#FAF7F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <Badge variant="outline" className="text-orange-600 border-orange-300 bg-orange-50 px-4 py-2 text-sm font-medium">
              User Reviews
            </Badge>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What creators are saying
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {mockReviews.map((review, index) => (
            <Card 
              key={review.id}
              className="border-2 border-orange-200/50 hover:border-orange-300 transition-all duration-300 hover:shadow-xl group bg-white/90 backdrop-blur-sm hover:-translate-y-1"
            >
              <CardContent className="p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-500 text-white font-semibold">
                      {review.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-gray-900">{review.name}</h4>
                    <p className="text-sm text-gray-600">{review.role}</p>
                  </div>
                </div>
                
                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 text-orange-300 opacity-50" size={32} />
                  <blockquote className="text-gray-700 italic leading-relaxed pl-6">
                    "{review.content}"
                  </blockquote>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;