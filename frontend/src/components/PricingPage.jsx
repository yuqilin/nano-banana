import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Check, Sparkles, Zap, Crown, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const PricingPage = ({ onBack }) => {
  const { user, openSignInModal } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState('monthly'); // 'monthly' | 'yearly'

  const plans = [
    {
      id: 'free',
      name: 'Free',
      description: 'Perfect for getting started',
      icon: Sparkles,
      price: { monthly: 0, yearly: 0 },
      credits: 10,
      features: [
        '10 image generations per month',
        'Basic text-to-image',
        'Standard resolution (512x512)',
        'Community support',
        'Basic editing tools'
      ],
      limitations: [
        'No image-to-image editing',
        'No batch processing',
        'Watermarked images'
      ],
      popular: false,
      current: user?.subscription?.plan === 'free'
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'For creators and professionals',
      icon: Zap,
      price: { monthly: 19, yearly: 190 }, // $190 yearly = ~$15.83/month
      credits: 500,
      features: [
        '500 image generations per month',
        'Image-to-image editing',
        'High resolution (1024x1024)',
        'Batch processing (up to 5 images)',
        'Advanced editing tools',
        'Priority support',
        'Commercial license',
        'No watermarks'
      ],
      limitations: [],
      popular: true,
      current: user?.subscription?.plan === 'pro'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For teams and businesses',
      icon: Crown,
      price: { monthly: 99, yearly: 990 }, // $990 yearly = ~$82.5/month
      credits: 'Unlimited',
      features: [
        'Unlimited image generations',
        'All Pro features included',
        'Ultra high resolution (2048x2048)',
        'Batch processing (unlimited)',
        'API access',
        'Custom model training',
        'Priority processing',
        'Dedicated support',
        'Team collaboration',
        'Usage analytics'
      ],
      limitations: [],
      popular: false,
      current: user?.subscription?.plan === 'enterprise'
    }
  ];

  const handleSubscribe = async (planId) => {
    if (!user) {
      openSignInModal();
      return;
    }

    if (planId === 'free') {
      // Handle free plan selection (just update user plan)
      return;
    }

    // For paid plans, initiate Stripe checkout
    try {
      // This would integrate with Stripe
      const plan = plans.find(p => p.id === planId);
      const amount = billingPeriod === 'yearly' ? plan.price.yearly : plan.price.monthly;
      
      console.log(`Initiating Stripe checkout for ${planId} plan at $${amount}/${billingPeriod}`);
      
      // Mock Stripe checkout for now
      window.alert(`Redirecting to Stripe checkout for ${plan.name} plan - $${amount}/${billingPeriod}`);
      
    } catch (error) {
      console.error('Subscription error:', error);
    }
  };

  const formatPrice = (price) => {
    if (price === 0) return 'Free';
    return `$${price}`;
  };

  const calculateYearlySavings = (monthly, yearly) => {
    const monthlyTotal = monthly * 12;
    const savings = monthlyTotal - yearly;
    const percentage = Math.round((savings / monthlyTotal) * 100);
    return { amount: savings, percentage };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF7F0] to-orange-50/30">
      {/* Header */}
      <div className="border-b border-orange-200/30 bg-[#FAF7F0]/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">🍌</span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                Nano Banana
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent">
              Simple Pricing
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choose the perfect plan for your AI image generation needs. 
            Upgrade or downgrade at any time with no hidden fees.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white rounded-lg p-1 border-2 border-orange-200 shadow-sm">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-md font-medium transition-all relative ${
                billingPeriod === 'yearly'
                  ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <Badge className="absolute -top-2 -right-2 bg-green-100 text-green-800 text-xs">
                Save 20%
              </Badge>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const price = plan.price[billingPeriod];
            const savings = billingPeriod === 'yearly' && plan.price.monthly > 0 
              ? calculateYearlySavings(plan.price.monthly, plan.price.yearly)
              : null;

            return (
              <Card
                key={plan.id}
                className={`relative border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                  plan.popular
                    ? 'border-orange-400 bg-gradient-to-b from-orange-50 to-white shadow-xl scale-105'
                    : plan.current
                    ? 'border-green-400 bg-gradient-to-b from-green-50 to-white'
                    : 'border-orange-200/50 bg-white/90 backdrop-blur-sm hover:border-orange-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                {plan.current && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-green-400 to-green-500 text-white px-4 py-1">
                      Current Plan
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl w-fit">
                    <Icon className="text-orange-600" size={32} />
                  </div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <p className="text-gray-600">{plan.description}</p>
                  
                  <div className="mt-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold">{formatPrice(price)}</span>
                      {price > 0 && (
                        <span className="text-gray-500 ml-1">
                          /{billingPeriod === 'yearly' ? 'year' : 'month'}
                        </span>
                      )}
                    </div>
                    
                    {savings && (
                      <div className="mt-2">
                        <span className="text-sm text-green-600 font-medium">
                          Save ${savings.amount}/year ({savings.percentage}% off)
                        </span>
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <span className="text-lg font-semibold text-orange-600">
                        {typeof plan.credits === 'string' ? plan.credits : `${plan.credits} credits`}
                      </span>
                      <span className="text-gray-500 text-sm ml-1">
                        /{billingPeriod === 'yearly' ? 'year' : 'month'}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <Button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={plan.current}
                    className={`w-full mb-6 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white'
                        : plan.current
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'bg-white border-2 border-orange-300 text-orange-600 hover:bg-orange-50'
                    }`}
                  >
                    {plan.current ? 'Current Plan' : `Get ${plan.name}`}
                  </Button>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Features included:</h4>
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Check className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {plan.limitations.length > 0 && (
                    <>
                      <Separator className="my-4" />
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-600 text-sm">Limitations:</h4>
                        {plan.limitations.map((limitation, index) => (
                          <div key={index} className="text-xs text-gray-500">
                            • {limitation}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-orange-200">
              <h3 className="font-semibold mb-2">Can I change my plan anytime?</h3>
              <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-orange-200">
              <h3 className="font-semibold mb-2">What happens if I exceed my credits?</h3>
              <p className="text-gray-600">You can purchase additional credit packs or upgrade to a higher plan. Generation will pause until you have sufficient credits.</p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-orange-200">
              <h3 className="font-semibold mb-2">Is there a free trial for paid plans?</h3>
              <p className="text-gray-600">All new users start with our Free plan. You can upgrade anytime to unlock additional features and credits.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;