import { X, ChevronDown, ChevronUp, Settings, Sliders } from 'lucide-react';
import { useState } from 'react';
import { SettingsPanel } from './SettingsPanel';

interface UserProfileProps {
  onClose: () => void;
  onOpenMandatory: () => void;
  onOpenUpdate: () => void;
  onOpenDesires: () => void;
  onOpenSecurity: () => void;
  onOpenFilters: () => void;
}

// Mock user data - this would come from actual user state
const mockUserProfile = {
  name: 'You',
  age: 28,
  location: '5 miles away',
  compatibility: 95,
  bio: 'Looking for meaningful connections based on shared interests and values.',
  
  // Identity
  gender: 'Woman',
  military: 'No Service',
  pronouns: ['She/Her'],
  zodiacSign: 'Libra',
  
  // Interests organized by category
  interests: {
    'Movies & TV': ['Foreign Film', 'Documentaries', 'Comedy'],
    'Outdoor': ['Outdoor Games', 'Corn Hole', 'Horse Shoes', 'Hiking'],
    'Creative': ['Social Media Content Creator', 'Photography'],
    'Learning': ['Higher Education', 'Reading'],
    'Technology': ['Finance/Crypto', 'Programming'],
    'Social': ['Church', 'Volunteering'],
    'Sports': ['Basketball', 'Swimming'],
    'Gaming': ['Video Games', 'Board Games']
  },
  
  mandatoryInterests: ['Higher Education', 'Church'],
  dealbreakers: ['Smoking', 'No Ambition'],
  
  // Desires
  desiresActivities: [
    'Deep conversations',
    'A clean home',
    'Dressing up',
    'Alone time',
    'Lots of time spent together',
    'Tells me "good morning"/"goodnight" everyday'
  ],
  desiresTraits: [
    'Is handy',
    'Is punctual',
    'Is nurturing',
    'Is ambitious'
  ],
  
  // Preferences
  music: ['Pop', 'Rock', 'Jazz'],
  favoriteFoods: ['Italian', 'Sushi', 'Mexican'],
  personality: ['Adventurous', 'Thoughtful', 'Creative']
};

export function UserProfile({ onClose, onOpenMandatory, onOpenUpdate, onOpenDesires, onOpenSecurity, onOpenFilters }: UserProfileProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    identity: false,
    interests: true,
    desires: false,
    preferences: false,
    settings: false,
    filters: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-gray-900 dark:text-gray-100">👤 Your Profile</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-1">How others see you</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-700 dark:to-pink-700 rounded-full flex items-center justify-center">
                <span className="text-4xl">👤</span>
              </div>
            </div>
            <div>
              <h3 className="text-gray-900 dark:text-gray-100">{mockUserProfile.name}</h3>
              <p className="text-gray-600 dark:text-gray-400">{mockUserProfile.age} years old • {mockUserProfile.location}</p>
            </div>
            <p className="text-gray-700 dark:text-gray-300 max-w-md mx-auto">{mockUserProfile.bio}</p>
          </div>

          {/* Identity Section */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection('identity')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <h3 className="text-gray-900 dark:text-gray-100">🆔 Identity</h3>
              {expandedSections.identity ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.identity && (
              <div className="p-4 pt-0 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Gender:</span>
                  <span className="text-gray-900 dark:text-gray-100">{mockUserProfile.gender}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">🎖️ Military:</span>
                  <span className="text-gray-900 dark:text-gray-100">{mockUserProfile.military}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Pronouns:</span>
                  <span className="text-gray-900 dark:text-gray-100">{mockUserProfile.pronouns.join(', ')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">♎ Zodiac:</span>
                  <span className="text-gray-900 dark:text-gray-100">{mockUserProfile.zodiacSign}</span>
                </div>
              </div>
            )}
          </div>

          {/* Interests Section */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection('interests')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <h3 className="text-gray-900 dark:text-gray-100">❤️ Interests</h3>
              {expandedSections.interests ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.interests && (
              <div className="p-4 pt-0 space-y-4">
                {Object.entries(mockUserProfile.interests).map(([category, items]) => (
                  <div key={category}>
                    <h4 className="text-gray-700 dark:text-gray-300 mb-2">{category}:</h4>
                    <div className="flex flex-wrap gap-2">
                      {items.map((item) => {
                        const isMandatory = mockUserProfile.mandatoryInterests.includes(item);
                        return (
                          <span
                            key={item}
                            className={`px-3 py-1 rounded-full ${
                              isMandatory
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-2 border-red-500'
                                : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                            }`}
                          >
                            {item} {isMandatory && '⭐'}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
                
                {mockUserProfile.mandatoryInterests.length > 0 && (
                  <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <p className="text-red-700 dark:text-red-400">⭐ = Mandatory Interest</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desires Section */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection('desires')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <h3 className="text-gray-900 dark:text-gray-100">✨ Desires</h3>
              {expandedSections.desires ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.desires && (
              <div className="p-4 pt-0 space-y-4">
                <div>
                  <h4 className="text-gray-700 dark:text-gray-300 mb-2">I want someone who enjoys:</h4>
                  <div className="flex flex-wrap gap-2">
                    {mockUserProfile.desiresActivities.map((activity) => (
                      <span
                        key={activity}
                        className="px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 rounded-full"
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-gray-700 dark:text-gray-300 mb-2">I want someone who:</h4>
                  <div className="flex flex-wrap gap-2">
                    {mockUserProfile.desiresTraits.map((trait) => (
                      <span
                        key={trait}
                        className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Preferences Section */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection('preferences')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <h3 className="text-gray-900 dark:text-gray-100">🎵 Music & Food</h3>
              {expandedSections.preferences ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.preferences && (
              <div className="p-4 pt-0 space-y-4">
                <div>
                  <h4 className="text-gray-700 dark:text-gray-300 mb-2">Music:</h4>
                  <div className="flex flex-wrap gap-2">
                    {mockUserProfile.music.map((genre) => (
                      <span
                        key={genre}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-gray-700 dark:text-gray-300 mb-2">Favorite Foods:</h4>
                  <div className="flex flex-wrap gap-2">
                    {mockUserProfile.favoriteFoods.map((food) => (
                      <span
                        key={food}
                        className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full"
                      >
                        {food}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Settings Section */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection('settings')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-gray-900 dark:text-gray-100">⚙️ Settings</h3>
              </div>
              {expandedSections.settings ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.settings && (
              <div className="p-4 pt-0">
                <SettingsPanel
                  onOpenMandatory={onOpenMandatory}
                  onOpenUpdate={onOpenUpdate}
                  onOpenDesires={onOpenDesires}
                  onOpenSecurity={onOpenSecurity}
                />
              </div>
            )}
          </div>

          {/* Filters Section */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden">
            <button
              onClick={onOpenFilters}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-gray-900 dark:text-gray-100">🔍 Filters</h3>
              </div>
            </button>
          </div>

          {/* Dealbreakers */}
          {mockUserProfile.dealbreakers.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-xl p-4">
              <h3 className="text-red-900 dark:text-red-100 mb-3">🚫 Dealbreakers</h3>
              <div className="flex flex-wrap gap-2">
                {mockUserProfile.dealbreakers.map((dealbreaker) => (
                  <span
                    key={dealbreaker}
                    className="px-3 py-1 bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-100 rounded-full"
                  >
                    {dealbreaker}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}