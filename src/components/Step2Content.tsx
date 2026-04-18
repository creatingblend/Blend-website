import { useState } from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

interface Step2ContentProps {
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

export function Step2Content({ formData, updateFormData, toggleArrayItem }: Step2ContentProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    religion: true,
    politics: false,
    racePreference: false,
    relationshipGoal: false,
    children: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Handle relationship goal timeline toggle
  const handleRelationshipGoalToggle = (label: string) => {
    toggleArrayItem('relationshipGoal', label);
    // If deselecting Marriage/Long-term relationship, clear the timeline
    if (label === 'Marriage / Long-term relationship' && formData.relationshipGoal.includes(label)) {
      updateFormData('relationshipTimeline', '');
    }
  };

  return (
    <div className="space-y-4">
      {/* Religion */}
      <SectionDropdown 
        title="Religion ✝️☪️🕉️" 
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
                  ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:border-purple-500 text-gray-900 dark:text-white'
                  : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
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
        title="Political Views 🗳️" 
        required 
        isOpen={expandedSections.politics} 
        onToggle={() => toggleSection('politics')}
      >
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">Select all that apply</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Liberal', emoji: '���' },
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
                  ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:border-purple-500 text-gray-900 dark:text-white'
                  : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
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

      {/* Race Preference */}
      <SectionDropdown 
        title="Race Preference 🌍" 
        required 
        isOpen={expandedSections.racePreference} 
        onToggle={() => toggleSection('racePreference')}
      >
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">Select all that apply</p>
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
            { label: 'No Preference', emoji: '💫' }
          ].map(option => (
            <button
              key={option.label}
              onClick={() => toggleArrayItem('racePreference', option.label)}
              className={`relative p-4 rounded-xl border-2 transition-colors ${
                formData.racePreference.includes(option.label)
                  ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:border-purple-500 text-gray-900 dark:text-white'
                  : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
              }`}
            >
              {formData.racePreference.includes(option.label) && (
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

      {/* Relationship Goal */}
      <SectionDropdown 
        title="Relationship Goal 💕" 
        required 
        isOpen={expandedSections.relationshipGoal} 
        onToggle={() => toggleSection('relationshipGoal')}
      >
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">Select all that apply - This is a mandatory match filter</p>
        <div className="grid grid-cols-1 gap-3">
          {[
            { label: 'Marriage / Long-term relationship', emoji: '💍' },
            { label: 'Casual dating', emoji: '☕' },
            { label: 'New friends', emoji: '👋' },
            { label: 'Figuring it out', emoji: '🤔' }
          ].map(option => (
            <button
              key={option.label}
              onClick={() => handleRelationshipGoalToggle(option.label)}
              className={`relative p-4 rounded-xl border-2 transition-colors text-left ${
                formData.relationshipGoal.includes(option.label)
                  ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:border-purple-500 text-gray-900 dark:text-white'
                  : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
              }`}
            >
              {formData.relationshipGoal.includes(option.label) && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
              <span className="mr-2">{option.emoji}</span>
              {option.label}
            </button>
          ))}
        </div>

        {/* Timeline dropdown when Marriage/Long-term relationship is selected */}
        {formData.relationshipGoal.includes('Marriage / Long-term relationship') && (
          <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-700">
            <label className="text-gray-900 dark:text-gray-100 font-medium text-sm mb-3 block">
              Timeline for marriage/long-term commitment? ⏰
            </label>
            <div className="grid grid-cols-1 gap-2">
              {[
                'Within 6 months',
                'Within a year',
                'Within 2 years',
                'Within 3-5 years',
                'No specific timeline'
              ].map(timeline => (
                <button
                  key={timeline}
                  onClick={() => updateFormData('relationshipTimeline', timeline)}
                  className={`p-3 rounded-xl border-2 transition-colors text-left text-sm ${
                    formData.relationshipTimeline === timeline
                      ? 'border-purple-600 bg-purple-100 dark:bg-purple-800/50 dark:border-purple-500 text-gray-900 dark:text-white'
                      : 'border-purple-200 dark:border-purple-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {formData.relationshipTimeline === timeline && '✓ '}{timeline}
                </button>
              ))}
            </div>
          </div>
        )}
      </SectionDropdown>

      {/* Children */}
      <SectionDropdown 
        title="Children 👶" 
        required 
        isOpen={expandedSections.children} 
        onToggle={() => toggleSection('children')}
      >
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">Select all that apply</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Have children', emoji: '👶' },
            { label: "Don't have children", emoji: '🚫' },
            { label: 'Want children', emoji: '💕' },
            { label: "Don't want children", emoji: '❌' },
            { label: 'Open to children', emoji: '🤔' },
            { label: 'Prefer not to say', emoji: '🤐' }
          ].map(option => (
            <button
              key={option.label}
              onClick={() => toggleArrayItem('children', option.label)}
              className={`relative p-4 rounded-xl border-2 transition-colors ${
                (formData.children || []).includes(option.label)
                  ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:border-purple-500 text-gray-900 dark:text-white'
                  : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
              }`}
            >
              {(formData.children || []).includes(option.label) && (
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
    </div>
  );
}