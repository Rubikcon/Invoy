import React from 'react';
import { Send, Smartphone, Zap, Laptop, Code, Coffee, CheckCircle } from 'lucide-react';

export default function AnimatedHeroSlider() {
  const [currentSlide, setCurrentSlide] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 2);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const slides = [
    {
      id: 'client',
      image: '/WhatsApp Image 2025-07-19 at 21.34.06 copy.jpeg',
      title: 'Client Approving Payment',
      description: 'Secure review and approval process'
    },
    {
      id: 'freelancer',
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
      title: 'Freelancer Creating Invoice',
      description: 'Professional invoice generation'
    }
  ];

  return (
    <div className="relative w-full h-96 overflow-hidden">
      {/* Slide Container */}
      <div 
        className="flex transition-transform duration-1000 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {/* Client Slide */}
        <div className="min-w-full relative flex items-center justify-center">
          <div className="relative">
            <img
              src="/WhatsApp Image 2025-07-19 at 21.34.06 copy.jpeg"
              alt="Client approving crypto invoice"
              className="w-80 h-96 object-cover rounded-2xl shadow-2xl"
            />
            
            {/* Phone Glow Effect */}
            <div className="absolute bottom-20 right-16 w-16 h-8 bg-blue-400/30 rounded-lg blur-xl animate-pulse"></div>
            
            {/* Floating Crypto Coins */}
            {/* Ethereum */}
            <div className="absolute bottom-24 right-12 animate-float">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg animate-crypto-glow">
                <svg viewBox="0 0 256 417" className="w-5 h-5">
                  <path d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z" fill="white"/>
                  <path d="M127.962 0L0 212.32l127.962 75.639V154.158z" fill="white" opacity="0.6"/>
                </svg>
              </div>
            </div>
            
            {/* Bitcoin */}
            <div className="absolute bottom-32 right-8 animate-float animation-delay-1000">
              <div className="w-7 h-7 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg animate-crypto-glow">
                <span className="text-white font-bold text-xs">₿</span>
              </div>
            </div>
            
            {/* Solana */}
            <div className="absolute bottom-28 right-20 animate-float animation-delay-2000">
              <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg animate-crypto-glow">
                <span className="text-white font-bold text-xs">S</span>
              </div>
            </div>
            
            {/* Polygon */}
            <div className="absolute bottom-36 right-14 animate-float animation-delay-3000">
              <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg animate-crypto-glow">
                <span className="text-white font-bold text-xs">P</span>
              </div>
            </div>
            
            {/* Stellar (XLM) */}
            <div className="absolute bottom-40 right-10 animate-float animation-delay-4000">
              <div className="w-5 h-5 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg animate-crypto-glow">
                <span className="text-white font-bold text-xs">X</span>
              </div>
            </div>
            
            {/* Approval Animation */}
            <div className="absolute top-8 right-8 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium animate-pulse">
              <CheckCircle size={12} className="inline mr-1" />
              Payment Approved
            </div>
            
            {/* Client Label */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
              <p className="text-sm font-medium text-gray-900">Client Review</p>
              <p className="text-xs text-gray-600">Approving invoice payment</p>
            </div>
          </div>
        </div>

        {/* Freelancer Slide */}
        <div className="min-w-full relative flex items-center justify-center">
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop"
              alt="Freelancer creating crypto invoice"
              className="w-80 h-96 object-cover rounded-2xl shadow-2xl"
            />
            
            {/* Laptop Glow Effect */}
            <div className="absolute bottom-32 left-16 w-20 h-12 bg-blue-400/30 rounded-lg blur-xl animate-pulse"></div>
            
            {/* Floating Work Icons */}
            <div className="absolute top-12 right-8 animate-float">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <Code size={18} className="text-white" />
              </div>
            </div>
            
            <div className="absolute top-24 right-16 animate-float animation-delay-1000">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
                <Laptop size={14} className="text-white" />
              </div>
            </div>
            
            <div className="absolute top-36 right-12 animate-float animation-delay-2000">
              <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <Coffee size={12} className="text-white" />
              </div>
            </div>
            
            {/* Invoice Creation Animation */}
            <div className="absolute bottom-20 left-8 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium animate-pulse">
              <Send size={12} className="inline mr-1" />
              Creating Invoice
            </div>
            
            {/* Network Indicators */}
            <div className="absolute top-16 left-8 space-y-2">
              <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-lg px-2 py-1 text-xs text-blue-600 animate-pulse">
                Ethereum
              </div>
              <div className="bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-lg px-2 py-1 text-xs text-purple-600 animate-pulse animation-delay-1000">
                Polygon
              </div>
            </div>
            
            {/* Freelancer Label */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
              <p className="text-sm font-medium text-gray-900">Freelancer</p>
              <p className="text-xs text-gray-600">Creating secure invoice</p>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentSlide === index ? 'bg-blue-500 w-6' : 'bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Background Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-12 left-12 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-20 right-20 w-3 h-3 bg-purple-400 rounded-full animate-pulse opacity-40 animation-delay-2000"></div>
        <div className="absolute bottom-16 left-16 w-2 h-2 bg-green-400 rounded-full animate-pulse opacity-50 animation-delay-3000"></div>
      </div>
    </div>
  );
}