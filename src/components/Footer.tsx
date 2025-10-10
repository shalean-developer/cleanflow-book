export const Footer = () => {
  return (
    <footer role="contentinfo" className="bg-white dark:bg-[#0B1220] border-t border-gray-200/20 dark:border-white/10">
      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#0C53ED] rounded-full flex items-center justify-center shadow-md">
                <img src="/favicon.png" alt="Shalean Logo" className="w-6 h-6" loading="lazy" />
              </div>
              <span className="font-bold text-xl text-[#0F172A] dark:text-white">Shalean</span>
            </div>
            <p className="text-sm text-[#475569] dark:text-white/80 max-w-[60ch] leading-relaxed">
              Professional cleaning services across Cape Town. Quality you can trust.
            </p>
          </div>

          {/* Services Section */}
          <div className="lg:col-span-1">
            <h3 className="text-xs font-semibold text-[#0F172A] dark:text-white uppercase tracking-wide mb-4">
              Services
            </h3>
            <nav aria-label="Services navigation">
              <ul className="space-y-3">
                <li>
                  <a 
                    href="/services" 
                    className="text-sm text-[#475569] dark:text-white/80 hover:text-[#0C53ED] dark:hover:text-white transition-colors duration-150 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2 rounded-sm"
                  >
                    Standard Cleaning
                  </a>
                </li>
                <li>
                  <a 
                    href="/services" 
                    className="text-sm text-[#475569] dark:text-white/80 hover:text-[#0C53ED] dark:hover:text-white transition-colors duration-150 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2 rounded-sm"
                  >
                    Deep Cleaning
                  </a>
                </li>
                <li>
                  <a 
                    href="/services" 
                    className="text-sm text-[#475569] dark:text-white/80 hover:text-[#0C53ED] dark:hover:text-white transition-colors duration-150 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2 rounded-sm"
                  >
                    Move In/Out
                  </a>
                </li>
                <li>
                  <a 
                    href="/services" 
                    className="text-sm text-[#475569] dark:text-white/80 hover:text-[#0C53ED] dark:hover:text-white transition-colors duration-150 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2 rounded-sm"
                  >
                    Specialized Services
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Company Section */}
          <div className="lg:col-span-1">
            <h3 className="text-xs font-semibold text-[#0F172A] dark:text-white uppercase tracking-wide mb-4">
              Company
            </h3>
            <nav aria-label="Company navigation">
              <ul className="space-y-3">
                <li>
                  <a 
                    href="/" 
                    className="text-sm text-[#475569] dark:text-white/80 hover:text-[#0C53ED] dark:hover:text-white transition-colors duration-150 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2 rounded-sm"
                  >
                    Our Team
                  </a>
                </li>
                <li>
                  <a 
                    href="/" 
                    className="text-sm text-[#475569] dark:text-white/80 hover:text-[#0C53ED] dark:hover:text-white transition-colors duration-150 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2 rounded-sm"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a 
                    href="/" 
                    className="text-sm text-[#475569] dark:text-white/80 hover:text-[#0C53ED] dark:hover:text-white transition-colors duration-150 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2 rounded-sm"
                  >
                    Reviews
                  </a>
                </li>
                <li>
                  <a 
                    href="/blog" 
                    className="text-sm text-[#475569] dark:text-white/80 hover:text-[#0C53ED] dark:hover:text-white transition-colors duration-150 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2 rounded-sm"
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Contact Section */}
          <div className="lg:col-span-1">
            <h3 className="text-xs font-semibold text-[#0F172A] dark:text-white uppercase tracking-wide mb-4">
              Contact
            </h3>
            <address className="not-italic">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg 
                    className="w-5 h-5 text-[#0C53ED]/80 dark:text-[#0C53ED] flex-shrink-0 mt-0.5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm text-[#475569] dark:text-white/80">
                    Cape Town, South Africa
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <svg 
                    className="w-5 h-5 text-[#0C53ED]/80 dark:text-[#0C53ED] flex-shrink-0 mt-0.5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a 
                    href="mailto:info@shalean.co.za" 
                    className="text-sm text-[#475569] dark:text-white/80 hover:text-[#0C53ED] dark:hover:text-white transition-colors duration-150 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2 rounded-sm"
                  >
                    info@shalean.co.za
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <svg 
                    className="w-5 h-5 text-[#0C53ED]/80 dark:text-[#0C53ED] flex-shrink-0 mt-0.5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a 
                    href="tel:+27211234567" 
                    className="text-sm text-[#475569] dark:text-white/80 hover:text-[#0C53ED] dark:hover:text-white transition-colors duration-150 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2 rounded-sm"
                  >
                    +27 21 123 4567
                  </a>
                </li>
              </ul>
            </address>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#E5E7EB]/20 dark:border-white/10"></div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Copyright */}
          <p className="text-sm text-[#475569] dark:text-white/80">
            © 2025 Shalean Cleaning Services. All rights reserved.
          </p>

          {/* Legal Links */}
          <nav aria-label="Legal links" className="flex flex-wrap items-center gap-4 text-sm">
            <a 
              href="/privacy" 
              className="text-[#475569] dark:text-white/80 hover:text-[#0C53ED] dark:hover:text-white transition-colors duration-150 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2 rounded-sm"
            >
              Privacy Policy
            </a>
            <span className="text-[#E5E7EB] dark:text-white/40">·</span>
            <a 
              href="/terms" 
              className="text-[#475569] dark:text-white/80 hover:text-[#0C53ED] dark:hover:text-white transition-colors duration-150 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2 rounded-sm"
            >
              Terms
            </a>
            <span className="text-[#E5E7EB] dark:text-white/40">·</span>
            <a 
              href="/cookies" 
              className="text-[#475569] dark:text-white/80 hover:text-[#0C53ED] dark:hover:text-white transition-colors duration-150 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2 rounded-sm"
            >
              Cookies
            </a>
            <span className="text-[#E5E7EB] dark:text-white/40">·</span>
            <a 
              href="/popia" 
              className="text-[#475569] dark:text-white/80 hover:text-[#0C53ED] dark:hover:text-white transition-colors duration-150 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2 rounded-sm"
            >
              POPIA
            </a>
          </nav>

          {/* Social Icons */}
          <div className="flex items-center gap-2">
            <a 
              href="https://facebook.com/shalean" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2"
              aria-label="Follow us on Facebook"
            >
              <svg className="w-5 h-5 text-[#475569] dark:text-white/80" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a 
              href="https://instagram.com/shalean" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2"
              aria-label="Follow us on Instagram"
            >
              <svg className="w-5 h-5 text-[#475569] dark:text-white/80" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.281h-1.829v1.829h1.829V7.707zm-7.83 1.829c-1.606 0-2.911 1.305-2.911 2.911s1.305 2.911 2.911 2.911 2.911-1.305 2.911-2.911-1.305-2.911-2.911-2.911z"/>
              </svg>
            </a>
            <a 
              href="https://x.com/shalean" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2"
              aria-label="Follow us on X"
            >
              <svg className="w-5 h-5 text-[#475569] dark:text-white/80" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a 
              href="https://linkedin.com/company/shalean" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2"
              aria-label="Follow us on LinkedIn"
            >
              <svg className="w-5 h-5 text-[#475569] dark:text-white/80" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
