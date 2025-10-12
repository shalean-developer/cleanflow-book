import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Users,
  TrendingUp,
  Heart,
  Award,
  Clock,
  DollarSign,
  GraduationCap,
  MapPin,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function Careers() {
  const benefits = [
    {
      icon: DollarSign,
      title: "Competitive Pay",
      description: "Earn competitive rates with opportunities for bonuses and tips",
    },
    {
      icon: Clock,
      title: "Flexible Schedule",
      description: "Choose your working hours and days that fit your lifestyle",
    },
    {
      icon: GraduationCap,
      title: "Training & Development",
      description: "Ongoing training in cleaning techniques and customer service",
    },
    {
      icon: TrendingUp,
      title: "Growth Opportunities",
      description: "Clear career progression from cleaner to team lead",
    },
    {
      icon: Heart,
      title: "Supportive Team",
      description: "Join a friendly, supportive team that values your contribution",
    },
    {
      icon: Award,
      title: "Recognition Program",
      description: "Monthly awards and bonuses for outstanding performance",
    },
  ];

  const values = [
    {
      title: "Excellence",
      description: "We maintain the highest standards in everything we do",
    },
    {
      title: "Integrity",
      description: "Honesty and transparency guide all our interactions",
    },
    {
      title: "Respect",
      description: "We treat everyone with dignity and respect",
    },
    {
      title: "Growth",
      description: "We invest in our team's personal and professional development",
    },
  ];

  const requirements = [
    "Minimum 1 year of cleaning experience (residential or commercial)",
    "Valid South African ID or work permit",
    "Excellent attention to detail",
    "Reliable and punctual",
    "Strong communication skills",
    "Physical fitness to perform cleaning tasks",
    "Professional references available",
    "Own transport preferred (but not required)",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EAF2FF] to-white dark:from-[#0B1220] dark:to-[#0B1220]">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C53ED]/10 to-[#2A869E]/10 dark:from-[#0C53ED]/5 dark:to-[#2A869E]/5"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white dark:bg-[#0B1220] px-4 py-2 rounded-full border border-[#0C53ED]/20 mb-6 shadow-sm">
              <Users className="w-4 h-4 text-[#0C53ED]" />
              <span className="text-sm font-medium text-[#0C53ED]">We're Hiring!</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-[#180D39] dark:text-white mb-6">
              Join the Shalean Team
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-[#0C53ED] to-[#2A869E] mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-gray-600 dark:text-white/70 max-w-3xl mx-auto mb-8">
              Build a rewarding career with Cape Town's leading cleaning service.
              We're looking for dedicated, professional cleaners to join our growing team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-[#0C53ED] hover:bg-[#0C53ED]/90 text-white font-semibold text-lg h-14 px-8 rounded-xl shadow-lg"
              >
                <Link to="/careers/apply">
                  Apply Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-[#0C53ED] text-[#0C53ED] hover:bg-[#EAF2FF] font-semibold text-lg h-14 px-8 rounded-xl"
              >
                <Link to="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-16 px-4 bg-white dark:bg-[#0B1220]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#180D39] dark:text-white mb-4">
              Why Work With Shalean?
            </h2>
            <p className="text-lg text-gray-600 dark:text-white/70 max-w-2xl mx-auto">
              We believe in creating a positive, rewarding work environment where our team can thrive
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-[#EAF2FF] dark:bg-[#0C53ED]/20 mb-4">
                    <Icon className="w-7 h-7 text-[#0C53ED]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#180D39] dark:text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 dark:text-white/70">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#180D39] dark:text-white mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 dark:text-white/70">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white dark:bg-[#0B1220] rounded-2xl border border-gray-100 dark:border-white/10 p-6 text-center shadow-sm"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#0C53ED] to-[#2A869E] flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">{value.title[0]}</span>
                </div>
                <h3 className="text-xl font-semibold text-[#180D39] dark:text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-white/70 text-sm">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We're Looking For */}
      <section className="py-16 px-4 bg-white dark:bg-[#0B1220]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#180D39] dark:text-white mb-4">
              What We're Looking For
            </h2>
            <p className="text-lg text-gray-600 dark:text-white/70">
              We welcome applications from experienced cleaning professionals who share our values
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#EAF2FF] to-white dark:from-[#0C53ED]/10 dark:to-[#0B1220] rounded-2xl border border-[#0C53ED]/20 p-8 shadow-lg">
            <h3 className="text-xl font-semibold text-[#180D39] dark:text-white mb-6">
              Requirements & Qualifications:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requirements.map((req, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#0C53ED] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-white/80">{req}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
            <p className="text-amber-900 dark:text-amber-200 text-center">
              <strong>New to professional cleaning?</strong> We also offer entry-level positions with full training for candidates who demonstrate the right attitude and work ethic.
            </p>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <MapPin className="w-12 h-12 text-[#0C53ED] mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-[#180D39] dark:text-white mb-4">
            Where We Operate
          </h2>
          <p className="text-lg text-gray-600 dark:text-white/70 mb-8">
            We serve clients across Cape Town and are looking for cleaners in the following areas:
          </p>
          <div className="bg-white dark:bg-[#0B1220] rounded-2xl border border-gray-100 dark:border-white/10 p-8 shadow-sm">
            <div className="flex flex-wrap justify-center gap-3">
              {[
                "City Bowl",
                "Southern Suburbs",
                "Northern Suburbs",
                "Table View",
                "Parklands",
                "Century City",
                "Claremont",
                "Wynberg",
                "Muizenberg",
                "Fish Hoek",
                "Rondebosch",
                "Retreat",
              ].map((area) => (
                <span
                  key={area}
                  className="px-4 py-2 bg-[#EAF2FF] dark:bg-[#0C53ED]/20 text-[#0C53ED] dark:text-[#0C53ED] rounded-xl font-medium"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#0C53ED] to-[#2A869E]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Join Our Team?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Take the first step towards a rewarding career with Shalean.
            Apply today and we'll be in touch within 3-5 business days.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-[#0C53ED] hover:bg-gray-100 font-semibold text-lg h-14 px-8 rounded-xl shadow-lg"
          >
            <Link to="/careers/apply">
              Submit Your Application
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <p className="text-white/80 text-sm mt-6">
            Questions? Email us at{" "}
            <a
              href="mailto:bookings@shalean.co.za"
              className="underline hover:text-white"
            >
              bookings@shalean.co.za
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}

