import { useEffect } from "react";

const POPIA = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-white dark:from-[#0B1220] dark:to-[#1E293B] py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] dark:text-white mb-4">
            POPIA Compliance
          </h1>
          <p className="text-lg text-[#475569] dark:text-white/80">
            Protection of Personal Information Act (POPIA) Compliance Notice
          </p>
          <p className="text-sm text-[#475569] dark:text-white/70 mt-2">
            Last updated: October 11, 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm border border-gray-200/20 dark:border-white/10 p-8 md:p-12 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-4">
              Introduction to POPIA
            </h2>
            <p className="text-[#475569] dark:text-white/80 leading-relaxed mb-4">
              The Protection of Personal Information Act (POPIA) is South African legislation that regulates how personal information must be processed by public and private bodies. Shalean Cleaning Services is committed to full compliance with POPIA and protecting your personal information.
            </p>
            <p className="text-[#475569] dark:text-white/80 leading-relaxed">
              This document outlines how we comply with POPIA's eight conditions for lawful processing of personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-4">
              Responsible Party Information
            </h2>
            <div className="bg-[#F8FAFC] dark:bg-[#0B1220] rounded-lg p-6 space-y-3">
              <p className="text-[#475569] dark:text-white/80">
                <strong className="text-[#0F172A] dark:text-white">Company Name:</strong> Shalean Cleaning Services (Pty) Ltd
              </p>
              <p className="text-[#475569] dark:text-white/80">
                <strong className="text-[#0F172A] dark:text-white">Information Officer:</strong> [Name to be appointed]
              </p>
              <p className="text-[#475569] dark:text-white/80">
                <strong className="text-[#0F172A] dark:text-white">Contact Email:</strong>{" "}
                <a href="mailto:privacy@shalean.co.za" className="text-[#0C53ED] hover:underline">
                  privacy@shalean.co.za
                </a>
              </p>
              <p className="text-[#475569] dark:text-white/80">
                <strong className="text-[#0F172A] dark:text-white">Contact Phone:</strong>{" "}
                <a href="tel:+27211234567" className="text-[#0C53ED] hover:underline">
                  +27 21 123 4567
                </a>
              </p>
              <p className="text-[#475569] dark:text-white/80">
                <strong className="text-[#0F172A] dark:text-white">Physical Address:</strong> Cape Town, South Africa
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-4">
              POPIA's Eight Conditions
            </h2>
            <p className="text-[#475569] dark:text-white/80 leading-relaxed mb-6">
              We comply with all eight conditions for lawful processing as outlined in POPIA:
            </p>

            <div className="space-y-6">
              <div className="border-l-4 border-[#0C53ED] pl-6 py-2">
                <h3 className="text-xl font-semibold text-[#0F172A] dark:text-white mb-2">
                  1. Accountability
                </h3>
                <p className="text-[#475569] dark:text-white/80 leading-relaxed">
                  We have appointed an Information Officer responsible for ensuring POPIA compliance. We maintain documentation of all processing activities and have implemented appropriate policies and procedures to protect personal information.
                </p>
              </div>

              <div className="border-l-4 border-[#0C53ED] pl-6 py-2">
                <h3 className="text-xl font-semibold text-[#0F172A] dark:text-white mb-2">
                  2. Processing Limitation
                </h3>
                <p className="text-[#475569] dark:text-white/80 leading-relaxed mb-2">
                  We process personal information only:
                </p>
                <ul className="list-disc list-inside text-[#475569] dark:text-white/80 space-y-1 ml-4">
                  <li>With your consent</li>
                  <li>For legitimate business purposes</li>
                  <li>To fulfill contractual obligations</li>
                  <li>To comply with legal requirements</li>
                  <li>To protect legitimate interests</li>
                </ul>
              </div>

              <div className="border-l-4 border-[#0C53ED] pl-6 py-2">
                <h3 className="text-xl font-semibold text-[#0F172A] dark:text-white mb-2">
                  3. Purpose Specification
                </h3>
                <p className="text-[#475569] dark:text-white/80 leading-relaxed mb-2">
                  We collect personal information for specific, explicitly defined, and lawful purposes related to:
                </p>
                <ul className="list-disc list-inside text-[#475569] dark:text-white/80 space-y-1 ml-4">
                  <li>Providing cleaning services</li>
                  <li>Processing bookings and payments</li>
                  <li>Customer support and communication</li>
                  <li>Service improvement and quality assurance</li>
                  <li>Marketing (with consent)</li>
                  <li>Legal compliance</li>
                </ul>
              </div>

              <div className="border-l-4 border-[#0C53ED] pl-6 py-2">
                <h3 className="text-xl font-semibold text-[#0F172A] dark:text-white mb-2">
                  4. Further Processing Limitation
                </h3>
                <p className="text-[#475569] dark:text-white/80 leading-relaxed">
                  We do not process personal information for purposes other than those for which it was originally collected, unless we have obtained your consent or the further processing is compatible with the original purpose.
                </p>
              </div>

              <div className="border-l-4 border-[#0C53ED] pl-6 py-2">
                <h3 className="text-xl font-semibold text-[#0F172A] dark:text-white mb-2">
                  5. Information Quality
                </h3>
                <p className="text-[#475569] dark:text-white/80 leading-relaxed">
                  We take reasonable steps to ensure that all personal information we process is complete, accurate, not misleading, and updated where necessary. You have the right to request correction of inaccurate information.
                </p>
              </div>

              <div className="border-l-4 border-[#0C53ED] pl-6 py-2">
                <h3 className="text-xl font-semibold text-[#0F172A] dark:text-white mb-2">
                  6. Openness
                </h3>
                <p className="text-[#475569] dark:text-white/80 leading-relaxed mb-2">
                  We maintain clear documentation about our information processing activities. Upon request, we will provide you with:
                </p>
                <ul className="list-disc list-inside text-[#475569] dark:text-white/80 space-y-1 ml-4">
                  <li>Information about what personal data we hold about you</li>
                  <li>How we collected it</li>
                  <li>Why we are processing it</li>
                  <li>Who we share it with</li>
                </ul>
              </div>

              <div className="border-l-4 border-[#0C53ED] pl-6 py-2">
                <h3 className="text-xl font-semibold text-[#0F172A] dark:text-white mb-2">
                  7. Security Safeguards
                </h3>
                <p className="text-[#475569] dark:text-white/80 leading-relaxed mb-2">
                  We implement appropriate technical and organizational measures to protect personal information against:
                </p>
                <ul className="list-disc list-inside text-[#475569] dark:text-white/80 space-y-1 ml-4">
                  <li>Unauthorized or unlawful processing</li>
                  <li>Accidental loss, destruction, or damage</li>
                  <li>Data breaches</li>
                </ul>
                <p className="text-[#475569] dark:text-white/80 leading-relaxed mt-2">
                  Our security measures include encryption, access controls, regular security assessments, and staff training.
                </p>
              </div>

              <div className="border-l-4 border-[#0C53ED] pl-6 py-2">
                <h3 className="text-xl font-semibold text-[#0F172A] dark:text-white mb-2">
                  8. Data Subject Participation
                </h3>
                <p className="text-[#475569] dark:text-white/80 leading-relaxed">
                  We respect your rights as a data subject. You have the right to request access to, correction of, or deletion of your personal information. You also have the right to object to processing and to withdraw consent where processing is based on consent.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-4">
              Your Rights Under POPIA
            </h2>
            <p className="text-[#475569] dark:text-white/80 leading-relaxed mb-4">
              As a data subject, you have the following rights:
            </p>
            
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-[#0F172A] dark:text-white mb-2">Right to Access</h4>
                <p className="text-[#475569] dark:text-white/80 text-sm">
                  Request confirmation of what personal information we hold about you and access to that information.
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-[#0F172A] dark:text-white mb-2">Right to Correction</h4>
                <p className="text-[#475569] dark:text-white/80 text-sm">
                  Request correction, destruction, or deletion of your personal information that is inaccurate, irrelevant, excessive, or outdated.
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-[#0F172A] dark:text-white mb-2">Right to Object</h4>
                <p className="text-[#475569] dark:text-white/80 text-sm">
                  Object to the processing of your personal information at any time, on reasonable grounds.
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-[#0F172A] dark:text-white mb-2">Right to Lodge a Complaint</h4>
                <p className="text-[#475569] dark:text-white/80 text-sm">
                  Lodge a complaint with the Information Regulator if you believe your rights have been violated.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-4">
              Data Breach Notification
            </h2>
            <p className="text-[#475569] dark:text-white/80 leading-relaxed">
              In the event of a data breach that poses a risk of harm to you, we will notify you and the Information Regulator as soon as reasonably possible. We have procedures in place to detect, report, and investigate data breaches.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-4">
              Cross-Border Transfers
            </h2>
            <p className="text-[#475569] dark:text-white/80 leading-relaxed">
              If we transfer your personal information outside of South Africa, we ensure that the recipient country has adequate data protection laws or that appropriate safeguards are in place to protect your information in accordance with POPIA requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-4">
              Children's Personal Information
            </h2>
            <p className="text-[#475569] dark:text-white/80 leading-relaxed">
              We do not knowingly process personal information of children without parental or guardian consent. Our services are intended for individuals 18 years and older.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-4">
              How to Exercise Your Rights
            </h2>
            <p className="text-[#475569] dark:text-white/80 leading-relaxed mb-4">
              To exercise any of your rights under POPIA, please contact our Information Officer:
            </p>
            <div className="bg-[#F8FAFC] dark:bg-[#0B1220] rounded-lg p-6 space-y-3">
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
                <strong className="text-[#0F172A] dark:text-white">Subject Line:</strong> POPIA Rights Request
              </p>
            </div>
            <p className="text-[#475569] dark:text-white/80 leading-relaxed mt-4">
              We will respond to your request within a reasonable time, not exceeding one month from the date of receipt.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-4">
              Information Regulator Contact Details
            </h2>
            <p className="text-[#475569] dark:text-white/80 leading-relaxed mb-4">
              If you have concerns about how we handle your personal information, you may contact the Information Regulator:
            </p>
            <div className="bg-[#F8FAFC] dark:bg-[#0B1220] rounded-lg p-6 space-y-2">
              <p className="text-[#475569] dark:text-white/80">
                <strong className="text-[#0F172A] dark:text-white">Website:</strong>{" "}
                <a href="https://www.justice.gov.za/inforeg/" target="_blank" rel="noopener noreferrer" className="text-[#0C53ED] hover:underline">
                  www.justice.gov.za/inforeg
                </a>
              </p>
              <p className="text-[#475569] dark:text-white/80">
                <strong className="text-[#0F172A] dark:text-white">Email:</strong>{" "}
                <span className="text-[#0C53ED]">inforeg@justice.gov.za</span>
              </p>
              <p className="text-[#475569] dark:text-white/80">
                <strong className="text-[#0F172A] dark:text-white">Phone:</strong> 012 406 4818
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-4">
              Updates to This Notice
            </h2>
            <p className="text-[#475569] dark:text-white/80 leading-relaxed">
              We may update this POPIA Compliance Notice from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes and update the "Last updated" date at the top of this page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default POPIA;

