import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Editor from "./components/Editor";
import Features from "./components/Features";
import Showcase from "./components/Showcase";
import Reviews from "./components/Reviews";
import FAQ from "./components/FAQ";
import AuthModal from "./components/AuthModal";
import PricingPage from "./components/PricingPage";
import { Toaster } from "./components/ui/toaster";

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const navigateToHome = () => setCurrentPage('home');
  const navigateToPricing = () => setCurrentPage('pricing');

  return (
    <div className="App">
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={
                <div className="min-h-screen bg-background">
                  {currentPage === 'home' ? (
                    <>
                      <Header onNavigateToPricing={navigateToPricing} />
                      <Hero />
                      <Editor />
                      <Features />
                      <Showcase />
                      <Reviews />
                      <FAQ />
                    </>
                  ) : (
                    <PricingPage onBack={navigateToHome} />
                  )}
                  <AuthModal />
                  <Toaster />
                </div>
              } />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;