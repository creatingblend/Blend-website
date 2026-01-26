import { useState, useEffect } from "react";
import {
  User,
  Heart,
  HelpCircle,
  Shield,
  Moon,
  Sun,
  AlertTriangle,
  PauseCircle,
} from "lucide-react";
import { AnimatedLogo } from "./AnimatedLogo";
import { AvatarBuilder, AvatarConfig } from "./AvatarBuilder";

interface SettingsPanelProps {
  onOpenMandatory: () => void;
  onOpenUpdate: () => void;
  onOpenDesires: () => void;
  onOpenSecurity: () => void;
}

export function SettingsPanel({
  onOpenMandatory,
  onOpenUpdate,
  onOpenDesires,
  onOpenSecurity,
}: SettingsPanelProps) {
  const [showAvatarBuilder, setShowAvatarBuilder] =
    useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] =
    useState(false);
  const [showSuspendConfirm, setShowSuspendConfirm] =
    useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [distanceValue, setDistanceValue] = useState(15);
  const [distanceUnit, setDistanceUnit] = useState<"m" | "k">(
    "m",
  ); // m = miles, k = kilometers
  const [currentAvatar, setCurrentAvatar] = useState<
    AvatarConfig | undefined
  >();

  // Check for dark mode on mount
  useEffect(() => {
    const isDark =
      document.documentElement.classList.contains("dark");
    setDarkMode(isDark);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleSaveAvatar = (avatar: AvatarConfig) => {
    setCurrentAvatar(avatar);
    // Here you would typically save to backend/local storage
    console.log("Avatar saved:", avatar);
  };

  const handleDeactivate = () => {
    // Here you would typically call backend to deactivate
    console.log("Account deactivated");
    setShowDeactivateConfirm(false);
  };

  const handleSuspend = () => {
    // Here you would typically call backend to suspend
    console.log("Account suspended");
    setShowSuspendConfirm(false);
  };

  return (
    <>
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-6 overflow-y-auto scrollbar-hide"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* Avatar */}
        <button
          onClick={() => setShowAvatarBuilder(true)}
          className="w-full flex items-center gap-3 p-3 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors text-left"
        >
          <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <span className="text-gray-700 dark:text-gray-300">
            Choose Avatar
          </span>
        </button>

        {/* Mandatory Interests */}
        <button
          onClick={onOpenMandatory}
          className="w-full flex items-center gap-3 p-3 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors text-left"
        >
          <Heart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <span className="text-gray-700 dark:text-gray-300">
            ⭐ Mandatory Interests
          </span>
        </button>

        {/* Update Interests */}
        <button
          onClick={onOpenUpdate}
          className="w-full flex items-center gap-3 p-3 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors text-left"
        >
          <Heart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <span className="text-gray-700 dark:text-gray-300">
            🔄 Update Interests
          </span>
        </button>

        {/* What you want (Desires) */}
        <button
          onClick={onOpenDesires}
          className="w-full flex items-center gap-3 p-3 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors text-left"
        >
          <Heart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <span className="text-gray-700 dark:text-gray-300">
            💭 What you want
          </span>
        </button>

        {/* Light/Dark Mode */}
        <div className="flex items-center justify-between p-3 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors">
          <div className="flex items-center gap-3">
            {darkMode ? (
              <Moon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            ) : (
              <Sun className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            )}
            <span className="text-gray-700 dark:text-gray-300">
              Light / Dark Mode
            </span>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              darkMode ? "bg-purple-600" : "bg-gray-300"
            }`}
          >
            <div
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                darkMode ? "translate-x-6" : ""
              }`}
            />
          </button>
        </div>

        {/* Help */}
        <button
          onClick={() => setShowHelp(true)}
          className="w-full flex items-center gap-3 p-3 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors text-left"
        >
          <HelpCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <span className="text-gray-700 dark:text-gray-300">
            Help
          </span>
        </button>

        {/* Distance Slider */}
        <div className="space-y-3 p-3">
          <div className="flex items-center justify-between">
            <label className="text-gray-700 dark:text-gray-300">
              Distance
            </label>
            <div className="flex items-center gap-2">
              <span className="text-purple-600 dark:text-purple-400">
                {distanceValue} {distanceUnit}
              </span>
              <button
                onClick={() =>
                  setDistanceUnit(
                    distanceUnit === "m" ? "k" : "m",
                  )
                }
                className="px-2 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded text-sm hover:bg-purple-200 dark:hover:bg-purple-900 transition-colors"
              >
                {distanceUnit === "m" ? "miles" : "km"}
              </button>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={distanceValue}
            onChange={(e) =>
              setDistanceValue(Number(e.target.value))
            }
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
          <div className="flex justify-between text-gray-500 dark:text-gray-400">
            <span>0 {distanceUnit}</span>
            <span>100 {distanceUnit}</span>
          </div>
        </div>

        {/* Update Security */}
        <button
          onClick={onOpenSecurity}
          className="w-full flex items-center gap-3 p-3 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors text-left"
        >
          <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <span className="text-gray-700 dark:text-gray-300">
            Update Security
          </span>
        </button>

        {/* Suspend Account */}
        <button
          onClick={() => setShowSuspendConfirm(true)}
          className="w-full flex items-center gap-3 p-3 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg transition-colors text-left"
        >
          <PauseCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <span className="text-amber-600 dark:text-amber-400">
            ⏸️ Suspend Account
          </span>
        </button>

        {/* Deactivate Account */}
        <button
          onClick={() => setShowDeactivateConfirm(true)}
          className="w-full flex items-center gap-3 p-3 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors text-left"
        >
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          <span className="text-red-600 dark:text-red-400">
            ⚠️ Deactivate Account
          </span>
        </button>

        {/* BLEND Logo */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col items-center gap-2">
          <AnimatedLogo size="small" autoPlay={false} />
          <span className="text-gray-900 dark:text-gray-100 text-center">
            B.L.E.N.D
          </span>
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Personality-first dating
          </p>
        </div>
      </div>

      {/* Avatar Builder Modal */}
      {showAvatarBuilder && (
        <AvatarBuilder
          onClose={() => setShowAvatarBuilder(false)}
          onSave={handleSaveAvatar}
          currentAvatar={currentAvatar}
        />
      )}

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-gray-900">Help & FAQ</h2>
                <button
                  onClick={() => setShowHelp(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-gray-900 mb-2">
                    How does B.L.E.N.D work?
                  </h3>
                  <p className="text-gray-600">
                    B.L.E.N.D is a personality-first dating app
                    where you connect with matches based on
                    shared interests, hobbies, and compatibility
                    scores—without photos or visuals. Build
                    genuine connections through chat, voice, and
                    shared activities.
                  </p>
                </div>

                <div>
                  <h3 className="text-gray-900 mb-2">
                    What is the compatibility score?
                  </h3>
                  <p className="text-gray-600">
                    Our algorithm calculates compatibility based
                    on your interests, personality traits,
                    values, and preferences. Higher percentages
                    indicate stronger potential matches.
                  </p>
                </div>

                <div>
                  <h3 className="text-gray-900 mb-2">
                    What features are free?
                  </h3>
                  <p className="text-gray-600">
                    All core features are free: matching,
                    messaging, voice chat, mini-games, and date
                    suggestions. Premium features include
                    exclusive games, advanced filters, and
                    dating tutorials.
                  </p>
                </div>

                <div>
                  <h3 className="text-gray-900 mb-2">
                    How do I report inappropriate behavior?
                  </h3>
                  <p className="text-gray-600">
                    In any conversation, tap the menu icon and
                    select "Report User". We take safety
                    seriously and review all reports promptly.
                  </p>
                </div>

                <div>
                  <h3 className="text-gray-900 mb-2">
                    Contact Support
                  </h3>
                  <p className="text-gray-600">
                    Email us at support@blendapp.com or use the
                    in-app chat support (coming soon).
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowHelp(false)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Confirmation Modal */}
      {showSuspendConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <PauseCircle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              <h2 className="text-gray-900 dark:text-gray-100">
                ⏸️ Suspend Account?
              </h2>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Suspending your account will temporarily hide your
              profile from matches and pause all activity. You
              can reactivate anytime by simply logging back in.
              This is completely reversible.
            </p>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
              <p className="text-amber-900 dark:text-amber-300">
                ✨ What happens when suspended:
              </p>
              <ul className="text-amber-700 dark:text-amber-400 mt-2 space-y-1 list-disc list-inside">
                <li>Profile hidden from new matches</li>
                <li>Existing conversations preserved</li>
                <li>Can reactivate instantly</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSuspendConfirm(false)}
                className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSuspend}
                className="flex-1 px-6 py-3 bg-amber-600 dark:bg-amber-700 text-white rounded-full hover:bg-amber-700 dark:hover:bg-amber-800 transition-colors"
              >
                Suspend Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Confirmation Modal */}
      {showDeactivateConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              <h2 className="text-gray-900 dark:text-gray-100">
                ⚠️ Deactivate Account?
              </h2>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to deactivate your account?
              Your profile will be hidden and you can reactivate
              within 30 days. After 30 days, all data will be
              permanently deleted. This is reversible within the
              30-day window.
            </p>

            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
              <p className="text-red-900 dark:text-red-300">
                ⚠️ Warning:
              </p>
              <p className="text-red-700 dark:text-red-400 mt-1">
                After 30 days, all your data including
                conversations and matches will be permanently
                deleted.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeactivateConfirm(false)}
                className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeactivate}
                className="flex-1 px-6 py-3 bg-red-600 dark:bg-red-700 text-white rounded-full hover:bg-red-700 dark:hover:bg-red-800 transition-colors"
              >
                Deactivate Account
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}