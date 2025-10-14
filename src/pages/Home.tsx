const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-[#0C53ED] to-[#2A869E]">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="mb-6 px-4 py-2 bg-white/20 text-white border border-white/30 rounded-full inline-block">
              <span className="mr-2">✨</span>
              Top-Rated Cleaning Service
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Professional Cleaning Services
              <br />
              <span className="text-white/90">in Cape Town</span>
            </h1>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Trusted by hundreds of families. Same-day booking available. 
              Professional, reliable, and affordable cleaning for your home or office.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="bg-white text-[#0C53ED] hover:bg-white/90 rounded-full shadow-lg hover:shadow-xl transition-all px-8 py-3 text-lg font-semibold"
              >
                Book Now
              </button>
              <button 
                className="border border-white/30 text-white hover:bg-white/10 rounded-full backdrop-blur-sm px-8 py-3 text-lg font-semibold"
              >
                Get Free Quote
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Our Cleaning Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional cleaning solutions tailored to your needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0C53ED] to-[#2A869E] flex items-center justify-center mb-4">
                <span className="text-white text-xl">🏠</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Standard Cleaning</h3>
              <p className="text-gray-600 mb-4">Regular maintenance cleaning to keep your home fresh and tidy</p>
              <div className="text-[#0C53ED] font-bold text-xl mb-4">From R350</div>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Dusting & vacuuming</span>
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Bathroom cleaning</span>
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Kitchen surfaces</span>
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Floor cleaning</span>
                </li>
              </ul>
              <button className="w-full border border-gray-200 hover:bg-[#0C53ED] hover:text-white transition-all py-2 px-4 rounded">
                Learn More →
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0C53ED] to-[#2A869E] flex items-center justify-center mb-4">
                <span className="text-white text-xl">🏆</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Deep Cleaning</h3>
              <p className="text-gray-600 mb-4">Comprehensive cleaning for every corner and surface of your home</p>
              <div className="text-[#0C53ED] font-bold text-xl mb-4">From R500</div>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Everything in standard</span>
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Inside appliances</span>
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Window cleaning</span>
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Detailed scrubbing</span>
                </li>
              </ul>
              <button className="w-full border border-gray-200 hover:bg-[#0C53ED] hover:text-white transition-all py-2 px-4 rounded">
                Learn More →
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0C53ED] to-[#2A869E] flex items-center justify-center mb-4">
                <span className="text-white text-xl">👥</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Move In/Out</h3>
              <p className="text-gray-600 mb-4">Complete property cleaning for moving day</p>
              <div className="text-[#0C53ED] font-bold text-xl mb-4">Custom pricing</div>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Empty property clean</span>
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Deep sanitization</span>
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>All surfaces</span>
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Ready for handover</span>
                </li>
              </ul>
              <button className="w-full border border-gray-200 hover:bg-[#0C53ED] hover:text-white transition-all py-2 px-4 rounded">
                Learn More →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="mb-4 px-4 py-2 bg-[#EAF2FF] text-[#0C53ED] border border-[#0C53ED]/20 rounded-full inline-block">
              Simple Process
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              How It Works
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Get your home professionally cleaned in four easy steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#0C53ED] to-[#2A869E] flex items-center justify-center shadow-lg">
                  <div className="text-white text-2xl font-bold">1</div>
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-[#0C53ED]/10">
                  <span className="text-[#0C53ED] text-lg">📋</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Choose Service</h3>
              <p className="text-gray-600 text-sm">Select the cleaning package that fits your needs</p>
            </div>

            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#0C53ED] to-[#2A869E] flex items-center justify-center shadow-lg">
                  <div className="text-white text-2xl font-bold">2</div>
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-[#0C53ED]/10">
                  <span className="text-[#0C53ED] text-lg">📅</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Pick Date & Time</h3>
              <p className="text-gray-600 text-sm">Book a slot that works with your schedule</p>
            </div>

            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#0C53ED] to-[#2A869E] flex items-center justify-center shadow-lg">
                  <div className="text-white text-2xl font-bold">3</div>
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-[#0C53ED]/10">
                  <span className="text-[#0C53ED] text-lg">👥</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Meet Your Cleaner</h3>
              <p className="text-gray-600 text-sm">Get matched with a vetted professional</p>
            </div>

            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#0C53ED] to-[#2A869E] flex items-center justify-center shadow-lg">
                  <div className="text-white text-2xl font-bold">4</div>
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-[#0C53ED]/10">
                  <span className="text-[#0C53ED] text-lg">🏠</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Enjoy Clean Home</h3>
              <p className="text-gray-600 text-sm">Relax while we handle the rest</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#0C53ED]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Book Your Cleaning?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Join hundreds of satisfied customers in Cape Town. 
            Same-day booking available. Professional service guaranteed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-[#0C53ED] hover:bg-white/90 rounded-full shadow-lg px-8 py-3 text-lg font-semibold">
              Book Now
            </button>
            <button className="border border-white/30 text-white hover:bg-white/10 rounded-full backdrop-blur-sm px-8 py-3 text-lg font-semibold">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

