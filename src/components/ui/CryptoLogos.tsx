import React from 'react';

export default function CryptoLogos() {
  return (
    <div className="flex items-center justify-center space-x-8 py-8">
      {/* Ethereum */}
      <div className="relative group">
        <div className="w-12 h-12 animate-float">
          <svg viewBox="0 0 256 417" className="w-full h-full">
            <defs>
              <linearGradient id="ethGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#627EEA" />
                <stop offset="100%" stopColor="#8A92B2" />
              </linearGradient>
            </defs>
            <path
              d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z"
              fill="url(#ethGradient)"
              className="animate-pulse"
            />
            <path
              d="M127.962 0L0 212.32l127.962 75.639V154.158z"
              fill="url(#ethGradient)"
              opacity="0.6"
              className="animate-pulse animation-delay-1000"
            />
            <path
              d="M127.962 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z"
              fill="url(#ethGradient)"
              className="animate-pulse animation-delay-2000"
            />
            <path
              d="M127.962 416.905v-104.72L0 236.585z"
              fill="url(#ethGradient)"
              opacity="0.6"
              className="animate-pulse animation-delay-3000"
            />
          </svg>
        </div>
        <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Bitcoin */}
      <div className="relative group">
        <div className="w-12 h-12 animate-float animation-delay-1000">
          <svg viewBox="0 0 256 256" className="w-full h-full">
            <defs>
              <linearGradient id="btcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F7931A" />
                <stop offset="100%" stopColor="#FFB84D" />
              </linearGradient>
            </defs>
            <circle cx="128" cy="128" r="128" fill="url(#btcGradient)" className="animate-pulse" />
            <path
              d="M170.5 108.3c2.4-16.1-9.9-24.8-26.7-30.6l5.5-21.8-13.4-3.3-5.3 21.2c-3.5-.9-7.1-1.7-10.7-2.5l5.4-21.4-13.4-3.3-5.5 21.8c-2.9-.7-5.7-1.3-8.4-2l.1-.3-18.5-4.6-3.6 14.2s9.9 2.3 9.7 2.4c5.4 1.4 6.4 4.9 6.2 7.7l-6.2 24.9c.4.1.9.2 1.4.4-.4-.1-.9-.2-1.4-.4l-8.7 34.9c-.7 1.6-2.3 4.1-6.1 3.2.1.2-9.7-2.4-9.7-2.4l-6.7 15.2 17.5 4.4c3.3.8 6.5 1.7 9.6 2.5l-5.6 22.3 13.4 3.3 5.5-21.8c3.7 1 7.3 1.9 10.8 2.8l-5.5 21.7 13.4 3.3 5.6-22.2c22.9 4.3 40.1 2.6 47.4-18.2 5.9-16.7-.3-26.4-12.4-32.7 8.8-2 15.4-7.7 17.2-19.5zm-30.8 43.2c-4.2 16.7-32.4 7.7-41.5 5.4l7.4-29.7c9.1 2.3 38.5 6.8 34.1 24.3zm4.2-43.4c-3.8 15.2-27.3 7.5-34.9 5.6l6.7-26.9c7.6 1.9 32.2 5.4 28.2 21.3z"
              fill="white"
              className="animate-pulse animation-delay-500"
            />
          </svg>
        </div>
        <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Solana */}
      <div className="relative group">
        <div className="w-12 h-12 animate-float animation-delay-2000">
          <svg viewBox="0 0 256 256" className="w-full h-full">
            <defs>
              <linearGradient id="solGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9945FF" />
                <stop offset="50%" stopColor="#14F195" />
                <stop offset="100%" stopColor="#00D4FF" />
              </linearGradient>
            </defs>
            <rect width="256" height="256" rx="128" fill="url(#solGradient)" className="animate-pulse" />
            <path
              d="M68.4 180.8c1.6-1.6 3.8-2.5 6.1-2.5h113c2.8 0 4.2 3.4 2.2 5.4l-25.5 25.5c-1.6 1.6-3.8 2.5-6.1 2.5h-113c-2.8 0-4.2-3.4-2.2-5.4l25.5-25.5z"
              fill="white"
              className="animate-pulse animation-delay-1000"
            />
            <path
              d="M68.4 46.2c1.6-1.6 3.8-2.5 6.1-2.5h113c2.8 0 4.2 3.4 2.2 5.4l-25.5 25.5c-1.6 1.6-3.8 2.5-6.1 2.5h-113c-2.8 0-4.2-3.4-2.2-5.4l25.5-25.5z"
              fill="white"
              className="animate-pulse animation-delay-2000"
            />
            <path
              d="M187.6 113.5c1.6-1.6 3.8-2.5 6.1-2.5h25.5c2.8 0 4.2 3.4 2.2 5.4l-25.5 25.5c-1.6 1.6-3.8 2.5-6.1 2.5h-113c-2.8 0-4.2-3.4-2.2-5.4l25.5-25.5c1.6-1.6 3.8-2.5 6.1-2.5h81.4z"
              fill="white"
              className="animate-pulse animation-delay-3000"
            />
          </svg>
        </div>
        <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Stellar (XLM) */}
      <div className="relative group">
        <div className="w-12 h-12 animate-float animation-delay-3000">
          <svg viewBox="0 0 256 256" className="w-full h-full">
            <defs>
              <linearGradient id="xlmGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#08B5E5" />
                <stop offset="100%" stopColor="#7C4DFF" />
              </linearGradient>
            </defs>
            <circle cx="128" cy="128" r="128" fill="url(#xlmGradient)" className="animate-pulse" />
            <path
              d="M128 32L96 64v128l32-32V64l32 32v96l32-32V64z"
              fill="white"
              className="animate-pulse animation-delay-1000"
            />
            <path
              d="M64 96l32 32v64l-32-32z"
              fill="white"
              opacity="0.8"
              className="animate-pulse animation-delay-2000"
            />
            <path
              d="M192 96v64l-32-32V96z"
              fill="white"
              opacity="0.8"
              className="animate-pulse animation-delay-3000"
            />
          </svg>
        </div>
        <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </div>
  );
}