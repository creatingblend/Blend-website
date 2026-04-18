import { useState } from 'react';
import { ArrowLeft, Users, MapPin, Clock, AlertTriangle, X, UserPlus, ChevronDown, ChevronUp } from 'lucide-react';

interface ConversationSettingsProps {
  match: any;
  onBack: () => void;
  onDeleteConversation: () => void;
  onSaveToFriendsList?: (matchId: number) => void;
}

export function ConversationSettings({ match, onBack, onDeleteConversation, onSaveToFriendsList }: ConversationSettingsProps) {
  const [showStayFriendsModal, setShowStayFriendsModal] = useState(false);
  const [showFriendRequestConfirm, setShowFriendRequestConfirm] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [showFeedbackStep, setShowFeedbackStep] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<string[]>([]);
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  const [showAllSharedInterests, setShowAllSharedInterests] = useState(false);
  const [showAllMandatoryInterests, setShowAllMandatoryInterests] = useState(false);

  const handleSaveToFriends = () => {
    setFriendRequestSent(true);
    if (onSaveToFriendsList) {
      onSaveToFriendsList(match.id);
    }
  };

  const handleCloseConversation = () => {
    setShowStayFriendsModal(true);
  };

  const handleStayFriends = () => {
    setShowStayFriendsModal(false);
    setShowFriendRequestConfirm(true);
    // In a real app, this would send the request to the other user
    if (onSaveToFriendsList) {
       onSaveToFriendsList(match.id);
    }
  };

  const handleRejectFriends = () => {
    setShowStayFriendsModal(false);
    setShowFeedbackStep(true);
  };

  // Add more sample interests for demonstration
  const allSharedInterests = match.interests || match.sharedInterests || [
    'Photography', 'Travel', 'Cooking', 'Hiking', 'Music', 'Art', 
    'Reading', 'Movies', 'Yoga', 'Gaming', 'Dancing', 'Swimming'
  ];
  
  const allMandatoryInterests = match.mandatoryInterests || ['Photography', 'Travel', 'Cooking'];
  
  const displayedSharedInterests = showAllSharedInterests 
    ? allSharedInterests 
    : allSharedInterests.slice(0, 6);
    
  const displayedMandatoryInterests = showAllMandatoryInterests 
    ? allMandatoryInterests 
    : allMandatoryInterests.slice(0, 3);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h3 className="text-gray-900 dark:text-gray-100">Conversation Settings</h3>
          <div className="w-6" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Match Info */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-700 dark:to-pink-700 rounded-full flex items-center justify-center">
              <Users className="w-10 h-10 text-purple-600 dark:text-purple-300" />
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-gray-900 dark:text-gray-100">{match.name}</h2>
            <p className="text-purple-600 dark:text-purple-400 mt-1">{match.compatibility}% Compatible</p>
          </div>
        </div>

        {/* Mandatory Interests */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-purple-200 dark:border-purple-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-gray-900 dark:text-gray-100">Mandatory Interests</h3>
            </div>
            {allMandatoryInterests.length > 3 && (
              <button
                onClick={() => setShowAllMandatoryInterests(!showAllMandatoryInterests)}
                className="flex items-center gap-1 px-3 py-1 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-full transition-colors"
              >
                <span className="text-sm">{showAllMandatoryInterests ? 'Show Less' : 'Show More'}</span>
                {showAllMandatoryInterests ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {displayedMandatoryInterests && displayedMandatoryInterests.length > 0 ? (
              displayedMandatoryInterests.map((interest: string) => (
                <span
                  key={interest}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full"
                >
                  {interest}
                </span>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No mandatory interests set</p>
            )}
          </div>
        </div>

        {/* Shared Interests */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-pink-200 dark:border-pink-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/50 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-gray-900 dark:text-gray-100">Top Shared Interests</h3>
            </div>
            {allSharedInterests.length > 6 && (
              <button
                onClick={() => setShowAllSharedInterests(!showAllSharedInterests)}
                className="flex items-center gap-1 px-3 py-1 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/30 rounded-full transition-colors"
              >
                <span className="text-sm">{showAllSharedInterests ? 'Show Less' : 'Show More'}</span>
                {showAllSharedInterests ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {displayedSharedInterests && displayedSharedInterests.length > 0 ? (
              displayedSharedInterests.map((interest: string) => (
                <span
                  key={interest}
                  className="px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/50 dark:to-purple-900/50 text-pink-700 dark:text-pink-300 rounded-full border border-pink-200 dark:border-pink-700"
                >
                  {interest}
                </span>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No shared interests</p>
            )}
          </div>
        </div>

        {/* Distance */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
              <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Distance</p>
              <p className="text-gray-900 dark:text-gray-100">{match.location}</p>
            </div>
          </div>
        </div>

        {/* Conversation Duration */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Conversation Active For</p>
              <p className="text-gray-900 dark:text-gray-100">{match.conversationDuration || '2 days'}</p>
            </div>
          </div>
        </div>

        {/* Add to Friends */}
        {!friendRequestSent && (
          <button
            onClick={handleSaveToFriends}
            className="w-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-left">
                <p className="text-gray-900 dark:text-gray-100">Send Friend Request 👥</p>
                <p className="text-gray-500 dark:text-gray-400">Add {match.name} to your friends list</p>
              </div>
            </div>
          </button>
        )}

        {friendRequestSent && (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl border-2 border-green-200 dark:border-green-800 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-green-900 dark:text-green-300">✓ Friend Request Sent</p>
                <p className="text-green-600 dark:text-green-400">Waiting for {match.name} to accept</p>
              </div>
            </div>
          </div>
        )}

        {/* Danger Zone */}
        <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl border-2 border-red-200 dark:border-red-800 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            <h3 className="text-red-900 dark:text-red-300">Danger Zone</h3>
          </div>
          <p className="text-red-700 dark:text-red-400">
            Once you close this conversation, it cannot be recovered. All messages and content will be permanently deleted.
          </p>
          <button
            onClick={handleCloseConversation}
            className="w-full bg-red-600 dark:bg-red-700 text-white px-6 py-3 rounded-full hover:bg-red-700 dark:hover:bg-red-800 transition-colors"
          >
            Close Conversation
          </button>
        </div>
      </div>

      {/* Stay Friends Modal */}
      {showStayFriendsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">End Conversation?</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Would you like to stay friends with this person? Or fully end the conversation?
            </p>
            
            <div className="space-y-3">
              <button
                onClick={handleStayFriends}
                className="w-full p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-xl border border-green-200 dark:border-green-800 hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
              >
                <Users className="w-5 h-5" />
                Stay Friends
              </button>
              
              <button
                onClick={handleRejectFriends}
                className="w-full p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-xl border border-red-200 dark:border-red-800 hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Fully End Conversation
              </button>

              <button
                onClick={() => setShowStayFriendsModal(false)}
                className="w-full p-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Friend Request Sent Confirmation */}
      {showFriendRequestConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Friend Request Sent!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We've let {match.name} know you'd like to stay friends. If they accept, they'll appear in your Friends List.
            </p>
            <button
              onClick={() => {
                setShowFriendRequestConfirm(false);
                onBack(); // Go back to chat or dashboard
              }}
              className="w-full py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackStep && !showDeleteWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-900 dark:text-gray-100">📝 Why are you closing this conversation?</h2>
              <button
                onClick={() => setShowFeedbackStep(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                This feedback will be shared with {match.name} to help them improve
              </p>

              <div className="space-y-2">
                {[
                  { label: 'Dishonest', emoji: '🚫' },
                  { label: 'Didn\'t respond', emoji: '👻' },
                  { label: 'Wasn\'t right for me', emoji: '💔' },
                  { label: 'Found another date', emoji: '💕' },
                  { label: 'Aggressive', emoji: '😠' },
                  { label: 'Rude', emoji: '😤' },
                  { label: 'Inappropriate speech/jokes', emoji: '🤐' },
                  { label: 'Refuses to meetup', emoji: '🚷' },
                  { label: 'Impatient', emoji: '⏰' },
                  { label: 'Different values', emoji: '⚖️' },
                  { label: 'Lost interest', emoji: '😐' },
                  { label: 'Too busy', emoji: '📅' }
                ].map((option) => {
                  const isSelected = selectedFeedback.includes(option.label);
                  return (
                    <button
                      key={option.label}
                      onClick={() => {
                        setSelectedFeedback(prev =>
                          prev.includes(option.label)
                            ? prev.filter(f => f !== option.label)
                            : [...prev, option.label]
                        );
                      }}
                      className={`w-full p-3 rounded-xl border-2 text-left transition-colors ${
                        isSelected
                          ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30'
                          : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                      }`}
                    >
                      {option.emoji} {option.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowFeedbackStep(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowFeedbackStep(false);
                    setShowDeleteWarning(true);
                  }}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Warning Modal */}
      {showDeleteWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                <h2 className="text-gray-900 dark:text-gray-100">Close Conversation?</h2>
              </div>
              <button
                onClick={() => setShowDeleteWarning(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <p className="text-red-900 dark:text-red-300">
                  ⚠️ This action is permanent and cannot be undone!
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-gray-900 dark:text-gray-100">
                  Are you sure you want to close this conversation with <strong>{match.name}</strong>?
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                  <li>All messages will be deleted</li>
                  <li>All shared content will be removed</li>
                  <li>You cannot recover this conversation</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowDeleteWarning(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowDeleteWarning(false);
                    onDeleteConversation();
                  }}
                  className="flex-1 px-6 py-3 bg-red-600 dark:bg-red-700 text-white rounded-full hover:bg-red-700 dark:hover:bg-red-800 transition-colors"
                >
                  Close Forever
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
