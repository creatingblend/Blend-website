import { useState } from 'react';
import { Heart, X, MessageCircle, User, Settings, Crown, Sliders, Users, Lock, Plus, Bell, ChevronDown, ChevronUp } from 'lucide-react';
import { AnimatedLogo } from './AnimatedLogo';
import { InterestsModal } from './InterestsModal';
import { SecurityScreen } from './SecurityScreen';
import { PeerToPeerTab } from './PeerToPeerTab';
import { TutorialsTab } from './TutorialsTab';
import { LocalEventsTab } from './LocalEventsTab';
import { RandomDatingTab } from './RandomDatingTab';
import { FriendsListTab } from './FriendsListTab';
import { UserProfile } from './UserProfile';
import type { Screen } from '../App';
import { hasIncompleteProfile } from '../utils/profileCompletion';

const mockMatches = [
  {
    id: 1,
    name: 'Anonymous User',
    compatibility: 92,
    age: 28,
    location: '3 miles away',
    interests: ['Hiking', 'Photography', 'Cooking'],
    sharedInterests: ['Hiking', 'Photography', 'Cooking'],
    mandatoryInterests: ['Hiking', 'Cooking'],
    bio: 'Love exploring new trails and trying new recipes. Looking for someone who enjoys deep conversations and spontaneous adventures.',
    personality: ['Adventurous', 'Creative', 'Thoughtful'],
    conversationDuration: '2 days',
    revealed: false,
    military: 'Active Duty',
    pronouns: ['They/Them'],
    zodiac: 'Sagittarius ♐',
    wantsToInitiate: true,
    desires: ['Deep conversations 💭', 'Going on walks 🚶', 'Traveling ✈️', 'A clean home 🧹', 'Is ambitious 🎯', 'Is a good listener 👂']
  },
  {
    id: 2,
    name: 'Mystery Match',
    compatibility: 88,
    age: 26,
    location: '5 miles away',
    interests: ['Reading', 'Gaming', 'Movies'],
    sharedInterests: ['Reading', 'Gaming', 'Movies'],
    mandatoryInterests: ['Reading', 'Movies'],
    bio: 'Bookworm by day, gamer by night. Love discussing everything from philosophy to sci-fi.',
    personality: ['Curious', 'Witty', 'Empathetic'],
    conversationDuration: '5 days',
    revealed: false
  },
  {
    id: 3,
    name: 'Secret Admirer',
    compatibility: 85,
    age: 30,
    location: '2 miles away',
    interests: ['Music', 'Fitness', 'Technology'],
    sharedInterests: ['Music', 'Fitness', 'Technology'],
    mandatoryInterests: ['Fitness', 'Technology'],
    bio: 'Tech enthusiast who loves staying active. Always up for a good concert or trying a new restaurant.',
    personality: ['Energetic', 'Passionate', 'Loyal'],
    conversationDuration: '1 week',
    revealed: false
  }
];

// Mock conversation requests - people who liked you and want to chat
const mockConversationRequests = [
  {
    id: 101,
    name: 'Curious Mind',
    compatibility: 91,
    age: 27,
    location: '4 miles away',
    interests: ['Art', 'Travel', 'Yoga'],
    sharedInterests: ['Art', 'Travel', 'Yoga'],
    mandatoryInterests: ['Travel', 'Yoga'],
    bio: 'Artist and traveler seeking meaningful connections. Love exploring new cultures and trying local cuisines.',
    personality: ['Open-minded', 'Adventurous', 'Caring'],
    requestedAt: '2 hours ago'
  },
  {
    id: 102,
    name: 'Tech Explorer',
    compatibility: 86,
    age: 29,
    location: '6 miles away',
    interests: ['Programming', 'Hiking', 'Coffee'],
    sharedInterests: ['Programming', 'Hiking', 'Coffee'],
    mandatoryInterests: ['Programming', 'Coffee'],
    bio: 'Software engineer by day, outdoor enthusiast by weekend. Always seeking the perfect cup of coffee.',
    personality: ['Analytical', 'Friendly', 'Curious'],
    requestedAt: '1 day ago'
  }
];

const predefinedGroups = [
  { id: 1, name: '🍕 Foodies Unite', members: 1247, description: 'Share recipes, restaurant recommendations, and cooking tips', category: 'Food' },
  { id: 2, name: '💪 Fitness Friends', members: 892, description: 'Workout buddies, fitness goals, and healthy living', category: 'Fitness' },
  { id: 3, name: '📚 Book Club', members: 654, description: 'Discuss books, share reading lists, and literary chat', category: 'Reading' },
  { id: 4, name: '💻 Tech Talk', members: 521, description: 'Latest tech news, gadgets, and programming discussions', category: 'Technology' },
  { id: 5, name: '✈️ Travel Enthusiasts', members: 1103, description: 'Share travel stories, tips, and destination recommendations', category: 'Travel' },
  { id: 6, name: '🎵 Music Lovers', members: 789, description: 'Discuss favorite artists, concerts, and music discovery', category: 'Music' },
  { id: 7, name: '🎮 Gamers Lounge', members: 967, description: 'PC, console, and mobile gaming community', category: 'Gaming' },
  { id: 8, name: '🎨 Creative Minds', members: 543, description: 'Art, design, photography, and creative projects', category: 'Arts' },
];

interface MainDashboardProps {
  onNavigate: (screen: Screen, data?: any) => void;
}

export function MainDashboard({ onNavigate }: MainDashboardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'conversations' | 'groups' | 'peer' | 'tutorials' | 'events' | 'random' | 'celebrate' | 'services' | 'friends'>('conversations');
  const [showFilters, setShowFilters] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showInterestsModal, setShowInterestsModal] = useState(false);
  const [showSecurityScreen, setShowSecurityScreen] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [filterReturnToSettings, setFilterReturnToSettings] = useState(false);
  const [maxDistance, setMaxDistance] = useState(50);
  const [minCompatibility, setMinCompatibility] = useState(50);
  const [ageRange, setAgeRange] = useState({ min: 18, max: 99 });
  const [useMetric, setUseMetric] = useState(false); // false = miles, true = km
  const [showAdditionalDetails, setShowAdditionalDetails] = useState(false);
  const [showAllSharedInterests, setShowAllSharedInterests] = useState(false);
  const [viewingNewMatches, setViewingNewMatches] = useState(false);

  // Mock form data - in real app this would come from user context/state
  const mockFormData = {
    name: 'User',
    about: '',
    age: 25,
    gender: 'Woman',
    orientation: ['Men'],
    race: 'White',
    languages: [{ language: 'English' }],
    heightFt: 5,
    heightIn: 6,
    weightLbs: 140,
    exerciseHabits: 'I exercise regularly',
    religion: 'Christian',
    politics: ['Moderate'],
    racePreference: ['No Preference'],
    relationshipGoal: ['Long-term relationship'],
    childrenPreference: ['Want someday'],
    // Missing optional fields to demonstrate incomplete profile
    military: '',
    pronouns: [],
    zodiacSign: '',
    hobbies: {},
    favoriteFoods: [],
    musicPerforming: [],
    musicListening: [],
    moviesTV: [],
    personality: [],
    dealbreakers: [],
    desiresActivities: [],
    desiresTraits: []
  };

  const profileIncomplete = hasIncompleteProfile(mockFormData);

  const currentMatch = mockMatches[currentIndex];
  const hasNewMatches = mockMatches.length > 0;

  const handleLike = () => {
    if (currentIndex < mockMatches.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePass = () => {
    if (currentIndex < mockMatches.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleSaveInterests = (interests: string[]) => {
    console.log('Interests saved:', interests);
    // Here you would typically save to backend
  };

  // If security screen is shown, render it fullscreen
  if (showSecurityScreen) {
    return <SecurityScreen onBack={() => setShowSecurityScreen(false)} />;
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-2 shrink-0 z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-3 items-center">
          {/* Left: Logo */}
          <div className="flex items-center gap-4">
            <AnimatedLogo size="small" autoPlay={false} />
          </div>
          
          {/* Center: B.L.E.N.D */}
          <div className="flex justify-center">
            <span className="text-gray-900 select-all cursor-text hover:bg-purple-100 transition-colors px-2 py-1 rounded">B.L.E.N.D</span>
          </div>
          
          {/* Right: Action Buttons */}
          <div className="flex items-center gap-4 justify-end">
            <button 
              onClick={() => onNavigate('feedback', mockMatches[0])}
              className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              title="Date Feedback (Demo)"
            >
              <MessageCircle className="w-6 h-6" />
            </button>
            <button 
              onClick={() => setShowUserProfile(true)}
              className="w-10 h-10 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex items-center justify-center hover:scale-105 transition-transform relative"
              title="View Your Profile & Settings"
            >
              <span className="text-xl">👤</span>
              {profileIncomplete && (
                <span className="absolute top-0 left-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg m-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <h2 className="text-gray-900">Filter Options</h2>
                <button
                  onClick={() => {
                    setShowFilters(false);
                    if (filterReturnToSettings) {
                      setShowUserProfile(true);
                      setFilterReturnToSettings(false);
                    }
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Distance Filter */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-gray-900">Maximum Distance</label>
                  <span className="text-purple-600">{maxDistance} {useMetric ? 'km' : 'miles'}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="200"
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-gray-500">
                  <span>5 {useMetric ? 'km' : 'miles'}</span>
                  <span>200 {useMetric ? 'km' : 'miles'}</span>
                </div>
              </div>

              {/* Compatibility Filter */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-gray-900">Minimum Compatibility</label>
                  <span className="text-purple-600">{minCompatibility}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={minCompatibility}
                  onChange={(e) => setMinCompatibility(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-gray-500">
                  <span>0%</span>
                  <span>100%</span>
                </div>
                {minCompatibility > 80 && (
                  <p className="text-amber-600">⚠️ High threshold may limit matches</p>
                )}
                {minCompatibility < 30 && (
                  <p className="text-amber-600">⚠️ Low threshold may show less compatible matches</p>
                )}
              </div>

              {/* Age Range Filter */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-gray-900">Age Range</label>
                  <span className="text-purple-600">{ageRange.min} - {ageRange.max}</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="18"
                    max="99"
                    value={ageRange.min}
                    onChange={(e) => setAgeRange({ ...ageRange, min: Number(e.target.value) })}
                    className="w-1/2 h-8 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600 px-2"
                  />
                  <input
                    type="number"
                    min="18"
                    max="99"
                    value={ageRange.max}
                    onChange={(e) => setAgeRange({ ...ageRange, max: Number(e.target.value) })}
                    className="w-1/2 h-8 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600 px-2"
                  />
                </div>
              </div>

              {/* Metric System */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-gray-900">Distance Unit</label>
                  <span className="text-purple-600">{useMetric ? 'km' : 'miles'}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setUseMetric(false)}
                    className={`w-1/2 h-8 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600 px-2 ${
                      !useMetric ? 'bg-purple-600 text-white' : ''
                    }`}
                  >
                    Miles
                  </button>
                  <button
                    onClick={() => setUseMetric(true)}
                    className={`w-1/2 h-8 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600 px-2 ${
                      useMetric ? 'bg-purple-600 text-white' : ''
                    }`}
                  >
                    km
                  </button>
                </div>
              </div>

              {/* Apply Button */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowFilters(false);
                    if (filterReturnToSettings) {
                      setShowUserProfile(true);
                      setFilterReturnToSettings(false);
                    }
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 overflow-x-auto shrink-0 z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-6 min-w-max pr-6">
            <button
              onClick={() => { setActiveTab('conversations'); setViewingNewMatches(false); }}
              className={`py-4 border-b-2 transition-colors whitespace-nowrap relative ${
                activeTab === 'conversations'
                  ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Conversations
              {mockConversationRequests.length > 0 && (
                <span className="absolute -top-1 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                  {mockConversationRequests.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('groups')}
              className={`py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'groups'
                  ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Groups
            </button>
            <button
              onClick={() => setActiveTab('random')}
              className={`py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'random'
                  ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Random Chat
            </button>
            <button
              onClick={() => setActiveTab('friends')}
              className={`py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'friends'
                  ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Friends List
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'events'
                  ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Local Events
            </button>
            <button
              onClick={() => setActiveTab('celebrate')}
              className={`py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'celebrate'
                  ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Celebrate 🎉
            </button>
            <button
              onClick={() => setActiveTab('peer')}
              className={`py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'peer'
                  ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Peer-to-Peer
            </button>
            <button
              onClick={() => setActiveTab('tutorials')}
              className={`py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'tutorials'
                  ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Tutorials
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'services'
                  ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Services 🤝
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Left: Main Content */}
          <div>
          {activeTab === 'conversations' ? (
            <div className="max-w-4xl mx-auto">
              {/* Conversation Requests Section */}
              {mockConversationRequests.length > 0 && !viewingNewMatches && (
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Bell className="w-6 h-6 text-purple-600" />
                    <div>
                      <h2 className="text-gray-900 dark:text-gray-100 text-xl font-bold">Conversation Requests</h2>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">People who want to chat with you</p>
                    </div>
                  </div>
                  
                  <div className="grid gap-4">
                    {mockConversationRequests.map((request) => (
                      <div key={request.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center relative">
                        <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                          <span className="text-3xl">👤</span>
                        </div>
                        
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg mb-1">{request.name}</h3>
                        
                        <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1 mb-6 w-full">
                          <p className="font-medium text-purple-600 dark:text-purple-400">{request.compatibility}% Compatible</p>
                          <div className="flex items-center justify-center gap-2">
                             <span>{request.age}y/o</span>
                             <span>•</span>
                             <span>{request.location}</span>
                          </div>
                        </div>

                        <button 
                          onClick={() => onNavigate('profile', { ...request, isConversationRequest: true })}
                          className="px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium w-full"
                        >
                          View Profile
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Check New Matches Button */}
              {!viewingNewMatches && (
                <div className="mb-8">
                  <button
                    onClick={() => hasNewMatches && setViewingNewMatches(true)}
                    disabled={!hasNewMatches}
                    className={`w-full py-4 rounded-xl shadow-sm border transition-all flex items-center justify-center gap-2 font-semibold ${
                      hasNewMatches
                        ? 'bg-purple-600 text-white border-purple-600 hover:bg-purple-700 shadow-md'
                        : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    }`}
                  >
                    <span className="text-xl">✨</span>
                    Check New Potential Matches
                    {hasNewMatches && (
                      <span className="bg-white text-purple-600 text-xs px-2 py-0.5 rounded-full ml-2">
                        {mockMatches.length}
                      </span>
                    )}
                  </button>
                </div>
              )}

              {/* New Matches Content (formerly 'new' tab) */}
              {viewingNewMatches ? (
                <div className="max-w-md mx-auto relative">
                  <button 
                    onClick={() => setViewingNewMatches(false)}
                    className="absolute -top-12 left-0 text-purple-600 hover:text-purple-700 flex items-center gap-1 font-medium"
                  >
                    ← Back to Conversations
                  </button>
                  
                  {/* Match Card */}
                  <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    {/* Compatibility Badge */}
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
                      <div className="flex items-center justify-between mb-4">
                        <span>Compatibility Match</span>
                        <span className="text-3xl">{currentMatch.compatibility}%</span>
                      </div>
                      <div className="w-full bg-white/30 rounded-full h-2">
                        <div
                          className="bg-white rounded-full h-2 transition-all"
                          style={{ width: `${currentMatch.compatibility}%` }}
                        />
                      </div>
                    </div>

                    {/* Profile Info */}
                    <div className="p-6 space-y-6">
                      {/* Mystery Avatar */}
                      <div className="flex justify-center">
                        <div className="w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex items-center justify-center">
                          <User className="w-16 h-16 text-purple-600" />
                        </div>
                      </div>

                      {/* Basic Info */}
                      <div className="text-center space-y-2">
                        <h2 className="text-gray-900">{currentMatch.name}</h2>
                        <p className="text-gray-600">{currentMatch.age} years old • {currentMatch.location}</p>
                        {currentMatch.wantsToInitiate && (
                          <p className="text-purple-600 font-semibold">💌 Wants to initiate conversation with you</p>
                        )}
                        <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-600 mt-2">
                          {currentMatch.military && (
                            <span className="bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                              🪖 {currentMatch.military}
                            </span>
                          )}
                          {currentMatch.pronouns && currentMatch.pronouns.length > 0 && (
                            <span className="bg-green-50 px-3 py-1 rounded-full border border-green-200">
                              {currentMatch.pronouns.join(', ')}
                            </span>
                          )}
                          {currentMatch.zodiac && (
                            <span className="bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                              {currentMatch.zodiac}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Shared Interests */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-gray-900">Shared Interests</h3>
                          {currentMatch.sharedInterests.length > (currentMatch.mandatoryInterests?.length || 3) && (
                            <button
                              onClick={() => setShowAllSharedInterests(!showAllSharedInterests)}
                              className="text-purple-600 hover:text-purple-700 transition-colors flex items-center gap-1"
                            >
                              {showAllSharedInterests ? (
                                <>
                                  <ChevronUp className="w-4 h-4" />
                                  <span className="text-sm">Show Less</span>
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-4 h-4" />
                                  <span className="text-sm">Show More</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(showAllSharedInterests 
                            ? currentMatch.sharedInterests 
                            : currentMatch.mandatoryInterests || currentMatch.sharedInterests.slice(0, 3)
                          ).map((interest) => (
                            <span
                              key={interest}
                              className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full border border-purple-200"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Bio */}
                      <div className="space-y-2">
                        <h3 className="text-gray-900">About</h3>
                        <p className="text-gray-600">{currentMatch.bio}</p>
                      </div>

                      {/* Desires */}
                      {currentMatch.desires && currentMatch.desires.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="text-gray-900">What They're Looking For</h3>
                            <button
                              onClick={() => setShowAdditionalDetails(!showAdditionalDetails)}
                              className="text-purple-600 hover:text-purple-700 transition-colors flex items-center gap-1"
                            >
                              {showAdditionalDetails ? (
                                <>
                                  <ChevronUp className="w-4 h-4" />
                                  <span className="text-sm">Show Less</span>
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-4 h-4" />
                                  <span className="text-sm">Show More</span>
                                </>
                              )}
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {currentMatch.desires.slice(0, showAdditionalDetails ? undefined : 4).map((desire) => (
                              <span
                                key={desire}
                                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full"
                              >
                                {desire}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-center gap-6 mt-8">
                    <button
                      onClick={handlePass}
                      className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <X className="w-8 h-8 text-red-500" />
                    </button>
                    <button
                      onClick={handleLike}
                      className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <Heart className="w-10 h-10 text-white fill-white" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Active Conversations List (placeholder for now as user just asked to move 'new' here) */
                <div className="space-y-4">
                  {/* Existing conversations would go here */}
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl text-center">
                    <p className="text-purple-800 dark:text-purple-300">
                      Your active conversations will appear here.
                      <br/>
                      Check potential matches to start connecting!
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === 'groups' ? (
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-gray-900 dark:text-gray-100 font-bold text-2xl">Interest Groups</h2>
                  <p className="text-gray-600 dark:text-gray-400">Join communities based on your passions</p>
                </div>
                <button
                  onClick={() => setShowCreateGroupModal(true)}
                  className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create Group
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {predefinedGroups.map((group) => (
                  <div key={group.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-2xl">
                        {group.name.split(' ')[0]}
                      </div>
                      <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-xs">
                        {group.members} members
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{group.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{group.description}</p>
                    <button className="w-full py-2 border-2 border-purple-600 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                      Join Group
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'peer' ? (
            <PeerToPeerTab onShowPremium={() => setShowPremiumModal(true)} />
          ) : activeTab === 'tutorials' ? (
            <TutorialsTab onShowPremium={() => setShowPremiumModal(true)} />
          ) : activeTab === 'events' ? (
            <LocalEventsTab onShowPremium={() => setShowPremiumModal(true)} />
          ) : activeTab === 'random' ? (
            <RandomDatingTab onNavigate={onNavigate} />
          ) : activeTab === 'celebrate' ? (
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <h2 className="text-gray-900 dark:text-gray-100">Celebrate 🎉</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Share your milestones and celebrate success stories</p>
              </div>

              <div className="space-y-4">
                {/* Example celebration posts */}
                {[
                  { 
                    id: 1, 
                    type: 'Milestone 🎯',
                    user: 'Anonymous User',
                    content: 'Just had my first successful date from the app! Thank you B.L.E.N.D for helping me connect with amazing people!',
                    likes: 47,
                    timestamp: '2 hours ago'
                  },
                  { 
                    id: 2, 
                    type: 'Engagement 💍',
                    user: 'Happy Couple',
                    content: 'We met on B.L.E.N.D 6 months ago, and today I said YES! Personality-first dating really works!',
                    likes: 203,
                    timestamp: '1 day ago'
                  },
                  { 
                    id: 3, 
                    type: 'Birthday 🎂',
                    user: 'Celebrating Life',
                    content: 'Celebrating my birthday with someone I met here. Grateful for meaningful connections!',
                    likes: 89,
                    timestamp: '3 days ago'
                  },
                  { 
                    id: 4, 
                    type: 'Success Story ✨',
                    user: 'Found My Person',
                    content: 'After years of superficial dating apps, B.L.E.N.D helped me find someone who truly gets me. One year anniversary today!',
                    likes: 156,
                    timestamp: '5 days ago'
                  }
                ].map((post) => (
                  <div key={post.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-purple-600 dark:text-purple-300" />
                        </div>
                        <div>
                          <h3 className="text-gray-900 dark:text-gray-100 font-semibold">{post.user}</h3>
                          <p className="text-gray-500 text-sm">{post.timestamp}</p>
                        </div>
                      </div>
                      <span className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-sm">
                        {post.type}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{post.content}</p>
                    <button className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
                      <Heart className="w-5 h-5" />
                      <span>{post.likes} likes</span>
                    </button>
                  </div>
                ))}
              </div>

              <button className="mt-6 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-full hover:opacity-90 transition-opacity">
                Share Your Story 📝
              </button>
            </div>
          ) : activeTab === 'services' ? (
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <h2 className="text-gray-900 dark:text-gray-100">Mental Health & Wellness Services 🤝</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Professional support for your wellbeing journey</p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6 mb-6">
                <h3 className="text-blue-900 dark:text-blue-300 font-semibold mb-2">💙 You're Not Alone</h3>
                <p className="text-blue-700 dark:text-blue-400">
                  Dating and relationships can be challenging. We've partnered with licensed professionals to provide support when you need it.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    id: 1,
                    title: 'Relationship Counseling',
                    icon: '💑',
                    description: 'Professional guidance for building healthy relationships',
                    provider: 'Licensed Therapists',
                    availability: 'Available 24/7'
                  },
                  {
                    id: 2,
                    title: 'Anxiety & Stress Management',
                    icon: '🧘',
                    description: 'Techniques and support for managing dating anxiety',
                    provider: 'Mental Health Specialists',
                    availability: 'Online & In-Person'
                  },
                  {
                    id: 3,
                    title: 'Self-Esteem & Confidence',
                    icon: '✨',
                    description: 'Build confidence in yourself and your relationships',
                    provider: 'Life Coaches',
                    availability: 'Group & Individual Sessions'
                  },
                  {
                    id: 4,
                    title: 'Communication Skills',
                    icon: '💬',
                    description: 'Learn effective communication for meaningful connections',
                    provider: 'Relationship Experts',
                    availability: 'Workshops Available'
                  },
                  {
                    id: 5,
                    title: 'Grief & Loss Support',
                    icon: '💔',
                    description: 'Compassionate support for processing relationship endings',
                    provider: 'Grief Counselors',
                    availability: 'Available Now'
                  },
                  {
                    id: 6,
                    title: 'Crisis Support Hotline',
                    icon: '🆘',
                    description: 'Immediate help when you need it most',
                    provider: 'Crisis Specialists',
                    availability: '24/7 Hotline'
                  }
                ].map((service) => (
                  <div key={service.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-4xl mb-3">{service.icon}</div>
                    <h3 className="text-gray-900 dark:text-gray-100 font-semibold mb-2">{service.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm">{service.description}</p>
                    <div className="space-y-2 mb-4">
                      <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">{service.provider}</p>
                      <p className="text-green-600 dark:text-green-400 text-sm">{service.availability}</p>
                    </div>
                    <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full hover:opacity-90 transition-opacity">
                      Learn More
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-2xl p-6">
                <h3 className="text-amber-900 dark:text-amber-300 font-semibold mb-2">🔒 Confidential & Secure</h3>
                <p className="text-amber-700 dark:text-amber-400">
                  All services are completely confidential and provided by licensed professionals. Your privacy and wellbeing are our top priorities.
                </p>
              </div>
            </div>
          ) : activeTab === 'friends' ? (
            <FriendsListTab onNavigate={onNavigate} />
          ) : null}
          </div>
        </div>
      </div>

      {/* Premium Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crown className="w-6 h-6 text-white" />
            <div>
              <p className="text-white">Unlock Premium Features</p>
              <p className="text-amber-100">Advanced filters, exclusive games, dating tutorials & more</p>
            </div>
          </div>
          <button className="bg-white text-orange-600 px-6 py-2 rounded-full hover:bg-amber-50 transition-colors">
            Upgrade
          </button>
        </div>
      </div>

      {/* Premium Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg max-w-md mx-4">
            <h2 className="text-gray-900 dark:text-gray-100">Premium Feature</h2>
            <p className="text-gray-600 dark:text-gray-400 my-4">This is a premium feature. Upgrade to unlock full access to B.L.E.N.D!</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPremiumModal(false)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowPremiumModal(false)}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
              >
                Upgrade
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-900 dark:text-gray-100">Create Your Own Group</h2>
              <button
                onClick={() => setShowCreateGroupModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-purple-900 dark:text-purple-300">Group Creation Fee</span>
                  <span className="text-purple-600 dark:text-purple-400">$3.99</span>
                </div>
                <p className="text-purple-700 dark:text-purple-400">One-time fee to create your own custom group</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-gray-900 dark:text-gray-100 block mb-2">Group Name</label>
                  <input
                    type="text"
                    placeholder="Enter group name..."
                    className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-xl focus:border-purple-600 outline-none"
                  />
                </div>

                <div>
                  <label className="text-gray-900 dark:text-gray-100 block mb-2">Description</label>
                  <textarea
                    placeholder="What's your group about?"
                    className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-xl focus:border-purple-600 outline-none h-24 resize-none"
                  />
                </div>

                <div>
                  <label className="text-gray-900 dark:text-gray-100 block mb-2">Category</label>
                  <select className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-xl focus:border-purple-600 outline-none">
                    <option>Select a category...</option>
                    <option>🍕 Food & Dining</option>
                    <option>💪 Fitness & Health</option>
                    <option>📚 Books & Reading</option>
                    <option>💻 Technology</option>
                    <option>✈️ Travel</option>
                    <option>🎵 Music</option>
                    <option>🎮 Gaming</option>
                    <option>🐾 Pets</option>
                    <option>✨ Other</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateGroupModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowCreateGroupModal(false);
                    setShowPremiumModal(true);
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:opacity-90 transition-opacity"
                >
                  Create for $3.99
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interests Modal */}
      {showInterestsModal && (
        <InterestsModal
          onSave={handleSaveInterests}
          onClose={() => setShowInterestsModal(false)}
        />
      )}

      {/* User Profile Modal */}
      {showUserProfile && (
        <UserProfile 
          onClose={() => setShowUserProfile(false)}
          onOpenSecurity={() => {
            setShowUserProfile(false);
            setShowSecurityScreen(true);
          }}
          onOpenFilters={() => {
            setShowUserProfile(false);
            setFilterReturnToSettings(true);
            setShowFilters(true);
          }}
        />
      )}
    </div>
  );
}