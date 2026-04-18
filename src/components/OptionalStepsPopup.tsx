import { motion } from 'motion/react';

interface OptionalStepsPopupProps {
  onContinue: () => void;
  onSkip: () => void;
}

export function OptionalStepsPopup({ onContinue, onSkip }: OptionalStepsPopupProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="text-4xl mb-2">✨</div>
          <h3 className="text-gray-900 text-xl">Great Progress!</h3>
          <p className="text-gray-600">
            You've completed all the mandatory fields! The next few steps are optional but will help you find even better matches.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            You can complete these now, or save it for later in the settings menu
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onContinue}
            className="w-full py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium"
          >
            Continue to Additional Profile Building
          </button>
          <button
            onClick={onSkip}
            className="w-full py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            Skip for Now
          </button>
        </div>
      </motion.div>
    </div>
  );
}
