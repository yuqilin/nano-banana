import React, { useState, useCallback, useRef } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Upload, Sparkles, Copy, Image, Type, Settings, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useImageGeneration } from '../hooks/useImageGeneration';
import { useToast } from '../hooks/use-toast';

const Editor = () => {
  const [activeMode, setActiveMode] = useState('text-to-image');
  const [batchMode, setBatchMode] = useState(false);
  const [prompt, setPrompt] = useState('A futuristic city powered by nano technology, golden hour lighting, ultra detailed...');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const { 
    isGenerating, 
    generationStatus, 
    error, 
    generatedImages, 
    generateImage, 
    uploadImage,
    resetGeneration 
  } = useImageGeneration();
  
  const { toast } = useToast();

  // Handle image generation
  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive"
      });
      return;
    }

    if (prompt.trim().length < 3) {
      toast({
        title: "Error", 
        description: "Prompt must be at least 3 characters long",
        variant: "destructive"
      });
      return;
    }

    try {
      resetGeneration();
      const inputImage = uploadedFiles.length > 0 ? uploadedFiles[0].url : null;
      await generateImage(prompt, activeMode, inputImage);
      
      toast({
        title: "Generation Started",
        description: "Your image is being generated...",
      });
    } catch (err) {
      toast({
        title: "Generation Failed",
        description: err.message || "Failed to start generation",
        variant: "destructive"
      });
    }
  }, [prompt, activeMode, uploadedFiles, generateImage, resetGeneration, toast]);

  // Handle file upload
  const handleFileUpload = useCallback(async (files) => {
    const file = files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 10MB",
        variant: "destructive"
      });
      return;
    }

    try {
      const uploadedFile = await uploadImage(file);
      setUploadedFiles([uploadedFile]);
      
      toast({
        title: "Upload Successful",
        description: "Reference image uploaded successfully",
      });
    } catch (err) {
      toast({
        title: "Upload Failed",
        description: err.message || "Failed to upload image",
        variant: "destructive"
      });
    }
  }, [uploadImage, toast]);

  // Handle drag and drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  // Handle file input click
  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    handleFileUpload(files);
  };

  // Copy prompt to clipboard
  const handleCopyPrompt = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      toast({
        title: "Copied",
        description: "Prompt copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Copy Failed", 
        description: "Failed to copy prompt to clipboard",
        variant: "destructive"
      });
    }
  }, [prompt, toast]);

  // Remove uploaded file
  const removeUploadedFile = (index) => {
    setUploadedFiles(files => files.filter((_, i) => i !== index));
  };

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

              {/* Image Upload (only show for image-to-image mode) */}
              {activeMode === 'image-to-image' && (
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Image className="text-orange-500" size={20} />
                    <span className="font-medium text-gray-900">Reference Image</span>
                    <span className="text-gray-500 text-sm">{uploadedFiles.length}/9</span>
                  </div>
                  
                  {uploadedFiles.length === 0 ? (
                    <div 
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                        dragOver 
                          ? 'border-orange-400 bg-orange-50' 
                          : 'border-orange-300 bg-orange-50/50 hover:bg-orange-50'
                      }`}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onClick={handleFileClick}
                    >
                      <div className="flex flex-col items-center space-y-3">
                        <div className="p-3 bg-orange-100 rounded-full">
                          <Upload className="text-orange-600" size={24} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Add Image</div>
                          <div className="text-sm text-gray-500">Drag & drop or click to upload</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={file.url} 
                              alt={file.originalName}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div>
                              <div className="font-medium text-sm">{file.originalName}</div>
                              <div className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeUploadedFile(index)}
                            className="text-gray-500 hover:text-red-600"
                          >
                            <XCircle size={16} />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleFileClick}
                        className="w-full text-orange-600 border-orange-300 hover:bg-orange-50"
                      >
                        <Upload className="mr-2" size={16} />
                        Add Another Image
                      </Button>
                    </div>
                  )}
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>
              )}

              {/* Prompt Input */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="text-orange-500" size={20} />
                    <span className="font-medium text-gray-900">Main Prompt</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleCopyPrompt}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Copy size={16} />
                  </Button>
                </div>
                <Textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your desired image edits..."
                  className="min-h-[100px] border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                  maxLength={500}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {prompt.length}/500 characters
                </div>
              </div>

              {/* Generate Button */}
              <Button 
                size="lg" 
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" size={20} />
                    {generationStatus === 'starting' ? 'Starting...' : 'Generating...'}
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2" size={20} />
                    Generate Now
                  </>
                )}
              </Button>

              {/* Error Display */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-red-800">
                    <XCircle size={16} />
                    <span className="font-medium">Error</span>
                  </div>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
              )}
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
              {generatedImages.length > 0 ? (
                <div className="space-y-4">
                  {generatedImages.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={imageUrl} 
                        alt={`Generated image ${index + 1}`}
                        className="w-full rounded-lg shadow-lg transition-transform group-hover:scale-[1.02]"
                      />
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          className="bg-black/50 hover:bg-black/70 text-white"
                        >
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {generationStatus === 'completed' && (
                    <div className="flex items-center justify-center p-4 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="text-green-600 mr-2" size={20} />
                      <span className="text-green-800 font-medium">Generation completed!</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-gray-50/50 min-h-[400px] flex flex-col items-center justify-center">
                  {isGenerating ? (
                    <>
                      <div className="p-4 bg-orange-100 rounded-full mb-4 animate-pulse">
                        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {generationStatus === 'starting' ? 'Starting generation...' : 'Generating your image...'}
                      </h3>
                      <p className="text-gray-600">
                        This usually takes 0.8-2 seconds
                      </p>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Editor;