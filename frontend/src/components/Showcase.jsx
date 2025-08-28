import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Sparkles, Heart, Loader2 } from 'lucide-react';
import { galleryAPI, handleAPIError } from '../utils/api';

const Showcase = () => {
  const [showcaseImages, setShowcaseImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShowcase = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await galleryAPI.getFeaturedShowcase(4);
        
        if (response.success) {
          setShowcaseImages(response.showcase || []);
        } else {
          throw new Error(response.error || 'Failed to fetch showcase');
        }
      } catch (err) {
        console.error('Showcase fetch error:', err);
        setError(handleAPIError(err, 'Failed to load showcase images'));
        
        // Fallback to mock data
        const mockImages = [
          {
            id: "1",
            title: "Ultra-Fast Mountain Generation",
            description: "Created in 0.8 seconds with Nano Banana's optimized neural engine",
            image: "https://images.unsplash.com/photo-1494806812796-244fe51b774d?w=800&q=80",
            likes: 42,
            processingTime: 0.8
          },
          {
            id: "2", 
            title: "Instant Garden Creation",
            description: "Complex scene rendered in milliseconds using Nano Banana technology",
            image: "https://images.unsplash.com/photo-1563714193017-5a5fb60bc02b?w=800&q=80",
            likes: 38,
            processingTime: 1.2
          },
          {
            id: "3",
            title: "Real-time Beach Synthesis", 
            description: "Nano Banana delivers photorealistic results at lightning speed",
            image: "https://images.unsplash.com/photo-1665613252734-7ed473dce464?w=800&q=80",
            likes: 35,
            processingTime: 1.0
          },
          {
            id: "4",
            title: "Rapid Aurora Generation",
            description: "Advanced effects processed instantly with Nano Banana AI", 
            image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80",
            likes: 56,
            processingTime: 0.9
          }
        ];
        
        setShowcaseImages(mockImages);
      } finally {
        setLoading(false);
      }
    };

    fetchShowcase();
  }, []);

  const handleLike = async (imageId) => {
    try {
      const response = await galleryAPI.likeGalleryItem(imageId);
      
      if (response.success) {
        setShowcaseImages(images => 
          images.map(img => 
            img.id === imageId 
              ? { ...img, likes: response.likes }
              : img
          )
        );
      }
    } catch (err) {
      console.error('Like error:', err);
      // Silently fail for likes - not critical functionality
    }
  };

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

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading showcase images...</p>
            </div>
          </div>
        ) : error && showcaseImages.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-red-600 mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              className="text-orange-600 border-orange-300"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {showcaseImages.map((item, index) => (
                <Card 
                  key={item.id}
                  className="overflow-hidden border-2 border-orange-200/50 hover:border-orange-300 transition-all duration-300 hover:shadow-2xl group bg-white/90 backdrop-blur-sm hover:-translate-y-2"
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                      loading={index < 2 ? "eager" : "lazy"}
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-gradient-to-r from-orange-400 to-orange-500 text-white font-medium">
                        Nano Banana Speed
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleLike(item.id)}
                        className="bg-black/50 hover:bg-black/70 text-white border-none"
                      >
                        <Heart size={14} className="mr-1" />
                        {item.likes || 0}
                      </Button>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-700 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {item.description}
                    </p>
                    {item.processingTime && (
                      <div className="flex items-center text-sm text-orange-600 font-medium">
                        <Sparkles size={14} className="mr-1" />
                        Generated in {item.processingTime}s
                      </div>
                    )}
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
                  onClick={() => {
                    document.getElementById('editor')?.scrollIntoView({ 
                      behavior: 'smooth' 
                    });
                  }}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <Sparkles className="mr-2" size={20} />
                  Try Nano Banana Generator
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Showcase;