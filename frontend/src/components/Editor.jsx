import React, { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Upload, Sparkles, Copy, Image, Type, Settings } from 'lucide-react';

const Editor = () => {
  const [activeMode, setActiveMode] = useState('image-to-image');
  const [batchMode, setBatchMode] = useState(false);
  const [prompt, setPrompt] = useState('A futuristic city powered by nano technology, golden hour lighting, ultra detailed...');

  return (
    <section id="editor" className="py-20 bg-gradient-to-b from-[#FAF7F0] to-orange-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <Badge variant="outline" className="text-orange-600 border-orange-300 bg-orange-50 px-4 py-2 text-sm font-medium">
              Get Started
            </Badge>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Try The AI Editor
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the power of nano-banana's natural language image editing.
            Transform any photo with simple text commands
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Prompt Engine */}
          <Card className="border-2 border-orange-200 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-2xl">
                <div className="p-2 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg">
                  <Sparkles className="text-white" size={20} />
                </div>
                <span>Prompt Engine</span>
              </CardTitle>
              <p className="text-gray-600">Transform your image with AI-powered editing</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveMode('image-to-image')}
                  className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md font-medium transition-all ${
                    activeMode === 'image-to-image' 
                      ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Image className="mr-2" size={16} />
                  Image to Image
                </button>
                <button
                  onClick={() => setActiveMode('text-to-image')}
                  className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md font-medium transition-all ${
                    activeMode === 'text-to-image' 
                      ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Type className="mr-2" size={16} />
                  Text to Image
                </button>
              </div>

              {/* Batch Processing Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <Settings className="text-gray-400" size={20} />
                  <div>
                    <div className="font-medium text-gray-900">Batch Processing</div>
                    <div className="text-sm text-gray-600">Enable batch mode to process multiple images at once</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-gradient-to-r from-orange-400 to-orange-500 text-white">Pro</Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-orange-600 border-orange-300 hover:bg-orange-50"
                  >
                    Upgrade
                  </Button>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Image className="text-orange-500" size={20} />
                  <span className="font-medium text-gray-900">Reference Image</span>
                  <span className="text-gray-500 text-sm">0/9</span>
                </div>
                <div className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center bg-orange-50/50 hover:bg-orange-50 transition-colors cursor-pointer group">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="p-3 bg-orange-100 rounded-full group-hover:bg-orange-200 transition-colors">
                      <Upload className="text-orange-600" size={24} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Add Image</div>
                      <div className="text-sm text-gray-500">Drag & drop or click to upload</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prompt Input */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="text-orange-500" size={20} />
                    <span className="font-medium text-gray-900">Main Prompt</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                    <Copy size={16} />
                  </Button>
                </div>
                <Textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your desired image edits..."
                  className="min-h-[100px] border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                />
              </div>

              {/* Generate Button */}
              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 text-lg shadow-lg hover:shadow-xl transition-all"
              >
                <Sparkles className="mr-2" size={20} />
                Generate Now
              </Button>
            </CardContent>
          </Card>

          {/* Output Gallery */}
          <Card className="border-2 border-orange-200 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-2xl">
                <div className="p-2 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg">
                  <Image className="text-white" size={20} />
                </div>
                <span>Output Gallery</span>
              </CardTitle>
              <p className="text-gray-600">Your ultra-fast AI creations appear here instantly</p>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-gray-50/50 min-h-[400px] flex flex-col items-center justify-center">
                <div className="p-4 bg-orange-100 rounded-full mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg flex items-center justify-center">
                    <Image className="text-white" size={24} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Ready for instant generation
                </h3>
                <p className="text-gray-600">
                  Enter your prompt and unleash the power
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Editor;