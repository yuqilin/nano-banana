import React, { useState } from 'react';
import { Sun, Moon, ChevronDown, User, CreditCard } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ onNavigateToPricing }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, openSignInModal, openSignUpModal, signOut } = useAuth();

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToEditor = () => scrollToSection('editor');
  const scrollToShowcase = () => scrollToSection('showcase');

  const handlePricingClick = () => {
    if (onNavigateToPricing) {
      onNavigateToPricing();
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-orange-200/30">
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
              className="text-foreground hover:text-orange-600 transition-colors font-medium cursor-pointer"
            >
              Image Editor
            </button>
            <button 
              onClick={scrollToShowcase}
              className="text-foreground hover:text-orange-600 transition-colors font-medium cursor-pointer"
            >
              Showcase
            </button>
            <div className="relative group">
              <button className="flex items-center space-x-1 text-foreground hover:text-orange-600 transition-colors font-medium">
                <span>Toolbox</span>
                <ChevronDown size={16} />
              </button>
            </div>
            <button 
              onClick={handlePricingClick}
              className="text-foreground hover:text-orange-600 transition-colors font-medium cursor-pointer"
            >
              Pricing
            </button>
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Language/Region */}
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <span>🇺🇸</span>
            </button>

            {/* User Authentication */}
            {isAuthenticated ? (
              <>
                {/* User Credits Display */}
                <div className="hidden sm:flex items-center space-x-2 bg-orange-50 dark:bg-orange-950/50 rounded-lg px-3 py-2">
                  <CreditCard size={16} className="text-orange-600" />
                  <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                    {user?.subscription?.credits || 0} credits
                  </span>
                </div>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.avatar} alt={user?.name || 'User'} />
                        <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-500 text-white">
                          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      {user?.subscription?.plan !== 'free' && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs rounded-full">
                          {user?.subscription?.plan === 'pro' ? 'P' : 'E'}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64" align="end" forceMount>
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={handlePricingClick}>
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Billing & Credits</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer" onClick={signOut}>
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="outline" className="text-orange-600 border-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950">
                  Launch Now
                </Button>
                <Button 
                  variant="outline" 
                  onClick={openSignInModal}
                  className="text-foreground border-border hover:bg-muted"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={openSignUpModal}
                  className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-medium"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;