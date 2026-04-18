import { ArrowLeft, MapPin, Heart, Star, User, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface ProfileRevealProps {
  match: any;
  onBack: () => void;
  onAccept?: () => void;
  onReject?: () => void;
}

export function ProfileReveal({ match, onBack, onAccept, onReject }: ProfileRevealProps) {
  const [expandedSections, setExpandedSections] = useState({
    sharedInterests: true,
    personality: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h3 className="text-gray-900">Profile</h3>
          <div className="w-6" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Avatar */}
        <div className="flex justify-center">
          <div className="w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
            <User className="w-16 h-16 text-purple-600" />
          </div>
        </div>

        {/* Basic Info */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">{match.name}</h2>
          <div className="flex items-center justify-center gap-4 text-gray-600">
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4 text-purple-600" />
              <span>{match.age} years old</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-pink-600" />
              <span>{match.location}</span>
            </div>
          </div>
        </div>

        {/* Compatibility */}
        <div className="bg-white rounded-2xl border-2 border-purple-200 p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Star className="w-6 h-6 text-purple-600 fill-purple-600" />
            <span className="text-xl font-bold text-purple-600">{match.compatibility}% Compatibility</span>
          </div>
          <p className="text-gray-600">
            You share {match.interests.length} common interests and have similar personality traits!
          </p>
        </div>

        {/* About */}
        <div className="space-y-3">
          <h3 className="text-gray-900 font-semibold text-lg">About</h3>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <p className="text-gray-700 leading-relaxed">{match.bio}</p>
          </div>
        </div>

        {/* Shared Interests Dropdown */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('sharedInterests')}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <h3 className="text-gray-900 font-semibold">Shared Interests</h3>
            {expandedSections.sharedInterests ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          
          {expandedSections.sharedInterests && (
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {match.interests.map((interest: string) => (
                  <span
                    key={interest}
                    className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full border border-purple-200"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Personality Traits Dropdown */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('personality')}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <h3 className="text-gray-900 font-semibold">Personality Traits</h3>
            {expandedSections.personality ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          
          {expandedSections.personality && (
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {match.personality.map((trait: string) => (
                  <span
                    key={trait}
                    className="px-4 py-2 bg-pink-100 text-pink-700 rounded-full border border-pink-200"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Accept/Reject Buttons - Only show for conversation requests */}
        {match.isConversationRequest && onAccept && onReject && (
          <div className="grid grid-cols-2 gap-4 sticky bottom-0 bg-white p-4 -mx-6 border-t border-gray-200">
            <button 
              onClick={onReject}
              className="px-6 py-4 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors border border-gray-300 font-medium"
            >
              Reject
            </button>
            <button 
              onClick={onAccept}
              className="px-6 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium"
            >
              Accept
            </button>
          </div>
        )}
      </div>
    </div>
  );
}