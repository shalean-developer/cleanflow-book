import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Users, User, Plus, DollarSign, Shield, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-20">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Main Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text + CTA */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
                Control your{' '}
                <span className="text-primary">finance</span>
                {' '}future easily
              </h1>
              
              {/* Subheading */}
              <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-md text-lg">
                Streamline your business's financial management with our intuitive, scalable SaaS platform. 
                Designed for Cape Town businesses.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-4">
              <Button 
                size="lg" 
                onClick={() => navigate('/booking/quote')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-3 text-lg font-semibold"
              >
                Get Free Quote
              </Button>
              <Button 
                size="icon" 
                variant="secondary"
                className="bg-black hover:bg-gray-800 text-white rounded-full w-12 h-12"
              >
                <ArrowUpRight className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {/* Right Column - Smartphone Mockup */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Phone Mockup */}
              <div className="w-80 h-[600px] bg-white rounded-3xl shadow-xl rotate-3 translate-y-2 border-4 border-gray-200 overflow-hidden">
                {/* Phone Screen Content */}
                <div className="p-6 h-full bg-gradient-to-br from-blue-50 to-indigo-100">
                  {/* Status Bar */}
                  <div className="flex justify-between items-center mb-6 text-sm font-medium">
                    <span>9:41</span>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                        N
                      </div>
                      <span>Hello, Alex</span>
                    </div>
                  </div>

                  {/* Total Balance */}
                  <div className="text-center mb-8">
                    <p className="text-gray-600 text-sm mb-2">Total Balance</p>
                    <p className="text-3xl font-bold text-gray-900">$123,981.00</p>
                  </div>

                  {/* Action Icons */}
                  <div className="grid grid-cols-4 gap-4 mb-8">
                    {['Deposit', 'Withdraw', 'Top up', 'Send'].map((action) => (
                      <div key={action} className="text-center">
                        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-2">
                          <DollarSign className="w-6 h-6 text-primary" />
                        </div>
                        <p className="text-xs text-gray-600">{action}</p>
                      </div>
                    ))}
                  </div>

                  {/* Transfer Money */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Transfer Money</h3>
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full border-2 border-white flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                        ))}
                      </div>
                      <Plus className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Activity</h3>
                    <div className="space-y-3">
                      {[
                        { name: 'Jonathan Alex', date: '7th Jun, 2023', amount: '+$500.99', positive: true },
                        { name: 'Reference Project', date: '5th April, 2023', amount: '+$279.78', positive: true },
                        { name: 'MacBook Air', date: '12th May, 2023', amount: '-$450.54', positive: false },
                      ].map((transaction, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-white rounded-lg shadow-sm">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{transaction.name}</p>
                            <p className="text-xs text-gray-500">{transaction.date}</p>
                          </div>
                          <span className={`text-sm font-semibold ${transaction.positive ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats / Trust Row */}
        <div className="flex items-center justify-center gap-3 text-sm text-gray-500 mt-12">
          <div className="w-8 h-px bg-gray-300"></div>
          <div className="w-2 h-2 bg-primary rounded-full"></div>
          <div className="w-8 h-px bg-gray-300"></div>
          <span className="font-semibold text-lg">15 Million+</span>
          <span className="text-sm">users</span>
          <div className="flex -space-x-2 ml-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full border-2 border-white flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            ))}
          </div>
        </div>

        {/* Sub-grid of Small Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {/* Card 1: Connect Easily */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Connect Easily</h3>
              <span className="text-sm text-primary hover:underline cursor-pointer">See all</span>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Savannah Nguyen', description: 'Unlock the power of real-time' },
                { name: 'Brooklyn Simmons', description: 'Unlock the power of real-time' }
              ].map((user, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.description}</p>
                  </div>
                  <Plus className="w-5 h-5 text-gray-400 cursor-pointer hover:text-primary" />
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Digital Banking Platform */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Digital Banking Platform!</h3>
            </div>
            <div className="bg-lime-400 text-black px-3 py-1 rounded-full text-sm font-semibold inline-block mb-4">
              TRY NOW
            </div>
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>

          {/* Card 3: Grow your capital */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow md:col-span-2 lg:col-span-1">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Grow your capital with No boundary at all</h3>
            </div>
            <div className="relative mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 bg-black text-white px-2 py-1 rounded-full text-xs font-semibold">
                Revolutionary
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Trusted by 50000 people</p>
          </div>

          {/* Card 4: Secure & Trusted */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Secure & Trusted by industry experts</h3>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Bank-grade Security</p>
                <p className="text-xs text-gray-500">256-bit encryption</p>
              </div>
            </div>
            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold inline-block">
              Certified Secure
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
