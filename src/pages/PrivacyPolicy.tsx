import { useEffect } from "react";

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-white dark:from-[#0B1220] dark:to-[#1E293B] py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-[#475569] dark:text-white/80">
            Last updated: October 11, 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm border border-gray-200/20 dark:border-white/10 p-8 md:p-12 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-4">
              Introduction
            </h2>
            <p className="text-[#475569] dark:text-white/80 leading-relaxed">
              At Shalean Cleaning Services ("we," "us," or "our"), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-4">
              Information We Collect
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-[#0F172A] dark:text-white mb-2">
                  Personal Information
                </h3>
                <p className="text-[#475569] dark:text-white/80 leading-relaxed mb-2">
                  We collect personal information that you voluntarily provide to us when you:
                </p>
                <ul className="list-disc list-inside text-[#475569] dark:text-white/80 space-y-2 ml-4">
                  <li>Book a cleaning service</li>
                  <li>Create an account</li>
                  <li>Contact us for support</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Apply for employment</li>
                </ul>
                <p className="text-[#475569] dark:text-white/80 leading-relaxed mt-4">
                  This information may include: name, email address, phone number, physical address, payment information, and any other information you choose to provide.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#0F172A] dark:text-white mb-2">
                  Automatically Collected Information
                </h3>
                <p className="text-[#475569] dark:text-white/80 leading-relaxed">
                  When you access our website, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies installed on your device. We also collect information about how you interact with our website.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-4">
              How We Use Your Information
            </h2>
            <p className="text-[#475569] dark:text-white/80 leading-relaxed mb-3">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-[#475569] dark:text-white/80 space-y-2 ml-4">
              <li>Provide, operate, and maintain our cleaning services</li>
              <li>Process your bookings and payments</li>
              <li>Send you booking confirmations and service updates</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Improve and optimize our website and services</li>
              <li>Send you marketing communications (with your consent)</li>
              <li>Comply with legal obligations</li>
              <li>Prevent fraud and enhance security</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-4">
              Information Sharing and Disclosure
            </h2>
            <p className="text-[#475569] dark:text-white/80 leading-relaxed mb-3">
              We may share your information with:
            </p>
            <ul className="list-disc list-inside text-[#475569] dark:text-white/80 space-y-2 ml-4">
              <li><strong>Service Providers:</strong> Third-party companies that help us provide our services (e.g., payment processors, email service providers)</li>
              <li><strong>Cleaning Professionals:</strong> Information necessary to complete your booking</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with any merger, sale, or acquisition of our business</li>
            </ul>
            <p className="text-[#475569] dark:text-white/80 leading-relaxed mt-4">
              We do not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-4">
              Data Security
            </h2>
            <p className="text-[#475569] dark:text-white/80 leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-4">
              Your Rights
            </h2>
            <p className="text-[#475569] dark:text-white/80 leading-relaxed mb-3">
              Under the Protection of Personal Information Act (POPIA), you have the right to:
            </p>
            <ul className="list-disc list-inside text-[#475569] dark:text-white/80 space-y-2 ml-4">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Withdraw consent for processing</li>
              <li>Object to processing of your information</li>
              <li>Request data portability</li>
            </ul>
            <p className="text-[#475569] dark:text-white/80 leading-relaxed mt-4">
              To exercise any of these rights, please contact us at{" "}
              <a href="mailto:privacy@shalean.co.za" className="text-[#0C53ED] hover:underline">
                privacy@shalean.co.za
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-4">
              Data Retention
            </h2>
            <p className="text-[#475569] dark:text-white/80 leading-relaxed">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-4">
              Children's Privacy
            </h2>
            <p className="text-[#475569] dark:text-white/80 leading-relaxed">
              Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-4">
              Changes to This Privacy Policy
            </h2>
            <p className="text-[#475569] dark:text-white/80 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-4">
              Contact Us
            </h2>
            <p className="text-[#475569] dark:text-white/80 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or our privacy practices, please contact us:
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

export default PrivacyPolicy;

