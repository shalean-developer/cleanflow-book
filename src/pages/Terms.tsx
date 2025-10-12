import { useEffect } from "react";

const Terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-white dark:from-[#0B1220] dark:to-[#1E293B] py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] dark:text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-[#475569] dark:text-white/80">
            Last updated: October 11, 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm border border-gray-200/20 dark:border-white/10 p-8 md:p-12 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-4">
              Agreement to Terms
            </h2>
            <p className="text-[#475569] dark:text-white/80 leading-relaxed">
              By accessing or using the Shalean Cleaning Services website and services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-4">
              Services
            </h2>
            <p className="text-[#475569] dark:text-white/80 leading-relaxed mb-3">
              Shalean provides professional cleaning services in the Cape Town area, including but not limited to:
            </p>
            <ul className="list-disc list-inside text-[#475569] dark:text-white/80 space-y-2 ml-4">
              <li>Standard residential cleaning</li>
              <li>Deep cleaning services</li>
              <li>Move in/out cleaning</li>
              <li>Specialized cleaning services</li>
            </ul>
            <p className="text-[#475569] dark:text-white/80 leading-relaxed mt-4">
              We reserve the right to refuse service to anyone for any reason at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-4">
              Booking and Payment
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-[#0F172A] dark:text-white mb-2">
                  Booking Process
                </h3>
                <p className="text-[#475569] dark:text-white/80 leading-relaxed">
                  All bookings must be made through our website or by contacting us directly. By making a booking, you confirm that all information provided is accurate and complete.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#0F172A] dark:text-white mb-2">
                  Payment Terms
                </h3>
                <ul className="list-disc list-inside text-[#475569] dark:text-white/80 space-y-2 ml-4">
                  <li>Payment is due at the time of service completion unless otherwise agreed</li>
                  <li>We accept various payment methods including credit cards, debit cards, and bank transfers</li>
                  <li>All prices are in South African Rand (ZAR) and include VAT unless stated otherwise</li>
                  <li>Prices are subject to change without notice</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-4">
              Cancellation and Rescheduling
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-[#0F172A] dark:text-white mb-2">
                  Customer Cancellations
                </h3>
                <ul className="list-disc list-inside text-[#475569] dark:text-white/80 space-y-2 ml-4">
                  <li>Cancellations made more than 24 hours before the scheduled service: Full refund</li>
                  <li>Cancellations made less than 24 hours before the scheduled service: 50% cancellation fee</li>
                  <li>No-show or same-day cancellation: Full service charge applies</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#0F172A] dark:text-white mb-2">
                  Rescheduling
                </h3>
                <p className="text-[#475569] dark:text-white/80 leading-relaxed">
                  You may reschedule your service up to 24 hours before the scheduled time without penalty. Rescheduling requests made less than 24 hours in advance may incur a fee.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-4">
              Customer Responsibilities
            </h2>
            <p className="text-[#475569] dark:text-white/80 leading-relaxed mb-3">
              As a customer, you agree to:
            </p>
            <ul className="list-disc list-inside text-[#475569] dark:text-white/80 space-y-2 ml-4">
              <li>Provide safe and unobstructed access to all areas to be cleaned</li>
              <li>Secure or remove any valuable, fragile, or personal items before service</li>
              <li>Inform us of any special requirements, allergies, or concerns before the service</li>
              <li>Ensure pets are secured during the cleaning service</li>
              <li>Provide accurate property information including size and condition</li>
              <li>Be present or arrange for someone to be present to provide access to the property</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-4">
              Our Responsibilities
            </h2>
            <p className="text-[#475569] dark:text-white/80 leading-relaxed mb-3">
              Shalean Cleaning Services commits to:
            </p>
            <ul className="list-disc list-inside text-[#475569] dark:text-white/80 space-y-2 ml-4">
              <li>Provide professional and courteous cleaning services</li>
              <li>Use appropriate cleaning products and equipment</li>
              <li>Respect your property and privacy</li>
              <li>Arrive within the scheduled time window</li>
              <li>Maintain insurance coverage for our operations</li>
              <li>Address any concerns or issues promptly</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-4">
              Liability and Insurance
            </h2>
            <p className="text-[#475569] dark:text-white/80 leading-relaxed mb-4">
              Shalean Cleaning Services carries liability insurance. However, we are not liable for:
            </p>
            <ul className="list-disc list-inside text-[#475569] dark:text-white/80 space-y-2 ml-4">
              <li>Pre-existing damage to property or furnishings</li>
              <li>Damage caused by hidden defects in the property</li>
              <li>Items not properly secured or identified as valuable</li>
              <li>Damages exceeding the value of the service provided</li>
              <li>Indirect or consequential damages</li>
            </ul>
            <p className="text-[#475569] dark:text-white/80 leading-relaxed mt-4">
              Any claims must be reported within 24 hours of the service completion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-4">
              Quality Guarantee
            </h2>
            <p className="text-[#475569] dark:text-white/80 leading-relaxed">
              We stand behind the quality of our work. If you are not satisfied with our service, please contact us within 24 hours of service completion. We will make every effort to address your concerns, including re-cleaning specific areas if necessary.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-4">
              Intellectual Property
            </h2>
            <p className="text-[#475569] dark:text-white/80 leading-relaxed">
              All content on the Shalean website, including text, graphics, logos, images, and software, is the property of Shalean Cleaning Services and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works from our content without explicit permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-4">
              Termination
            </h2>
            <p className="text-[#475569] dark:text-white/80 leading-relaxed">
              We reserve the right to terminate or suspend your access to our services immediately, without prior notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties, or for any other reason.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-4">
              Limitation of Liability
            </h2>
            <p className="text-[#475569] dark:text-white/80 leading-relaxed">
              To the maximum extent permitted by law, Shalean Cleaning Services shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-4">
              Governing Law
            </h2>
            <p className="text-[#475569] dark:text-white/80 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of South Africa. Any disputes arising from these Terms or our services shall be subject to the exclusive jurisdiction of the courts of South Africa.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-4">
              Changes to Terms
            </h2>
            <p className="text-[#475569] dark:text-white/80 leading-relaxed">
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice before any new terms take effect. Your continued use of our services after changes become effective constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-4">
              Contact Information
            </h2>
            <p className="text-[#475569] dark:text-white/80 leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-[#F8FAFC] dark:bg-[#0B1220] rounded-lg p-6 space-y-2">
              <p className="text-[#475569] dark:text-white/80">
                <strong className="text-[#0F172A] dark:text-white">Email:</strong>{" "}
                <a href="mailto:info@shalean.co.za" className="text-[#0C53ED] hover:underline">
                  info@shalean.co.za
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

export default Terms;

