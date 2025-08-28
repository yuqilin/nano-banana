import React from 'react';
import { Sun, Moon, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';

const Header = () => {
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToEditor = () => scrollToSection('editor');
  const scrollToShowcase = () => scrollToSection('showcase');

  return (
    <header className="sticky top-0 z-50 bg-[#FAF7F0]/95 backdrop-blur-sm border-b border-orange-200/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">🍌</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              Nano Banana
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={scrollToEditor}
              className="text-gray-700 hover:text-orange-600 transition-colors font-medium cursor-pointer"
            >
              Image Editor
            </button>
            <button 
              onClick={scrollToShowcase}
              className="text-gray-700 hover:text-orange-600 transition-colors font-medium cursor-pointer"
            >
              Showcase
            </button>
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-orange-600 transition-colors font-medium">
                <span>Toolbox</span>
                <ChevronDown size={16} />
              </button>
            </div>
            <button className="text-gray-700 hover:text-orange-600 transition-colors font-medium cursor-pointer">
              Pricing
            </button>
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <Sun size={20} />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <span>🇺🇸</span>
            </button>
            <Button variant="outline" className="text-orange-600 border-orange-600 hover:bg-orange-50">
              Launch Now
            </Button>
            <Button variant="outline" className="text-gray-600 border-gray-300 hover:bg-gray-50">
              Sign In
            </Button>
            <Button className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-medium">
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;