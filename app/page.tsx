'use client';

import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#300266] via-[#801ED7] to-[#300266] flex items-center justify-center p-4">
      <div className="text-center">
        {/* Logo Braze */}
        <div className="mb-8 flex justify-center">
          <Image 
            src="/braze-logo.png" 
            alt="Braze" 
            width={375}
            height={125}
            className="h-25 w-auto object-contain drop-shadow-2xl"
            priority
          />
        </div>
        
        {/* Message minimal */}
        <div className="bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 inline-block border border-white/20">
          <p className="text-white text-lg font-medium">
            Real-time Leaderboard Demo
          </p>
        </div>
        
        {/* Footer discret */}
        <div className="mt-12">
          <Image 
            src="/powered-by-braze-logo.png" 
            alt="Powered by Braze" 
            width={200}
            height={60}
            className="h-[60px] w-auto object-contain mx-auto opacity-60"
          />
        </div>
      </div>
    </div>
  );
}
