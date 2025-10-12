import { useEffect } from "react";

const Cookies = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-white dark:from-[#0B1220] dark:to-[#1E293B] py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] dark:text-white mb-4">
            Cookie Policy
          </h1>
          <p className="text-lg text-[#475569] dark:text-white/80">
            Last updated: October 11, 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm border border-gray-200/20 dark:border-white/10 p-8 md:p-12 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-4">
              What Are Cookies?
            </h2>
            <p className="text-[#475569] dark:text-white/80 leading-relaxed">
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently, provide a better user experience, and provide information to the owners of the site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-4">
              How We Use Cookies
            </h2>
            <p className="text-[#475569] dark:text-white/80 leading-relaxed mb-4">
              Shalean Cleaning Services uses cookies to:
            </p>
            <ul className="list-disc list-inside text-[#475569] dark:text-white/80 space-y-2 ml-4">
              <li>Keep you signed in to your account</li>
              <li>Understand how you use our website</li>
              <li>Remember your preferences and settings</li>
              <li>Improve our website performance</li>
              <li>Provide personalized content and advertisements</li>
              <li>Analyze website traffic and usage patterns</li>
              <li>Prevent fraudulent activity and enhance security</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-4">
              Types of Cookies We Use
            </h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-[#0C53ED] pl-6 py-2">
                <h3 className="text-xl font-semibold text-[#0F172A] dark:text-white mb-2">
                  Essential Cookies
                </h3>
                <p className="text-[#475569] dark:text-white/80 leading-relaxed mb-2">
                  These cookies are necessary for the website to function properly. They enable basic functions like page navigation, access to secure areas, and booking services.
                </p>
                <p className="text-sm text-[#475569] dark:text-white/70 italic">
                  Examples: Authentication cookies, security cookies, load balancing cookies
                </p>
              </div>

              <div className="border-l-4 border-[#0C53ED] pl-6 py-2">
                <h3 className="text-xl font-semibold text-[#0F172A] dark:text-white mb-2">
                  Functional Cookies
                </h3>
                <p className="text-[#475569] dark:text-white/80 leading-relaxed mb-2">
                  These cookies enable enhanced functionality and personalization, such as remembering your preferences, language settings, and region.
                </p>
                <p className="text-sm text-[#475569] dark:text-white/70 italic">
                  Examples: Language preference cookies, theme preference cookies, location cookies
                </p>
              </div>

              <div className="border-l-4 border-[#0C53ED] pl-6 py-2">
                <h3 className="text-xl font-semibold text-[#0F172A] dark:text-white mb-2">
                  Analytics Cookies
                </h3>
                <p className="text-[#475569] dark:text-white/80 leading-relaxed mb-2">
                  These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website.
                </p>
                <p className="text-sm text-[#475569] dark:text-white/70 italic">
                  Examples: Google Analytics cookies, visitor tracking cookies, bounce rate cookies
                </p>
              </div>

              <div className="border-l-4 border-[#0C53ED] pl-6 py-2">
                <h3 className="text-xl font-semibold text-[#0F172A] dark:text-white mb-2">
                  Marketing Cookies
                </h3>
                <p className="text-[#475569] dark:text-white/80 leading-relaxed mb-2">
                  These cookies are used to track visitors across websites to display relevant advertisements and encourage engagement. We may share this information with third-party advertisers.
                </p>
                <p className="text-sm text-[#475569] dark:text-white/70 italic">
                  Examples: Advertising cookies, retargeting cookies, social media cookies
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-4">
              Third-Party Cookies
            </h2>
            <p className="text-[#475569] dark:text-white/80 leading-relaxed mb-4">
              In addition to our own cookies, we may use various third-party cookies to report usage statistics, deliver advertisements, and provide enhanced functionality. These third parties include:
            </p>
            <ul className="list-disc list-inside text-[#475569] dark:text-white/80 space-y-2 ml-4">
              <li><strong>Google Analytics:</strong> To analyze website usage and improve our services</li>
              <li><strong>Payment Processors:</strong> To securely process your payments</li>
              <li><strong>Social Media Platforms:</strong> To enable social sharing features</li>
              <li><strong>Advertising Partners:</strong> To deliver relevant advertisements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-4">
              Cookie Duration
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-[#0F172A] dark:text-white mb-2">
                  Session Cookies
                </h3>
                <p className="text-[#475569] dark:text-white/80 leading-relaxed">
                  These are temporary cookies that expire when you close your browser. They help us track your movements from page to page so you don't get asked for information you've already provided.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#0F172A] dark:text-white mb-2">
                  Persistent Cookies
                </h3>
                <p className="text-[#475569] dark:text-white/80 leading-relaxed">
                  These cookies remain on your device for a set period or until you delete them. They help us recognize you as a returning visitor and remember your preferences.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-4">
              Managing Cookies
            </h2>
            <p className="text-[#475569] dark:text-white/80 leading-relaxed mb-4">
              You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences through:
            </p>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-[#0F172A] dark:text-white mb-2">
                  Browser Settings
                </h3>
                <p className="text-[#475569] dark:text-white/80 leading-relaxed mb-3">
                  Most web browsers allow you to control cookies through their settings. To find out more about cookies, including how to see what cookies have been set and how to manage and delete them, visit:
                </p>
                <ul className="list-disc list-inside text-[#475569] dark:text-white/80 space-y-2 ml-4">
                  <li><a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-[#0C53ED] hover:underline">www.allaboutcookies.org</a></li>
                  <li><a href="https://www.youronlinechoices.com" target="_blank" rel="noopener noreferrer" className="text-[#0C53ED] hover:underline">www.youronlinechoices.com</a></li>
                </ul>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-200 mb-2">
                  ⚠️ Important Note
                </h3>
                <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
                  If you disable cookies, please note that some parts of our website may not function properly. Essential cookies are necessary for the website to work and cannot be disabled.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-4">
              Do Not Track Signals
            </h2>
            <p className="text-[#475569] dark:text-white/80 leading-relaxed">
              Some browsers incorporate a "Do Not Track" (DNT) feature that signals to websites you visit that you do not want to have your online activity tracked. As there is not yet a common understanding of how to interpret DNT signals, we do not currently respond to DNT signals on our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-4">
              Updates to This Cookie Policy
            </h2>
            <p className="text-[#475569] dark:text-white/80 leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for operational, legal, or regulatory reasons. We encourage you to review this policy periodically. The "Last updated" date at the top indicates when this policy was last revised.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-4">
              Contact Us
            </h2>
            <p className="text-[#475569] dark:text-white/80 leading-relaxed mb-4">
              If you have any questions about our use of cookies, please contact us:
            </p>
            <div className="bg-[#F8FAFC] dark:bg-[#0B1220] rounded-lg p-6 space-y-2">
              <p className="text-[#475569] dark:text-white/80">
                <strong className="text-[#0F172A] dark:text-white">Email:</strong>{" "}
                <a href="mailto:privacy@shalean.co.za" className="text-[#0C53ED] hover:underline">
                  privacy@shalean.co.za
                </a>
              </p>
              <p className="text-[#475569] dark:text-white/80">
                <strong className="text-[#0F172A] dark:text-white">Phone:</strong>{" "}
                <a href="tel:+27211234567" className="text-[#0C53ED] hover:underline">
                  +27 21 123 4567
                </a>
              </p>
              <p className="text-[#475569] dark:text-white/80">
                <strong className="text-[#0F172A] dark:text-white">Address:</strong> Cape Town, South Africa
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Cookies;

