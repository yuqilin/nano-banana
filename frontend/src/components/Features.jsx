import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { mockFeatures } from '../data/mockData';

const Features = () => {
  const iconMap = {
    "💬": "MessageSquare",
    "🎭": "Users", 
    "🎨": "Palette",
    "🎯": "Target",
    "📚": "BookOpen",
    "⭐": "Star"
  };

  return (
    <section className="py-20 bg-gradient-to-b from-orange-50/30 to-[#FAF7F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <Badge variant="outline" className="text-orange-600 border-orange-300 bg-orange-50 px-4 py-2 text-sm font-medium">
              Core Features
            </Badge>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose Nano Banana?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nano-banana is the most advanced AI image editor on LMArena. 
            Revolutionize your photo editing with natural language understanding
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockFeatures.map((feature, index) => (
            <Card 
              key={feature.id} 
              className="border-2 border-orange-200/50 hover:border-orange-300 transition-all duration-300 hover:shadow-xl group bg-white/80 backdrop-blur-sm hover:-translate-y-1"
            >
              <CardContent className="p-8">
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`p-3 bg-gradient-to-br ${feature.color} rounded-xl shadow-lg group-hover:shadow-xl transition-shadow`}>
                    <span className="text-2xl text-white">{feature.icon}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-700 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;