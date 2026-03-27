'use client';

import { useState } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function SubscribePage() {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID }),
      });
      
      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Failed to initiate checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-[#1c1310] rounded-3xl p-8 shadow-xl border border-orange-100 dark:border-orange-900/30 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-gradient-to-tr from-primary-orange to-primary-pink rounded-2xl shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-2 text-foreground">Unlock The Source</h1>
        <p className="text-foreground/70 mb-8">
          Gain full access to all manifestation tools, frequency oracles, and scenic visions.
        </p>
        
        <div className="bg-orange-50 dark:bg-orange-950/20 rounded-2xl p-6 mb-8 text-left">
          <ul className="space-y-3">
            {[
              'Unlimited Frequency Oracle (528Hz/432Hz)',
              'Direct access to The Source Oracle (Abraham Q&A)',
              'Vortex Tracker & Wish List',
              'Scenic Vision AI Generation'
            ].map((feature, i) => (
              <li key={i} className="flex items-start text-sm text-foreground/80">
                <CheckCircle2 className="w-5 h-5 text-primary-orange mr-3 shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mb-8">
          <span className="text-4xl font-bold text-foreground">¥980</span>
          <span className="text-foreground/60"> / month</span>
        </div>
        
        <button 
          onClick={handleSubscribe} 
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-primary-orange to-primary-pink text-white rounded-xl font-bold text-lg hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Subscribe Now'}
        </button>
      </div>
    </div>
  );
}
