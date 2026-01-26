import { useState, useEffect } from 'react';
import { ArrowLeft, Mic, MicOff, Phone, Volume2, VolumeX } from 'lucide-react';

interface VoiceChatScreenProps {
  match: any;
  onBack: () => void;
}

export function VoiceChatScreen({ match, onBack }: VoiceChatScreenProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    // Simulate connection after 2 seconds
    const timer = setTimeout(() => {
      setIsConnected(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    onBack();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-white/80 hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <p className="text-white">
            {isConnected ? formatDuration(duration) : 'Connecting...'}
          </p>
          <div className="w-6" />
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="w-40 h-40 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <div className="w-32 h-32 bg-white/30 rounded-full flex items-center justify-center">
                <Volume2 className="w-16 h-16 text-white animate-pulse" />
              </div>
            </div>
            {isConnected && (
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              </div>
            )}
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-white">{match.name}</h2>
            <p className="text-white/80">
              {isConnected ? 'Voice chat active' : 'Connecting...'}
            </p>
          </div>
        </div>

        {/* Audio Waves Visualization */}
        {isConnected && (
          <div className="flex items-center justify-center gap-1 h-20">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-white/60 rounded-full animate-pulse"
                style={{
                  height: `${Math.random() * 60 + 20}px`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
              isSpeakerOn
                ? 'bg-white/20 text-white'
                : 'bg-white/40 text-white/60'
            }`}
          >
            {isSpeakerOn ? (
              <Volume2 className="w-6 h-6" />
            ) : (
              <VolumeX className="w-6 h-6" />
            )}
          </button>

          <button
            onClick={handleEndCall}
            className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
          >
            <Phone className="w-8 h-8 text-white transform rotate-[135deg]" />
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
              isMuted
                ? 'bg-white/40 text-white/60'
                : 'bg-white/20 text-white'
            }`}
          >
            {isMuted ? (
              <MicOff className="w-6 h-6" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Info */}
        <div className="text-center space-y-2">
          <p className="text-white/80">
            Get to know each other through conversation
          </p>
          <p className="text-white/60">
            Voice chat is 100% free
          </p>
        </div>
      </div>
    </div>
  );
}
