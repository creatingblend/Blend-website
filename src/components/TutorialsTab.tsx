import { Play, Lock, Clock } from 'lucide-react';

interface TutorialsTabProps {
  onShowPremium: () => void;
}

const tutorialVideos = [
  {
    id: 1,
    title: 'Dating Advice: First Steps',
    duration: '12:45',
    category: '💝 Dating Advice',
    description: 'Learn the fundamentals of modern dating and how to build confidence',
    thumbnail: 'bg-gradient-to-br from-purple-400 to-pink-400'
  },
  {
    id: 2,
    title: 'Self Improvement: Building Confidence',
    duration: '18:20',
    category: '✨ Self Improvement',
    description: 'Develop self-confidence and become your best self',
    thumbnail: 'bg-gradient-to-br from-blue-400 to-cyan-400'
  },
  {
    id: 3,
    title: 'How to Dress for a First Date',
    duration: '10:15',
    category: '👔 First Date',
    description: 'Style tips and outfit ideas to make a great first impression',
    thumbnail: 'bg-gradient-to-br from-amber-400 to-orange-400'
  },
  {
    id: 4,
    title: 'How to Act on a First Date',
    duration: '15:30',
    category: '😊 First Date',
    description: 'Body language, conversation tips, and creating chemistry',
    thumbnail: 'bg-gradient-to-br from-green-400 to-emerald-400'
  },
  {
    id: 5,
    title: "Do's and Don'ts: First Date Edition",
    duration: '14:00',
    category: '✅ First Date',
    description: 'Common mistakes to avoid and best practices to follow',
    thumbnail: 'bg-gradient-to-br from-red-400 to-pink-400'
  },
  {
    id: 6,
    title: "Do's and Don'ts: Second Date",
    duration: '11:45',
    category: '💕 Second Date',
    description: 'Taking things to the next level after a successful first date',
    thumbnail: 'bg-gradient-to-br from-indigo-400 to-purple-400'
  },
  {
    id: 7,
    title: "Do's and Don'ts: Third Date",
    duration: '13:20',
    category: '💖 Third Date',
    description: 'Building deeper connection and assessing compatibility',
    thumbnail: 'bg-gradient-to-br from-pink-400 to-rose-400'
  },
  {
    id: 8,
    title: 'Meeting Her/His Family',
    duration: '16:10',
    category: '👨‍👩‍👧 Relationships',
    description: 'Make a great impression when meeting their family for the first time',
    thumbnail: 'bg-gradient-to-br from-teal-400 to-cyan-400'
  },
  {
    id: 9,
    title: 'Meeting Her/His Friends',
    duration: '12:30',
    category: '👥 Relationships',
    description: 'Navigate social circles and build rapport with their friends',
    thumbnail: 'bg-gradient-to-br from-yellow-400 to-amber-400'
  },
  {
    id: 10,
    title: 'Communication in Relationships',
    duration: '20:00',
    category: '💬 Relationships',
    description: 'Effective communication strategies for healthy relationships',
    thumbnail: 'bg-gradient-to-br from-violet-400 to-purple-400'
  },
  {
    id: 11,
    title: 'Dealing with Rejection',
    duration: '9:45',
    category: '💪 Self Improvement',
    description: 'How to handle rejection gracefully and move forward',
    thumbnail: 'bg-gradient-to-br from-slate-400 to-gray-400'
  },
  {
    id: 12,
    title: 'Long-term Relationship Success',
    duration: '25:15',
    category: '❤️ Relationships',
    description: 'Maintaining a healthy, long-lasting relationship',
    thumbnail: 'bg-gradient-to-br from-rose-400 to-red-400'
  }
];

export function TutorialsTab({ onShowPremium }: TutorialsTabProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-900 dark:text-gray-100">Tutorial Videos</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Expert dating advice and self-improvement content</p>
          </div>
          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full">
            <Lock className="w-4 h-4" />
            <span>Premium Feature</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutorialVideos.map((video) => (
          <button
            key={video.id}
            onClick={onShowPremium}
            className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all text-left group"
          >
            {/* Thumbnail */}
            <div className={`h-48 ${video.thumbnail} relative flex items-center justify-center`}>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
              <div className="relative z-10 w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 text-purple-600 ml-1" />
              </div>
              <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{video.duration}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-2">
              <span className="inline-block px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded text-sm">
                {video.category}
              </span>
              <h3 className="text-gray-900 dark:text-gray-100">{video.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{video.description}</p>
              
              <div className="pt-2 flex items-center gap-2 text-purple-600 dark:text-purple-400">
                <Lock className="w-4 h-4" />
                <span>Premium Content</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
