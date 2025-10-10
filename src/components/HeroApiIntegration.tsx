import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Sparkles, Home, Clock, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FeatureCard {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

const features: FeatureCard[] = [
  { id: 'deep-cleaning', label: 'Deep Cleaning', icon: Sparkles },
  { id: 'regular-cleaning', label: 'Regular Cleaning', icon: Home },
  { id: 'move-in-out', label: 'Move In/Out', icon: Clock },
  { id: 'specialized', label: 'Specialized', icon: Shield },
  { id: 'team-service', label: 'Team Service', icon: Users },
];


export const HeroApiIntegration: React.FC = () => {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState('deep-cleaning');

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">

      {/* Main Hero Area */}
      <div className="max-w-screen-xl mx-auto px-4 py-16">
        <div className="text-center">
          {/* Section Label */}
          <div className="mb-8">
            <span className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">
              — Cape Town's Trusted Cleaning Experts —
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl font-semibold text-center leading-tight text-gray-900 dark:text-gray-50 mb-6">
            Professional Cleaning Services
            <br />
            You Can Trust
          </h1>

          {/* Subheading */}
          <p className="text-gray-500 dark:text-gray-400 text-center max-w-2xl mx-auto mt-4 text-lg">
            Transform your space with our professional cleaning solutions tailored to your needs.
          </p>

          {/* Feature Selector Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-16 justify-center max-w-4xl mx-auto">
            {features.map((feature) => {
              const Icon = feature.icon;
              const isActive = activeFeature === feature.id;
              
              return (
                <div
                  key={feature.id}
                  onClick={() => setActiveFeature(feature.id)}
                  className={cn(
                    "relative bg-white dark:bg-gray-900 rounded-2xl p-6 cursor-pointer transition-all duration-200 border",
                    "hover:shadow-md shadow-sm",
                    isActive 
                      ? "shadow-lg scale-105 border-gray-300 dark:border-gray-600" 
                      : "border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700"
                  )}
                >
                  {/* Radio Indicator */}
                  <div className={cn(
                    "absolute top-3 right-3 w-4 h-4 rounded-full border-2 transition-all duration-200",
                    isActive 
                      ? "bg-black border-black" 
                      : "border-gray-300 dark:border-gray-600"
                  )}>
                    {isActive && <Check className="w-3 h-3 text-white absolute top-0.5 left-0.5" />}
                  </div>

                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    <Icon className={cn(
                      "w-8 h-8 transition-colors duration-200",
                      isActive 
                        ? "text-purple-600" 
                        : "text-gray-400 dark:text-gray-500"
                    )} />
                  </div>

                  {/* Label */}
                  <p className="text-sm font-medium text-center text-gray-700 dark:text-gray-300">
                    {feature.label}
                  </p>
                </div>
              );
            })}
          </div>

          {/* CTA Button */}
          <div className="mt-12">
            <Button 
              onClick={() => navigate('/booking/service/select')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-full text-sm font-semibold transition-colors"
            >
              Book a service
            </Button>

            {/* Small Features Row */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-gray-500 dark:text-gray-400 text-sm mt-6">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-black dark:text-white" />
                <span>Trusted Cleaners</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-black dark:text-white" />
                <span>Flexible Scheduling</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-black dark:text-white" />
                <span>Satisfaction Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
