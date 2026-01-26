import { ArrowLeft, MapPin, Clock, DollarSign, Coffee, Utensils, Film, Music, Book, TreePine } from 'lucide-react';

interface DatePlannerProps {
  match: any;
  onBack: () => void;
}

const dateIdeas = [
  {
    category: 'Food & Dining',
    icon: Utensils,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    places: [
      {
        name: 'Biryani Paradise',
        type: 'Indian Restaurant',
        distance: '2.3 miles',
        priceRange: '$$',
        rating: 4.8,
        highlight: 'You both love biryani!'
      },
      {
        name: "Giovanni's Trattoria",
        type: 'Italian Restaurant',
        distance: '3.1 miles',
        priceRange: '$$$',
        rating: 4.6,
        highlight: 'Shared interest: Italian food'
      }
    ]
  },
  {
    category: 'Cafés & Coffee',
    icon: Coffee,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    places: [
      {
        name: 'The Reading Bean',
        type: 'Book Café',
        distance: '1.8 miles',
        priceRange: '$',
        rating: 4.7,
        highlight: 'Perfect for coffee lovers'
      },
      {
        name: 'Artisan Coffee House',
        type: 'Specialty Coffee',
        distance: '2.5 miles',
        priceRange: '$$',
        rating: 4.9,
        highlight: 'Cozy atmosphere'
      }
    ]
  },
  {
    category: 'Entertainment',
    icon: Film,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    places: [
      {
        name: 'Indie Cinema',
        type: 'Movie Theater',
        distance: '4.2 miles',
        priceRange: '$$',
        rating: 4.5,
        highlight: 'You both love movies'
      },
      {
        name: 'Live Music Lounge',
        type: 'Music Venue',
        distance: '3.8 miles',
        priceRange: '$$$',
        rating: 4.8,
        highlight: 'Shared interest: Music'
      }
    ]
  },
  {
    category: 'Outdoor Activities',
    icon: TreePine,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    places: [
      {
        name: 'Sunset Trail',
        type: 'Hiking Trail',
        distance: '6.5 miles',
        priceRange: 'Free',
        rating: 4.9,
        highlight: 'You both love hiking!'
      },
      {
        name: 'Riverside Park',
        type: 'City Park',
        distance: '2.1 miles',
        priceRange: 'Free',
        rating: 4.6,
        highlight: 'Great for walks'
      }
    ]
  }
];

const conversationPrompts = [
  "What's your favorite memory from a first date?",
  "If you could travel anywhere tomorrow, where would you go?",
  "What's something that always makes you laugh?",
  "What's your comfort food?",
  "What's the best advice you've ever received?"
];

export function DatePlanner({ match, onBack }: DatePlannerProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button onClick={onBack} className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h3 className="text-gray-900">Date Ideas</h3>
            <p className="text-gray-600">Based on your shared interests</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Intro */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
          <h2 className="text-gray-900 mb-2">Plan Your First Date</h2>
          <p className="text-gray-600">
            We've found places near both of you that match your shared interests. All suggestions are based on your compatibility!
          </p>
        </div>

        {/* Date Ideas by Category */}
        {dateIdeas.map((category) => {
          const Icon = category.icon;
          return (
            <div key={category.category} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${category.bgColor} rounded-full flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${category.color}`} />
                </div>
                <h3 className="text-gray-900">{category.category}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.places.map((place, index) => (
                  <div
                    key={index}
                    className="bg-white border-2 border-gray-200 rounded-2xl p-5 hover:border-purple-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-gray-900 mb-1">{place.name}</h4>
                        <p className="text-gray-600">{place.type}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-amber-500">★</span>
                        <span className="text-gray-900">{place.rating}</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{place.distance}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span>{place.priceRange}</span>
                      </div>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                      <p className="text-purple-700">💡 {place.highlight}</p>
                    </div>

                    <button className="w-full mt-4 bg-purple-600 text-white py-3 rounded-full hover:bg-purple-700 transition-colors">
                      Suggest to Match
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Date Time Planner */}
        <div className="bg-white border-2 border-purple-200 rounded-2xl p-6 space-y-4">
          <h3 className="text-gray-900">Plan Your Date Time</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-gray-700">Preferred Day</label>
              <select className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 outline-none">
                <option>This Weekend</option>
                <option>Next Week</option>
                <option>This Week</option>
                <option>Next Weekend</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-gray-700">Time of Day</label>
              <select className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 outline-none">
                <option>Evening (6-9 PM)</option>
                <option>Afternoon (2-5 PM)</option>
                <option>Morning (9-12 PM)</option>
                <option>Late Night (9 PM+)</option>
              </select>
            </div>
          </div>

          <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-full hover:opacity-90 transition-opacity">
            Send Date Proposal
          </button>
        </div>

        {/* Conversation Starters */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Music className="w-6 h-6 text-purple-600" />
            <h3 className="text-gray-900">Conversation Prompts for Your Date</h3>
          </div>
          <p className="text-gray-600">Keep the conversation flowing with these prompts</p>
          
          <div className="space-y-2">
            {conversationPrompts.map((prompt, index) => (
              <div key={index} className="bg-white rounded-xl p-4 border border-purple-100">
                <p className="text-gray-700">{prompt}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Tips */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 space-y-3">
          <h3 className="text-gray-900">Safety First 🛡️</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• Meet in a public place</li>
            <li>• Tell a friend where you're going</li>
            <li>• Arrange your own transportation</li>
            <li>• Trust your instincts</li>
            <li>• Keep your phone charged</li>
          </ul>
        </div>

        {/* Post-Date Feedback Reminder */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 space-y-3">
          <h3 className="text-gray-900 dark:text-gray-100">After Your Date 📧</h3>
          <p className="text-gray-700 dark:text-gray-300">
            24 hours after your scheduled date, we'll send you an email asking for feedback. 
            Your honest feedback helps us improve your future matches and ensures a better 
            dating experience for everyone in the B.L.E.N.D community!
          </p>
        </div>
      </div>
    </div>
  );
}
