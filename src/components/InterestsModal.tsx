import { useState } from 'react';
import { X, Check } from 'lucide-react';

interface InterestsModalProps {
  onClose: () => void;
  onSave: (interests: string[]) => void;
  currentInterests?: string[];
}

const allInterests = [
  '🥾 Hiking', '📸 Photography', '🍳 Cooking', '📚 Reading', '🎮 Gaming', '🎬 Movies',
  '🎵 Music', '💪 Fitness', '💻 Technology', '✈️ Travel', '🎨 Art', '💃 Dancing',
  '🧘 Yoga', '🏃 Running', '🚴 Cycling', '🏊 Swimming', '✍️ Writing', '🖌️ Painting',
  '🌱 Gardening', '🧘‍♀️ Meditation', '🤝 Volunteering', '☕ Coffee', '🍷 Wine',
  '🍺 Craft Beer', '🍛 Biryani', '🍕 Pizza', '🍣 Sushi', '🧁 Baking', '👗 Fashion',
  '⚽ Sports', '🏀 Basketball', '🏈 Football', '🎾 Tennis', '⛷️ Skiing', '🏄 Surfing',
  '🧗 Rock Climbing', '⛺ Camping', '🎒 Backpacking', '🎲 Board Games', '♟️ Chess',
  '🎙️ Podcasts', '😂 Stand-up Comedy', '🎭 Theater', '🏛️ Museums', '💭 Philosophy',
  '🔬 Science', '📜 History', '🌌 Astronomy', '🌿 Nature', '🦁 Animals', '🐾 Pets',
  '🐕 Dogs', '🐈 Cats', '🐦 Birds', '🗣️ Languages', '📖 Learning', '👨‍🏫 Teaching',
];

export function InterestsModal({ onClose, onSave, currentInterests = [] }: InterestsModalProps) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>(currentInterests);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSave = () => {
    onSave(selectedInterests);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
            <div>
              <h2 className="text-gray-900">Update Your Interests</h2>
              <p className="text-gray-600 mt-1">
                Select at least 3 interests to improve your matches
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Selected Count */}
          <div className="mb-6 p-4 bg-purple-50 rounded-lg">
            <p className="text-purple-900">
              {selectedInterests.length} interests selected
              {selectedInterests.length < 3 && (
                <span className="text-amber-600 ml-2">
                  (Select at least {3 - selectedInterests.length} more)
                </span>
              )}
            </p>
          </div>

          {/* Interests Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
            {allInterests.map((interest) => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`relative px-4 py-3 rounded-lg border-2 transition-all ${
                  selectedInterests.includes(interest)
                    ? 'border-purple-600 bg-purple-50 text-purple-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300'
                }`}
              >
                <span>{interest}</span>
                {selectedInterests.includes(interest) && (
                  <Check className="absolute top-1 right-1 w-4 h-4 text-purple-600" />
                )}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={selectedInterests.length < 3}
              className={`flex-1 px-6 py-3 rounded-full transition-all ${
                selectedInterests.length >= 3
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Save Interests
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
