import React from 'react';
import { Button } from './ui/button';
import { Sparkles, Zap, Target } from 'lucide-react';

const Hero = () => {
  const scrollToEditor = () => {
    const editor = document.getElementById('editor');
    if (editor) {
      editor.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToShowcase = () => {
    const showcase = document.getElementById('showcase');
    if (showcase) {
      showcase.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-gradient-to-br from-orange-400 to-orange-600"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-gradient-to-br from-orange-300 to-orange-500"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Top banner */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-full border border-orange-200">
            <span className="text-lg mr-2">🍌</span>
            <span className="text-orange-800 font-medium">The AI model that outperforms Flux Kontext</span>
            <button 
              onClick={scrollToEditor}
              className="ml-4 text-orange-600 font-semibold hover:text-orange-700 transition-colors cursor-pointer"
            >
              Try Now →
            </button>
          </div>
        </div>

        {/* Main heading */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent">
              Nano Banana
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
            Transform any image with simple text prompts. Nano-banana's advanced model 
            delivers consistent character editing and scene preservation that surpasses 
            Flux Kontext. Experience the future of AI image editing.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button 
              size="lg" 
              onClick={scrollToEditor}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <Sparkles className="mr-2" size={20} />
              Start Editing
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={scrollToShowcase}
              className="border-2 border-orange-300 text-orange-700 hover:bg-orange-50 px-8 py-4 text-lg font-semibold rounded-xl transition-all"
            >
              View Examples
            </Button>
          </div>

          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-600">
            <div className="flex items-center space-x-2">
              <Target className="text-orange-500" size={20} />
              <span className="font-medium">One-shot editing</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="text-orange-500" size={20} />
              <span className="font-medium">Multi-image support</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-gradient-to-br from-orange-400 to-orange-600 rounded flex items-center justify-center">
                <span className="text-white text-xs">💬</span>
              </div>
              <span className="font-medium">Natural language</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;