import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { AnimatedLogo } from './AnimatedLogo';

interface LoginScreenProps {
  onComplete: () => void;
  onSignUp: () => void;
}

export function LoginScreen({ onComplete, onSignUp }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showStatusSelection, setShowStatusSelection] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would validate credentials
    // Show status selection modal after successful login
    setShowStatusSelection(true);
  };

  const handleStatusSelect = (status: 'online' | 'offline') => {
    // In a real app, this would save the status to the backend
    console.log('User selected status:', status);
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 flex flex-col p-6">
      {/* Skip Button - Top Right */}
      <div className="flex justify-end mb-4">
        <button
          onClick={onComplete}
          className="px-6 py-2 text-white hover:bg-white/20 rounded-full transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Mission Statement at Top */}
      <div className="text-center text-white mt-8 mb-auto">
        <p className="text-lg max-w-md mx-auto leading-relaxed">
          💕 Connect deeper. Date smarter. Love blindly. 💕
        </p>
        <p className="mt-4 max-w-lg mx-auto opacity-90">
          Where personality meets compatibility, and true connections are made without the superficial swipe.
        </p>
      </div>

      {/* Login Form */}
      <div className="w-full max-w-md mx-auto">
        <div className="bg-purple-700/40 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/10">
          <h1 className="text-white text-center mb-8">Member Sign In</h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-3 rounded-full bg-white/90 text-gray-900 placeholder-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                required
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 rounded-full bg-white/90 text-gray-900 placeholder-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              <button
                type="button"
                className="absolute -bottom-6 right-0 text-white/80 hover:text-white transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-400 text-white py-3 rounded-full hover:from-blue-600 hover:to-blue-500 transition-all shadow-lg"
              >
                Login
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <span className="text-white/80">Don't have an account? </span>
            <button
              onClick={onSignUp}
              className="text-white hover:underline"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>

      {/* Logo at Bottom */}
      <div className="text-center mt-auto mb-8">
        <div className="flex items-center justify-center mb-2 scale-75">
          <AnimatedLogo size="large" autoPlay={true} />
        </div>
        <div className="text-white space-y-2">
          <h2 className="text-4xl tracking-wider">B.L.E.N.D</h2>
          <p className="text-white/80">Blind · Local · Engaged · New · Dating</p>
        </div>
      </div>

      {/* Status Selection Modal */}
      {showStatusSelection && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full">
            <h2 className="text-gray-900 text-center mb-4">Choose Your Status 🟢</h2>
            <p className="text-gray-600 text-center mb-8">
              Select how you'd like to appear in the app
            </p>

            <div className="space-y-4">
              <button
                onClick={() => handleStatusSelect('online')}
                className="w-full bg-gradient-to-r from-green-500 to-green-400 text-white p-6 rounded-2xl hover:from-green-600 hover:to-green-500 transition-all shadow-lg text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <span className="text-3xl">🟢</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Online</h3>
                    <p className="text-green-100 text-sm">
                      You'll be shown to others and can get matched
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleStatusSelect('offline')}
                className="w-full bg-gradient-to-r from-gray-500 to-gray-400 text-white p-6 rounded-2xl hover:from-gray-600 hover:to-gray-500 transition-all shadow-lg text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <span className="text-3xl">⚫</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Offline</h3>
                    <p className="text-gray-100 text-sm">
                      Browse privately without being shown to others
                    </p>
                  </div>
                </div>
              </button>
            </div>

            <p className="text-gray-500 text-center mt-6 text-sm">
              💡 You can change this anytime in your settings
            </p>
          </div>
        </div>
      )}
    </div>
  );
}