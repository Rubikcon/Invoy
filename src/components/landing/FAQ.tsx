import React from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

export default function FAQ() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: faqRef, isVisible: faqVisible } = useScrollAnimation();

  const faqs = [
    {
      question: "Is Invoy free to use?",
      answer: "Yes. Invoy is currently free for freelancers and employers. We believe in empowering the Web3 workforce with accessible tools for professional payment management."
    },
    {
      question: "Which networks are supported?",
      answer: "Ethereum, Polygon, and other EVM-compatible chains. We support major networks including Arbitrum, Optimism, and Base, with more networks being added regularly."
    },
    {
      question: "Do I need a wallet?",
      answer: "Yes. You'll need a crypto wallet like MetaMask to connect and receive payments. Invoy integrates seamlessly with popular Web3 wallets for secure transactions."
    },
    {
      question: "What if I make a mistake in the email?",
      answer: "You can cancel the invoice before it's paid. Once an invoice is created, you have full control to modify or cancel it until the employer processes the payment."
    },
    {
      question: "How does Invoy prevent wrong chain transactions?",
      answer: "Invoy automatically verifies that your wallet address is compatible with the selected network before creating the invoice. It cross-checks the chain ID and wallet configuration."
    },
    {
      question: "Is my wallet information secure?",
      answer: "Yes. Invoy never stores your private keys or has access to your funds. We only store your public wallet address and use industry-standard encryption for all data transmission."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-1000 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium mb-4">
            <HelpCircle size={16} className="mr-2" />
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Get answers to common questions about secure Web3 invoicing
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
              className="bg-white dark:bg-gray-700 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden transition-all duration-300 hover:shadow-md group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-600/50 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-8 transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <ChevronUp size={24} className="text-blue-600 dark:text-blue-400 transition-colors duration-300" />
                  ) : (
                    <ChevronDown size={24} className="text-gray-400 dark:text-gray-500 transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                  )}
                </div>
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
      </div>
    </section>
  );
}