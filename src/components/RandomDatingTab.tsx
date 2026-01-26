import { Shuffle, MessageCircle, Clock, UserPlus } from 'lucide-react';
import { useState, useEffect } from 'react';

interface RandomDatingTabProps {
  onNavigate: (screen: any, data?: any) => void;
  onSaveToFriendsList?: (matchId: number) => void;
}

type MatchStatus = 'idle' | 'searching' | 'matched' | 'timeout' | 'chatting';

const mockMatch = {
  id: 101,
  name: 'Anonymous Match',
  compatibility: 85,
  age: 28,
  location: 'Downtown (3 miles away)',
  interests: ['Photography', 'Travel', 'Cooking'],
  sharedInterests: ['Photography', 'Travel', 'Cooking'],
  mandatoryInterests: ['Photography', 'Travel'],
  bio: 'Love exploring new places and trying new foods. Looking for someone who enjoys spontaneous adventures.',
  personality: ['Adventurous', 'Creative', 'Thoughtful'],
  conversationDuration: '0 days',
  revealed: false
};

export function RandomDatingTab({ onNavigate, onSaveToFriendsList }: RandomDatingTabProps) {
  const [status, setStatus] = useState<MatchStatus>('idle');
  const [pairWithAnyone, setPairWithAnyone] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [userAccepted, setUserAccepted] = useState(false);
  const [friendRequestSent, setFriendRequestSent] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (status === 'matched' && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (status === 'matched' && timeRemaining === 0) {
      // Timer expired
      if (userAccepted) {
        // User accepted but match didn't - go back to searching
        setStatus('searching');
        setTimeout(() => {
          setStatus('matched');
          setTimeRemaining(60);
          setUserAccepted(false);
        }, 1500);
      } else {
        // User didn't accept - kicked out
        setStatus('timeout');
      }
    }
  }, [status, timeRemaining, userAccepted]);

  const handleShuffle = () => {
    setStatus('searching');
    // Simulate finding a match
    setTimeout(() => {
      setStatus('matched');
      setTimeRemaining(60);
      setUserAccepted(false);
      setFriendRequestSent(false);
    }, 2000);
  };

  const handleStartChatting = () => {
    setUserAccepted(true);
    // Simulate the other person accepting
    setTimeout(() => {
      setStatus('chatting');
      onNavigate('chat', mockMatch);
    }, 1000);
  };

  const handleSaveToFriends = () => {
    setFriendRequestSent(true);
    if (onSaveToFriendsList) {
      onSaveToFriendsList(mockMatch.id);
    }
  };

  // Calculate circle progress for timer
  const circleProgress = (timeRemaining / 60) * 100;

  if (status === 'chatting') {
    return null; // Will navigate to chat
  }

  return (
    <div className="max-w-2xl mx-auto">
      {status === 'idle' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-gray-900 dark:text-gray-100">⚡ Random Conversations</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Connect with anyone randomly - dating or just making friends!
            </p>
          </div>

          {/* Pair With Anyone Toggle */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-900 dark:text-gray-100">Pair With Anyone 🌈</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Match regardless of dating preferences (great for making friends!)
                </p>
              </div>
              <button
                onClick={() => setPairWithAnyone(!pairWithAnyone)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  pairWithAnyone ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    pairWithAnyone ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            {pairWithAnyone && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  💡 You'll be matched with anyone - two straight men could chat, anyone can make friends!
                </p>
              </div>
            )}
          </div>

          {!pairWithAnyone && (
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
              <p className="text-purple-700 dark:text-purple-300 text-sm">
                ℹ️ With "Pair With Anyone" off, you'll only match with people based on your dating preferences
              </p>
            </div>
          )}

          {/* Shuffle Button */}
          <button
            onClick={handleShuffle}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <Shuffle className="w-5 h-5" />
            Start Random Matching
          </button>
        </div>
      )}

      {status === 'searching' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 flex flex-col items-center justify-center space-y-4">
          <Shuffle className="w-16 h-16 text-purple-600 dark:text-purple-400 animate-spin" />
          <h3 className="text-gray-900 dark:text-gray-100">Finding your match...</h3>
          <p className="text-gray-600 dark:text-gray-400">This will only take a moment</p>
        </div>
      )}

      {status === 'matched' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
          {/* Timer Display */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-32 h-32">
              {/* Background circle */}
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-200 dark:text-gray-700"
                />
                {/* Progress circle */}
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - circleProgress / 100)}`}
                  className="text-purple-600 dark:text-purple-400 transition-all duration-1000"
                  strokeLinecap="round"
                />
              </svg>
              {/* Timer text in center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Clock className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-1" />
                <span className="text-gray-900 dark:text-gray-100">{timeRemaining}s</span>
              </div>
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-gray-900 dark:text-gray-100">Match Found! 🎉</h2>
              <p className="text-gray-600 dark:text-gray-400">
                {userAccepted ? 'Waiting for them to accept...' : 'Accept within 60 seconds to chat'}
              </p>
            </div>
          </div>

          {/* Match Preview Info */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900 dark:text-gray-100">Compatibility</p>
                <p className="text-purple-600 dark:text-purple-400">{mockMatch.compatibility}% Match</p>
              </div>
              <div className="text-right">
                <p className="text-gray-900 dark:text-gray-100">Location</p>
                <p className="text-gray-600 dark:text-gray-400">{mockMatch.location}</p>
              </div>
            </div>
            <div>
              <p className="text-gray-900 dark:text-gray-100 mb-2">
                {mockMatch.sharedInterests.length} Shared Interests
              </p>
              <div className="flex flex-wrap gap-2">
                {mockMatch.sharedInterests.slice(0, 3).map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 rounded-full border border-purple-200 dark:border-purple-700"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {!userAccepted && (
            <div className="space-y-3">
              <button
                onClick={handleStartChatting}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Start Chatting
              </button>
            </div>
          )}

          {userAccepted && (
            <div className="text-center space-y-2">
              <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-600 dark:text-gray-400">Connecting you both...</p>
            </div>
          )}
        </div>
      )}

      {status === 'timeout' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center space-y-4">
          <div className="text-6xl">⏰</div>
          <h2 className="text-gray-900 dark:text-gray-100">Time's Up!</h2>
          <p className="text-gray-600 dark:text-gray-400">
            You didn't accept in time. Try again to find another match!
          </p>
          <button
            onClick={() => {
              setStatus('idle');
            }}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}