import React from 'react';
import { Star, Quote } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

export default function Testimonials() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation();

  const testimonials = [
    {
      quote: "Excellent customer service and a great product. We have just signed up for another 3 years.",
      author: "Wade Warren",
      role: "CEO, TechCorp",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    },
    {
      quote: "Second time using best financial services. It works great to save throughout the whole process!",
      author: "Jerome Bell",
      role: "CTO, StartupXYZ",
      avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    },
    {
      quote: "The main benefits are the extraordinary flexibility and user-friendly interface.",
      author: "Annette Black",
      role: "Finance Director",
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    },
    {
      quote: "Customer service is exceptional. Product, definitely makes bookings quicker and easier to manage.",
      author: "Savannah Nguyen",
      role: "Operations Manager",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    },
    {
      quote: "Great customer service and administration style. The system is easy to use for our admin.",
      author: "Leslie Alexander",
      role: "Business Owner",
      avatar: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
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
          <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">TESTIMONY</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            What Our Lovely <span className="text-red-500">Customers</span>
            <br />
            Say About Us
          </h2>
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
              className="bg-white dark:bg-gray-700 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative group"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{testimonial.author}</div>
                  <div className="text-gray-600 dark:text-gray-300 text-sm">{testimonial.role}</div>
                </div>
              </div>
              
              <blockquote className="text-gray-700 dark:text-gray-300 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}