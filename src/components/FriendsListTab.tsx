import { Users, UserPlus, UserCheck, MessageCircle, X } from 'lucide-react';
import { useState } from 'react';

interface Friend {
  id: number;
  name: string;
  age: number;
  location: string;
  interests: string[];
  compatibility: number;
  isMutual: boolean;
  requestedBy: 'you' | 'them';
  source: 'groups' | 'random';
}

interface FriendsListTabProps {
  onNavigate: (screen: any, data?: any) => void;
}

// Mock friends data
const mockFriends: Friend[] = [
  {
    id: 1,
    name: 'Friendly Person',
    age: 27,
    location: '4 miles away',
    interests: ['Hiking', 'Photography', 'Music'],
    compatibility: 88,
    isMutual: true,
    requestedBy: 'you',
    source: 'random'
  },
  {
    id: 2,
    name: 'Group Buddy',
    age: 29,
    location: '6 miles away',
    interests: ['Gaming', 'Tech', 'Movies'],
    compatibility: 92,
    isMutual: true,
    requestedBy: 'them',
    source: 'groups'
  },
  {
    id: 3,
    name: 'Cool Acquaintance',
    age: 25,
    location: '2 miles away',
    interests: ['Cooking', 'Travel', 'Fitness'],
    compatibility: 85,
    isMutual: false,
    requestedBy: 'you',
    source: 'random'
  }
];

const mockPendingRequests: Friend[] = [
  {
    id: 4,
    name: 'Interested Friend',
    age: 30,
    location: '5 miles away',
    interests: ['Art', 'Reading', 'Coffee'],
    compatibility: 90,
    isMutual: false,
    requestedBy: 'them',
    source: 'groups'
  }
];

export function FriendsListTab({ onNavigate }: FriendsListTabProps) {
  const [friends, setFriends] = useState<Friend[]>(mockFriends);
  const [pendingRequests, setPendingRequests] = useState<Friend[]>(mockPendingRequests);
  const [activeView, setActiveView] = useState<'friends' | 'pending' | 'sent'>('friends');

  const handleAcceptRequest = (friendId: number) => {
    const friend = pendingRequests.find(f => f.id === friendId);
    if (friend) {
      // Move to friends list and mark as mutual
      setFriends([...friends, { ...friend, isMutual: true }]);
      setPendingRequests(pendingRequests.filter(f => f.id !== friendId));
    }
  };

  const handleDeclineRequest = (friendId: number) => {
    setPendingRequests(pendingRequests.filter(f => f.id !== friendId));
  };

  const handleRemoveFriend = (friendId: number) => {
    setFriends(friends.filter(f => f.id !== friendId));
  };

  const mutualFriends = friends.filter(f => f.isMutual);
  const sentRequests = friends.filter(f => !f.isMutual && f.requestedBy === 'you');

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-gray-900 dark:text-gray-100">👥 Friends List</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Connect with friends from groups and random conversations
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-4 mb-6">
        <h3 className="text-blue-900 dark:text-blue-300 font-semibold mb-2">🤝 Mutual Friends Only</h3>
        <p className="text-blue-700 dark:text-blue-400 text-sm">
          Friends can only be added to your list mutually. Both people need to send friend requests to each other to become friends!
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
        <button
          onClick={() => setActiveView('friends')}
          className={`flex-1 py-3 px-4 rounded-lg transition-all ${
            activeView === 'friends'
              ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <UserCheck className="w-4 h-4" />
            <span>Friends ({mutualFriends.length})</span>
          </div>
        </button>
        <button
          onClick={() => setActiveView('pending')}
          className={`flex-1 py-3 px-4 rounded-lg transition-all relative ${
            activeView === 'pending'
              ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Users className="w-4 h-4" />
            <span>Pending ({pendingRequests.length})</span>
            {pendingRequests.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {pendingRequests.length}
              </span>
            )}
          </div>
        </button>
        <button
          onClick={() => setActiveView('sent')}
          className={`flex-1 py-3 px-4 rounded-lg transition-all ${
            activeView === 'sent'
              ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <UserPlus className="w-4 h-4" />
            <span>Sent ({sentRequests.length})</span>
          </div>
        </button>
      </div>

      {/* Friends List */}
      {activeView === 'friends' && (
        <div className="space-y-4">
          {mutualFriends.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-gray-900 dark:text-gray-100 mb-2">No Friends Yet</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Start adding friends from groups and random conversations!
              </p>
            </div>
          ) : (
            mutualFriends.map((friend) => (
              <div
                key={friend.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-8 h-8 text-purple-600 dark:text-purple-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-gray-900 dark:text-gray-100">{friend.name}</h3>
                        <p className="text-gray-500 text-sm">{friend.age} years old • {friend.location}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-purple-600 dark:text-purple-400 font-semibold">
                          {friend.compatibility}%
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {friend.interests.slice(0, 3).map((interest) => (
                        <span
                          key={interest}
                          className="px-3 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        From: {friend.source === 'groups' ? '👥 Groups' : '🎲 Random Conversations'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onNavigate('chat', friend)}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Chat
                      </button>
                      <button
                        onClick={() => handleRemoveFriend(friend.id)}
                        className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Pending Requests */}
      {activeView === 'pending' && (
        <div className="space-y-4">
          {pendingRequests.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center">
              <UserPlus className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-gray-900 dark:text-gray-100 mb-2">No Pending Requests</h3>
              <p className="text-gray-600 dark:text-gray-400">
                You'll see friend requests from others here
              </p>
            </div>
          ) : (
            pendingRequests.map((request) => (
              <div
                key={request.id}
                className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-300 dark:border-purple-700 rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-8 h-8 text-purple-600 dark:text-purple-300" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">!</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-gray-900 dark:text-gray-100">{request.name}</h3>
                        <p className="text-gray-500 text-sm">{request.age} years old • {request.location}</p>
                      </div>
                      <span className="text-purple-600 dark:text-purple-400 font-semibold">
                        {request.compatibility}%
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {request.interests.slice(0, 3).map((interest) => (
                        <span
                          key={interest}
                          className="px-3 py-1 bg-white dark:bg-gray-800 text-purple-700 dark:text-purple-300 rounded-full text-sm border border-purple-200 dark:border-purple-700"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        From: {request.source === 'groups' ? '👥 Groups' : '🎲 Random Conversations'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAcceptRequest(request.id)}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                      >
                        <UserCheck className="w-4 h-4" />
                        Accept Request
                      </button>
                      <button
                        onClick={() => handleDeclineRequest(request.id)}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Sent Requests */}
      {activeView === 'sent' && (
        <div className="space-y-4">
          {sentRequests.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center">
              <UserPlus className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-gray-900 dark:text-gray-100 mb-2">No Sent Requests</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Send friend requests from groups and random conversations
              </p>
            </div>
          ) : (
            sentRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-gray-900 dark:text-gray-100">{request.name}</h3>
                        <p className="text-gray-500 text-sm">{request.age} years old • {request.location}</p>
                      </div>
                      <span className="text-purple-600 dark:text-purple-400 font-semibold">
                        {request.compatibility}%
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {request.interests.slice(0, 3).map((interest) => (
                        <span
                          key={interest}
                          className="px-3 py-1 bg-gray-50 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        From: {request.source === 'groups' ? '👥 Groups' : '🎲 Random Conversations'}
                      </span>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                      <p className="text-amber-700 dark:text-amber-300 text-sm">
                        ⏳ Waiting for them to accept your friend request
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
