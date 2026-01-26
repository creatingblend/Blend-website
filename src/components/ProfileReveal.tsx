import { ArrowLeft, MapPin, Briefcase, GraduationCap, Heart, Star, Sparkles, Lock } from 'lucide-react';

interface ProfileRevealProps {
  match: any;
  onBack: () => void;
}

export function ProfileReveal({ match, onBack }: ProfileRevealProps) {
  const revealProgress = 60; // 60% revealed

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
        {/* Reveal Progress */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span className="text-purple-900">Reveal Progress</span>
            </div>
            <span className="text-purple-600">{revealProgress}%</span>
          </div>
          <div className="w-full bg-purple-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-full h-3 transition-all"
              style={{ width: `${revealProgress}%` }}
            />
          </div>
          <p className="text-purple-700">
            Keep chatting and playing games to unlock more details!
          </p>
        </div>

        {/* Profile Photo - Locked */}
        <div className="relative">
          <div className="aspect-[4/5] bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl overflow-hidden flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-white/50 rounded-full flex items-center justify-center mx-auto">
                <Lock className="w-12 h-12 text-gray-500" />
              </div>
              <div>
                <p className="text-gray-700">Photo Locked</p>
                <p className="text-gray-500">Unlock at 100% reveal</p>
              </div>
            </div>
          </div>
        </div>

        {/* Compatibility */}
        <div className="bg-white rounded-2xl border-2 border-purple-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">Compatibility</h3>
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 text-purple-600 fill-purple-600" />
              <span className="text-purple-600">{match.compatibility}%</span>
            </div>
          </div>
          <p className="text-gray-600">
            You share {match.interests.length} common interests and have similar personality traits!
          </p>
        </div>

        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-gray-900">Basic Information</h3>
          
          <div className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-gray-500">Age</p>
              <p className="text-gray-900">{match.age} years old</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
              <MapPin className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <p className="text-gray-500">Location</p>
              <p className="text-gray-900">{match.location}</p>
            </div>
          </div>
        </div>

        {/* Locked Sections */}
        <div className="space-y-4">
          <h3 className="text-gray-900">Unlock More</h3>
          
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4 flex items-center gap-4 opacity-60">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-gray-500" />
            </div>
            <div className="flex-1">
              <p className="text-gray-500">Occupation</p>
              <p className="text-gray-700">Locked</p>
            </div>
            <Lock className="w-5 h-5 text-gray-400" />
          </div>

          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4 flex items-center gap-4 opacity-60">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-gray-500" />
            </div>
            <div className="flex-1">
              <p className="text-gray-500">Education</p>
              <p className="text-gray-700">Locked</p>
            </div>
            <Lock className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Interests */}
        <div className="space-y-3">
          <h3 className="text-gray-900">Shared Interests</h3>
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

        {/* Personality */}
        <div className="space-y-3">
          <h3 className="text-gray-900">Personality Traits</h3>
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

        {/* About */}
        <div className="space-y-3">
          <h3 className="text-gray-900">About</h3>
          <p className="text-gray-600 leading-relaxed">{match.bio}</p>
        </div>
      </div>
    </div>
  );
}
