import { useState } from 'react';
import { Heart, X, ThumbsUp, ThumbsDown, CheckCircle } from 'lucide-react';

interface DateFeedbackProps {
  match: any;
  onClose: () => void;
  onSubmit: (feedback: any) => void;
}

const positiveOptions = [
  { label: 'Arrived on time', emoji: '⏰' },
  { label: 'Paid/offered to pay', emoji: '💳' },
  { label: 'Was friendly', emoji: '😊' },
  { label: 'Asked about me', emoji: '❓' },
  { label: 'Was talkative', emoji: '💬' },
  { label: 'Was attractive', emoji: '✨' },
  { label: 'Dressed nice', emoji: '👔' },
  { label: 'Smelled nice', emoji: '🌹' },
  { label: 'Complimented me', emoji: '💕' },
  { label: 'Matched their profile', emoji: '✔️' }
];

const negativeOptions = [
  { label: 'Arrived late', emoji: '⏰' },
  { label: "Refused to pay/didn't offer to pay", emoji: '💸' },
  { label: 'Was rude to me', emoji: '😠' },
  { label: 'Was rude to the staff', emoji: '👎' },
  { label: 'Low hygiene', emoji: '🚿' },
  { label: 'Talked only about themselves', emoji: '🗣️' },
  { label: "Didn't talk much", emoji: '🤐' },
  { label: 'Talked too much', emoji: '🗨️' },
  { label: "Didn't ask about me", emoji: '🙄' },
  { label: 'Aggressive', emoji: '⚠️' },
  { label: "Doesn't match profile", emoji: '❌' },
  { label: 'Distracted (on phone)', emoji: '📱' }
];

export function DateFeedback({ match, onClose, onSubmit }: DateFeedbackProps) {
  const [step, setStep] = useState(1);
  const [dateWentWell, setDateWentWell] = useState<boolean | null>(null);
  const [openToSecondDate, setOpenToSecondDate] = useState<boolean | null>(null);
  const [selectedPositives, setSelectedPositives] = useState<string[]>([]);
  const [selectedNegatives, setSelectedNegatives] = useState<string[]>([]);
  const [personalMessage, setPersonalMessage] = useState('');
  const [sendPersonalMessage, setSendPersonalMessage] = useState(false);
  const [showEndConversationConfirm, setShowEndConversationConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const togglePositive = (label: string) => {
    setSelectedPositives(prev =>
      prev.includes(label)
        ? prev.filter(o => o !== label)
        : [...prev, label]
    );
  };

  const toggleNegative = (label: string) => {
    setSelectedNegatives(prev =>
      prev.includes(label)
        ? prev.filter(o => o !== label)
        : [...prev, label]
    );
  };

  const handleSubmit = () => {
    const feedback = {
      dateWentWell,
      openToSecondDate,
      positives: selectedPositives,
      negatives: selectedNegatives,
      personalMessage,
      matchId: match.id,
      timestamp: new Date().toISOString()
    };
    
    onSubmit(feedback);
    setSubmitted(true);
    
    // Auto close after 3 seconds
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h2 className="text-gray-900 dark:text-gray-100 mb-2">Thank You!</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Your feedback has been submitted. {openToSecondDate && "We'll let them know you're interested in a second date!"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
            <div>
              <h2 className="text-gray-900 dark:text-gray-100">Date Feedback</h2>
              <p className="text-gray-600 dark:text-gray-400">How did your date go with {match.name}?</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Step 1: Did the date go well? */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-gray-900 dark:text-gray-100 text-center">Did the date go well?</h3>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    setDateWentWell(true);
                    setStep(2);
                  }}
                  className="flex-1 max-w-xs p-8 rounded-2xl border-2 border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors flex flex-col items-center gap-3"
                >
                  <ThumbsUp className="w-12 h-12 text-green-600 dark:text-green-400" />
                  <span className="text-gray-900 dark:text-gray-100">Yes</span>
                </button>
                
                <button
                  onClick={() => {
                    setDateWentWell(false);
                    setStep(3);
                  }}
                  className="flex-1 max-w-xs p-8 rounded-2xl border-2 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors flex flex-col items-center gap-3"
                >
                  <ThumbsDown className="w-12 h-12 text-red-600 dark:text-red-400" />
                  <span className="text-gray-900 dark:text-gray-100">No</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Date went well - follow up questions */}
          {step === 2 && dateWentWell && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-gray-900 dark:text-gray-100">Would you be open to a second date?</h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => setOpenToSecondDate(true)}
                    className={`flex-1 p-4 rounded-xl border-2 transition-colors ${
                      openToSecondDate === true
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Heart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      <span className="text-gray-900 dark:text-gray-100">Yes, I'd like that</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setOpenToSecondDate(false)}
                    className={`flex-1 p-4 rounded-xl border-2 transition-colors ${
                      openToSecondDate === false
                        ? 'border-gray-600 bg-gray-50 dark:bg-gray-700'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-gray-900 dark:text-gray-100">Maybe not</span>
                  </button>
                </div>
                {openToSecondDate && (
                  <p className="text-green-600 dark:text-green-400">
                    ✓ We'll send them a notification that you're interested in a second date!
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="text-gray-900 dark:text-gray-100">What did you like about this person?</h3>
                <p className="text-gray-600 dark:text-gray-400">Select all that apply</p>
                <div className="grid grid-cols-2 gap-2">
                  {positiveOptions.map((option) => (
                    <button
                      key={option.label}
                      onClick={() => togglePositive(option.label)}
                      className={`p-3 rounded-lg border-2 text-left transition-colors ${
                        selectedPositives.includes(option.label)
                          ? 'border-green-600 bg-green-50 dark:bg-green-900/30 text-green-900 dark:text-green-300'
                          : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-green-300'
                      }`}
                    >
                      <span className="mr-2">{option.emoji}</span>
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-gray-900 dark:text-gray-100">What did you like about the date?</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Tell us in your own words (this helps us improve)
                </p>
                <textarea
                  value={personalMessage}
                  onChange={(e) => setPersonalMessage(e.target.value.slice(0, 200))}
                  maxLength={200}
                  rows={3}
                  className="w-full p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-purple-400 dark:focus:border-purple-600 focus:outline-none transition-colors"
                  placeholder="I had a great time! They were really fun to talk to..."
                />
                <p className="text-gray-500 dark:text-gray-400">{personalMessage.length}/200 characters</p>
                
                <label className="flex items-center gap-2 cursor-pointer p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <input
                    type="checkbox"
                    checked={sendPersonalMessage}
                    onChange={(e) => setSendPersonalMessage(e.target.checked)}
                    className="w-5 h-5 text-purple-600 rounded"
                  />
                  <span className="text-gray-700 dark:text-gray-300">✉️ Share this message with {match.name}</span>
                </label>
                <p className="text-gray-500 dark:text-gray-400">
                  {sendPersonalMessage ? '✓ Your message will be sent to them' : '🔒 Your message is private (only for our analytics)'}
                </p>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
              >
                Submit Feedback
              </button>
            </div>
          )}

          {/* Step 3: Date didn't go well - follow up questions */}
          {step === 3 && dateWentWell === false && (
            <div className="space-y-6">
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
                <p className="text-purple-900 dark:text-purple-300">
                  A bad date doesn't always mean 'no chance for a second'
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-gray-900 dark:text-gray-100">Would a second date be a possible option?</h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => setOpenToSecondDate(true)}
                    className={`flex-1 p-4 rounded-xl border-2 transition-colors ${
                      openToSecondDate === true
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                    }`}
                  >
                    <span className="text-gray-900 dark:text-gray-100">Yes, maybe</span>
                  </button>
                  <button
                    onClick={() => setShowEndConversationConfirm(true)}
                    className={`flex-1 p-4 rounded-xl border-2 transition-colors ${
                      openToSecondDate === false
                        ? 'border-gray-600 bg-gray-50 dark:bg-gray-700'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-gray-900 dark:text-gray-100">No, not interested</span>
                  </button>
                </div>
                {showEndConversationConfirm && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 space-y-3">
                    <p className="text-yellow-900 dark:text-yellow-300">
                      ⚠️ Are you sure you want to end this conversation?
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setOpenToSecondDate(false);
                          setShowEndConversationConfirm(false);
                        }}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Yes, end conversation
                      </button>
                      <button
                        onClick={() => setShowEndConversationConfirm(false)}
                        className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                {openToSecondDate && (
                  <p className="text-purple-600 dark:text-purple-400">
                    We'll let them know you might be open to trying again
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="text-gray-900 dark:text-gray-100">What went wrong?</h3>
                <p className="text-gray-600 dark:text-gray-400">This helps us improve your future matches (optional)</p>
                <div className="grid grid-cols-2 gap-2">
                  {negativeOptions.map((option) => (
                    <button
                      key={option.label}
                      onClick={() => toggleNegative(option.label)}
                      className={`p-3 rounded-lg border-2 text-left transition-colors ${
                        selectedNegatives.includes(option.label)
                          ? 'border-red-600 bg-red-50 dark:bg-red-900/30 text-red-900 dark:text-red-300'
                          : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-red-300'
                      }`}
                    >
                      <span className="mr-2">{option.emoji}</span>
                      {option.label}
                    </button>
                  ))}
                </div>
                
                <div className="mt-4">
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Tell us more about what happened (this helps us improve - won't be sent to them)
                  </p>
                  <textarea
                    value={personalMessage}
                    onChange={(e) => setPersonalMessage(e.target.value.slice(0, 200))}
                    maxLength={200}
                    rows={3}
                    className="w-full p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-red-400 dark:focus:border-red-600 focus:outline-none transition-colors"
                    placeholder="They seemed disinterested and kept checking their phone..."
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-gray-500 dark:text-gray-400">{personalMessage.length}/200 characters</p>
                    <p className="text-gray-500 dark:text-gray-400">🔒 Private feedback for analytics only</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
              >
                Submit Feedback
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}