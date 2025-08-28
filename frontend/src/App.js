import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Editor from "./components/Editor";
import Features from "./components/Features";
import Showcase from "./components/Showcase";
import Reviews from "./components/Reviews";
import FAQ from "./components/FAQ";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <div className="min-h-screen bg-[#FAF7F0]">
              <Header />
              <Hero />
              <Editor />
              <Features />
              <Showcase />
              <Reviews />
              <FAQ />
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;