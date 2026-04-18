import { useState } from 'react';
import { ArrowLeft, Phone, MoreVertical, Send, Mic, Gamepad2, MapPin, Sparkles, Lock, Unlock, Crown, ChevronDown, ChevronUp } from 'lucide-react';
import type { Screen } from '../App';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'match' | 'system';
  timestamp: string;
  type?: 'reveal' | 'normal' | 'icebreaker';
}

const initialMessages: Message[] = [
  { 
    id: 1, 
    text: "🎲 Icebreaker: You both like Nintendo, foreign travel, and Italian food! Here's a starter: What's your dream travel destination?", 
    sender: 'system', 
    timestamp: '10:28 AM',
    type: 'icebreaker'
  },
  { id: 2, text: "Japan! I've always wanted to experience the culture and food there.", sender: 'match', timestamp: '10:30 AM' },
  { id: 3, text: "Same here! The blend of traditional and modern is fascinating. Have you tried authentic ramen?", sender: 'user', timestamp: '10:32 AM' },
  { id: 4, text: "Yes! There's this amazing ramen place downtown. We should check it out sometime!", sender: 'match', timestamp: '10:33 AM' },
];

const icebreakers = [
  "What's a dish you'll never get bored of?",
  "Two truths and a lie - you go first!",
  "What's your funniest childhood memory?",
  "If you could have dinner with anyone, who would it be?",
  "What's the best concert or show you've been to?"
];

const games = [
  { name: '20 Questions', icon: '❓', premium: false },
  { name: 'Would You Rather', icon: '🤔', premium: false },
  { name: 'Trivia Battle', icon: '🎯', premium: false },
  { name: 'Chess', icon: '♟️', premium: true },
  { name: 'Word Game', icon: '📝', premium: true },
  { name: 'Hangman', icon: '🎨', premium: true },
];

interface ChatScreenProps {
  match: any;
  onBack: () => void;
  onNavigate: (screen: Screen, data?: any) => void;
  onSaveToFriendsList?: (matchId: number) => void;
}

export function ChatScreen({ match, onBack, onNavigate, onSaveToFriendsList }: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [messageCount, setMessageCount] = useState(4);
  const [showIcebreakers, setShowIcebreakers] = useState(false);
  const [showGames, setShowGames] = useState(false);
  const [revealLevel, setRevealLevel] = useState(0);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<{
    date: string;
    time: string;
    location: string;
    activity: string;
  } | null>({
    date: 'Saturday, Jan 18, 2026',
    time: '7:00 PM',
    location: 'Downtown Italian Restaurant',
    activity: 'Dinner Date 🍝'
  });
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [expandDateBanner, setExpandDateBanner] = useState(false);
  const [isPremium, setIsPremium] = useState(false); // Mock state for premium status

  const handleSend = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: inputValue,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setInputValue('');
      setMessageCount(messageCount + 1);
    }
  };

  const handleIcebreaker = (question: string) => {
    const newMessage: Message = {
      id: messages.length + 1,
      text: `🎲 Icebreaker: ${question}`,
      sender: 'system',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'icebreaker'
    };
    setMessages([...messages, newMessage]);
    setShowIcebreakers(false);
  };

  const handleReveal = () => {
    if (revealLevel < 2) {
      setRevealLevel(revealLevel + 1);
      const revealMessage: Message = {
        id: messages.length + 1,
        text: revealLevel === 0 
          ? "🎉 You both agreed to reveal basic info! Check their profile to learn more."
          : "🎉 Full reveal unlocked! You can now share more personal details.",
        sender: 'system',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'reveal'
      };
      setMessages([...messages, revealMessage]);
    }
  };

  const canSendVoice = messageCount >= 10;

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 shrink-0 z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <button onClick={onBack} className="text-gray-600 hover:text-gray-900 flex-shrink-0">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex-shrink-0" />
              <div className="min-w-0">
                <h3 className="text-gray-900 truncate">{match.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-purple-600">{match.compatibility}%</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500">Online</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('voice', match)}
              disabled={!canSendVoice}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                canSendVoice 
                  ? 'text-gray-600 hover:bg-gray-100' 
                  : 'text-gray-300 cursor-not-allowed'
              }`}
              title={!canSendVoice ? 'Exchange 10 messages to unlock voice chat' : 'Start voice chat'}
            >
              <Phone className="w-5 h-5" />
            </button>
            <button
              onClick={() => onNavigate('conversationSettings', match)}
              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Scheduled Date Banner - Collapsible */}
      {scheduledDate && (
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 border-b border-pink-200 px-4 py-2 shrink-0 z-10 transition-all duration-300">
          <div className="max-w-4xl mx-auto">
            {!expandDateBanner ? (
              <button 
                onClick={() => setExpandDateBanner(true)}
                className="w-full flex items-center justify-between py-1"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-pink-600" />
                  <span className="font-semibold text-pink-900 text-sm">Your Upcoming Date!</span>
                </div>
                <ChevronDown className="w-4 h-4 text-pink-600" />
              </button>
            ) : (
              <div>
                 <button 
                  onClick={() => setExpandDateBanner(false)}
                  className="w-full flex items-center justify-between mb-2"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-pink-600" />
                    <span className="font-semibold text-pink-900 text-sm">Your Upcoming Date!</span>
                  </div>
                  <ChevronUp className="w-4 h-4 text-pink-600" />
                </button>
                <div className="flex items-start justify-between gap-4 pb-2 animate-in slide-in-from-top-2">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-pink-900 font-semibold mb-1">📅 Upcoming Date</p>
                      <p className="text-pink-700">{scheduledDate.activity}</p>
                      <p className="text-pink-600">{scheduledDate.date} at {scheduledDate.time}</p>
                      <p className="text-pink-600">📍 {scheduledDate.location}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setShowRescheduleModal(true)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition-colors whitespace-nowrap text-sm"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to cancel this date?')) {
                          setScheduledDate(null);
                        }
                      }}
                      className="bg-white text-pink-700 border-2 border-pink-300 px-4 py-2 rounded-full hover:bg-pink-50 transition-colors whitespace-nowrap text-sm"
                    >
                      Cancel Date
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 pb-[10px]">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : message.sender === 'system' ? 'justify-center' : 'justify-start'}`}
            >
              <div
                className={`${
                  message.sender === 'system'
                    ? 'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 text-purple-900 px-4 py-3 rounded-2xl w-full max-w-md text-center'
                    : message.sender === 'user'
                    ? 'bg-purple-600 text-white px-4 py-3 rounded-2xl rounded-tr-sm max-w-[70%]'
                    : 'bg-white border border-gray-200 text-gray-900 px-4 py-3 rounded-2xl rounded-tl-sm max-w-[70%]'
                }`}
              >
                <p>{message.text}</p>
                <p
                  className={`mt-1 text-xs ${
                    message.sender === 'system'
                      ? 'text-purple-600'
                      : message.sender === 'user'
                      ? 'text-purple-200'
                      : 'text-gray-400'
                  }`}
                >
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
          <div className="h-4" /> {/* Spacer */}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border-t border-gray-200 px-4 py-2 shrink-0">
        <div className="max-w-4xl mx-auto flex gap-2 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setShowIcebreakers(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 transition-colors whitespace-nowrap text-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span className="text-gray-700">Icebreaker</span>
          </button>
          <button 
            onClick={() => setShowGames(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 transition-colors whitespace-nowrap text-sm"
          >
            <Gamepad2 className="w-3.5 h-3.5 text-purple-600" />
            <span className="text-gray-700">Play Game</span>
          </button>
          <button 
            onClick={() => onNavigate('dateplanner', match)}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 transition-colors whitespace-nowrap text-sm"
          >
            <MapPin className="w-3.5 h-3.5 text-pink-600" />
            <span className="text-gray-700">Date Ideas</span>
          </button>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 shrink-0">
        <div className="max-w-4xl mx-auto flex items-end gap-2">
           <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-2 flex items-center min-h-[44px]">
             <input
               type="text"
               value={inputValue}
               onChange={(e) => setInputValue(e.target.value)}
               onKeyPress={(e) => e.key === 'Enter' && handleSend()}
               onFocus={() => setShowKeyboard(true)}
               onBlur={() => {
                  // Keep keyboard open for a moment to allow button clicks
                  // In a real mobile app, the virtual keyboard handles this
                  // For this simulation, we'll rely on the user manually closing or typing
               }}
               placeholder="Type a message..."
               className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500 text-base"
             />
           </div>
           
           {inputValue.trim() ? (
             <button
               onClick={handleSend}
               className="w-11 h-11 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors shadow-sm"
             >
               <Send className="w-5 h-5 text-white" />
             </button>
           ) : (
             <button 
               disabled={!canSendVoice}
               className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
                 canSendVoice 
                   ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                   : 'bg-gray-50 text-gray-300 cursor-not-allowed'
               }`}
             >
               <Mic className="w-6 h-6" />
             </button>
           )}
        </div>
      </div>

      {/* Simulated Keyboard & Ad Bar Container */}
      {showKeyboard && (
        <div className="shrink-0 bg-gray-100 border-t border-gray-300">
           {/* Keyboard Layout */}
           <div className="p-1 pb-2 bg-gray-200 select-none">
              {/* Prediction Bar */}
              <div className="flex justify-center gap-4 py-2 text-gray-600 text-sm border-b border-gray-300 mb-1">
                 <span>I</span>
                 <span>Hello</span>
                 <span>How are you</span>
              </div>
              
              <div className="space-y-2 px-1">
                {/* Row 1 */}
                <div className="flex gap-1.5 justify-center">
                  {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map((key) => (
                    <button
                      key={key}
                      onClick={() => setInputValue(inputValue + key.toLowerCase())}
                      className="w-[8.5%] h-11 bg-white rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-200 flex items-center justify-center text-xl font-medium text-gray-900"
                    >
                      {key}
                    </button>
                  ))}
                </div>
                
                {/* Row 2 */}
                <div className="flex gap-1.5 justify-center px-4">
                  {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map((key) => (
                    <button
                      key={key}
                      onClick={() => setInputValue(inputValue + key.toLowerCase())}
                      className="w-[8.5%] h-11 bg-white rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-200 flex items-center justify-center text-xl font-medium text-gray-900"
                    >
                      {key}
                    </button>
                  ))}
                </div>
                
                {/* Row 3 */}
                <div className="flex gap-1.5 justify-center">
                  <button
                    onClick={() => {
                        const words = inputValue.split(' ');
                        const newText = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                        setInputValue(newText);
                    }}
                    className="w-[12%] h-11 bg-gray-300 rounded-lg shadow-sm hover:bg-gray-400 flex items-center justify-center"
                  >
                    ⇧
                  </button>
                  {['Z', 'X', 'C', 'V', 'B', 'N', 'M'].map((key) => (
                    <button
                      key={key}
                      onClick={() => setInputValue(inputValue + key.toLowerCase())}
                      className="w-[8.5%] h-11 bg-white rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-200 flex items-center justify-center text-xl font-medium text-gray-900"
                    >
                      {key}
                    </button>
                  ))}
                  <button
                    onClick={() => setInputValue(inputValue.slice(0, -1))}
                    className="w-[12%] h-11 bg-gray-300 rounded-lg shadow-sm hover:bg-gray-400 flex items-center justify-center"
                  >
                    ⌫
                  </button>
                </div>
                
                {/* Row 4 */}
                <div className="flex gap-1.5 justify-center mt-2 px-1">
                  <button className="w-[12%] h-11 bg-gray-300 rounded-lg shadow-sm text-sm font-medium">123</button>
                  <button className="w-[12%] h-11 bg-gray-300 rounded-lg shadow-sm text-xl">😊</button>
                  <button
                    onClick={() => setInputValue(inputValue + ' ')}
                    className="flex-1 h-11 bg-white rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-200 text-sm text-gray-400 font-medium"
                  >
                    space
                  </button>
                  <button
                    onClick={() => setShowKeyboard(false)}
                    className="w-[20%] h-11 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 active:bg-blue-700 font-medium"
                  >
                    return
                  </button>
                </div>
              </div>
           </div>
           
           {/* Ad Bar (Only if not premium) */}
           {!isPremium && (
             <div className="h-12 bg-gray-800 text-white flex items-center justify-between px-4 text-xs">
                <span>Ad: Meet people near you!</span>
                <button 
                  onClick={() => setIsPremium(true)} 
                  className="bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition-colors"
                >
                  Remove Ads
                </button>
             </div>
           )}
        </div>
      )}

      {/* Icebreaker Modal */}
      {showIcebreakers && (
        <div className="absolute inset-0 bg-black/50 flex items-end z-20">
          <div className="bg-white rounded-t-3xl w-full max-h-[70vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-900">Icebreaker Questions</h3>
              <button onClick={() => setShowIcebreakers(false)} className="text-gray-500">✕</button>
            </div>
            <div className="space-y-3">
              {icebreakers.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleIcebreaker(question)}
                  className="w-full p-4 bg-purple-50 hover:bg-purple-100 rounded-xl text-left text-gray-900 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Games Modal */}
      {showGames && (
        <div className="absolute inset-0 bg-black/50 flex items-end z-20">
          <div className="bg-white rounded-t-3xl w-full max-h-[70vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-900">Play a Game Together</h3>
              <button onClick={() => setShowGames(false)} className="text-gray-500">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {games.map((game, index) => (
                <button
                  key={index}
                  className={`p-6 rounded-xl text-left transition-colors relative ${
                    game.premium 
                      ? 'bg-amber-50 border-2 border-amber-200 hover:bg-amber-100'
                      : 'bg-purple-50 hover:bg-purple-100'
                  }`}
                >
                  {game.premium && (
                    <Crown className="w-5 h-5 text-amber-600 absolute top-2 right-2" />
                  )}
                  <div className="text-3xl mb-2">{game.icon}</div>
                  <p className="text-gray-900">{game.name}</p>
                  {game.premium && <p className="text-amber-600">Premium</p>}
                </button>
              ))}
            </div>
            <p className="text-gray-600 mt-4 text-center">
              💡 Premium games: Only one person needs premium for both to play!
            </p>
          </div>
        </div>
      )}

      {/* Reschedule Date Modal */}
      {showRescheduleModal && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-900">Reschedule Date</h3>
              <button onClick={() => setShowRescheduleModal(false)} className="text-gray-500">✕</button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-gray-900 block mb-2">New Date</label>
                <input
                  type="date"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 outline-none"
                  defaultValue="2026-01-18"
                />
              </div>
              
              <div>
                <label className="text-gray-900 block mb-2">New Time</label>
                <input
                  type="time"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 outline-none"
                  defaultValue="19:00"
                />
              </div>
              
              <div>
                <label className="text-gray-900 block mb-2">Message (optional)</label>
                <textarea
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 outline-none resize-none"
                  rows={3}
                  placeholder="Let them know why you'd like to reschedule..."
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowRescheduleModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('Reschedule request sent!');
                    setShowRescheduleModal(false);
                  }}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
                >
                  Send Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
