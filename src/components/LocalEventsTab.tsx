import { Calendar, MapPin, Users, Lock, Star } from 'lucide-react';

interface LocalEventsTabProps {
  onShowPremium: () => void;
}

const mockEvents = [
  {
    id: 1,
    title: 'Comedy Night at The Laugh Factory',
    date: 'Friday, Dec 6th',
    time: '8:00 PM',
    location: 'Downtown Theater District',
    distance: '2.3 miles',
    attendees: 45,
    price: 'Free with Premium',
    sponsored: true,
    category: '😂 Comedy'
  },
  {
    id: 2,
    title: 'Speed Dating Event',
    date: 'Saturday, Dec 7th',
    time: '7:00 PM',
    location: 'Rooftop Lounge',
    distance: '1.8 miles',
    attendees: 32,
    price: 'Free with Premium',
    sponsored: true,
    category: '⚡ Speed Dating'
  },
  {
    id: 3,
    title: 'Game Night: Board Games & Trivia',
    date: 'Thursday, Dec 12th',
    time: '6:30 PM',
    location: 'Activity Center',
    distance: '3.5 miles',
    attendees: 28,
    price: 'Free with Premium',
    sponsored: true,
    category: '🎮 Games'
  },
  {
    id: 4,
    title: 'Wine Tasting Social',
    date: 'Friday, Dec 13th',
    time: '7:30 PM',
    location: 'Urban Winery',
    distance: '4.2 miles',
    attendees: 20,
    price: 'Free with Premium',
    sponsored: false,
    category: '🍷 Social'
  },
  {
    id: 5,
    title: 'Cooking Class: Italian Cuisine',
    date: 'Saturday, Dec 14th',
    time: '5:00 PM',
    location: 'Culinary Institute',
    distance: '5.1 miles',
    attendees: 16,
    price: 'Free with Premium',
    sponsored: true,
    category: '👨‍🍳 Cooking'
  },
  {
    id: 6,
    title: 'Live Music & Mingling',
    date: 'Sunday, Dec 15th',
    time: '6:00 PM',
    location: 'Jazz Club',
    distance: '2.7 miles',
    attendees: 52,
    price: 'Free with Premium',
    sponsored: false,
    category: '🎵 Music'
  }
];

export function LocalEventsTab({ onShowPremium }: LocalEventsTabProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-900 dark:text-gray-100">Local Events</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Meet people in person at sponsored events</p>
          </div>
          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full">
            <Lock className="w-4 h-4" />
            <span>Premium Feature</span>
          </div>
        </div>

        <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <p className="text-blue-900 dark:text-blue-300">
            🎉 This feature is coming soon! We're working on partnerships with local venues to bring you exclusive events.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockEvents.map((event) => (
          <button
            key={event.id}
            onClick={onShowPremium}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all text-left relative"
          >
            {event.sponsored && (
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-1 rounded-full">
                <Star className="w-3 h-3 fill-current" />
                <span>Sponsored</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded mb-2">
                  {event.category}
                </span>
                <h3 className="text-gray-900 dark:text-gray-100">{event.title}</h3>
              </div>

              <div className="space-y-2 text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{event.date} at {event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location} • {event.distance}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{event.attendees} attending</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <span className="text-purple-600 dark:text-purple-400">{event.price}</span>
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                  <Lock className="w-4 h-4" />
                  <span>RSVP with Premium</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
