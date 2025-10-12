import { Star, Quote, TrendingUp, Award, Users, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Reviews() {
  const navigate = useNavigate();

  const reviews = [
    {
      name: "Sarah Johnson",
      location: "Camps Bay",
      rating: 5,
      date: "2 weeks ago",
      title: "Exceptional service from start to finish",
      review: "The team was professional, thorough, and incredibly efficient. My home has never looked better! They paid attention to every detail and even cleaned areas I didn't expect. Highly recommend Shalean!",
      service: "Deep Cleaning",
      verified: true,
    },
    {
      name: "Michael Peters",
      location: "Sea Point",
      rating: 5,
      date: "1 month ago",
      title: "Best cleaning service in Cape Town",
      review: "I've tried several cleaning services over the years, but Shalean stands out. Their attention to detail, reliability, and friendly staff make them my go-to choice. The booking process was seamless too!",
      service: "Standard Cleaning",
      verified: true,
    },
    {
      name: "Amanda van der Merwe",
      location: "Constantia",
      rating: 5,
      date: "3 weeks ago",
      title: "Made our move so much easier",
      review: "Moving is stressful enough without worrying about cleaning. Shalean's move-out cleaning service was perfect. The property was spotless, and we got our full deposit back. Thank you!",
      service: "Move In/Out",
      verified: true,
    },
    {
      name: "David Chen",
      location: "Newlands",
      rating: 5,
      date: "2 months ago",
      title: "Reliable and trustworthy team",
      review: "What I appreciate most is the consistency. Every time they clean, the quality is the same - exceptional. The team is respectful of our home and belongings. Five stars all the way!",
      service: "Standard Cleaning",
      verified: true,
    },
    {
      name: "Thandi Ngwenya",
      location: "Rondebosch",
      rating: 5,
      date: "1 month ago",
      title: "Eco-friendly and effective",
      review: "As someone who's conscious about the environment, I love that they use eco-friendly products that are safe for my kids and pets. The results are amazing without compromising on quality.",
      service: "Deep Cleaning",
      verified: true,
    },
    {
      name: "James Robertson",
      location: "Claremont",
      rating: 5,
      date: "3 weeks ago",
      title: "Outstanding communication",
      review: "From booking to completion, the communication was excellent. They arrived on time, worked efficiently, and left my apartment sparkling. The online booking system made it so easy!",
      service: "Standard Cleaning",
      verified: true,
    },
  ];

  const stats = [
    { number: "4.9/5", label: "Average Rating", icon: Star },
    { number: "10,000+", label: "Happy Clients", icon: Users },
    { number: "98%", label: "Satisfaction Rate", icon: TrendingUp },
    { number: "50,000+", label: "Services Completed", icon: Award },
  ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-5 h-5 ${
              index < rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EAF2FF] to-white dark:from-[#0B1220] dark:to-[#0B1220]">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C53ED]/10 to-[#2A869E]/10 dark:from-[#0C53ED]/5 dark:to-[#2A869E]/5"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white dark:bg-[#0B1220] px-4 py-2 rounded-full border border-[#0C53ED]/20 mb-6 shadow-sm">
              <Star className="w-4 h-4 text-[#0C53ED] fill-[#0C53ED]" />
              <span className="text-sm font-medium text-[#0C53ED]">Customer Reviews</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-[#180D39] dark:text-white mb-6">
              See What Our Clients Say
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-[#0C53ED] to-[#2A869E] mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-gray-600 dark:text-white/70 max-w-3xl mx-auto">
              Real feedback from real customers. Discover why thousands of Cape Town residents
              trust Shalean for their cleaning needs.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-white dark:bg-[#0B1220] border-y border-gray-100 dark:border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#0C53ED] to-[#2A869E] flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-[#0C53ED] mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-white/70">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#180D39] dark:text-white mb-4">
              Customer Testimonials
            </h2>
            <p className="text-lg text-gray-600 dark:text-white/70 max-w-2xl mx-auto">
              Read honest reviews from our valued customers across Cape Town
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-[#180D39] dark:text-white">
                        {review.name}
                      </h3>
                      {review.verified && (
                        <CheckCircle2 className="w-5 h-5 text-[#0C53ED]" aria-label="Verified Customer" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-white/60">
                      {review.location} • {review.date}
                    </p>
                  </div>
                  <Quote className="w-8 h-8 text-[#0C53ED]/20 dark:text-[#0C53ED]/30 flex-shrink-0" />
                </div>

                <div className="mb-4">{renderStars(review.rating)}</div>

                <h4 className="text-md font-semibold text-[#180D39] dark:text-white mb-2">
                  {review.title}
                </h4>

                <p className="text-gray-600 dark:text-white/70 text-sm leading-relaxed mb-4">
                  {review.review}
                </p>

                <div className="pt-4 border-t border-gray-100 dark:border-white/10">
                  <span className="inline-flex items-center px-3 py-1 bg-[#EAF2FF] dark:bg-[#0C53ED]/20 text-[#0C53ED] rounded-full text-xs font-medium">
                    {review.service}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 px-4 bg-white dark:bg-[#0B1220]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#180D39] dark:text-white mb-4">
              Why Clients Choose Shalean
            </h2>
            <p className="text-lg text-gray-600 dark:text-white/70 max-w-2xl mx-auto">
              Our commitment to excellence is reflected in every review
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#0C53ED] to-[#2A869E] rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#180D39] dark:text-white mb-2">
                Verified Reviews
              </h3>
              <p className="text-gray-600 dark:text-white/70">
                All reviews are from real customers who have used our services
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#0C53ED] to-[#2A869E] rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#180D39] dark:text-white mb-2">
                Quality Guaranteed
              </h3>
              <p className="text-gray-600 dark:text-white/70">
                We stand behind our work with a 100% satisfaction guarantee
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#0C53ED] to-[#2A869E] rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#180D39] dark:text-white mb-2">
                Consistent Excellence
              </h3>
              <p className="text-gray-600 dark:text-white/70">
                Maintaining high standards across thousands of completed services
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#0C53ED] to-[#2A869E]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Experience the Shalean Difference?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers. Book your cleaning service today and see why
            we're Cape Town's top-rated cleaning company.
          </p>
          <Button
            onClick={() => navigate("/booking/service/select")}
            size="lg"
            className="bg-white text-[#0C53ED] hover:bg-gray-100 font-semibold text-lg px-8 py-6 h-auto shadow-lg hover:-translate-y-1 transition-all duration-200"
          >
            Book Your Cleaning Now
          </Button>
        </div>
      </section>

      {/* Review Platform Links */}
      <section className="py-12 px-4 bg-white dark:bg-[#0B1220]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600 dark:text-white/70 mb-6">
            You can also find us on these trusted review platforms:
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="#"
              className="text-[#0C53ED] hover:underline font-medium flex items-center gap-2"
            >
              <Star className="w-4 h-4 fill-[#0C53ED]" />
              Google Reviews
            </a>
            <span className="text-gray-300 dark:text-white/20">|</span>
            <a
              href="#"
              className="text-[#0C53ED] hover:underline font-medium flex items-center gap-2"
            >
              <Star className="w-4 h-4 fill-[#0C53ED]" />
              Facebook Reviews
            </a>
            <span className="text-gray-300 dark:text-white/20">|</span>
            <a
              href="#"
              className="text-[#0C53ED] hover:underline font-medium flex items-center gap-2"
            >
              <Star className="w-4 h-4 fill-[#0C53ED]" />
              Trustpilot
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

