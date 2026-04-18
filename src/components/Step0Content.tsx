import { useState } from 'react';
import { Check, X, ChevronDown, ChevronUp } from 'lucide-react';

interface Step0ContentProps {
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
    <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
      >
        <span className="font-semibold text-gray-900 dark:text-white">{title} {required && '*'}</span>
        {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />}
      </button>
      {isOpen && (
        <div className="p-4 border-t-2 border-gray-200 dark:border-gray-700">
          {children}
        </div>
      )}
    </div>
  );
}

export function Step0Content({ formData, updateFormData, toggleArrayItem }: Step0ContentProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    exercise: false,
    heightWeight: false,
    languages: false,
    ageRange: false,
    heightPref: false,
    bodyTypePref: false,
    distance: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="space-y-4">
      {/* Basic Info */}
      <SectionDropdown 
        title="Basic Information" 
        required 
        isOpen={expandedSections.basic} 
        onToggle={() => toggleSection('basic')}
      >
        <div className="space-y-4">
          {/* Name */}
          <div className="space-y-3">
            <label className="text-gray-900 dark:text-gray-100">Your Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => updateFormData('name', e.target.value)}
              placeholder="Enter your name"
              className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-purple-600 dark:focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>

          {/* Age */}
          <div className="space-y-3">
            <label className="text-gray-900 dark:text-gray-100">Age *</label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                updateFormData('age', isNaN(val) ? '' : val);
              }}
              className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-purple-600 dark:focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
              placeholder="25"
            />
          </div>
        </div>
      </SectionDropdown>

      {/* Exercise Habits */}
      <SectionDropdown 
        title="Exercise Habits 💪" 
        required 
        isOpen={expandedSections.exercise} 
        onToggle={() => toggleSection('exercise')}
      >
        <div className="grid grid-cols-1 gap-3">
          {['I exercise regularly', 'I mildly work out', 'I do not exercise regularly'].map(option => (
            <button
              key={option}
              onClick={() => updateFormData('exerciseHabits', option)}
              className={`p-4 rounded-xl border-2 text-left transition-colors ${
                formData.exerciseHabits === option
                  ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:border-purple-500 text-gray-900 dark:text-white'
                  : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
              }`}
            >
              {formData.exerciseHabits === option && '✓ '}{option}
            </button>
          ))}
        </div>
      </SectionDropdown>

      {/* Height & Weight */}
      <SectionDropdown 
        title="Height & Weight 📏" 
        required 
        isOpen={expandedSections.heightWeight} 
        onToggle={() => toggleSection('heightWeight')}
      >
        <div className="space-y-4">
          <div>
            <label className="text-gray-700 dark:text-gray-300 text-sm block mb-2">Height *</label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Ft"
                value={formData.heightFt}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  updateFormData('heightFt', isNaN(val) ? '' : val);
                }}
                className="w-full p-3 min-w-0 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-purple-600 dark:focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
              <input
                type="number"
                placeholder="In"
                value={formData.heightIn}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  updateFormData('heightIn', isNaN(val) ? '' : val);
                }}
                className="w-full p-3 min-w-0 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-purple-600 dark:focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>
          </div>
          
          <div>
            <label className="text-gray-700 dark:text-gray-300 text-sm block mb-2">Weight (lbs) *</label>
            <input
              type="number"
              value={formData.weightLbs}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                updateFormData('weightLbs', isNaN(val) ? '' : val);
              }}
              className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-purple-600 dark:focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl border border-purple-200 dark:border-purple-700">
            <span className="text-gray-700 dark:text-gray-300">Body Type:</span>
            <span className="font-semibold text-purple-600 dark:text-purple-400">{formData.autoBodyType}</span>
          </div>
        </div>
      </SectionDropdown>

      {/* Languages */}
      <SectionDropdown 
        title="Languages I Speak 🌍" 
        required 
        isOpen={expandedSections.languages} 
        onToggle={() => toggleSection('languages')}
      >
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {['English 🇺🇸', 'Spanish 🇪🇸', 'Mandarin 中文', 'French 🇫🇷', 'German 🇩🇪', 'Japanese 日本語'].map(option => {
              const langName = option.split(' ')[0];
              const isSelected = formData.languages.some((l: any) => l.language.includes(langName));
              return (
                <button
                  key={option}
                  onClick={() => {
                    if (isSelected) {
                      updateFormData('languages', formData.languages.filter((l: any) => !l.language.includes(langName)));
                    } else {
                      updateFormData('languages', [...formData.languages, { language: option }]);
                    }
                  }}
                  className={`relative p-4 rounded-xl border-2 transition-colors ${
                    isSelected
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:border-purple-500 text-gray-900 dark:text-white'
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <span className="block truncate">{option}</span>
                </button>
              );
            })}
          </div>
          
          {/* Add Another Language */}
          <div className="flex items-center gap-3 mt-3">
            <input
              type="text"
              value={formData.languageInput || ''}
              onChange={(e) => updateFormData('languageInput', e.target.value)}
              placeholder="Add another language..."
              className="flex-1 p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-purple-600 dark:focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
            <button
              onClick={() => {
                if (formData.languageInput && formData.languageInput.trim().length > 0) {
                  updateFormData('languages', [...formData.languages, { language: formData.languageInput }]);
                  updateFormData('languageInput', '');
                }
              }}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
            >
              Add
            </button>
          </div>

          {/* Uncommon Languages */}
          <div className="mt-4 pt-4 border-t-2 border-gray-200 dark:border-gray-700">
            <label className="text-gray-700 dark:text-gray-300 font-medium block mb-3">Uncommon Languages</label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={formData.uncommonLanguageInput || ''}
                onChange={(e) => updateFormData('uncommonLanguageInput', e.target.value)}
                placeholder="Add an uncommon language..."
                className="flex-1 p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-purple-600 dark:focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
              <button
                onClick={() => {
                  if (formData.uncommonLanguageInput && formData.uncommonLanguageInput.trim().length > 0) {
                    updateFormData('languages', [...formData.languages, { language: formData.uncommonLanguageInput }]);
                    updateFormData('uncommonLanguageInput', '');
                  }
                }}
                className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {formData.languages.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.languages.map((lang: any, index: number) => (
                <span
                  key={index}
                  className="px-3 py-2 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-sm flex items-center gap-2"
                >
                  {lang.language}
                  <button
                    onClick={() => {
                      updateFormData('languages', formData.languages.filter((_: any, i: number) => i !== index));
                    }}
                    className="hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </SectionDropdown>

      {/* Age Range Preference */}
      <SectionDropdown 
        title="Age Range Preference 🎂" 
        required 
        isOpen={expandedSections.ageRange} 
        onToggle={() => toggleSection('ageRange')}
      >
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-600 dark:text-gray-400 text-sm mb-2 block">Min Age</label>
              <input
                type="number"
                value={formData.ageMin}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  updateFormData('ageMin', isNaN(val) ? 18 : val);
                }}
                className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-purple-600 dark:focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-gray-600 dark:text-gray-400 text-sm mb-2 block">Max Age</label>
              <input
                type="number"
                value={formData.ageMax}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  updateFormData('ageMax', isNaN(val) ? 99 : val);
                }}
                className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-purple-600 dark:focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Looking for ages {formData.ageMin} - {formData.ageMax}
          </p>
        </div>
      </SectionDropdown>

      {/* Height Preference */}
      <SectionDropdown 
        title="Height Preference 📏" 
        required 
        isOpen={expandedSections.heightPref} 
        onToggle={() => toggleSection('heightPref')}
      >
        <div className="grid grid-cols-2 gap-3">
          {['Shorter than me', 'Same height', 'Taller than me', 'No preference'].map(option => (
            <button
              key={option}
              onClick={() => toggleArrayItem('heightPreference', option)}
              className={`relative p-4 rounded-xl border-2 transition-colors ${
                formData.heightPreference.includes(option)
                  ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:border-purple-500 text-gray-900 dark:text-white'
                  : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
              }`}
            >
              {formData.heightPreference.includes(option) && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
              {option}
            </button>
          ))}
        </div>
      </SectionDropdown>

      {/* Body Type Preference */}
      <SectionDropdown 
        title="Body Type Preference 💪" 
        required 
        isOpen={expandedSections.bodyTypePref} 
        onToggle={() => toggleSection('bodyTypePref')}
      >
        <div className="grid grid-cols-2 gap-3">
          {['Slim', 'Athletic', 'Average', 'Curvy', 'Muscular', 'No preference'].map(option => (
            <button
              key={option}
              onClick={() => toggleArrayItem('bodyTypePreference', option)}
              className={`relative p-4 rounded-xl border-2 transition-colors ${
                formData.bodyTypePreference.includes(option)
                  ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:border-purple-500 text-gray-900 dark:text-white'
                  : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
              }`}
            >
              {formData.bodyTypePreference.includes(option) && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
              {option}
            </button>
          ))}
        </div>
      </SectionDropdown>

      {/* Distance */}
      <SectionDropdown 
        title="Match Distance 🗺️" 
        required 
        isOpen={expandedSections.distance} 
        onToggle={() => toggleSection('distance')}
      >
        <div className="space-y-3">
          <input
            type="range"
            min="1"
            max="100"
            value={formData.maxDistance}
            onChange={(e) => updateFormData('maxDistance', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">1 mi</span>
            <span className="font-semibold text-purple-600 dark:text-purple-400">{formData.maxDistance} miles</span>
            <span className="text-gray-600 dark:text-gray-400">100 mi</span>
          </div>
        </div>
      </SectionDropdown>
    </div>
  );
}