import { useState } from 'react';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { AnimatedLogo } from './AnimatedLogo';

interface SignUpScreenProps {
  onComplete: () => void;
  onBack: () => void;
}

export function SignUpScreen({ onComplete, onBack }: SignUpScreenProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // In a real app, this would create an account
      onComplete();
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 flex flex-col p-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 text-white hover:text-white/80 transition-colors flex items-center gap-2"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Login</span>
      </button>

      {/* Mission Statement at Top */}
      <div className="text-center text-white mt-16 mb-auto">
        <p className="text-lg max-w-md mx-auto leading-relaxed">
          💕 Connect deeper. Date smarter. Love blindly. 💕
        </p>
        <p className="mt-4 max-w-lg mx-auto opacity-90">
          Join B.L.E.N.D and start making meaningful connections based on personality, not photos.
        </p>
      </div>

      {/* Sign Up Form */}
      <div className="w-full max-w-md mx-auto">
        <div className="bg-purple-700/40 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/10">
          <h1 className="text-white text-center mb-2">Create Account</h1>
          <p className="text-white/70 text-center mb-8">Start your blind dating journey</p>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="📧 Email"
                className={`w-full px-4 py-3 rounded-full bg-white/90 text-gray-900 placeholder-gray-500 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.email ? 'ring-2 ring-red-400' : 'focus:ring-white/50'
                }`}
              />
              {errors.email && (
                <p className="text-red-200 text-sm mt-1 ml-4">{errors.email}</p>
              )}
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="🔒 Password (min 8 characters)"
                className={`w-full px-4 py-3 rounded-full bg-white/90 text-gray-900 placeholder-gray-500 focus:bg-white focus:outline-none focus:ring-2 transition-all pr-12 ${
                  errors.password ? 'ring-2 ring-red-400' : 'focus:ring-white/50'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {errors.password && (
                <p className="text-red-200 text-sm mt-1 ml-4">{errors.password}</p>
              )}
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                placeholder="🔒 Confirm Password"
                className={`w-full px-4 py-3 rounded-full bg-white/90 text-gray-900 placeholder-gray-500 focus:bg-white focus:outline-none focus:ring-2 transition-all pr-12 ${
                  errors.confirmPassword ? 'ring-2 ring-red-400' : 'focus:ring-white/50'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {errors.confirmPassword && (
                <p className="text-red-200 text-sm mt-1 ml-4">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="bg-white/10 rounded-2xl p-4 mt-4">
              <p className="text-white/90 text-sm">
                By creating an account, you agree to our Terms of Service and Privacy Policy. B.L.E.N.D is committed to keeping your data safe and private.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-400 text-white py-3 rounded-full hover:from-blue-600 hover:to-blue-500 transition-all shadow-lg"
              >
                Create Account
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <span className="text-white/80">Already have an account? </span>
            <button
              onClick={onBack}
              className="text-white hover:underline"
            >
              Sign in
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
    </div>
  );
}
