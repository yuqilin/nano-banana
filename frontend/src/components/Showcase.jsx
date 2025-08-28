import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { mockShowcaseImages } from '../data/mockData';
import { Sparkles } from 'lucide-react';

const Showcase = () => {
  return (
    <section id="showcase" className="py-20 bg-gradient-to-b from-[#FAF7F0] to-orange-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <Badge variant="outline" className="text-orange-600 border-orange-300 bg-orange-50 px-4 py-2 text-sm font-medium">
              Showcase
            </Badge>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Lightning-Fast AI Creations
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See what Nano Banana generates in milliseconds
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {mockShowcaseImages.map((item, index) => (
            <Card 
              key={item.id}
              className="overflow-hidden border-2 border-orange-200/50 hover:border-orange-300 transition-all duration-300 hover:shadow-2xl group bg-white/90 backdrop-blur-sm hover:-translate-y-2"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-gradient-to-r from-orange-400 to-orange-500 text-white font-medium">
                    {item.badge}
                  </Badge>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-orange-100 via-orange-50 to-yellow-100 rounded-2xl p-12 border-2 border-orange-200">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Experience the power of Nano Banana yourself
            </h3>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <Sparkles className="mr-2" size={20} />
              Try Nano Banana Generator
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Showcase;