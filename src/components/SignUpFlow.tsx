import { useState, useEffect } from 'react';
import { Check, ChevronRight, ChevronDown, ChevronUp, X } from 'lucide-react';
import { DualRangeSlider } from './DualRangeSlider';
import { TransitionPopup } from './TransitionPopup';

interface SignUpFlowProps {
  onComplete: () => void;
}

export function SignUpFlow({ onComplete }: SignUpFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showTransition, setShowTransition] = useState(false);
  const [transitionConfig, setTransitionConfig] = useState<{
    lines: string[];
    showConfetti?: boolean;
    nextStep?: number;
    isComplete?: boolean;
  }>({ lines: [] });
  const [expandedHobby, setExpandedHobby] = useState<string | null>(null);
  const [showAllPersonality, setShowAllPersonality] = useState(false);
  const [showAllDesiresActivities, setShowAllDesiresActivities] = useState(false);
  const [showAllDesiresTraits, setShowAllDesiresTraits] = useState(false);
  const [expandedFoods, setExpandedFoods] = useState(false);
  const [expandedMusicPerforming, setExpandedMusicPerforming] = useState(false);
  const [expandedMusicListening, setExpandedMusicListening] = useState(false);
  const [expandedMoviesTV, setExpandedMoviesTV] = useState(false);
  const [showDesireModal, setShowDesireModal] = useState(false);
  const [selectedDesire, setSelectedDesire] = useState<{ field: string, value: string } | null>(null);
  const [desireHoldTimeout, setDesireHoldTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState<{ field: string, value: string } | null>(null);
  const [interestHoldTimeout, setInterestHoldTimeout] = useState<NodeJS.Timeout | null>(null);
  const [formData, setFormData] = useState({
    // Name and About
    name: '',
    about: '',
    
    // Personal Info
    age: '',
    heightSystem: 'imperial' as 'imperial' | 'metric',
    heightFt: '' as number | '',
    heightIn: '' as number | '',
    heightCm: '' as number | '',
    weightSystem: 'imperial' as 'imperial' | 'metric' | 'stone',
    weightLbs: '' as number | '',
    weightKg: '' as number | '',
    weightStone: '' as number | '',
    weightStoneLbs: '' as number | '',
    exerciseHabits: '',
    autoBodyType: 'Average',
    
    // Identity
    gender: '',
    orientation: [] as string[],
    race: '',
    military: '',
    pronouns: [] as string[],
    zodiacSign: '',
    
    // Languages
    languages: [] as Array<{ language: string, nativeScript?: string }>,
    languageInput: '',
    
    // Preferences
    ageMin: 20,
    ageMax: 30,
    heightPreference: [] as string[],
    bodyTypePreference: [] as string[],
    religion: '',
    politics: [] as string[],
    racePreference: [] as string[],
    
    // Relationship
    relationshipGoal: [] as string[],
    marriageDesire: '',
    childrenPreference: [] as string[],
    
    // Distance
    maxDistance: 50,
    useMetric: false,
    
    // Interests
    hobbies: {} as Record<string, string[]>,
    priorityHobbies: [] as string[],
    dealbreakerHobbies: [] as string[],
    favoriteFoods: [] as string[],
    priorityFoods: [] as string[],
    dealbreakerFoods: [] as string[],
    musicPerforming: [] as string[],
    priorityMusicPerforming: [] as string[],
    dealbreakerMusicPerforming: [] as string[],
    musicListening: [] as string[],
    priorityMusicListening: [] as string[],
    dealbreakerMusicListening: [] as string[],
    moviesTV: [] as string[],
    priorityMoviesTV: [] as string[],
    dealbreakerMoviesTV: [] as string[],
    personality: [] as string[],
    dealbreakers: [] as string[],
    
    // Desires - What I am hoping for
    desiresActivities: [] as string[],
    desiresTraits: [] as string[],
    priorityDesires: [] as string[],
    dealbreakerDesires: [] as string[],
    highlightDesires: [] as string[]
  });

  // Show initial welcome popup
  useEffect(() => {
    setTransitionConfig({
      lines: [
        "Let's get started! ✨",
        "First: what is your name, and tell us a little bit about yourself"
      ],
      nextStep: 0
    });
    setShowTransition(true);
  }, []); // Only run once on mount

  const steps = [
    'Name & About',
    'Identity',
    'Personal Info',
    'Languages',
    'Age & Height',
    'Preferences',
    'Relationship',
    'Distance',
    'Interests',
    'Food, Music & Entertainment',
    'Dealbreakers',
    'What you want'
  ];

  // Calculate BMI and auto-assign body type
  const calculateBodyType = (heightFt: number | '', heightIn: number | '', weight: number | '', exerciseHabits: string) => {
    // Return default if any value is missing
    if (heightFt === '' || heightIn === '' || weight === '' || !exerciseHabits) {
      return 'Average';
    }
    
    const totalInches = (heightFt * 12) + heightIn;
    const heightMeters = totalInches * 0.0254;
    const weightKg = weight * 0.453592;
    const bmi = weightKg / (heightMeters * heightMeters);
    
    if (exerciseHabits === 'I exercise regularly') {
      if (bmi < 18.5) return 'Skinny';
      if (bmi < 25) return 'Athletic';
      if (bmi < 30) return 'Muscular';
      return 'Plus-size';
    } else if (exerciseHabits === 'I mildly work out') {
      if (bmi < 18.5) return 'Skinny';
      if (bmi < 25) return 'Average';
      if (bmi < 30) return 'Athletic';
      return 'Plus-size';
    } else {
      if (bmi < 18.5) return 'Skinny';
      if (bmi < 25) return 'Average';
      if (bmi < 30) return 'Curvy';
      return 'Plus-size';
    }
  };

  const handleNext = () => {
    // Determine if we need a transition popup
    let transitionNeeded = false;
    let config: typeof transitionConfig = { lines: [] };

    // Step 0 → 1: After name/about, going to personal info
    if (currentStep === 0) {
      transitionNeeded = true;
      config = {
        lines: [
          `Nice to meet you, ${formData.name || 'friend'}! 👋`,
          "now let's find out some of your details and some of your mandatory interests"
        ],
        nextStep: 1
      };
    }
    // Step 2 → 3: Going to languages
    else if (currentStep === 2) {
      transitionNeeded = true;
      config = {
        lines: [
          "Great! Your profile is coming along 🎉",
          "What languages do you speak? We even included some 'lesser known' languages for you to share"
        ],
        nextStep: 3
      };
    }
    // Step 7 → 8: Going to interests (after distance)
    else if (currentStep === 7) {
      transitionNeeded = true;
      config = {
        lines: [
          "Awesome! Now then, let's get into the details about your personality ✨",
          "💡 Tip: Hold any interest to mark it as mandatory or a dealbreaker"
        ],
        nextStep: 8
      };
    }
    // Step 9 → 10: Going to dealbreakers
    else if (currentStep === 9) {
      transitionNeeded = true;
      config = {
        lines: [
          "Almost there! 🎯",
          "Tell us some things that would be unacceptable ⚠️"
        ],
        nextStep: 10
      };
    }
    // Step 10 → 11: Going to desires
    else if (currentStep === 10) {
      transitionNeeded = true;
      config = {
        lines: [
          "You made it to the final page! 🎊",
          "These next options don't affect your compatibility, but they do let your potential interests know what you're looking for"
        ],
        nextStep: 11
      };
    }
    // Step 11 → Complete: Final message
    else if (currentStep === 11) {
      transitionNeeded = true;
      config = {
        lines: [
          "You made it! 🎉",
          "Now get out there and meet some new people!"
        ],
        showConfetti: true,
        isComplete: true
      };
    }

    if (transitionNeeded) {
      setTransitionConfig(config);
      setShowTransition(true);
    } else {
      // No transition, just move to next step
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        onComplete();
      }
    }
  };

  const handleTransitionComplete = () => {
    setShowTransition(false);
    if (transitionConfig.isComplete) {
      onComplete();
    } else if (transitionConfig.nextStep !== undefined) {
      setCurrentStep(transitionConfig.nextStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate age range when age changes
      if (field === 'age' && typeof value === 'number' && value > 0) {
        const minAge = Math.max(18, value - 10);
        const maxAge = Math.min(99, value + 10);
        updated.ageMin = minAge;
        updated.ageMax = maxAge;
      }
      
      // Auto-calculate body type when height/weight/exercise changes
      if (field === 'heightFt' || field === 'heightIn' || field === 'weightLbs' || field === 'exerciseHabits') {
        updated.autoBodyType = calculateBodyType(
          updated.heightFt,
          updated.heightIn,
          updated.weightLbs,
          updated.exerciseHabits
        );
      }
      
      return updated;
    });
  };

  const toggleArrayItem = (field: string, item: string) => {
    setFormData(prev => {
      // 1. Handle the main array update
      const currentArray = prev[field as keyof typeof prev] as string[];
      const isRemoving = currentArray.includes(item);
      
      let newMainArray: string[];
      if (isRemoving) {
        newMainArray = currentArray.filter(i => i !== item);
      } else {
        newMainArray = [...currentArray, item];
      }
      
      // Start with a clone of prev
      const updated = {
        ...prev,
        [field]: newMainArray
      };

      if (isRemoving) {
        // Explicitly handle Step 9 Interest Cleanups
        if (field === 'favoriteFoods') {
          updated.priorityFoods = prev.priorityFoods.filter(i => i !== item);
          updated.dealbreakerFoods = prev.dealbreakerFoods.filter(i => i !== item);
        } else if (field === 'musicPerforming') {
          updated.priorityMusicPerforming = prev.priorityMusicPerforming.filter(i => i !== item);
          updated.dealbreakerMusicPerforming = prev.dealbreakerMusicPerforming.filter(i => i !== item);
        } else if (field === 'musicListening') {
          updated.priorityMusicListening = prev.priorityMusicListening.filter(i => i !== item);
          updated.dealbreakerMusicListening = prev.dealbreakerMusicListening.filter(i => i !== item);
        } else if (field === 'moviesTV') {
          updated.priorityMoviesTV = prev.priorityMoviesTV.filter(i => i !== item);
          updated.dealbreakerMoviesTV = prev.dealbreakerMoviesTV.filter(i => i !== item);
        }
        
        // Handle Desires Cleanup
        if (field === 'desiresActivities' || field === 'desiresTraits') {
           const combinedDesire = `${field}:${item}`;
           updated.priorityDesires = prev.priorityDesires.filter(d => d !== combinedDesire);
           updated.dealbreakerDesires = prev.dealbreakerDesires.filter(d => d !== combinedDesire);
           updated.highlightDesires = prev.highlightDesires.filter(d => d !== combinedDesire);
        }
      }
      
      return updated;
    });
  };

  const handleDesireMouseDown = (field: string, value: string) => {
    if (value === 'Other') return;
    const timeout = setTimeout(() => {
      setSelectedDesire({ field, value });
      setShowDesireModal(true);
    }, 500);
    setDesireHoldTimeout(timeout);
  };

  const handleDesireMouseUp = () => {
    if (desireHoldTimeout) {
      clearTimeout(desireHoldTimeout);
      setDesireHoldTimeout(null);
    }
  };

  const handleDesireSpecialAction = (action: 'mandatory' | 'dealbreaker' | 'highlight') => {
    if (!selectedDesire || selectedDesire.value === 'Other') return;

    const { field, value } = selectedDesire;
    const combinedDesire = `${field}:${value}`;

    setFormData(prev => {
      const updated = { ...prev };
      
      // First, toggle the desire in the main array
      if (!prev[field as keyof typeof prev].includes(value)) {
        (updated[field as keyof typeof prev] as string[]).push(value);
      }

      // Remove from all special arrays first
      updated.priorityDesires = prev.priorityDesires.filter(d => d !== combinedDesire);
      updated.dealbreakerDesires = prev.dealbreakerDesires.filter(d => d !== combinedDesire);
      updated.highlightDesires = prev.highlightDesires.filter(d => d !== combinedDesire);

      // Add to the selected special array
      if (action === 'mandatory') {
        updated.priorityDesires = [...updated.priorityDesires, combinedDesire];
      } else if (action === 'dealbreaker') {
        updated.dealbreakerDesires = [...updated.dealbreakerDesires, combinedDesire];
      } else if (action === 'highlight') {
        // Limit highlights to 4
        if (updated.highlightDesires.length < 4) {
          updated.highlightDesires = [...updated.highlightDesires, combinedDesire];
        }
      }

      return updated;
    });

    setShowDesireModal(false);
    setSelectedDesire(null);
  };

  const getDesireStatus = (field: string, value: string) => {
    const combinedDesire = `${field}:${value}`;
    if (formData.priorityDesires.includes(combinedDesire)) return 'mandatory';
    if (formData.dealbreakerDesires.includes(combinedDesire)) return 'dealbreaker';
    if (formData.highlightDesires.includes(combinedDesire)) return 'highlight';
    return null;
  };

  const handleInterestMouseDown = (field: string, value: string) => {
    if (value === 'Other') return;
    const timeout = setTimeout(() => {
      setSelectedInterest({ field, value });
      setShowInterestModal(true);
    }, 500);
    setInterestHoldTimeout(timeout);
  };

  const handleInterestMouseUp = () => {
    if (interestHoldTimeout) {
      clearTimeout(interestHoldTimeout);
      setInterestHoldTimeout(null);
    }
  };

  const handleInterestSpecialAction = (action: 'mandatory' | 'dealbreaker') => {
    if (!selectedInterest || selectedInterest.value === 'Other') return;

    const { field, value } = selectedInterest;
    
    // Map field names to their priority/dealbreaker equivalents
    const fieldMap: Record<string, string> = {
      'favoriteFoods': 'foods',
      'musicPerforming': 'musicPerforming',
      'musicListening': 'musicListening',
      'moviesTV': 'moviesTV',
      'hobbies': 'hobbies'
    };
    
    const mappedField = fieldMap[field] || field;
    const priorityField = `priority${mappedField.charAt(0).toUpperCase() + mappedField.slice(1)}` as keyof typeof formData;
    const dealbreakerField = `dealbreaker${mappedField.charAt(0).toUpperCase() + mappedField.slice(1)}` as keyof typeof formData;

    setFormData(prev => {
      const updated = { ...prev };
      
      // For hobbies, handle differently as it's stored in hobbies object
      if (field === 'hobbies') {
        // Value is in format "category:item"
        const [category, item] = value.split(':');
        const fullValue = `${category}: ${item}`;
        
        // Ensure the item is in the hobbies category
        if (!prev.hobbies[category]?.includes(fullValue)) {
          updated.hobbies = {
            ...prev.hobbies,
            [category]: [...(prev.hobbies[category] || []), fullValue]
          };
        }
      } else {
        // First, ensure the item is in the main array
        if (!(prev[field as keyof typeof prev] as string[]).includes(value)) {
          (updated[field as keyof typeof prev] as string[]) = [...(prev[field as keyof typeof prev] as string[]), value];
        }
      }

      // Remove from both arrays first
      const priorityArray = prev[priorityField] as string[] | undefined;
      const dealbreakerArray = prev[dealbreakerField] as string[] | undefined;
      
      (updated[priorityField] as string[]) = priorityArray ? priorityArray.filter(item => item !== value) : [];
      (updated[dealbreakerField] as string[]) = dealbreakerArray ? dealbreakerArray.filter(item => item !== value) : [];

      // Add to the selected array
      if (action === 'mandatory') {
        (updated[priorityField] as string[]) = [...(updated[priorityField] as string[]), value];
      } else if (action === 'dealbreaker') {
        (updated[dealbreakerField] as string[]) = [...(updated[dealbreakerField] as string[]), value];
      }

      return updated;
    });

    setShowInterestModal(false);
    setSelectedInterest(null);
  };

  const getInterestStatus = (field: string, value: string) => {
    // Map field names to their priority/dealbreaker equivalents
    const fieldMap: Record<string, string> = {
      'favoriteFoods': 'foods',
      'musicPerforming': 'musicPerforming',
      'musicListening': 'musicListening',
      'moviesTV': 'moviesTV',
      'hobbies': 'hobbies'
    };
    
    const mappedField = fieldMap[field] || field;
    const priorityField = `priority${mappedField.charAt(0).toUpperCase() + mappedField.slice(1)}` as keyof typeof formData;
    const dealbreakerField = `dealbreaker${mappedField.charAt(0).toUpperCase() + mappedField.slice(1)}` as keyof typeof formData;
    
    const priorityArray = formData[priorityField] as string[] | undefined;
    const dealbreakerArray = formData[dealbreakerField] as string[] | undefined;
    
    if (priorityArray && priorityArray.includes(value)) return 'mandatory';
    if (dealbreakerArray && dealbreakerArray.includes(value)) return 'dealbreaker';
    return null;
  };

  const updateHobbySubcategory = (hobby: string, subcategory: string) => {
    setFormData(prev => {
      const currentHobbies = prev.hobbies[hobby] || [];
      const isRemoving = currentHobbies.includes(subcategory);
      
      const updatedHobbies = isRemoving
        ? currentHobbies.filter(s => s !== subcategory)
        : [...currentHobbies, subcategory];
        
      const updated = {
        ...prev,
        hobbies: {
          ...prev.hobbies,
          [hobby]: updatedHobbies
        }
      };

      if (isRemoving) {
        // Clean up special arrays
        const fullValue = `${hobby}: ${subcategory}`;
        updated.priorityHobbies = prev.priorityHobbies.filter(h => h !== fullValue);
        updated.dealbreakerHobbies = prev.dealbreakerHobbies.filter(h => h !== fullValue);
      }
      
      return updated;
    });
  };

  const hobbyCategories = {
    'Games': {
      'Card Games': ['52 Cards/Standard Deck', 'Magic: The Gathering', 'Pokemon', 'Uno', 'Yu-Gi-Oh', 'Other'],
      'Board Games': ['Classic', 'Cooperative', 'Modern', 'Party Games', 'Strategy', 'Other'],
      'Video Games': ['Action', 'FPS', 'Horror', 'MMORPG', 'MOBA', 'Platformer', 'Puzzle', 'Racing', 'RPG', 'Simulation', 'Sports', 'Strategy', 'Survival', 'Other'],
      'Other': ['Trivia', 'Verbal Games', 'Word Games', 'Other']
    },
    'Sports (Watching)': ['Baseball', 'Basketball', 'Cricket', 'Football', 'Golf', 'Gymnastics', 'Hockey', 'Lacrosse', 'MMA', 'Motor Vehicle Racing', 'Olympics', 'Rugby', 'Soccer', 'Swimming', 'Tennis', 'Other'],
    'Sports (Playing)': ['Baseball', 'Basketball', 'Cricket', 'Cycling', 'Football', 'Golf', 'Gymnastics', 'Hockey', 'Lacrosse', 'Martial Arts', 'MMA', 'Olympics', 'Pickleball', 'Racquetball', 'Rugby', 'Running', 'Soccer', 'Swimming', 'Tennis', 'Yoga', 'Other'],
    'Outdoor': ['Beach Activities', 'Camping', 'Corn Hole', 'Hiking', 'Horse Shoes', 'Hunting', 'Kayaking', 'Outdoor Games', 'Rock Climbing', 'Skiing', 'Surfing', 'Other'],
    'Creative': ['Crafts', 'Design', 'DIY Projects', 'Drawing', 'Painting', 'Photography', 'Social Media Content Creator', 'Writing', 'Other'],
    'Learning': ['Documentaries', 'Higher Education', 'Languages', 'Museums', 'Online Courses', 'Podcasts', 'Reading', 'Social Media (YouTube/TikTok)', 'Other'],
    'Technology': ['AI/Tech News', 'Building PCs', 'Coding', 'Finance/Crypto', 'Gadgets', 'Gaming', 'Other'],
    'Social': ['Church', 'Clubs', 'Dancing', 'Karaoke', 'Meetups', 'Networking', 'Volunteering', 'Other']
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return formData.name.trim().length > 0;
      case 1: return formData.gender && formData.race && formData.orientation.length > 0;
      case 2: return formData.age > 0 && (formData.heightFt !== '' && formData.heightFt > 0) && (formData.weightLbs !== '' && formData.weightLbs > 0);
      case 3: return formData.languages.length > 0;
      case 4: return true;
      case 5: return formData.religion && formData.politics.length > 0 && formData.racePreference.length > 0;
      case 6: 
        const needsMarriage = formData.relationshipGoal.includes('Marriage / Long-term Relationship');
        return formData.relationshipGoal.length > 0 && 
               formData.childrenPreference.length > 0 &&
               (!needsMarriage || formData.marriageDesire);
      case 7: return true;
      case 8: return Object.keys(formData.hobbies).length > 0;
      case 9: return formData.favoriteFoods.length > 0 && (formData.musicPerforming.length > 0 || formData.musicListening.length > 0) && formData.moviesTV.length > 0;
      case 10: return true;
      case 11: return true;
      default: return false;
    }
  };

  const showMarriageQuestion = formData.relationshipGoal.includes('Marriage / Long-term Relationship');

  return (
    <div className="min-h-screen flex flex-col p-6">
      <div className="max-w-2xl w-full mx-auto flex-1 flex flex-col">
        {/* Progress */}
        <div className="space-y-4 mb-8">
          <div className="flex gap-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-purple-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600">Step {currentStep + 1} of {steps.length}</p>
              <h2 className="text-gray-900 mt-2">{steps[currentStep]}</h2>
            </div>
            <button
              onClick={handleNext}
              className="px-6 py-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              Skip
            </button>
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 mb-8 overflow-y-auto">
          {/* Step 0: Name & About */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-gray-900">Your Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  placeholder="Enter your name"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-600 outline-none"
                />
              </div>

              <div className="space-y-3">
                <label className="text-gray-900">About You (Optional)</label>
                <p className="text-gray-600">Tell us a bit about yourself (max 200 characters)</p>
                <textarea
                  value={formData.about}
                  onChange={(e) => {
                    if (e.target.value.length <= 200) {
                      updateFormData('about', e.target.value);
                    }
                  }}
                  placeholder="A few words about yourself..."
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-600 outline-none h-32 resize-none"
                />
                <p className="text-gray-500">{formData.about.length}/200 characters</p>
              </div>
            </div>
          )}

          {/* Step 1: Identity */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-gray-900">I am a *</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Man', emoji: '👨' },
                    { label: 'Woman', emoji: '👩' },
                    { label: 'Non-binary', emoji: '⚧️' },
                    { label: 'Trans Male', emoji: '🏳️‍⚧️' },
                    { label: 'Trans Female', emoji: '🏳️‍⚧️' },
                    { label: 'Custom', emoji: '✨' }
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
              </div>

              <div className="space-y-3">
                <label className="text-gray-900">My Race/Ethnicity *</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Asian', emoji: '🌏' },
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
              </div>

              <div className="space-y-3">
                <label className="text-gray-900">Interested in * (select all that apply)</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Men', emoji: '👨' },
                    { label: 'Women', emoji: '👩' },
                    { label: 'Non-binary', emoji: '⚧️' },
                    { label: 'Straight', emoji: '💑' },
                    { label: 'Gay', emoji: '🏳️‍🌈' },
                    { label: 'Lesbian', emoji: '💕' },
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
              </div>

              <div className="space-y-3">
                <label className="text-gray-900">Military Service (Optional)</label>
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
              </div>

              <div className="space-y-3">
                <label className="text-gray-900">Pronouns (Optional - select all that apply)</label>
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
              </div>

              <div className="space-y-3">
                <label className="text-gray-900">Zodiac Sign (Optional)</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Aquarius', emoji: '♒' },
                    { label: 'Aries', emoji: '♈' },
                    { label: 'Cancer', emoji: '♋' },
                    { label: 'Capricorn', emoji: '♑' },
                    { label: 'Gemini', emoji: '♊' },
                    { label: 'Leo', emoji: '♌' },
                    { label: 'Libra', emoji: '♎' },
                    { label: 'Pisces', emoji: '♓' },
                    { label: 'Sagittarius', emoji: '♐' },
                    { label: 'Scorpio', emoji: '♏' },
                    { label: 'Taurus', emoji: '♉' },
                    { label: 'Virgo', emoji: '♍' },
                    { label: 'Prefer not to share', emoji: '🤐' }
                  ].map(option => (
                    <button
                      key={option.label}
                      onClick={() => updateFormData('zodiacSign', option.label)}
                      className={`p-4 rounded-xl border-2 transition-colors ${
                        formData.zodiacSign === option.label
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <span className="mr-2">{option.emoji}</span>
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Personal Info */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-gray-900">Your Age *</label>
                <input
                  type="number"
                  min="18"
                  max="99"
                  value={formData.age || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateFormData('age', val === '' ? '' : Number(val));
                  }}
                  placeholder="Enter your age"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-600 outline-none text-center"
                />
              </div>

              <div className="space-y-3">
                <label className="text-gray-900">Your Height *</label>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-gray-600">Feet</label>
                    <input
                      type="number"
                      min="3"
                      max="8"
                      value={formData.heightFt}
                      onChange={(e) => updateFormData('heightFt', e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-600 outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-gray-600">Inches</label>
                    <input
                      type="number"
                      min="0"
                      max="11"
                      value={formData.heightIn}
                      onChange={(e) => updateFormData('heightIn', e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-600 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-gray-900">Your Weight (lbs) *</label>
                <input
                  type="number"
                  min="50"
                  max="500"
                  value={formData.weightLbs}
                  onChange={(e) => updateFormData('weightLbs', e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-600 outline-none"
                />
              </div>

              <div className="space-y-3">
                <label className="text-gray-900">Exercise Habits *</label>
                <div className="grid grid-cols-1 gap-3">
                  {['I exercise regularly', 'I mildly work out', 'I do not exercise regularly'].map(option => (
                    <button
                      key={option}
                      onClick={() => updateFormData('exerciseHabits', option)}
                      className={`p-4 rounded-xl border-2 text-left transition-colors ${
                        formData.exerciseHabits === option
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      {formData.exerciseHabits === option && '✓ '}{option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <p className="text-purple-900">Auto-calculated Body Type:</p>
                <p className="text-purple-700 mt-1">{formData.autoBodyType}</p>
                <p className="text-purple-600 mt-2">This helps us match you with compatible preferences</p>
              </div>
            </div>
          )}

          {/* Step 3: Languages */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-gray-900">Languages I Speak *</label>
                <p className="text-gray-600">Add languages you are fluent in</p>
                
                {/* Common languages quick select */}
                <div className="grid grid-cols-2 gap-3">
                  {['English 🇺🇸', 'Spanish 🇪🇸', 'Mandarin 中文', 'French 🇫🇷', 'German 🇩🇪', 'Japanese 日本語', 'Korean 한국어', 'Portuguese 🇵🇹', 'Italian 🇮🇹', 'Russian 🇷🇺', 'Arabic العربية', 'Hindi हिंदी'].map(option => {
                    const langName = option.split(' ')[0];
                    const isSelected = formData.languages.some(l => l.language.includes(langName));
                    return (
                      <button
                        key={option}
                        onClick={() => {
                          if (isSelected) {
                            updateFormData('languages', formData.languages.filter(l => !l.language.includes(langName)));
                          } else {
                            updateFormData('languages', [...formData.languages, { language: option }]);
                          }
                        }}
                        className={`relative p-3 rounded-lg border-2 transition-colors ${
                          isSelected
                            ? 'border-purple-600 bg-purple-50'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                        {option}
                      </button>
                    );
                  })}
                </div>
                
                {/* Custom language input - Common Section */}
                <div className="flex items-center gap-3 mt-4">
                  <input
                    type="text"
                    value={formData.languageInput}
                    onChange={(e) => updateFormData('languageInput', e.target.value)}
                    placeholder="Add another language..."
                    className="flex-1 p-4 border-2 border-gray-200 rounded-xl focus:border-purple-600 outline-none"
                  />
                  <button
                    onClick={() => {
                      if (formData.languageInput.trim().length > 0) {
                        updateFormData('languages', [...formData.languages, { language: formData.languageInput }]);
                        updateFormData('languageInput', '');
                      }
                    }}
                    className="px-6 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                
                {/* Uncommon/Fictional languages */}
                <div className="mt-6">
                  <label className="text-gray-700 mb-2 block">Uncommon Languages (Optional)</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Klingon 🖖', 'Dothraki ⚔️', 'Elvish 🧝', 'Na\'vi 🌿', 'Other 🌟'].map(option => {
                      const langName = option.split(' ')[0];
                      const isSelected = formData.languages.some(l => l.language.includes(langName));
                      return (
                        <button
                          key={option}
                          onClick={() => {
                            if (isSelected) {
                              updateFormData('languages', formData.languages.filter(l => !l.language.includes(langName)));
                            } else {
                              updateFormData('languages', [...formData.languages, { language: option }]);
                            }
                          }}
                          className={`relative p-3 rounded-lg border-2 transition-colors ${
                            isSelected
                              ? 'border-purple-600 bg-purple-50'
                              : 'border-gray-200 bg-white'
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                          {option}
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Custom language input - Uncommon Section */}
                  <div className="flex items-center gap-3 mt-4">
                    <input
                      type="text"
                      value={formData.languageInput}
                      onChange={(e) => updateFormData('languageInput', e.target.value)}
                      placeholder="Add another uncommon language..."
                      className="flex-1 p-4 border-2 border-gray-200 rounded-xl focus:border-purple-600 outline-none"
                    />
                    <button
                      onClick={() => {
                        if (formData.languageInput.trim().length > 0) {
                          updateFormData('languages', [...formData.languages, { language: formData.languageInput }]);
                          updateFormData('languageInput', '');
                        }
                      }}
                      className="px-6 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {formData.languages.length > 0 && (
                <div className="space-y-3">
                  <label className="text-gray-900">Selected Languages ({formData.languages.length})</label>
                  <div className="flex flex-wrap gap-2">
                    {formData.languages.map((lang, index) => (
                      <button
                        key={index}
                        onClick={() => updateFormData('languages', formData.languages.filter((_, i) => i !== index))}
                        className="px-4 py-2 bg-purple-100 text-purple-900 rounded-full border-2 border-purple-600 hover:bg-purple-200 transition-colors flex items-center gap-2"
                      >
                        {lang.language}
                        <span className="text-purple-600">×</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Age & Height Preferences */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-gray-900">Age Range Preference</label>
                <p className="text-gray-600">Set your preferred age range</p>
                
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="18"
                    max="99"
                    value={formData.ageMin}
                    onChange={(e) => updateFormData('ageMin', Number(e.target.value))}
                    className="w-1/2 h-10 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600 px-3 text-gray-900"
                    placeholder="Min age"
                  />
                  <input
                    type="number"
                    min="18"
                    max="99"
                    value={formData.ageMax}
                    onChange={(e) => updateFormData('ageMax', Number(e.target.value))}
                    className="w-1/2 h-10 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600 px-3 text-gray-900"
                    placeholder="Max age"
                  />
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{formData.ageMin} years</span>
                  <span>{formData.ageMax} years</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-gray-900">Height Preference (select all that apply)</label>
                <p className="text-gray-600">Based on demographic averages</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Short', emoji: '📏' },
                    { label: 'Average', emoji: '📐' },
                    { label: 'Tall', emoji: '🦒' },
                    { label: 'No Preference', emoji: '✨' }
                  ].map(option => (
                    <button
                      key={option.label}
                      onClick={() => toggleArrayItem('heightPreference', option.label)}
                      className={`relative p-4 rounded-xl border-2 transition-colors ${
                        formData.heightPreference.includes(option.label)
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      {formData.heightPreference.includes(option.label) && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <span className="mr-2">{option.emoji}</span>
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-gray-900">Body Type Preference (select all that apply)</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Petite', emoji: '🌸' },
                    { label: 'Thin', emoji: '💨' },
                    { label: 'Average', emoji: '⭐' },
                    { label: 'Thicc ;)', emoji: '😉' },
                    { label: 'Full Figure', emoji: '💪' },
                    { label: 'Athletic', emoji: '🏃' },
                    { label: 'Body Builder', emoji: '🏋️' },
                    { label: 'No Preference', emoji: '✨' }
                  ].map(option => (
                    <button
                      key={option.label}
                      onClick={() => toggleArrayItem('bodyTypePreference', option.label)}
                      className={`relative p-4 rounded-xl border-2 transition-colors ${
                        formData.bodyTypePreference.includes(option.label)
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      {formData.bodyTypePreference.includes(option.label) && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <span className="mr-2">{option.emoji}</span>
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Preferences */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-gray-900">Religion *</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Christian', emoji: '✝️' },
                    { label: 'Muslim', emoji: '☪️' },
                    { label: 'Hindu', emoji: '🕉️' },
                    { label: 'Buddhist', emoji: '☸️' },
                    { label: 'Jewish', emoji: '✡️' },
                    { label: 'Atheist', emoji: '🔬' },
                    { label: 'Agnostic', emoji: '��' },
                    { label: 'Spiritual', emoji: '✨' },
                    { label: 'No Preference', emoji: '🌟' }
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
              </div>

              <div className="space-y-3">
                <label className="text-gray-900">Political Views * (select all that apply)</label>
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
              </div>

              <div className="space-y-3">
                <label className="text-gray-900">Race Preference * (select all that apply)</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Asian', emoji: '🌏' },
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
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 bg-white'
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
              </div>
            </div>
          )}

          {/* Step 6: Relationship Goals */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-gray-900">Relationship Goal * (select all that apply)</label>
                <p className="text-gray-600">This is a mandatory match filter</p>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { label: 'Marriage / Long-term Relationship', emoji: '💍' },
                    { label: 'Dating / Casual', emoji: '😊' },
                    { label: 'Friendship First', emoji: '🤝' },
                    { label: 'Not Sure Yet', emoji: '🤷' }
                  ].map(option => (
                    <button
                      key={option.label}
                      onClick={() => toggleArrayItem('relationshipGoal', option.label)}
                      className={`relative p-4 rounded-xl border-2 text-left transition-colors ${
                        formData.relationshipGoal.includes(option.label)
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 bg-white'
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
              </div>

              {showMarriageQuestion && (
                <div className="space-y-3">
                  <label className="text-gray-900">Marriage Timeline *</label>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { label: 'Within 1 year', emoji: '⏰' },
                      { label: '1-2 years', emoji: '📅' },
                      { label: '2-5 years', emoji: '🗓️' },
                      { label: '5+ years', emoji: '⏳' },
                      { label: 'Open to marriage', emoji: '💕' },
                      { label: 'Not interested in marriage', emoji: '🚫' }
                    ].map(option => (
                      <button
                        key={option.label}
                        onClick={() => updateFormData('marriageDesire', option.label)}
                        className={`p-4 rounded-xl border-2 text-left transition-colors ${
                          formData.marriageDesire === option.label
                            ? 'border-purple-600 bg-purple-50'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <span className="mr-2">{option.emoji}</span>
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <label className="text-gray-900">Children * (select all that apply)</label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { label: 'Want children', emoji: '👶' },
                    { label: 'Have children', emoji: '👨‍👩‍👧' },
                    { label: 'Don\'t want children', emoji: '🚫' },
                    { label: 'Don\'t want more children', emoji: '✋' },
                    { label: 'Open to children', emoji: '🤔' },
                    { label: 'Partner can have children', emoji: '👍' },
                    { label: 'No Preference', emoji: '🌟' }
                  ].map(option => (
                    <button
                      key={option.label}
                      onClick={() => toggleArrayItem('childrenPreference', option.label)}
                      className={`relative p-4 rounded-xl border-2 text-left transition-colors ${
                        formData.childrenPreference.includes(option.label)
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      {formData.childrenPreference.includes(option.label) && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <span className="mr-2">{option.emoji}</span>
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 7: Distance */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-gray-900">Preferred Unit</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => updateFormData('useMetric', false)}
                    className={`flex-1 p-4 rounded-xl border-2 transition-colors ${
                      !formData.useMetric
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    Miles (mi)
                  </button>
                  <button
                    onClick={() => updateFormData('useMetric', true)}
                    className={`flex-1 p-4 rounded-xl border-2 transition-colors ${
                      formData.useMetric
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    Kilometers (km)
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-gray-900">Maximum Distance</label>
                  <span className="text-purple-600">
                    {formData.maxDistance} {formData.useMetric ? 'km' : 'mi'}
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="200"
                  value={formData.maxDistance}
                  onChange={(e) => updateFormData('maxDistance', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-gray-500">
                  <span>5 {formData.useMetric ? 'km' : 'mi'}</span>
                  <span>200 {formData.useMetric ? 'km' : 'mi'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 8: Interests with Accordion */}
          {currentStep === 8 && (
            <div className="space-y-3">
              <label className="text-gray-900">Your Hobbies & Interests *</label>
              <p className="text-gray-600">Click a category to expand and select specific interests</p>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                <p className="text-blue-900">💡 Hold any interest to mark it as mandatory or a dealbreaker</p>
              </div>
              
              {Object.entries(hobbyCategories).map(([category, subcategories]) => {
                const isExpanded = expandedHobby === category;
                const hasSelections = formData.hobbies[category]?.length > 0;
                
                return (
                  <div key={category} className="border-2 border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedHobby(isExpanded ? null : category)}
                      className={`w-full p-4 flex items-center justify-between transition-colors ${
                        hasSelections ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800' : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-gray-900 dark:text-gray-100">{category}</span>
                        {hasSelections && (
                          <span className="bg-purple-600 dark:bg-purple-700 text-white px-2 py-1 rounded-full">
                            {formData.hobbies[category].length}
                          </span>
                        )}
                      </div>
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-900 dark:text-gray-100" /> : <ChevronDown className="w-5 h-5 text-gray-900 dark:text-gray-100" />}
                    </button>
                    
                    {isExpanded && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t-2 border-gray-200 dark:border-gray-700">
                        {typeof subcategories === 'object' && !Array.isArray(subcategories) ? (
                          // Nested categories (like Games)
                          <div className="space-y-4">
                            {Object.entries(subcategories).map(([subcat, items]) => (
                              <div key={subcat}>
                                <p className="text-purple-900 dark:text-purple-300 mb-2">{subcat}</p>
                                <div className="grid grid-cols-2 gap-2">
                                  {(items as string[]).map(item => {
                                    const fullValue = `${subcat}: ${item}`;
                                    const hobbyValue = `${category}:${fullValue}`;
                                    const status = getInterestStatus('hobbies', hobbyValue);
                                    return (
                                      <button
                                        key={item}
                                        onClick={() => updateHobbySubcategory(category, fullValue)}
                                        onMouseDown={() => handleInterestMouseDown('hobbies', hobbyValue)}
                                        onMouseUp={handleInterestMouseUp}
                                        onMouseLeave={handleInterestMouseUp}
                                        onTouchStart={() => handleInterestMouseDown('hobbies', hobbyValue)}
                                        onTouchEnd={handleInterestMouseUp}
                                        className={`relative p-3 rounded-lg border-2 transition-colors text-left ${
                                          status === 'mandatory'
                                            ? 'border-green-500 bg-green-50 dark:bg-green-900/30'
                                            : status === 'dealbreaker'
                                            ? 'border-red-500 bg-red-50 dark:bg-red-900/30'
                                            : formData.hobbies[category]?.includes(fullValue)
                                            ? 'border-purple-600 dark:border-purple-500 bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-200'
                                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }`}
                                      >
                                        {formData.hobbies[category]?.includes(fullValue) && !status && (
                                          <div className="absolute top-2 right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                                            <Check className="w-4 h-4 text-white" />
                                          </div>
                                        )}
                                        {status === 'mandatory' && (
                                          <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-xs">⭐</span>
                                          </div>
                                        )}
                                        {status === 'dealbreaker' && (
                                          <div className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                            <X className="w-4 h-4 text-white" />
                                          </div>
                                        )}
                                        {item}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          // Simple list
                          <div className="grid grid-cols-2 gap-2">
                            {(subcategories as string[]).map(item => {
                              const hobbyValue = `${category}:${item}`;
                              const status = getInterestStatus('hobbies', hobbyValue);
                              return (
                                <button
                                  key={item}
                                  onClick={() => updateHobbySubcategory(category, item)}
                                  onMouseDown={() => handleInterestMouseDown('hobbies', hobbyValue)}
                                  onMouseUp={handleInterestMouseUp}
                                  onMouseLeave={handleInterestMouseUp}
                                  onTouchStart={() => handleInterestMouseDown('hobbies', hobbyValue)}
                                  onTouchEnd={handleInterestMouseUp}
                                  className={`relative p-3 rounded-lg border-2 transition-colors text-left ${
                                    status === 'mandatory'
                                      ? 'border-green-500 bg-green-50 dark:bg-green-900/30'
                                      : status === 'dealbreaker'
                                      ? 'border-red-500 bg-red-50 dark:bg-red-900/30'
                                      : formData.hobbies[category]?.includes(item)
                                      ? 'border-purple-600 dark:border-purple-500 bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-200'
                                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                  }`}
                                >
                                  {formData.hobbies[category]?.includes(item) && !status && (
                                    <div className="absolute top-2 right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                                      <Check className="w-4 h-4 text-white" />
                                    </div>
                                  )}
                                  {status === 'mandatory' && (
                                    <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                      <span className="text-white text-xs">⭐</span>
                                    </div>
                                  )}
                                  {status === 'dealbreaker' && (
                                    <div className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                      <X className="w-4 h-4 text-white" />
                                    </div>
                                  )}
                                  {item}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Step 9: Food, Music & Entertainment */}
          {currentStep === 9 && (
            <div className="space-y-3">
              <label className="text-gray-900">Food, Music & Entertainment *</label>
              <p className="text-gray-600">Click a category to expand and select your preferences</p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                <p className="text-blue-900">💡 Hold any option to mark as Mandatory or Dealbreaker</p>
              </div>
              
              {/* Favorite Foods */}
              <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedFoods(!expandedFoods)}
                  className={`w-full p-4 flex items-center justify-between transition-colors ${
                    formData.favoriteFoods.length > 0 ? 'bg-purple-50 border-purple-200' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gray-900">🍕 Favorite Foods</span>
                    {formData.favoriteFoods.length > 0 && (
                      <span className="bg-purple-600 text-white px-2 py-1 rounded-full">
                        {formData.favoriteFoods.length}
                      </span>
                    )}
                  </div>
                  {expandedFoods ? <ChevronUp className="w-5 h-5 text-gray-900" /> : <ChevronDown className="w-5 h-5 text-gray-900" />}
                </button>
                
                {expandedFoods && (
                  <div className="p-4 bg-gray-50 border-t-2 border-gray-200">
                    <div className="grid grid-cols-2 gap-3">
                      {['BBQ', 'Biryani', 'Burgers', 'Chinese', 'Indian', 'Italian', 'Japanese', 'Korean', 'Mediterranean', 'Mexican', 'Pasta', 'Pizza', 'Ramen', 'Seafood', 'Steaks', 'Sushi', 'Tacos', 'Thai', 'Vegan', 'Vegetarian', 'Not Picky', 'Other'].map(option => {
                        const status = getInterestStatus('favoriteFoods', option);
                        return (
                          <button
                            key={option}
                            onClick={() => toggleArrayItem('favoriteFoods', option)}
                            onMouseDown={() => handleInterestMouseDown('favoriteFoods', option)}
                            onMouseUp={handleInterestMouseUp}
                            onMouseLeave={handleInterestMouseUp}
                            onTouchStart={() => handleInterestMouseDown('favoriteFoods', option)}
                            onTouchEnd={handleInterestMouseUp}
                            className={`relative p-3 rounded-xl border-2 text-left transition-colors ${
                              status === 'mandatory' 
                                ? 'border-green-500 bg-green-50'
                                : status === 'dealbreaker'
                                ? 'border-red-500 bg-red-50'
                                : formData.favoriteFoods.includes(option)
                                ? 'border-purple-600 bg-purple-50'
                                : 'border-gray-200 bg-white'
                            }`}
                          >
                            {formData.favoriteFoods.includes(option) && !status && (
                              <div className="absolute top-2 right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            )}
                            {status === 'mandatory' && (
                              <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">⭐</span>
                              </div>
                            )}
                            {status === 'dealbreaker' && (
                              <div className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                <X className="w-4 h-4 text-white" />
                              </div>
                            )}
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Music Performing */}
              <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedMusicPerforming(!expandedMusicPerforming)}
                  className={`w-full p-4 flex items-center justify-between transition-colors ${
                    formData.musicPerforming.length > 0 ? 'bg-purple-50 border-purple-200' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gray-900">🎤 Music (Performing)</span>
                    {formData.musicPerforming.length > 0 && (
                      <span className="bg-purple-600 text-white px-2 py-1 rounded-full">
                        {formData.musicPerforming.length}
                      </span>
                    )}
                  </div>
                  {expandedMusicPerforming ? <ChevronUp className="w-5 h-5 text-gray-900" /> : <ChevronDown className="w-5 h-5 text-gray-900" />}
                </button>
                
                {expandedMusicPerforming && (
                  <div className="p-4 bg-gray-50 border-t-2 border-gray-200">
                    <div className="grid grid-cols-2 gap-3">
                      {['DJ 🎧', 'Attending Concerts 🎵', 'Writing Music ✍️', 'Being in a Band 🎸', 'Playing an Instrument 🎹', 'Singing 🎤', 'Music Production 🎚️', 'No Preference', 'Other'].map(option => {
                        const status = getInterestStatus('musicPerforming', option);
                        return (
                          <button
                            key={option}
                            onClick={() => toggleArrayItem('musicPerforming', option)}
                            onMouseDown={() => handleInterestMouseDown('musicPerforming', option)}
                            onMouseUp={handleInterestMouseUp}
                            onMouseLeave={handleInterestMouseUp}
                            onTouchStart={() => handleInterestMouseDown('musicPerforming', option)}
                            onTouchEnd={handleInterestMouseUp}
                            className={`relative p-3 rounded-xl border-2 text-left transition-colors ${
                              status === 'mandatory' 
                                ? 'border-green-500 bg-green-50'
                                : status === 'dealbreaker'
                                ? 'border-red-500 bg-red-50'
                                : formData.musicPerforming.includes(option)
                                ? 'border-purple-600 bg-purple-50'
                                : 'border-gray-200 bg-white'
                            }`}
                          >
                            {formData.musicPerforming.includes(option) && !status && (
                              <div className="absolute top-2 right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            )}
                            {status === 'mandatory' && (
                              <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">⭐</span>
                              </div>
                            )}
                            {status === 'dealbreaker' && (
                              <div className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                <X className="w-4 h-4 text-white" />
                              </div>
                            )}
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Music Listening */}
              <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedMusicListening(!expandedMusicListening)}
                  className={`w-full p-4 flex items-center justify-between transition-colors ${
                    formData.musicListening.length > 0 ? 'bg-purple-50 border-purple-200' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gray-900">🎵 Music (Listening)</span>
                    {formData.musicListening.length > 0 && (
                      <span className="bg-purple-600 text-white px-2 py-1 rounded-full">
                        {formData.musicListening.length}
                      </span>
                    )}
                  </div>
                  {expandedMusicListening ? <ChevronUp className="w-5 h-5 text-gray-900" /> : <ChevronDown className="w-5 h-5 text-gray-900" />}
                </button>
                
                {expandedMusicListening && (
                  <div className="p-4 bg-gray-50 border-t-2 border-gray-200">
                    <div className="grid grid-cols-2 gap-3">
                      {['Alternative', 'Blues', 'Classical', 'Country', 'Disco', 'EDM', 'Electronic', 'Folk', 'Hip Hop', 'Indie', 'Jazz', 'K-Pop', 'Latin', 'Metal', 'Pop', 'Punk', 'R&B', 'Reggae', 'Rock', 'Soul', 'No Preference', 'Other'].map(option => {
                        const status = getInterestStatus('musicListening', option);
                        return (
                          <button
                            key={option}
                            onClick={() => toggleArrayItem('musicListening', option)}
                            onMouseDown={() => handleInterestMouseDown('musicListening', option)}
                            onMouseUp={handleInterestMouseUp}
                            onMouseLeave={handleInterestMouseUp}
                            onTouchStart={() => handleInterestMouseDown('musicListening', option)}
                            onTouchEnd={handleInterestMouseUp}
                            className={`relative p-3 rounded-xl border-2 text-left transition-colors ${
                              status === 'mandatory' 
                                ? 'border-green-500 bg-green-50'
                                : status === 'dealbreaker'
                                ? 'border-red-500 bg-red-50'
                                : formData.musicListening.includes(option)
                                ? 'border-purple-600 bg-purple-50'
                                : 'border-gray-200 bg-white'
                            }`}
                          >
                            {formData.musicListening.includes(option) && !status && (
                              <div className="absolute top-2 right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            )}
                            {status === 'mandatory' && (
                              <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">⭐</span>
                              </div>
                            )}
                            {status === 'dealbreaker' && (
                              <div className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                <X className="w-4 h-4 text-white" />
                              </div>
                            )}
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Movies & TV */}
              <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedMoviesTV(!expandedMoviesTV)}
                  className={`w-full p-4 flex items-center justify-between transition-colors ${
                    formData.moviesTV.length > 0 ? 'bg-purple-50 border-purple-200' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gray-900">🎬 Movies & TV</span>
                    {formData.moviesTV.length > 0 && (
                      <span className="bg-purple-600 text-white px-2 py-1 rounded-full">
                        {formData.moviesTV.length}
                      </span>
                    )}
                  </div>
                  {expandedMoviesTV ? <ChevronUp className="w-5 h-5 text-gray-900" /> : <ChevronDown className="w-5 h-5 text-gray-900" />}
                </button>
                
                {expandedMoviesTV && (
                  <div className="p-4 bg-gray-50 border-t-2 border-gray-200">
                    <div className="grid grid-cols-2 gap-3">
                      {['Action', 'Animation', 'Artistic', 'Comedy', 'Cooking TV', 'Documentary', 'Drama', 'Fantasy', 'Foreign Films', 'Horror', 'Reality TV', 'Retro', 'Romance', 'Sci-Fi', 'Shopping TV', 'Superhero', 'Thriller', 'Other'].map(option => {
                        const status = getInterestStatus('moviesTV', option);
                        return (
                          <button
                            key={option}
                            onClick={() => toggleArrayItem('moviesTV', option)}
                            onMouseDown={() => handleInterestMouseDown('moviesTV', option)}
                            onMouseUp={handleInterestMouseUp}
                            onMouseLeave={handleInterestMouseUp}
                            onTouchStart={() => handleInterestMouseDown('moviesTV', option)}
                            onTouchEnd={handleInterestMouseUp}
                            className={`relative p-3 rounded-xl border-2 text-left transition-colors ${
                              status === 'mandatory' 
                                ? 'border-green-500 bg-green-50'
                                : status === 'dealbreaker'
                                ? 'border-red-500 bg-red-50'
                                : formData.moviesTV.includes(option)
                                ? 'border-purple-600 bg-purple-50'
                                : 'border-gray-200 bg-white'
                            }`}
                          >
                            {formData.moviesTV.includes(option) && !status && (
                              <div className="absolute top-2 right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            )}
                            {status === 'mandatory' && (
                              <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">⭐</span>
                              </div>
                            )}
                            {status === 'dealbreaker' && (
                              <div className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                <X className="w-4 h-4 text-white" />
                              </div>
                            )}
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 10: Dealbreakers */}
          {currentStep === 10 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-gray-900">Dealbreakers (Optional)</label>
                <p className="text-gray-600">Select things you cannot accept in a partner</p>
                <div className="grid grid-cols-2 gap-3">
                  {['Different Politics', 'Different Religion', 'Drinking', 'Recreational Drugs', 'Has Kids', 'Has Pets', 'Long Distance', 'No Kids', 'No Pets', 'Not Ambitious', 'Smoking', 'Not Picky'].map(option => (
                    <button
                      key={option}
                      onClick={() => toggleArrayItem('dealbreakers', option)}
                      className={`relative p-4 rounded-xl border-2 transition-colors ${
                        formData.dealbreakers.includes(option)
                          ? option === 'Not Picky' ? 'border-green-600 bg-green-50' : 'border-red-600 bg-red-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      {formData.dealbreakers.includes(option) && (
                        <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center ${
                          option === 'Not Picky' ? 'bg-green-600' : 'bg-red-600'
                        }`}>
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 11: Desires - What I Am Hoping For */}
          {currentStep === 11 && (
            <div className="space-y-6">
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-4">
                <p className="text-purple-900">💭 What I Am Hoping For</p>
                <p className="text-purple-600 mt-2">These preferences won't affect your compatibility score, but will be visible to potential matches to help them understand what you're looking for.</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
                <p className="text-blue-900 text-sm">💡 Hold any desire to mark it as:</p>
                <ul className="mt-2 space-y-1 text-blue-800 text-sm ml-4">
                  <li><span className="font-semibold">Mandatory ⭐</span> - This is a must-have</li>
                  <li><span className="font-semibold">Dealbreaker ⛔</span> - Won't match without this</li>
                  <li><span className="font-semibold">Highlight ✨</span> - Top 4 shown on your profile (max 4)</li>
                </ul>
              </div>

              <div className="space-y-3">
                <label className="text-gray-900">I want someone who enjoys... 🎯</label>
                <div className="grid grid-cols-1 gap-3">
                  {['Activism 📢', 'Acting goofy 🤪', 'Alone time 🧘', 'Baking 🧁', 'Being carefree 😌', 'Being the center of attention 🌟', 'Cooking 👨‍🍳', 'Dancing 💃', 'Deep conversations 💭', 'Dining in 🏠', 'Dining out 🍽️', 'Dressing up 👔', 'Going on walks 🚶', 'Holds the door open for me 🚪', 'Lots of time spent together 💑', 'Ordering out 📦', 'Partying 🎉', 'Phone conversations 📞', 'Relaxing at home 🛋️', 'Saving money 💰', 'Shopping 🛍️', 'Social media 📱', 'Tells jokes 😄', 'Tells me "good morning"/"goodnight" everyday 🌅', 'Tells stories 📖', 'Texting 💬', 'Traveling ✈️', 'A clean home 🧹', 'Who surprises me with gifts/flowers 🎁']
                    .slice(0, showAllDesiresActivities ? undefined : 6)
                    .map(option => {
                      const status = getDesireStatus('desiresActivities', option);
                      return (
                        <button
                          key={option}
                          onClick={() => toggleArrayItem('desiresActivities', option)}
                          onMouseDown={() => handleDesireMouseDown('desiresActivities', option)}
                          onMouseUp={handleDesireMouseUp}
                          onMouseLeave={handleDesireMouseUp}
                          onTouchStart={() => handleDesireMouseDown('desiresActivities', option)}
                          onTouchEnd={handleDesireMouseUp}
                          className={`relative p-3 rounded-xl border-2 text-left transition-colors ${
                            formData.desiresActivities.includes(option)
                              ? 'border-purple-600 bg-purple-50'
                              : 'border-gray-200 bg-white'
                          }`}
                        >
                          {formData.desiresActivities.includes(option) && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                          {status && (
                            <div className="absolute top-2 left-2 text-xs px-2 py-1 rounded-full bg-white border">
                              {status === 'mandatory' && '⭐'}
                              {status === 'dealbreaker' && '⛔'}
                              {status === 'highlight' && '✨'}
                            </div>
                          )}
                          {option}
                        </button>
                      );
                    })}
                </div>
                <button
                  onClick={() => setShowAllDesiresActivities(!showAllDesiresActivities)}
                  className="w-full flex items-center justify-center gap-2 p-3 text-purple-600 hover:text-purple-700 transition-colors"
                >
                  {showAllDesiresActivities ? (
                    <>
                      <ChevronUp className="w-5 h-5" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-5 h-5" />
                      Show More (23 more options)
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-3">
                <label className="text-gray-900">I want someone who... ✨</label>
                <p className="text-gray-600">Select traits that are important to you in a partner</p>
                <div className="grid grid-cols-1 gap-3">
                  {['Does not like gender/social norms 🚫', 'Has a job 💼', 'Is a good listener 👂', 'Is a good talker 🗣️', 'Is a homebody 🏡', 'Is a leader 👑', 'Is ambitious 🎯', 'Is comfortable around other people 👥', 'Is competitive 🏆', 'Is emotional 😢', 'Is encouraging 💪', 'Is feminine 👗', 'Is handy 🔧', 'Is masculine 💪', 'Is nurturing 🤱', 'Is okay with a simple routine 🔄', 'Is okay with being a stay-at-home significant other 🏠', 'Is punctual ⏰', 'Is sensitive 💗', 'Is stoic 🗿', 'Is willing to try new things 🌟', 'Lets me lead 👑', 'Likes gender/social norms 👔', 'Prefers monogamy 💑', 'Prefers open relationships 🔓', 'Wants a progressive lifestyle 🌱', 'Wants a traditional lifestyle 🏛️', 'Willing to do household chores 🧹']
                    .slice(0, showAllDesiresTraits ? undefined : 6)
                    .map(option => {
                      const status = getDesireStatus('desiresTraits', option);
                      return (
                        <button
                          key={option}
                          onClick={() => toggleArrayItem('desiresTraits', option)}
                          onMouseDown={() => handleDesireMouseDown('desiresTraits', option)}
                          onMouseUp={handleDesireMouseUp}
                          onMouseLeave={handleDesireMouseUp}
                          onTouchStart={() => handleDesireMouseDown('desiresTraits', option)}
                          onTouchEnd={handleDesireMouseUp}
                          className={`relative p-3 rounded-xl border-2 text-left transition-colors ${
                            formData.desiresTraits.includes(option)
                              ? 'border-purple-600 bg-purple-50'
                              : 'border-gray-200 bg-white'
                          }`}
                        >
                          {formData.desiresTraits.includes(option) && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                          {status && (
                            <div className="absolute top-2 left-2 text-xs px-2 py-1 rounded-full bg-white border">
                              {status === 'mandatory' && '⭐'}
                              {status === 'dealbreaker' && '⛔'}
                              {status === 'highlight' && '✨'}
                            </div>
                          )}
                          {option}
                        </button>
                      );
                    })}
                </div>
                <button
                  onClick={() => setShowAllDesiresTraits(!showAllDesiresTraits)}
                  className="w-full flex items-center justify-center gap-2 p-3 text-purple-600 hover:text-purple-700 transition-colors"
                >
                  {showAllDesiresTraits ? (
                    <>
                      <ChevronUp className="w-5 h-5" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-5 h-5" />
                      Show More (22 more options)
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex-1 bg-purple-600 text-white py-4 px-6 rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {currentStep < steps.length - 1 ? (
              <>
                Continue
                <ChevronRight className="w-5 h-5" />
              </>
            ) : (
              'Start Matching'
            )}
          </button>
        </div>
      </div>

      {/* Transition Popup */}
      <TransitionPopup
        isOpen={showTransition}
        lines={transitionConfig.lines}
        onComplete={handleTransitionComplete}
        showConfetti={transitionConfig.showConfetti}
      />

      {/* Desire Selection Modal */}
      {showDesireModal && selectedDesire && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-gray-900 text-lg mb-4">Mark this desire as:</h3>
            <p className="text-gray-600 mb-6 text-sm">{selectedDesire.value}</p>
            
            <div className="space-y-3">
              <button
                onClick={() => handleDesireSpecialAction('mandatory')}
                className="w-full p-4 rounded-xl border-2 border-yellow-500 bg-yellow-50 text-left hover:bg-yellow-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <p className="font-semibold text-gray-900">Mandatory</p>
                    <p className="text-sm text-gray-600">This is a must-have for you</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleDesireSpecialAction('dealbreaker')}
                className="w-full p-4 rounded-xl border-2 border-red-500 bg-red-50 text-left hover:bg-red-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⛔</span>
                  <div>
                    <p className="font-semibold text-gray-900">Dealbreaker</p>
                    <p className="text-sm text-gray-600">You won't match without this</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleDesireSpecialAction('highlight')}
                disabled={formData.highlightDesires.length >= 4 && !formData.highlightDesires.includes(`${selectedDesire.field}:${selectedDesire.value}`)}
                className="w-full p-4 rounded-xl border-2 border-purple-500 bg-purple-50 text-left hover:bg-purple-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✨</span>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Highlight {formData.highlightDesires.length >= 4 && '(Max 4 reached)'}
                    </p>
                    <p className="text-sm text-gray-600">Show in top 4 on your profile</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowDesireModal(false);
                  setSelectedDesire(null);
                }}
                className="w-full p-4 rounded-xl border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors mt-4"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interest Selection Modal */}
      {showInterestModal && selectedInterest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-gray-900 text-lg mb-4">Mark this interest as:</h3>
            <p className="text-gray-600 mb-6 text-sm">{selectedInterest.value}</p>
            
            <div className="space-y-3">
              <button
                onClick={() => handleInterestSpecialAction('mandatory')}
                className="w-full p-4 rounded-xl border-2 border-green-500 bg-green-50 text-left hover:bg-green-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <p className="font-semibold text-gray-900">Mandatory</p>
                    <p className="text-sm text-gray-600">This is a must-have for you</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleInterestSpecialAction('dealbreaker')}
                className="w-full p-4 rounded-xl border-2 border-red-500 bg-red-50 text-left hover:bg-red-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⛔</span>
                  <div>
                    <p className="font-semibold text-gray-900">Dealbreaker</p>
                    <p className="text-sm text-gray-600">You won't match without this</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowInterestModal(false);
                  setSelectedInterest(null);
                }}
                className="w-full p-4 rounded-xl border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors mt-4"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}