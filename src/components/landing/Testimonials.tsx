import React from 'react';
import { Star, Quote } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

export default function Testimonials() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation();

  const testimonials = [
    {
      quote: "Invoy helped me avoid chain errors and get paid faster.",
      author: "Amina",
      role: "Smart Contract Developer",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    },
    {
      quote: "The approval system gave my team full visibility and control.",
      author: "David",
      role: "DAO Lead",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    },
    {
      quote: "Finally, a professional way to handle crypto payments for freelance work.",
      author: "Maria",
      role: "DeFi Consultant",
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-1000 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors duration-300">
            Join thousands of freelancers and employers who trust Invoy for their Web3 payments.
          </p>
        </div>

        <div 
          ref={cardsRef}
          className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-1000 delay-300 ${
            cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg transition-all duration-300 relative group border border-gray-200 dark:border-gray-700 hover:-translate-y-1"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <Quote size={32} className="text-blue-500 dark:text-blue-400 mb-6 opacity-50 group-hover:opacity-100 transition-all duration-300" />
              
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-400 dark:text-yellow-300 fill-current transition-colors duration-300" />
                ))}
              </div>
              
              <blockquote className="text-gray-900 dark:text-white text-lg leading-relaxed mb-6 italic transition-colors duration-300">
                "{testimonial.quote}"
              </blockquote>
              
              <div className="flex items-center space-x-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">{testimonial.author}</div>
                  <div className="text-gray-600 dark:text-gray-300 text-sm transition-colors duration-300">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}