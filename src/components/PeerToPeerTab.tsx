import { ThumbsUp, ThumbsDown, Lock, Info } from 'lucide-react';
import { useState } from 'react';

interface PeerToPeerTabProps {
  onShowPremium: () => void;
}

const mockPeerData = [
  {
    id: 1,
    gender: '👩 Women',
    location: 'Downtown',
    distance: '2 miles',
    wantMost: [
      { trait: '✅ Honest', percentage: 82 },
      { trait: '👂 Good listener', percentage: 78 },
      { trait: '😄 Sense of humor', percentage: 65 },
      { trait: '🎯 Ambitious', percentage: 71 },
      { trait: '💖 Kind', percentage: 89 }
    ],
    dontWant: [
      { trait: '❌ Dishonest', percentage: 91 },
      { trait: '🚿 Poor hygiene', percentage: 88 },
      { trait: '😤 Rude to servers', percentage: 85 },
      { trait: '⏰ Always late', percentage: 73 },
      { trait: '🙄 Self-centered', percentage: 80 }
    ]
  },
  {
    id: 2,
    gender: '👨 Men',
    location: 'Midtown',
    distance: '5 miles',
    wantMost: [
      { trait: '💪 Independent', percentage: 76 },
      { trait: '🗺️ Adventurous', percentage: 68 },
      { trait: '💬 Communicative', percentage: 84 },
      { trait: '🤝 Supportive', percentage: 79 },
      { trait: '💯 Loyal', percentage: 87 }
    ],
    dontWant: [
      { trait: '🔒 Controlling', percentage: 89 },
      { trait: '😞 Negative attitude', percentage: 82 },
      { trait: '🚫 Poor communication', percentage: 86 },
      { trait: '⚠️ Unreliable', percentage: 78 },
      { trait: '😠 Jealous', percentage: 83 }
    ]
  },
  {
    id: 3,
    gender: '⚧️ Non-binary',
    location: 'Eastside',
    distance: '3 miles',
    wantMost: [
      { trait: '🙏 Respectful', percentage: 92 },
      { trait: '🌈 Open-minded', percentage: 88 },
      { trait: '🎨 Creative', percentage: 70 },
      { trait: '✨ Authentic', percentage: 85 },
      { trait: '💝 Compassionate', percentage: 81 }
    ],
    dontWant: [
      { trait: '👎 Judgmental', percentage: 90 },
      { trait: '🚪 Close-minded', percentage: 93 },
      { trait: '🤥 Dishonest', percentage: 87 },
      { trait: '😒 Passive aggressive', percentage: 84 },
      { trait: '💢 Disrespectful', percentage: 91 }
    ]
  },
  {
    id: 4,
    gender: '🏳️‍⚧️ Trans Male',
    location: 'Westside',
    distance: '4 miles',
    wantMost: [
      { trait: '🤗 Understanding', percentage: 90 },
      { trait: '⏳ Patient', percentage: 83 },
      { trait: '🙏 Respectful', percentage: 94 },
      { trait: '💎 Genuine', percentage: 86 },
      { trait: '😂 Funny', percentage: 72 }
    ],
    dontWant: [
      { trait: '🚫 Transphobic', percentage: 98 },
      { trait: '🙈 Ignorant', percentage: 89 },
      { trait: '👊 Pushy', percentage: 85 },
      { trait: '🎭 Fake', percentage: 82 },
      { trait: '🔗 Controlling', percentage: 88 }
    ]
  },
  {
    id: 5,
    gender: '🏳️‍⚧️ Trans Female',
    location: 'Uptown',
    distance: '6 miles',
    wantMost: [
      { trait: '🤲 Accepting', percentage: 95 },
      { trait: '💕 Kind-hearted', percentage: 87 },
      { trait: '🧠 Intelligent', percentage: 74 },
      { trait: '💐 Romantic', percentage: 69 },
      { trait: '🔐 Trustworthy', percentage: 91 }
    ],
    dontWant: [
      { trait: '⛔ Discriminatory', percentage: 97 },
      { trait: '😡 Aggressive', percentage: 90 },
      { trait: '🎪 Manipulative', percentage: 93 },
      { trait: '🤫 Secretive', percentage: 81 },
      { trait: '💄 Superficial', percentage: 76 }
    ]
  }
];

export function PeerToPeerTab({ onShowPremium }: PeerToPeerTabProps) {
  const [showInfoModal, setShowInfoModal] = useState(false);
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-900 dark:text-gray-100">Peer-to-Peer Insights</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">See what local singles want most in a partner</p>
          </div>
          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full">
            <Lock className="w-4 h-4" />
            <span>Premium Feature</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockPeerData.map((peer) => (
          <div
            key={peer.id}
            onClick={onShowPremium}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden cursor-pointer"
          >
            {/* Premium overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-[2px] flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <div className="bg-white dark:bg-gray-800 rounded-full px-6 py-3 shadow-lg">
                <p className="text-purple-600 dark:text-purple-400">Unlock with Premium</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-900 dark:text-gray-100">{peer.gender}</h3>
                <span className="text-gray-500 dark:text-gray-400">{peer.distance}</span>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400">{peer.location}</p>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ThumbsUp className="w-4 h-4 text-green-600" />
                    <span className="text-gray-900 dark:text-gray-100">Want Most:</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowInfoModal(true);
                      }}
                      className="ml-auto"
                    >
                      <Info className="w-4 h-4 text-blue-500 hover:text-blue-600" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    {peer.wantMost.slice(0, 3).map((item) => (
                      <div key={item.trait} className="flex items-center justify-between bg-green-50 dark:bg-green-900/30 px-3 py-2 rounded">
                        <span className="text-green-700 dark:text-green-300">{item.trait}</span>
                        <span className="text-green-600 dark:text-green-400">{item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ThumbsDown className="w-4 h-4 text-red-600" />
                    <span className="text-gray-900 dark:text-gray-100">Don't Want:</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowInfoModal(true);
                      }}
                      className="ml-auto"
                    >
                      <Info className="w-4 h-4 text-blue-500 hover:text-blue-600" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    {peer.dontWant.slice(0, 3).map((item) => (
                      <div key={item.trait} className="flex items-center justify-between bg-red-50 dark:bg-red-900/30 px-3 py-2 rounded">
                        <span className="text-red-700 dark:text-red-300">{item.trait}</span>
                        <span className="text-red-600 dark:text-red-400">{item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-gray-900 dark:text-gray-100">What do these percentages mean?</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
                <p className="text-gray-900 dark:text-gray-100">
                  📊 These percentages show <strong>how many people in your area</strong> want or don't want these specific traits in a partner.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                    <ThumbsUp className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-gray-100">Want Most</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      If "82% Honest" is shown, it means 82% of local singles in that demographic say honesty is a top priority for them.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                    <ThumbsDown className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-gray-100">Don't Want</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      If "91% Dishonest" is shown, it means 91% of local singles in that demographic consider dishonesty a dealbreaker.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                <p className="text-amber-900 dark:text-amber-300">
                  💡 <strong>Use this to your advantage!</strong> These insights help you understand what matters most to potential matches in your area.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowInfoModal(false)}
              className="w-full mt-6 bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}