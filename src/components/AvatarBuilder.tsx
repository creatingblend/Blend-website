import { useState } from 'react';
import { X, Save } from 'lucide-react';

interface AvatarBuilderProps {
  onClose: () => void;
  onSave: (avatar: AvatarConfig) => void;
  currentAvatar?: AvatarConfig;
}

export interface AvatarConfig {
  faceShape: string;
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  eyeShape: string;
  eyeColor: string;
  makeup: 'none' | 'light' | 'bold';
  makeupIntensity: number;
  eyewear: string;
  accessories: string[];
}

const defaultAvatar: AvatarConfig = {
  faceShape: 'oval',
  skinTone: '#f4c8a8',
  hairStyle: 'short',
  hairColor: '#4a3728',
  eyeShape: 'almond',
  eyeColor: '#6b4423',
  makeup: 'none',
  makeupIntensity: 50,
  eyewear: 'none',
  accessories: [],
};

export function AvatarBuilder({ onClose, onSave, currentAvatar }: AvatarBuilderProps) {
  const [avatar, setAvatar] = useState<AvatarConfig>(currentAvatar || defaultAvatar);

  const handleSave = () => {
    onSave(avatar);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
            <h2 className="text-gray-900">Avatar Builder</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                className="text-green-600 hover:text-green-700 transition-colors"
                title="Save Avatar"
              >
                <Save className="w-6 h-6" />
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Live Preview */}
            <div className="flex flex-col items-center">
              <h3 className="text-gray-900 mb-4">Preview</h3>
              <div className="w-64 h-64 bg-gradient-to-br from-purple-50 to-pink-50 rounded-full flex items-center justify-center border-4 border-purple-200">
                <svg width="200" height="200" viewBox="0 0 200 200">
                  {/* Face */}
                  <circle cx="100" cy="100" r="80" fill={avatar.skinTone} />
                  
                  {/* Hair */}
                  {avatar.hairStyle !== 'bald' && (
                    <>
                      <ellipse cx="100" cy="60" rx="85" ry="50" fill={avatar.hairColor} />
                      {avatar.hairStyle === 'long' && (
                        <rect x="30" y="100" width="140" height="60" fill={avatar.hairColor} rx="10" />
                      )}
                      {avatar.hairStyle === 'ponytail' && (
                        <ellipse cx="100" cy="180" rx="30" ry="40" fill={avatar.hairColor} />
                      )}
                      {avatar.hairStyle === 'bun' && (
                        <circle cx="100" cy="40" r="25" fill={avatar.hairColor} />
                      )}
                    </>
                  )}
                  
                  {/* Eyes */}
                  <ellipse cx="75" cy="90" rx="8" ry="10" fill={avatar.eyeColor} />
                  <ellipse cx="125" cy="90" rx="8" ry="10" fill={avatar.eyeColor} />
                  
                  {/* Eyewear */}
                  {avatar.eyewear !== 'none' && (
                    <>
                      <rect x="60" y="80" width="30" height="25" fill="none" stroke="#000" strokeWidth="2" rx="5" />
                      <rect x="110" y="80" width="30" height="25" fill="none" stroke="#000" strokeWidth="2" rx="5" />
                      <line x1="90" y1="92" x2="110" y2="92" stroke="#000" strokeWidth="2" />
                    </>
                  )}
                  
                  {/* Makeup */}
                  {avatar.makeup !== 'none' && (
                    <>
                      <path d="M 75 85 Q 75 80 75 85" stroke="#ff69b4" strokeWidth={avatar.makeup === 'bold' ? 2 : 1} fill="none" />
                      <path d="M 125 85 Q 125 80 125 85" stroke="#ff69b4" strokeWidth={avatar.makeup === 'bold' ? 2 : 1} fill="none" />
                      <ellipse cx="70" cy="105" rx="6" ry="4" fill="#ff69b4" opacity={avatar.makeupIntensity / 100} />
                      <ellipse cx="130" cy="105" rx="6" ry="4" fill="#ff69b4" opacity={avatar.makeupIntensity / 100} />
                    </>
                  )}
                  
                  {/* Mouth */}
                  <path d="M 80 120 Q 100 130 120 120" stroke="#000" strokeWidth="2" fill="none" />
                  
                  {/* Accessories */}
                  {avatar.accessories.includes('earrings') && (
                    <>
                      <circle cx="55" cy="110" r="5" fill="#ffd700" />
                      <circle cx="145" cy="110" r="5" fill="#ffd700" />
                    </>
                  )}
                  {avatar.accessories.includes('hat') && (
                    <rect x="50" y="30" width="100" height="15" fill="#8b4513" rx="5" />
                  )}
                  {avatar.accessories.includes('necklace') && (
                    <ellipse cx="100" cy="175" rx="40" ry="8" fill="none" stroke="#ffd700" strokeWidth="3" />
                  )}
                </svg>
              </div>
            </div>

            {/* Right: Controls */}
            <div className="space-y-6">
              {/* Face Shape */}
              <div className="space-y-2">
                <label className="text-gray-900">Face Shape</label>
                <select
                  value={avatar.faceShape}
                  onChange={(e) => setAvatar({ ...avatar, faceShape: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  {['oval', 'round', 'square', 'heart'].map(shape => (
                    <option key={shape} value={shape}>{shape}</option>
                  ))}
                </select>
              </div>

              {/* Skin Tone */}
              <div className="space-y-2">
                <label className="text-gray-900">Skin Tone</label>
                <div className="flex gap-2 flex-wrap">
                  {['#f4c8a8', '#e8b89a', '#dba57e', '#c68a5c', '#a67350', '#8b5d3b'].map(tone => (
                    <button
                      key={tone}
                      onClick={() => setAvatar({ ...avatar, skinTone: tone })}
                      className={`w-10 h-10 rounded-full border-2 ${
                        avatar.skinTone === tone ? 'border-purple-600 ring-2 ring-purple-300' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: tone }}
                    />
                  ))}
                </div>
              </div>

              {/* Hair Style */}
              <div className="space-y-2">
                <label className="text-gray-900">Hair Style</label>
                <select
                  value={avatar.hairStyle}
                  onChange={(e) => setAvatar({ ...avatar, hairStyle: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  {['short', 'medium', 'long', 'curly', 'wavy', 'bald', 'ponytail', 'bun'].map(style => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
              </div>

              {/* Hair Color */}
              <div className="space-y-2">
                <label className="text-gray-900">Hair Color</label>
                <div className="flex gap-2 flex-wrap">
                  {['#000000', '#4a3728', '#8b5a3c', '#d4a574', '#e6c7b8', '#ff0000', '#0000ff', '#00ff00'].map(color => (
                    <button
                      key={color}
                      onClick={() => setAvatar({ ...avatar, hairColor: color })}
                      className={`w-10 h-10 rounded-full border-2 ${
                        avatar.hairColor === color ? 'border-purple-600 ring-2 ring-purple-300' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Eye Shape */}
              <div className="space-y-2">
                <label className="text-gray-900">Eye Shape</label>
                <select
                  value={avatar.eyeShape}
                  onChange={(e) => setAvatar({ ...avatar, eyeShape: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  {['almond', 'round', 'hooded', 'upturned'].map(shape => (
                    <option key={shape} value={shape}>{shape}</option>
                  ))}
                </select>
              </div>

              {/* Eye Color */}
              <div className="space-y-2">
                <label className="text-gray-900">Eye Color</label>
                <div className="flex gap-2 flex-wrap">
                  {['#6b4423', '#2e5c8a', '#5a9a5c', '#808080'].map(color => (
                    <button
                      key={color}
                      onClick={() => setAvatar({ ...avatar, eyeColor: color })}
                      className={`w-10 h-10 rounded-full border-2 ${
                        avatar.eyeColor === color ? 'border-purple-600 ring-2 ring-purple-300' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Makeup */}
              <div className="space-y-2">
                <label className="text-gray-900">Makeup</label>
                <div className="flex gap-2">
                  {(['none', 'light', 'bold'] as const).map(level => (
                    <button
                      key={level}
                      onClick={() => setAvatar({ ...avatar, makeup: level })}
                      className={`px-4 py-2 rounded-lg ${
                        avatar.makeup === level
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                {avatar.makeup !== 'none' && (
                  <div className="space-y-1">
                    <label className="text-gray-600">Intensity: {avatar.makeupIntensity}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={avatar.makeupIntensity}
                      onChange={(e) => setAvatar({ ...avatar, makeupIntensity: Number(e.target.value) })}
                      className="w-full accent-purple-600"
                    />
                  </div>
                )}
              </div>

              {/* Eyewear */}
              <div className="space-y-2">
                <label className="text-gray-900">Eyewear</label>
                <select
                  value={avatar.eyewear}
                  onChange={(e) => setAvatar({ ...avatar, eyewear: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  {['none', 'glasses', 'sunglasses', 'reading'].map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              {/* Accessories */}
              <div className="space-y-2">
                <label className="text-gray-900">Accessories</label>
                <div className="flex gap-2 flex-wrap">
                  {['none', 'earrings', 'hat', 'headband', 'necklace'].map(accessory => (
                    <button
                      key={accessory}
                      onClick={() => {
                        if (accessory === 'none') {
                          setAvatar({ ...avatar, accessories: [] });
                        } else {
                          const newAccessories = avatar.accessories.includes(accessory)
                            ? avatar.accessories.filter(a => a !== accessory)
                            : [...avatar.accessories.filter(a => a !== 'none'), accessory];
                          setAvatar({ ...avatar, accessories: newAccessories });
                        }
                      }}
                      className={`px-4 py-2 rounded-lg ${
                        (accessory === 'none' && avatar.accessories.length === 0) ||
                        avatar.accessories.includes(accessory)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {accessory}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center justify-center gap-2 flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:opacity-90 transition-opacity"
            >
              <Save className="w-5 h-5" />
              Save Avatar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function generateAvatarSVG(avatar: AvatarConfig): string {
  return `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="80" fill="${avatar.skinTone}" />
    ${avatar.hairStyle !== 'bald' ? `<ellipse cx="100" cy="60" rx="85" ry="50" fill="${avatar.hairColor}" />` : ''}
    <ellipse cx="75" cy="90" rx="8" ry="10" fill="${avatar.eyeColor}" />
    <ellipse cx="125" cy="90" rx="8" ry="10" fill="${avatar.eyeColor}" />
    <path d="M 80 120 Q 100 130 120 120" stroke="#000" strokeWidth="2" fill="none" />
  </svg>`;
}