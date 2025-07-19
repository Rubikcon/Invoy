import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

export default function FAQ() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: faqRef, isVisible: faqVisible } = useScrollAnimation();

  const faqs = [
    {
      question: "Is Invoy free to use?",
      answer: "Yes. Invoy is currently free for freelancers and employers."
    },
    {
      question: "Which networks are supported?",
      answer: "Ethereum, Polygon, and other EVM-compatible chains."
    },
    {
      question: "Do I need a wallet?",
      answer: "Yes. You'll need a crypto wallet like Metamask."
    },
    {
      question: "What if I make a mistake in the email?",
      answer: "You can cancel the invoice before it's paid."
    },
    {
      question: "How secure is Invoy?",
      answer: "Invoy uses industry-standard security practices and never stores your private keys. All transactions are verified before execution."
    },
    {
      question: "Can I use Invoy for recurring payments?",
      answer: "Currently, Invoy focuses on one-time invoice payments. Recurring payment features are planned for future releases."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-purple-900/20 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-1000 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 transition-colors duration-300">
            Everything you need to know about Invoy.
          </p>
        </div>

        <div 
          ref={faqRef}
          className={`space-y-4 transition-all duration-1000 delay-300 ${
            faqVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-md"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-8 transition-colors duration-300">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp size={24} className="text-blue-600 dark:text-blue-400 flex-shrink-0 transition-colors duration-300" />
                ) : (
                  <ChevronDown size={24} className="text-gray-400 dark:text-gray-500 flex-shrink-0 transition-colors duration-300" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-8 pb-6 animate-slide-down">
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-4 transition-colors duration-300">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-300">Still have questions?</p>
          <a
            href="mailto:support@invoy.xyz"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  );
}