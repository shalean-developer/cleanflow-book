import { Users, Award, Heart, Shield } from "lucide-react";
import luciaImg from "@/assets/lucia-pazvakavambwa.webp";
import normatterImg from "@/assets/normatter-mazhinji.webp";
import nyashaImg from "@/assets/nyasha-mudani.webp";

export default function OurTeam() {
  const teamMembers = [
    {
      name: "Lucia Pazvakavambwa",
      role: "Senior Cleaning Specialist",
      image: luciaImg,
      bio: "With over 8 years of experience, Lucia brings exceptional attention to detail and a warm, professional approach to every home she services.",
      specialties: ["Deep Cleaning", "Move In/Out", "Eco-Friendly Products"],
    },
    {
      name: "Normatter Mazhinji",
      role: "Team Lead & Quality Supervisor",
      image: normatterImg,
      bio: "Normatter ensures that every cleaning meets our highest standards. Her leadership and expertise make her an invaluable part of the Shalean family.",
      specialties: ["Quality Control", "Team Training", "Specialized Services"],
    },
    {
      name: "Nyasha Mudani",
      role: "Cleaning Specialist",
      image: nyashaImg,
      bio: "Nyasha's dedication to customer satisfaction and thorough cleaning approach has earned her consistently excellent reviews from our clients.",
      specialties: ["Standard Cleaning", "Organization", "Customer Care"],
    },
  ];

  const values = [
    {
      icon: Shield,
      title: "Trusted Professionals",
      description: "All team members are thoroughly vetted, background-checked, and trained to our exacting standards.",
    },
    {
      icon: Award,
      title: "Excellence Driven",
      description: "We take pride in delivering exceptional service and continuously improving our skills and techniques.",
    },
    {
      icon: Heart,
      title: "Customer Focused",
      description: "Your satisfaction is our priority. We treat every home with the care and respect it deserves.",
    },
    {
      icon: Users,
      title: "Community Minded",
      description: "We believe in giving back to our community and supporting local initiatives in Cape Town.",
    },
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
              <span className="text-sm font-medium text-[#0C53ED]">Meet Our Team</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-[#180D39] dark:text-white mb-6">
              The Faces Behind the Clean
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-[#0C53ED] to-[#2A869E] mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-gray-600 dark:text-white/70 max-w-3xl mx-auto">
              Our dedicated team of cleaning professionals is committed to making your home sparkle.
              Get to know the people who bring quality and care to every service.
            </p>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-16 px-4 bg-white dark:bg-[#0B1220]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#180D39] dark:text-white mb-4">
              Our Cleaning Specialists
            </h2>
            <p className="text-lg text-gray-600 dark:text-white/70 max-w-2xl mx-auto">
              Every member of our team is hand-picked, professionally trained, and passionate about delivering exceptional service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="aspect-square overflow-hidden bg-gradient-to-br from-[#EAF2FF] to-white dark:from-[#0C53ED]/20 dark:to-[#0B1220]">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[#180D39] dark:text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-[#0C53ED] font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 dark:text-white/70 text-sm mb-4 leading-relaxed">
                    {member.bio}
                  </p>
                  <div className="pt-4 border-t border-gray-200 dark:border-white/10">
                    <p className="text-xs font-semibold text-gray-500 dark:text-white/60 uppercase tracking-wide mb-2">
                      Specialties:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {member.specialties.map((specialty, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-[#EAF2FF] dark:bg-[#0C53ED]/20 text-[#0C53ED] rounded-full text-xs font-medium"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#180D39] dark:text-white mb-4">
              What Sets Us Apart
            </h2>
            <p className="text-lg text-gray-600 dark:text-white/70 max-w-2xl mx-auto">
              Our team embodies these core values in every interaction and every clean
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-[#0B1220] rounded-2xl border border-gray-100 dark:border-white/10 p-8 shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r from-[#0C53ED] to-[#2A869E] flex-shrink-0">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#180D39] dark:text-white mb-2">
                        {value.title}
                      </h3>
                      <p className="text-gray-600 dark:text-white/70 leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Join Our Team CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#0C53ED] to-[#2A869E]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Want to Join Our Team?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            We're always looking for talented, dedicated cleaning professionals to join the Shalean family.
          </p>
          <a
            href="/careers"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#0C53ED] hover:bg-gray-100 font-semibold text-lg rounded-xl shadow-lg transition-all duration-200 hover:-translate-y-1"
          >
            View Career Opportunities
            <Users className="ml-2 w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white dark:bg-[#0B1220]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#0C53ED] mb-2">25+</div>
              <div className="text-gray-600 dark:text-white/70">Team Members</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#0C53ED] mb-2">10K+</div>
              <div className="text-gray-600 dark:text-white/70">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#0C53ED] mb-2">50K+</div>
              <div className="text-gray-600 dark:text-white/70">Homes Cleaned</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#0C53ED] mb-2">4.9</div>
              <div className="text-gray-600 dark:text-white/70">Average Rating</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

