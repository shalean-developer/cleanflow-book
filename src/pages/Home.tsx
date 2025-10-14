// TEMPORARILY DISABLED FOR HOME-ONLY DEPLOYMENT
// import { useNavigate } from 'react-router-dom';

const Home = () => {
  // const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-gray-900">
              Professional Cleaning Services You Can Trust
            </h1>
            <p className="text-xl mb-12 text-gray-600 max-w-3xl mx-auto">
              Experience spotless results with Cape Town's premier cleaning service. 
              Expert cleaners, eco-friendly products, and flexible scheduling for your home or business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-4 text-lg font-semibold flex items-center justify-center gap-2 transition-all cursor-not-allowed opacity-70"
                disabled
              >
                Book Now
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button 
                className="border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-full px-8 py-4 text-lg font-semibold transition-all cursor-not-allowed opacity-70"
                disabled
              >
                Apply For Work
              </button>
            </div>
            
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">500+</div>
                <div className="text-gray-600 text-sm">Happy Customers</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">98%</div>
                <div className="text-gray-600 text-sm">Satisfaction Rate</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">50+</div>
                <div className="text-gray-600 text-sm">Expert Cleaners</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">100+</div>
                <div className="text-gray-600 text-sm">Service Types</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-6">
                Why Choose CleanFlow
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                Premium Cleaning Service That Exceeds Expectations
            </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl">
                We deliver exceptional cleaning results using professional-grade equipment, eco-friendly products, and highly trained staff.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Vetted & Trained Professionals: Background-checked cleaners with ongoing training</h3>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Eco-Friendly Products: Safe, non-toxic cleaning solutions for your family and pets</h3>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Satisfaction Guarantee: We'll re-clean for free if you're not completely satisfied</h3>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Flexible Scheduling: Book online 24/7 with same-day service available</h3>
                  </div>
                </div>
              </div>
              
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-4 text-lg font-semibold flex items-center gap-2 transition-all cursor-not-allowed opacity-70"
                disabled
              >
                Get a Free Quote
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="relative">
              {/* Professional Cleaning Team Image */}
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="/src/assets/cleaning-team-hero.jpg" 
                  alt="Professional cleaning team working in modern kitchen"
                  className="w-full h-auto object-cover"
                />
              </div>

              <div className="mt-6 flex justify-center gap-6 text-sm text-gray-600">
                <span>Insured & Bonded</span>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              What Makes Us Different
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From residential to commercial, we provide comprehensive cleaning solutions backed by our commitment to excellence.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Trained Professionals</h3>
              <p className="text-gray-600">Our team undergoes rigorous training and background checks to ensure top-quality service every time.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 mx-auto mb-6 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Booking</h3>
              <p className="text-gray-600">Book online in minutes with our easy-to-use platform. Choose your date, time, and services.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">100% Guaranteed</h3>
              <p className="text-gray-600">Not satisfied? We'll come back and re-clean for free. Your satisfaction is our priority.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Transparent Pricing</h3>
              <p className="text-gray-600">No hidden fees or surprises. Get instant quotes and see exactly what you're paying for.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Our Cleaning Services
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Professional cleaning solutions tailored to your needs, from regular maintenance to specialized deep cleans.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <div className="text-sm font-semibold">Residential</div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Home Cleaning</h3>
                <p className="text-gray-600 mb-4">Regular or one-time cleaning services for apartments, houses, and condos throughout Cape Town.</p>
                <button 
                  className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-not-allowed opacity-70"
                  disabled
                >
                  View Details
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="text-sm font-semibold">Deep Cleaning</div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Deep Clean Services</h3>
                <p className="text-gray-600 mb-4">Intensive top-to-bottom cleaning including hard-to-reach areas and detailed sanitization.</p>
                <button 
                  className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-not-allowed opacity-70"
                  disabled
                >
                  View Details
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <div className="text-sm font-semibold">Move In/Out</div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Move-In/Out Cleaning</h3>
                <p className="text-gray-600 mb-4">Comprehensive cleaning for properties between tenants or before moving in.</p>
                <button 
                  className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-not-allowed opacity-70"
                  disabled
                >
                  View Details
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Join 500+ satisfied customers who trust CleanFlow for their cleaning needs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-bold">S</span>
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-gray-900">Sarah Mitchell</h3>
                  <div className="text-yellow-400 text-sm">★★★★★</div>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">"CleanFlow has been a lifesaver! The team is professional, thorough, and always on time. My home has never looked better. Highly recommend their deep cleaning service!"</p>
              <div className="text-xs text-gray-400">Sea Point, Cape Town</div>
            </div>

            <div className="bg-white rounded-2xl p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-bold">M</span>
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-gray-900">Michael Brown</h3>
                  <div className="text-yellow-400 text-sm">★★★★★</div>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">"Exceptional service! The booking process was seamless, and the cleaners did an outstanding job. They even cleaned areas I didn't expect. Worth every penny!"</p>
              <div className="text-xs text-gray-400">Camps Bay, Cape Town</div>
            </div>

            <div className="bg-white rounded-2xl p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-bold">L</span>
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-gray-900">Lisa Thompson</h3>
                  <div className="text-yellow-400 text-sm">★★★★★</div>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">"I've tried several cleaning services, but CleanFlow stands out. The attention to detail and eco-friendly products make all the difference. My weekly cleaning is now stress-free!"</p>
              <div className="text-xs text-gray-400">Green Point, Cape Town</div>
            </div>
          </div>
        </div>
      </section>

      {/* As Featured In Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              As Featured In
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Recognized by Cape Town's leading publications and service directories.
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-12 flex-wrap opacity-60">
            <div className="text-2xl font-bold text-gray-400">Cape Town Times</div>
            <div className="text-2xl font-bold text-gray-400">Home & Garden</div>
            <div className="text-2xl font-bold text-gray-400">Service Directory</div>
            <div className="text-2xl font-bold text-gray-400">Local Business</div>
            <div className="text-2xl font-bold text-gray-400">Clean & Green</div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-50 to-blue-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-50/50"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Ready for a Spotless Space?
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            Book your first cleaning today and experience the CleanFlow difference. Professional service, guaranteed satisfaction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-4 text-lg font-semibold transition-all cursor-not-allowed opacity-70"
              disabled
            >
              Book Your Cleaning
            </button>
            <button 
              className="border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-full px-8 py-4 text-lg font-semibold transition-all cursor-not-allowed opacity-70"
              disabled
            >
              Get a Free Quote
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

