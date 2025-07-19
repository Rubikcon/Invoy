import React from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Shield, Zap } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

export default function FAQ() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: faqRef, isVisible: faqVisible } = useScrollAnimation();

  const faqs = [
    {
      question: "How does Invoy prevent wrong chain transactions?",
      answer: "Invoy automatically verifies that your wallet address is compatible with the selected network before creating the invoice. It cross-checks the chain ID and wallet configuration to ensure payments can only be sent to the correct network."
    },
    {
      question: "Which wallets and networks does Invoy support?",
      answer: "Invoy supports MetaMask and WalletConnect-compatible wallets. We support major networks including Ethereum, Polygon, Arbitrum, Optimism, and Base, with more networks being added regularly."
    },
    {
      question: "Is Invoy free to use for freelancers?",
      answer: "Yes! Invoy is completely free for freelancers to create and send invoices. We believe in empowering the Web3 workforce with accessible tools for professional payment management."
    },
    {
      question: "How do employers receive and approve invoices?",
      answer: "Employers receive a secure email with a unique invoice link. They can review all work details, verify the wallet address and network, then approve or reject the payment request with optional feedback."
    },
    {
      question: "What happens if an employer rejects my invoice?",
      answer: "If rejected, you'll receive an email notification with the employer's reason. You can then create a new invoice with any necessary corrections or clarifications."
    },
    {
      question: "Can I track the status of my invoices?",
      answer: "Absolutely! Your dashboard shows real-time status updates for all invoices: Pending, Approved, Paid, or Rejected. Both you and the employer receive email notifications at each stage."
    },
    {
      question: "Is my wallet information secure with Invoy?",
      answer: "Yes. Invoy never stores your private keys or has access to your funds. We only store your public wallet address and use industry-standard encryption for all data transmission."
    },
    {
      question: "Can I use Invoy for recurring payments?",
      answer: "Currently, Invoy focuses on one-time invoice payments to ensure maximum security and verification for each transaction. Recurring payment features are planned for future releases."
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
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium mb-4">
            <HelpCircle size={16} className="mr-2" />
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
            Everything You Need to Know
            <br />
            About <span className="text-blue-600">Invoy</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 transition-colors duration-300">
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
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-md group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
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

        {/* Help Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Shield size={24} />
              <h3 className="text-2xl font-bold">Still Have Questions?</h3>
            </div>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Our team is here to help you get started with secure Web3 invoicing. Reach out anytime!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@invoy.xyz"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 inline-flex items-center justify-center space-x-2"
              >
                <span>Contact Support</span>
              </a>
              <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors duration-200 inline-flex items-center justify-center space-x-2">
                <Zap size={16} />
                <span>Join Community</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}