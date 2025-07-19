import React from 'react';
import { Star, Quote, CheckCircle } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

export default function Testimonials() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation();

  const testimonials = [
    {
      quote: "Invoy saved me from a costly mistake. I almost sent 2 ETH to the wrong network. The verification caught it instantly!",
      author: "Sarah Chen",
      role: "Frontend Developer",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      rating: 5,
      verified: true
    },
    {
      quote: "As an employer, I love the approval flow. I can review work details before sending payment. It's professional and secure.",
      author: "Marcus Johnson",
      role: "Startup Founder",
      avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      rating: 5,
      verified: true
    },
    {
      quote: "The invoice links are so clean and professional. My clients trust the process and payments come through faster now.",
      author: "Elena Rodriguez",
      role: "Smart Contract Developer",
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      rating: 5,
      verified: true
    },
    {
      quote: "Multi-chain support is amazing. I work with clients who prefer different networks and Invoy handles it all seamlessly.",
      author: "David Kim",
      role: "DeFi Specialist",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      rating: 5,
      verified: true
    },
    {
      quote: "Finally, a professional way to handle crypto payments. No more screenshots of wallet addresses in chat apps!",
      author: "Priya Patel",
      role: "Web3 Designer",
      avatar: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      rating: 5,
      verified: true
    },
    {
      quote: "The email notifications keep everyone in the loop. Both my clients and I know exactly where each payment stands.",
      author: "Alex Thompson",
      role: "Blockchain Consultant",
      avatar: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      rating: 5,
      verified: true
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-1000 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">TESTIMONIALS</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            What Our <span className="text-blue-600">Web3 Community</span>
            <br />
            Says About Invoy
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join thousands of freelancers and employers who trust Invoy for secure, error-free crypto payments
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">99.9%</div>
            <div className="text-gray-600 dark:text-gray-300">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">$2M+</div>
            <div className="text-gray-600 dark:text-gray-300">Processed Safely</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">5,000+</div>
            <div className="text-gray-600 dark:text-gray-300">Happy Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">0</div>
            <div className="text-gray-600 dark:text-gray-300">Wrong Chain Errors</div>
          </div>
        </div>

        <div 
          ref={cardsRef}
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-1000 delay-300 ${
            cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-700 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative group border border-gray-200 dark:border-gray-600"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 opacity-20">
                <Quote size={32} className="text-blue-500" />
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-400 fill-current" />
                ))}
              </div>
              
              <blockquote className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 relative z-10">
                "{testimonial.quote}"
              </blockquote>

              <div className="flex items-center space-x-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <div className="font-semibold text-gray-900 dark:text-white">{testimonial.author}</div>
                    {testimonial.verified && (
                      <CheckCircle size={16} className="text-blue-500" />
                    )}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 text-sm">{testimonial.role}</div>
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Join Our Community?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Start creating secure, professional invoices today and never worry about payment errors again.
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 inline-flex items-center space-x-2">
              <span>Get Started Free</span>
              <CheckCircle size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}