import { Heart, Eye, MessageCircle, Users } from 'lucide-react';
import { AnimatedLogo } from './AnimatedLogo';

interface WelcomeScreenProps {
  onNext: () => void;
  onMeaningfulConversations?: () => void;
}

export function WelcomeScreen({ onNext, onMeaningfulConversations }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Logo */}
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <AnimatedLogo size="large" autoPlay={true} />
          </div>
          <h1 className="text-purple-900">
            <span className="select-all cursor-text hover:bg-purple-100 transition-colors text-center w-full inline-block">B.L.E.N.D</span>
          </h1>
          <p className="text-gray-600">Blind. Local. Engaged. New. Dating</p>
        </div>

        {/* Tagline */}
        <div className="space-y-3 py-6">
          <h2 className="text-gray-900">Connect Beyond Appearance</h2>
          <p className="text-gray-600">
            Removing the pressure of trying to find a match, and bringing back what really matters — connection and personality.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 gap-4 py-6">
          <button 
            onClick={onMeaningfulConversations}
            className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md hover:bg-purple-50 transition-all cursor-pointer text-left"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-left">
              <h3 className="text-gray-900">Meaningful Conversations</h3>
              <p className="text-gray-600">Get to know each other through deep conversations and fun games</p>
            </div>
          </button>

          <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-pink-600" />
            </div>
            <div className="text-left">
              <h3 className="text-gray-900">Compatibility First</h3>
              <p className="text-gray-600">Match with people who share your interests and values</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onNext}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-full hover:opacity-90 transition-opacity"
        >
          Get Started
        </button>

        <p className="text-gray-500">100% Free • No Photos Required</p>
      </div>
    </div>
  );
}