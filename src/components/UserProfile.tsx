import { X, ChevronDown, ChevronUp, Settings, Sliders, Pencil, HelpCircle, Shield, PauseCircle, AlertTriangle, Moon, Sun, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AvatarBuilder, AvatarConfig } from './AvatarBuilder';
import { SignUpFlow } from './SignUpFlow';
import { calculateProfileCompletion } from '../utils/profileCompletion';

interface UserProfileProps {
  onClose: () => void;
  onOpenSecurity: () => void;
  onOpenFilters: () => void;
}

// Mock user data
const mockUserProfile = {
  name: 'You',
  age: 28,
  location: '5 miles away',
  compatibility: 95,
  bio: 'Looking for meaningful connections based on shared interests and values.',
  
  gender: 'Woman',
  military: 'No Service',
  pronouns: ['She/Her'],
  zodiacSign: 'Libra',
  
  interests: {
    'Movies & TV': ['Foreign Film', 'Documentaries', 'Comedy'],
    'Outdoor': ['Outdoor Games', 'Corn Hole', 'Horse Shoes', 'Hiking'],
    'Creative': ['Social Media Content Creator', 'Photography'],
    'Learning': ['Higher Education', 'Reading'],
    'Technology': ['Finance/Crypto', 'Programming'],
    'Social': ['Church', 'Volunteering'],
    'Sports': ['Basketball', 'Swimming'],
    'Gaming': ['Video Games', 'Board Games'],
    'Pets': ['Dogs', 'Cats']
  },
  
  mandatoryInterests: ['Higher Education', 'Church'],
  dealbreakers: ['Smoking', 'No Ambition'],
  
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
  
  music: ['Pop', 'Rock', 'Jazz'],
  favoriteFoods: ['Italian', 'Sushi', 'Mexican'],
  personality: ['Adventurous', 'Thoughtful', 'Creative']
};

export function UserProfile({ onClose, onOpenSecurity, onOpenFilters }: UserProfileProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    identity: false,
    interests: false,
    whatIWant: false,
    filters: false,
    account: false
  });

  const [editConfig, setEditConfig] = useState<{ initialStep: number; endStep: number } | null>(null);
  const [showAvatarBuilder, setShowAvatarBuilder] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [showSuspendConfirm, setShowSuspendConfirm] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState<AvatarConfig | undefined>();

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      // Create a new state where all sections are closed
      const newState = Object.keys(prev).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {} as Record<string, boolean>);
      
      // Toggle the target section
      // If it was open (true), it becomes closed (false) because all are set to false above and we don't change it
      // If it was closed (false), we set it to true
      if (!prev[section]) {
        newState[section] = true;
      }
      
      return newState;
    });
  };

  const handleSaveAvatar = (avatar: AvatarConfig) => {
    setCurrentAvatar(avatar);
    setShowAvatarBuilder(false);
  };

  const handleDeactivate = () => {
    console.log("Account deactivated");
    setShowDeactivateConfirm(false);
  };

  const handleSuspend = () => {
    console.log("Account suspended");
    setShowSuspendConfirm(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {editConfig && (
        <div className="fixed inset-0 z-[60] bg-white dark:bg-gray-900 overflow-y-auto">
           <div className="relative min-h-screen">
             <button 
                onClick={() => setEditConfig(null)}
                className="absolute top-4 right-4 z-50 p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
             >
                <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
             </button>
             <SignUpFlow 
                initialStep={editConfig.initialStep}
                endStep={editConfig.endStep}
                mode="edit"
                onComplete={() => setEditConfig(null)}
             />
           </div>
        </div>
      )}
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
        </div>

        <div className="p-6 space-y-6">
          {/* Profile Header & Avatar */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-700 dark:to-pink-700 rounded-full flex items-center justify-center cursor-pointer" onClick={() => setShowAvatarBuilder(true)}>
                   <User className="w-12 h-12 text-purple-600 dark:text-purple-300" />
                </div>
                <button 
                  onClick={() => setShowAvatarBuilder(true)}
                  className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600"
                >
                  <Pencil className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-gray-900 dark:text-gray-100">{mockUserProfile.name}</h3>
              <p className="text-gray-600 dark:text-gray-400">{mockUserProfile.age} years old • {mockUserProfile.location}</p>
            </div>
            <p className="text-gray-700 dark:text-gray-300 max-w-md mx-auto">{mockUserProfile.bio}</p>
          </div>

          {/* Profile Completion Section */}
          {(() => {
            const mockFormData = {
              name: 'You',
              about: mockUserProfile.bio,
              age: mockUserProfile.age,
              gender: mockUserProfile.gender,
              orientation: ['Men'],
              race: 'White',
              military: mockUserProfile.military,
              pronouns: mockUserProfile.pronouns,
              zodiacSign: mockUserProfile.zodiacSign,
              languages: [{ language: 'English' }],
              heightFt: 5 as number | '',
              heightIn: 6 as number | '',
              weightLbs: 140 as number | '',
              exerciseHabits: 'I exercise regularly',
              religion: 'Christian',
              politics: ['Moderate'],
              racePreference: ['No Preference'],
              relationshipGoal: ['Long-term relationship'],
              marriageDesire: '',
              childrenPreference: ['Want someday'],
              heightPreference: [] as string[],
              bodyTypePreference: [] as string[],
              hobbies: mockUserProfile.interests,
              favoriteFoods: mockUserProfile.favoriteFoods,
              musicPerforming: [] as string[],
              musicListening: mockUserProfile.music,
              moviesTV: mockUserProfile.interests['Movies & TV'] || [],
              personality: mockUserProfile.personality,
              dealbreakers: mockUserProfile.dealbreakers,
              desiresActivities: mockUserProfile.desiresActivities,
              desiresTraits: mockUserProfile.desiresTraits
            };
            
            const completion = calculateProfileCompletion(mockFormData);
            
            return (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-700 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-purple-900 dark:text-purple-100 font-semibold">Profile Completion</h4>
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{completion.percentage}%</span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-3 mb-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-pink-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${completion.percentage}%` }}
                  />
                </div>
                
                <p className="text-purple-700 dark:text-purple-300 text-sm mb-2">
                  {completion.percentage < 100 ? (
                    <>
                      <strong>💡 Tip:</strong> You're more likely to have meaningful matches if you complete your profile!
                    </>
                  ) : (
                    <>
                      <strong>🎉 Amazing!</strong> Your profile is complete!
                    </>
                  )}
                </p>
                
                {completion.percentage < 100 && (
                  <details className="text-sm text-purple-600 dark:text-purple-400 cursor-pointer">
                    <summary className="hover:underline">See what's missing</summary>
                    <div className="mt-2 space-y-1">
                      {completion.missingMandatory.length > 0 && (
                        <div className="pl-3">
                          <p className="font-semibold text-red-600 dark:text-red-400">Required:</p>
                          <ul className="list-disc list-inside pl-2">
                            {completion.missingMandatory.map(field => (
                              <li key={field}>{field}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {completion.missingOptional.length > 0 && (
                        <div className="pl-3">
                          <p className="font-semibold">Optional:</p>
                          <ul className="list-disc list-inside pl-2">
                            {completion.missingOptional.slice(0, 5).map(field => (
                              <li key={field}>{field}</li>
                            ))}
                            {completion.missingOptional.length > 5 && (
                              <li>...and {completion.missingOptional.length - 5} more</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </details>
                )}
              </div>
            );
          })()}

          {/* Identity Section */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection('identity')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <h3 className="text-gray-900 dark:text-gray-100">🆔 Identity</h3>
              {expandedSections.identity ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </button>
            {expandedSections.identity && (
              <div className="p-4 pt-0 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Gender:</span>
                  <span className="text-gray-900 dark:text-gray-100">{mockUserProfile.gender}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Military:</span>
                  <span className="text-gray-900 dark:text-gray-100">{mockUserProfile.military}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Pronouns:</span>
                  <span className="text-gray-900 dark:text-gray-100">{mockUserProfile.pronouns.join(', ')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Zodiac:</span>
                  <span className="text-gray-900 dark:text-gray-100">{mockUserProfile.zodiacSign}</span>
                </div>
                <button
                  onClick={() => setEditConfig({ initialStep: 0, endStep: 6 })}
                  className="w-full mt-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Pencil className="w-4 h-4" /> Update Mandatory Interests
                </button>
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
              {expandedSections.interests ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </button>
            {expandedSections.interests && (
              <div className="p-4 pt-0 space-y-4">
                {/* Hobbies */}
                {Object.entries(mockUserProfile.interests).map(([category, items]) => (
                  <div key={category}>
                    <h4 className="text-gray-700 dark:text-gray-300 mb-2">{category}:</h4>
                    <div className="flex flex-wrap gap-2">
                      {items.map((item) => {
                        const isMandatory = mockUserProfile.mandatoryInterests.includes(item);
                        return (
                          <span key={item} className={`px-3 py-1 rounded-full ${isMandatory ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-2 border-red-500' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'}`}>
                            {item} {isMandatory && '⭐'}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
                
                {/* Music & Food (Merged) */}
                <div>
                  <h4 className="text-gray-700 dark:text-gray-300 mb-2">Music:</h4>
                  <div className="flex flex-wrap gap-2">
                    {mockUserProfile.music.map((genre) => (
                      <span key={genre} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">{genre}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-gray-700 dark:text-gray-300 mb-2">Favorite Foods:</h4>
                  <div className="flex flex-wrap gap-2">
                    {mockUserProfile.favoriteFoods.map((food) => (
                      <span key={food} className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">{food}</span>
                    ))}
                  </div>
                </div>

                {/* Dealbreakers (Merged) */}
                {mockUserProfile.dealbreakers.length > 0 && (
                  <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-xl p-4">
                    <h4 className="text-red-900 dark:text-red-100 mb-2">🚫 Dealbreakers</h4>
                    <div className="flex flex-wrap gap-2">
                      {mockUserProfile.dealbreakers.map((dealbreaker) => (
                        <span key={dealbreaker} className="px-3 py-1 bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-100 rounded-full">{dealbreaker}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                <button
                  onClick={() => setEditConfig({ initialStep: 7, endStep: 9 })}
                  className="w-full mt-2 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Pencil className="w-4 h-4" /> Update Interests
                </button>
              </div>
            )}
          </div>

          {/* What I Want Section */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection('whatIWant')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <h3 className="text-gray-900 dark:text-gray-100">💭 What I Want</h3>
              {expandedSections.whatIWant ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </button>
            {expandedSections.whatIWant && (
              <div className="p-4 pt-0 space-y-4">
                <div>
                  <h4 className="text-gray-700 dark:text-gray-300 mb-2">I want someone who enjoys:</h4>
                  <div className="flex flex-wrap gap-2">
                    {mockUserProfile.desiresActivities.map((activity) => (
                      <span key={activity} className="px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 rounded-full">{activity}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-gray-700 dark:text-gray-300 mb-2">I want someone who:</h4>
                  <div className="flex flex-wrap gap-2">
                    {mockUserProfile.desiresTraits.map((trait) => (
                      <span key={trait} className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full">{trait}</span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setEditConfig({ initialStep: 10, endStep: 10 })}
                  className="w-full mt-2 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Pencil className="w-4 h-4" /> Update What I Want
                </button>
              </div>
            )}
          </div>

          {/* Filters Section */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection('filters')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <h3 className="text-gray-900 dark:text-gray-100">🔍 Filters</h3>
              {expandedSections.filters ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </button>
            {expandedSections.filters && (
              <div className="p-4 pt-0 space-y-4">
                 {/* Light/Dark Mode */}
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    {darkMode ? <Moon className="w-5 h-5 text-purple-600 dark:text-purple-400" /> : <Sun className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
                    <span className="text-gray-700 dark:text-gray-300">Light / Dark Mode</span>
                  </div>
                  <button
                    onClick={toggleDarkMode}
                    className={`relative w-12 h-6 rounded-full transition-colors ${darkMode ? "bg-purple-600" : "bg-gray-300"}`}
                  >
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${darkMode ? "translate-x-6" : ""}`} />
                  </button>
                </div>

                <button
                  onClick={onOpenFilters}
                  className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Sliders className="w-4 h-4" /> Manage Search Filters
                </button>
              </div>
            )}
          </div>

          {/* Account Section */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden">
             <button
              onClick={() => toggleSection('account')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <h3 className="text-gray-900 dark:text-gray-100">⚙️ Account</h3>
              {expandedSections.account ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </button>
            {expandedSections.account && (
              <div className="p-4 pt-0 space-y-3">
                 <button onClick={() => setShowHelp(true)} className="w-full flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-left transition-colors">
                    <HelpCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <span className="text-gray-700 dark:text-gray-300">Help</span>
                 </button>
                 <button onClick={onOpenSecurity} className="w-full flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-left transition-colors">
                    <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <span className="text-gray-700 dark:text-gray-300">Update Security</span>
                 </button>
                 <button onClick={() => setShowSuspendConfirm(true)} className="w-full flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg text-left transition-colors">
                    <PauseCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    <span className="text-amber-600 dark:text-amber-400">Suspend Account</span>
                 </button>
                 <button onClick={() => setShowDeactivateConfirm(true)} className="w-full flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg text-left transition-colors">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <span className="text-red-600 dark:text-red-400">Deactivate Account</span>
                 </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Avatar Builder Modal */}
      {showAvatarBuilder && (
        <AvatarBuilder
          onClose={() => setShowAvatarBuilder(false)}
          onSave={handleSaveAvatar}
          currentAvatar={currentAvatar}
        />
      )}

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
             <div className="p-6">
              <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-gray-900">Help & FAQ</h2>
                <button onClick={() => setShowHelp(false)} className="text-gray-400 hover:text-gray-600 transition-colors">×</button>
              </div>
              {/* Help Content (Simplified for brevity) */}
              <div className="space-y-4 text-gray-600">
                <p><strong>How does B.L.E.N.D work?</strong><br/>Personality-first dating based on shared interests.</p>
                <p><strong>Compatibility Score?</strong><br/>Calculated based on interests and values.</p>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button onClick={() => setShowHelp(false)} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Modal */}
      {showSuspendConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-gray-900 dark:text-gray-100 text-xl font-bold mb-4">⏸️ Suspend Account?</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Temporarily hide your profile. You can reactivate anytime.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowSuspendConfirm(false)} className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">Cancel</button>
              <button onClick={handleSuspend} className="flex-1 px-6 py-3 bg-amber-600 text-white rounded-full">Suspend</button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Modal */}
      {showDeactivateConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-gray-900 dark:text-gray-100 text-xl font-bold mb-4">⚠️ Deactivate Account?</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Your data will be permanently deleted after 30 days.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeactivateConfirm(false)} className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">Cancel</button>
              <button onClick={handleDeactivate} className="flex-1 px-6 py-3 bg-red-600 text-white rounded-full">Deactivate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}