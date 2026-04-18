import { useState } from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

interface Step1ContentProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  toggleArrayItem: (field: string, item: string) => void;
}

interface SectionDropdownProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  required?: boolean;
}

function SectionDropdown({ title, isOpen, onToggle, children, required }: SectionDropdownProps) {
  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="font-semibold text-gray-900">{title} {required && '*'}</span>
        {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
      </button>
      {isOpen && (
        <div className="p-4 border-t-2 border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
}

export function Step1Content({ formData, updateFormData, toggleArrayItem }: Step1ContentProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    gender: false,
    race: false,
    interestedIn: false,
    religion: false,
    politics: false,
    military: false,
    pronouns: false,
    zodiacSign: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="space-y-4">
      {/* Gender */}
      <SectionDropdown 
        title="I am a" 
        required 
        isOpen={expandedSections.gender} 
        onToggle={() => toggleSection('gender')}
      >
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Man', emoji: '👨' },
            { label: 'Woman', emoji: '👩' },
            { label: 'Non-binary', emoji: '⚧️' },
            { label: 'Trans Male', emoji: '🏳️‍⚧️' },
            { label: 'Trans Female', emoji: '🏳️‍⚧️' },
            { label: 'Other', emoji: '✨' }
          ].map(option => (
            <button
              key={option.label}
              onClick={() => updateFormData('gender', option.label)}
              className={`p-4 rounded-xl border-2 transition-colors ${
                formData.gender === option.label
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <span className="mr-2">{option.emoji}</span>
              {option.label}
            </button>
          ))}
        </div>
      </SectionDropdown>

      {/* Race */}
      <SectionDropdown 
        title="My Race/Ethnicity" 
        required 
        isOpen={expandedSections.race} 
        onToggle={() => toggleSection('race')}
      >
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Asian', emoji: '🌏' },
            { label: 'South Asian', emoji: '🌏' },
            { label: 'Black', emoji: '🌍' },
            { label: 'Hispanic', emoji: '🌎' },
            { label: 'White', emoji: '🌎' },
            { label: 'Middle Eastern', emoji: '🕌' },
            { label: 'Pacific Islander', emoji: '🏝️' },
            { label: 'Native American', emoji: '🪶' },
            { label: 'Mixed', emoji: '🤝' },
            { label: 'Other', emoji: '🌟' },
            { label: 'Prefer not to say', emoji: '🤐' }
          ].map(option => (
            <button
              key={option.label}
              onClick={() => updateFormData('race', option.label)}
              className={`p-4 rounded-xl border-2 transition-colors ${
                formData.race === option.label
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <span className="mr-2">{option.emoji}</span>
              {option.label}
            </button>
          ))}
        </div>
      </SectionDropdown>

      {/* Interested In */}
      <SectionDropdown 
        title="Interested in" 
        required 
        isOpen={expandedSections.interestedIn} 
        onToggle={() => toggleSection('interestedIn')}
      >
        <p className="text-gray-600 text-sm mb-3">Select all that apply</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Men', emoji: '👨' },
            { label: 'Women', emoji: '👩' },
            { label: 'Non-binary', emoji: '⚧️' },
            { label: 'Bisexual', emoji: '💜' },
            { label: 'Other', emoji: '💖' }
          ].map(option => (
            <button
              key={option.label}
              onClick={() => toggleArrayItem('orientation', option.label)}
              className={`relative p-4 rounded-xl border-2 transition-colors ${
                formData.orientation.includes(option.label)
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {formData.orientation.includes(option.label) && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
              <span className="mr-2">{option.emoji}</span>
              {option.label}
            </button>
          ))}
        </div>
      </SectionDropdown>

      {/* Religion */}
      <SectionDropdown 
        title="Religion" 
        required 
        isOpen={expandedSections.religion} 
        onToggle={() => toggleSection('religion')}
      >
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Christian', emoji: '✝️' },
            { label: 'Muslim', emoji: '☪️' },
            { label: 'Hindu', emoji: '🕉️' },
            { label: 'Buddhist', emoji: '☸️' },
            { label: 'Jewish', emoji: '✡️' },
            { label: 'Mormon', emoji: '📖' },
            { label: 'Atheist', emoji: '🔬' },
            { label: 'Agnostic', emoji: '🤔' },
            { label: 'Spiritual', emoji: '✨' },
            { label: 'Other', emoji: '🌟' },
            { label: 'No Preference', emoji: '💫' }
          ].map(option => (
            <button
              key={option.label}
              onClick={() => updateFormData('religion', option.label)}
              className={`p-4 rounded-xl border-2 transition-colors ${
                formData.religion === option.label
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <span className="mr-2">{option.emoji}</span>
              {option.label}
            </button>
          ))}
        </div>
      </SectionDropdown>

      {/* Political Views */}
      <SectionDropdown 
        title="Political Views" 
        required 
        isOpen={expandedSections.politics} 
        onToggle={() => toggleSection('politics')}
      >
        <p className="text-gray-600 text-sm mb-3">Select all that apply</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Liberal', emoji: '🗽' },
            { label: 'Conservative', emoji: '🦅' },
            { label: 'Moderate', emoji: '⚖️' },
            { label: 'Progressive', emoji: '🌱' },
            { label: 'Libertarian', emoji: '🦋' },
            { label: 'Socialist', emoji: '🤝' },
            { label: 'Apolitical', emoji: '🤷' },
            { label: 'No Preference', emoji: '🌟' }
          ].map(option => (
            <button
              key={option.label}
              onClick={() => toggleArrayItem('politics', option.label)}
              className={`relative p-4 rounded-xl border-2 transition-colors ${
                formData.politics.includes(option.label)
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {formData.politics.includes(option.label) && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
              <span className="mr-2">{option.emoji}</span>
              {option.label}
            </button>
          ))}
        </div>
      </SectionDropdown>

      {/* Military Service (Optional) */}
      <SectionDropdown 
        title="Military Service (Optional)" 
        isOpen={expandedSections.military} 
        onToggle={() => toggleSection('military')}
      >
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Currently Serving', emoji: '🛡️' },
            { label: 'Veteran', emoji: '🎖️' },
            { label: 'Interested in Joining', emoji: '🪖' },
            { label: 'Skip', emoji: '⏭️' }
          ].map(option => (
            <button
              key={option.label}
              onClick={() => updateFormData('military', option.label)}
              className={`p-4 rounded-xl border-2 transition-colors ${
                formData.military === option.label
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <span className="mr-2">{option.emoji}</span>
              {option.label}
            </button>
          ))}
        </div>
      </SectionDropdown>

      {/* Pronouns (Optional) */}
      <SectionDropdown 
        title="Pronouns (Optional)" 
        isOpen={expandedSections.pronouns} 
        onToggle={() => toggleSection('pronouns')}
      >
        <p className="text-gray-600 text-sm mb-3">Select all that apply</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'He/Him', emoji: '👨' },
            { label: 'She/Her', emoji: '👩' },
            { label: 'They/Them', emoji: '⚧️' },
            { label: 'Other', emoji: '✨' },
            { label: 'Prefer not to share', emoji: '🤐' }
          ].map(option => (
            <button
              key={option.label}
              onClick={() => toggleArrayItem('pronouns', option.label)}
              className={`relative p-4 rounded-xl border-2 transition-colors ${
                formData.pronouns.includes(option.label)
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {formData.pronouns.includes(option.label) && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
              <span className="mr-2">{option.emoji}</span>
              {option.label}
            </button>
          ))}
        </div>
      </SectionDropdown>

      {/* Zodiac Sign (Optional) */}
      <SectionDropdown 
        title="Zodiac Sign (Optional)" 
        isOpen={expandedSections.zodiacSign} 
        onToggle={() => toggleSection('zodiacSign')}
      >
        <div className="grid grid-cols-3 gap-2">
          {['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces', 'Prefer not to share'].map(sign => (
            <button
              key={sign}
              onClick={() => updateFormData('zodiacSign', sign)}
              className={`p-3 rounded-xl border-2 text-sm transition-colors ${
                formData.zodiacSign === sign
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {sign}
            </button>
          ))}
        </div>
      </SectionDropdown>
    </div>
  );
}