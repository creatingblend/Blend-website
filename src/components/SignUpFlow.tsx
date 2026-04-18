import { useState, useEffect } from 'react';
import { Check, ChevronRight, ChevronDown, ChevronUp, X, Lightbulb } from 'lucide-react';
import { TransitionPopup } from './TransitionPopup';
import { Step0Content } from './Step0Content';
import { Step1Content } from './Step1Content';
import { Step2Content } from './Step2Content';

interface SignUpFlowProps {
  onComplete: () => void;
  initialStep?: number;
  endStep?: number;
  mode?: 'signup' | 'edit';
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

interface HeaderTipProps {
  title: string;
  children: React.ReactNode;
}

function HeaderTip({ title, children }: HeaderTipProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between bg-transparent">
         <label className="text-gray-900 font-semibold text-xl">{title}</label>
         <button 
           onClick={() => setIsOpen(!isOpen)}
           className="p-2 text-gray-400 hover:text-yellow-500 transition-colors rounded-full hover:bg-yellow-50 focus:outline-none"
           title="Show help"
         >
           <Lightbulb className={`w-5 h-5 ${isOpen ? 'fill-yellow-500 text-yellow-500' : ''}`} />
         </button>
      </div>
      {isOpen && (
         <div className="mt-2 p-3 bg-purple-50 text-purple-900 rounded-lg text-sm border border-purple-100 animate-in fade-in slide-in-from-top-1">
           {children}
         </div>
      )}
    </div>
  );
}

export function SignUpFlow({ onComplete, initialStep = 0, endStep, mode = 'signup' }: SignUpFlowProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
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
  const [expandedEntertainment, setExpandedEntertainment] = useState<string | null>(null);
  const [showDesireModal, setShowDesireModal] = useState(false);
  const [selectedDesire, setSelectedDesire] = useState<{ field: string, value: string } | null>(null);
  const [desireHoldTimeout, setDesireHoldTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState<{ field: string, value: string } | null>(null);
  const [interestHoldTimeout, setInterestHoldTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showOptionalPopup, setShowOptionalPopup] = useState(false);
  
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    // Consolidated pages
    personalInfo: true,
    preferences: false,
    myIdentity: true,
    valuesGoals: true,
    // Original pages
    gender: true,
    race: false,
    interestedIn: false,
    military: false,
    pronouns: false,
    zodiacSign: false,
    exercise: true,
    commonLanguages: true,
    uncommonLanguages: false,
    heightPref: true,
    bodyTypePref: false,
    religion: true,
    politics: false,
    racePref: false,
    children: false,
    desiresActivities: false,
    desiresTraits: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      // Create a new state where all sections are closed
      const newState = Object.keys(prev).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {} as Record<string, boolean>);
      
      // If the clicked section was closed, open it. 
      // If it was open, it stays closed (because we set all to false above)
      if (!prev[section]) {
        newState[section] = true;
      }
      
      return newState;
    });
  };

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
    uncommonLanguageInput: '',
    
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
    children: [] as string[],
    
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
    if (mode === 'signup' && currentStep === 0) {
      setTransitionConfig({
        lines: [
          "Let's get started! ✨",
          "First: what is your name, and tell us a little bit about yourself"
        ],
        nextStep: 0
      });
      setShowTransition(true);
    }
  }, []); // Only run once on mount

  const steps = [
    'Profile & Preferences', // Step 1 (was temp 1:1)
    'Identity & Background', // Step 2 (was temp 2:2)
    'Values & Goals', // Step 3 (was temp 3:3)
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
    const targetEnd = endStep !== undefined ? endStep : 10;
    
    if (currentStep >= targetEnd) {
      onComplete();
      return;
    }

    // Determine if we need a transition popup
    let transitionNeeded = false;
    let config: typeof transitionConfig = { lines: [] };

    // Skip transitions if in edit mode (optional, but cleaner for quick edits)
    if (mode === 'edit') {
       setCurrentStep(currentStep + 1);
       return;
    }

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
    // Step 2 → 3: Show optional popup (Values & Goals -> Interests)
    else if (currentStep === 2) {
      // Show optional popup instead of transition
      setShowOptionalPopup(true);
      return;
    }
    // Step 4 → 5: Going to dealbreakers (Food/Music -> Dealbreakers)
    else if (currentStep === 4) {
      transitionNeeded = true;
      config = {
        lines: [
          "Almost there! 🎯",
          "Tell us some things that would be unacceptable ⚠️"
        ],
        nextStep: 5
      };
    }
    // Step 5 → 6: Going to desires (Dealbreakers -> What you want)
    else if (currentStep === 5) {
      transitionNeeded = true;
      config = {
        lines: [
          "You made it to the final page! 🎊",
          "These next options don't affect your compatibility, but they do let your potential interests know what you're looking for"
        ],
        nextStep: 6
      };
    }
    // Step 6 → Complete: Final message
    else if (currentStep === 6) {
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
    // Prevent going back before the initial step (important for edit mode)
    if (currentStep > initialStep) {
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
    if (value === 'Other' || value.endsWith(':Other') || value.endsWith(': Other')) return;
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
    if (!selectedInterest || selectedInterest.value === 'Other' || selectedInterest.value.endsWith(':Other') || selectedInterest.value.endsWith(': Other')) return;

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
      // Create a shallow copy of the hobbies object to avoid mutation issues
      const currentHobbiesMap = { ...prev.hobbies };
      
      // Get the current array for this hobby category, default to empty array
      const currentList = currentHobbiesMap[hobby] || [];
      
      // Check if item exists
      const exists = currentList.includes(subcategory);
      
      let newList;
      if (exists) {
        // Remove item
        newList = currentList.filter(item => item !== subcategory);
      } else {
        // Add item
        newList = [...currentList, subcategory];
      }
      
      // Update the hobbies map with the new list
      currentHobbiesMap[hobby] = newList;
      
      // Update special lists if removing
      let updatedPriority = prev.priorityHobbies;
      let updatedDealbreaker = prev.dealbreakerHobbies;
      
      if (exists) {
         const keyToRemove = `${hobby}:${subcategory}`;
         updatedPriority = prev.priorityHobbies.filter(h => h !== keyToRemove);
         updatedDealbreaker = prev.dealbreakerHobbies.filter(h => h !== keyToRemove);
      }
      
      return {
        ...prev,
        hobbies: currentHobbiesMap,
        priorityHobbies: updatedPriority,
        dealbreakerHobbies: updatedDealbreaker
      };
    });
  };

  const hobbyCategories = {
    'Sports (Watching)': ['Baseball', 'Basketball', 'Cricket', 'Football', 'Golf', 'Gymnastics', 'Hockey', 'Lacrosse', 'MMA', 'Motor Vehicle Racing', 'Olympics', 'Rugby', 'Soccer', 'Swimming', 'Tennis', 'Other'],
    'Sports (Playing)': ['Baseball', 'Basketball', 'Cricket', 'Cycling', 'Football', 'Golf', 'Gymnastics', 'Hockey', 'Lacrosse', 'Martial Arts', 'MMA', 'Olympics', 'Pickleball', 'Racquetball', 'Rugby', 'Running', 'Soccer', 'Swimming', 'Tennis', 'Yoga', 'Other'],
    'Outdoor': ['Beach Activities', 'Camping', 'Corn Hole', 'Hiking', 'Horse Shoes', 'Hunting', 'Kayaking', 'Outdoor Games', 'Rock Climbing', 'Skiing', 'Surfing', 'Other'],
    'Creative': ['Crafts', 'Design', 'DIY Projects', 'Drawing', 'Painting', 'Photography', 'Social Media Content Creator', 'Teaching', 'Theater', 'Writing', 'Other'],
    'Learning': ['Documentaries', 'Higher Education', 'Languages', 'Museums', 'Online Courses', 'Podcasts', 'Reading', 'Social Media (YouTube/TikTok)', 'Other'],
    'Technology': ['AI/Tech News', 'Building PCs', 'Coding', 'Finance/Crypto', 'Gadgets', 'Gaming', 'Other'],
    'Social': ['Church', 'Clubs', 'Dancing', 'Karaoke', 'Meetups', 'Networking', 'Volunteering', 'Other'],
    'Pets': ['Dogs', 'Cats', 'Rodent(s)', 'Terrarium Pets', 'Aquarium Pets', 'Farm Animals', 'Other'],
    'Board Games': ['Classic', 'Cooperative', 'Modern', 'Party Games', 'Strategy', 'Table Top RPG', 'Other']
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: // Profile & Preferences (mandatory)
        return formData.name.trim().length > 0 && 
               formData.age > 0 && 
               (formData.heightFt !== '' && formData.heightFt > 0) && 
               (formData.weightLbs !== '' && formData.weightLbs > 0) &&
               formData.exerciseHabits &&
               formData.languages.length > 0 &&
               formData.ageMin > 0 &&
               formData.ageMax > 0;
      case 1: // Identity (mandatory)
        return formData.gender && formData.religion;
      case 2: // Values & Goals (mandatory)
        const needsMarriage = formData.relationshipGoal.includes('Marriage / Long-term Relationship');
        return formData.relationshipGoal.length > 0 && 
               formData.childrenPreference.length > 0 &&
               (!needsMarriage || formData.marriageDesire);
      case 3: // Interests (optional)
      case 4: // Food/Music/Entertainment (optional)
      case 5: // Dealbreakers (optional)
      case 6: // About You (optional)
        return true;
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
            {mode !== 'edit' && (
              <button
                onClick={handleNext}
                className="px-6 py-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                Skip
              </button>
            )}
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 mb-8 overflow-y-auto overflow-x-hidden">
          {/* Step 0: 1:1 temp - Consolidated Profile & Preferences */}
          {currentStep === 0 && (
            <Step0Content 
              formData={formData} 
              updateFormData={updateFormData}
              toggleArrayItem={toggleArrayItem}
            />
          )}

          {/* OLD Step 0 WITH DROPDOWNS - DELETE BELOW */}
          {false && currentStep === 0 && (
            <div className="space-y-4">
              <SectionDropdown 
                title="📋 Personal Information" 
                isOpen={expandedSections.personalInfo || false}
                onToggle={() => toggleSection('personalInfo')}
                required
              >
                {/* Name */}
                <div className="space-y-2 mb-4">
                  <label className="text-gray-900 font-medium text-sm">Your Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    placeholder="Enter your name"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 outline-none"
                  />
                </div>

                {/* Age */}
                <div className="space-y-2 mb-4">
                  <label className="text-gray-900 font-medium text-sm">Age *</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      updateFormData('age', isNaN(val) ? '' : val);
                    }}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 outline-none"
                    placeholder="25"
                  />
                </div>

                {/* Exercise Habits */}
                <div className="space-y-2 mb-4">
                  <label className="text-gray-900 font-medium text-sm">Exercise Habits 💪</label>
                  <div className="grid grid-cols-1 gap-2">
                    {['I exercise regularly', 'I mildly work out', 'I do not exercise regularly'].map(option => (
                      <button
                        key={option}
                        onClick={() => updateFormData('exerciseHabits', option)}
                        className={`p-3 rounded-xl border-2 text-left transition-colors text-sm ${
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

                {/* Height & Weight */}
                <div className="bg-white rounded-xl p-4 border-2 border-gray-200 mb-4">
                  <h4 className="text-gray-900 font-medium mb-3 text-sm">Height & Weight 📏</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-gray-700 text-xs block mb-1">Height *</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          placeholder="Ft"
                          value={formData.heightFt}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            updateFormData('heightFt', isNaN(val) ? '' : val);
                          }}
                          className="w-full p-2 min-w-0 border-2 border-gray-200 rounded-lg focus:border-purple-600 outline-none text-sm"
                        />
                        <input
                          type="number"
                          placeholder="In"
                          value={formData.heightIn}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            updateFormData('heightIn', isNaN(val) ? '' : val);
                          }}
                          className="w-full p-2 min-w-0 border-2 border-gray-200 rounded-lg focus:border-purple-600 outline-none text-sm"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-gray-700 text-xs block mb-1">Weight (lbs) *</label>
                      <input
                        type="number"
                        value={formData.weightLbs}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          updateFormData('weightLbs', isNaN(val) ? '' : val);
                        }}
                        className="w-full p-2 border-2 border-gray-200 rounded-lg focus:border-purple-600 outline-none text-sm"
                      />
                    </div>

                    <div className="flex items-center justify-between p-2 bg-purple-50 rounded-lg border border-purple-200">
                      <span className="text-gray-700 text-xs">Body Type:</span>
                      <span className="font-semibold text-purple-600 text-sm">{formData.autoBodyType}</span>
                    </div>
                  </div>
                </div>

                {/* Languages */}
                <div className="space-y-2">
                  <label className="text-gray-900 font-medium text-sm">Languages I Speak 🌍</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                    {['English 🇺🇸', 'Spanish 🇪🇸', 'Mandarin 中文', 'French 🇫🇷', 'German 🇩🇪', 'Japanese 日本語'].map(option => {
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
                          className={`relative p-2 rounded-lg border-2 transition-colors text-xs ${
                            isSelected
                              ? 'border-purple-600 bg-purple-50'
                              : 'border-gray-200 bg-white'
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-1 right-1 w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                          <span className="block truncate">{option}</span>
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Add Another Language */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formData.languageInput}
                      onChange={(e) => updateFormData('languageInput', e.target.value)}
                      placeholder="Add another language..."
                      className="flex-1 p-2 border-2 border-gray-200 rounded-lg focus:border-purple-600 outline-none text-sm"
                    />
                    <button
                      onClick={() => {
                        if (formData.languageInput.trim().length > 0) {
                          updateFormData('languages', [...formData.languages, { language: formData.languageInput }]);
                          updateFormData('languageInput', '');
                        }
                      }}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                    >
                      Add
                    </button>
                  </div>

                  {formData.languages.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.languages.map((lang, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs flex items-center gap-1"
                        >
                          {lang.language}
                          <button
                            onClick={() => {
                              updateFormData('languages', formData.languages.filter((_, i) => i !== index));
                            }}
                            className="hover:bg-purple-200 rounded-full"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </SectionDropdown>

              <SectionDropdown 
                title="⚙️ Your Preferences" 
                isOpen={expandedSections.preferences || false}
                onToggle={() => toggleSection('preferences')}
                required
              >
                {/* Age Range Preference */}
                <div className="space-y-2 mb-4">
                  <label className="text-gray-900 font-medium text-sm">Age Range Preference 🎂</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-gray-600 text-xs mb-1 block">Min Age</label>
                      <input
                        type="number"
                        value={formData.ageMin}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          updateFormData('ageMin', isNaN(val) ? 18 : val);
                        }}
                        className="w-full p-2 border-2 border-gray-200 rounded-lg focus:border-blue-600 outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 text-xs mb-1 block">Max Age</label>
                      <input
                        type="number"
                        value={formData.ageMax}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          updateFormData('ageMax', isNaN(val) ? 99 : val);
                        }}
                        className="w-full p-2 border-2 border-gray-200 rounded-lg focus:border-blue-600 outline-none text-sm"
                      />
                    </div>
                  </div>
                  <p className="text-gray-600 text-xs mt-1">
                    Looking for ages {formData.ageMin} - {formData.ageMax}
                  </p>
                </div>

                {/* Height Preference */}
                <div className="space-y-2 mb-4">
                  <label className="text-gray-900 font-medium text-sm">Height Preference 📏</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Shorter than me', 'Same height', 'Taller than me', 'No preference'].map(option => (
                      <button
                        key={option}
                        onClick={() => toggleArrayItem('heightPreference', option)}
                        className={`relative p-2 rounded-lg border-2 transition-colors text-xs ${
                          formData.heightPreference.includes(option)
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        {formData.heightPreference.includes(option) && (
                          <div className="absolute top-1 right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Body Type Preference */}
                <div className="space-y-2 mb-4">
                  <label className="text-gray-900 font-medium text-sm">Body Type Preference 💪</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Slim', 'Athletic', 'Average', 'Curvy', 'Muscular', 'No preference'].map(option => (
                      <button
                        key={option}
                        onClick={() => toggleArrayItem('bodyTypePreference', option)}
                        className={`relative p-2 rounded-lg border-2 transition-colors text-xs ${
                          formData.bodyTypePreference.includes(option)
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        {formData.bodyTypePreference.includes(option) && (
                          <div className="absolute top-1 right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Max Distance */}
                <div className="space-y-2">
                  <label className="text-gray-900 font-medium text-sm">Max Distance 🗺️</label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={formData.maxDistance}
                    onChange={(e) => updateFormData('maxDistance', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">1 mi</span>
                    <span className="font-semibold text-blue-600">{formData.maxDistance} miles</span>
                    <span className="text-gray-600">100 mi</span>
                  </div>
                </div>
              </SectionDropdown>
            </div>
          )}

          {/* Step 1: 2:2 temp - Consolidated Identity */}
          {currentStep === 1 && (
            <Step1Content 
              formData={formData} 
              updateFormData={updateFormData}
              toggleArrayItem={toggleArrayItem}
            />
          )}

          {/* OLD Step 1 WITH DROPDOWNS - DELETE BELOW */}
          {false && currentStep === 1 && (
            <div className="space-y-4">
              <SectionDropdown 
                title="👤 My Identity" 
                isOpen={expandedSections.myIdentity || false}
                onToggle={() => toggleSection('myIdentity')}
                required
              >
                {/* Gender */}
                <div className="space-y-2 mb-4">
                  <label className="text-gray-900 font-medium text-sm">I am a *</label>
                  <div className="grid grid-cols-2 gap-2">
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
                        className={`p-3 rounded-xl border-2 transition-colors text-sm ${
                          formData.gender === option.label
                            ? 'border-indigo-600 bg-indigo-50'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <span className="mr-2">{option.emoji}</span>
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Race */}
                <div className="space-y-2 mb-4">
                  <label className="text-gray-900 font-medium text-sm">My Race/Ethnicity *</label>
                  <div className="grid grid-cols-2 gap-2">
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
                        className={`p-3 rounded-xl border-2 transition-colors text-sm ${
                          formData.race === option.label
                            ? 'border-indigo-600 bg-indigo-50'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <span className="mr-2">{option.emoji}</span>
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interested In */}
                <div className="space-y-2">
                  <label className="text-gray-900 font-medium text-sm">Interested in * (select all that apply)</label>
                  <div className="grid grid-cols-2 gap-2">
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
                        className={`relative p-3 rounded-xl border-2 transition-colors text-sm ${
                          formData.orientation.includes(option.label)
                            ? 'border-indigo-600 bg-indigo-50'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        {formData.orientation.includes(option.label) && (
                          <div className="absolute top-1 right-1 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                        <span className="mr-2">{option.emoji}</span>
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </SectionDropdown>
            </div>
          )}

          {/* Step 2: 3:3 temp - Consolidated Values & Goals */}
          {currentStep === 2 && (
            <Step2Content 
              formData={formData} 
              updateFormData={updateFormData}
              toggleArrayItem={toggleArrayItem}
            />
          )}

          {/* OLD Step 2 WITH DROPDOWNS - DELETE BELOW */}
          {false && currentStep === 2 && (
            <div className="space-y-4">
              <SectionDropdown 
                title="💚 Values & Relationship Goals" 
                isOpen={expandedSections.valuesGoals || false}
                onToggle={() => toggleSection('valuesGoals')}
                required
              >
                {/* Religion */}
                <div className="space-y-2 mb-4">
                  <label className="text-gray-900 font-medium text-sm">Religion ✝️☪️🕉️</label>
                  <div className="grid grid-cols-2 gap-2">
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
                        className={`p-3 rounded-xl border-2 transition-colors text-sm ${
                          formData.religion === option.label
                            ? 'border-green-600 dark:border-green-500 bg-green-50 dark:bg-green-900/30 text-gray-900 dark:text-gray-100'
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                        }`}
                      >
                        <span className="mr-2">{option.emoji}</span>
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Political Views */}
                <div className="space-y-2 mb-4">
                  <label className="text-gray-900 font-medium text-sm">Political Views 🗳️ (select all that apply)</label>
                  <div className="grid grid-cols-2 gap-2">
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
                        className={`relative p-3 rounded-xl border-2 transition-colors text-sm ${
                          formData.politics.includes(option.label)
                            ? 'border-green-600 dark:border-green-500 bg-green-50 dark:bg-green-900/30 text-gray-900 dark:text-gray-100'
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                        }`}
                      >
                        {formData.politics.includes(option.label) && (
                          <div className="absolute top-1 right-1 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                        <span className="mr-2">{option.emoji}</span>
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Race Preference */}
                <div className="space-y-2 mb-4">
                  <label className="text-gray-900 font-medium text-sm">Race Preference 🌍 (select all that apply)</label>
                  <div className="grid grid-cols-2 gap-2">
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
                        className={`relative p-3 rounded-xl border-2 transition-colors text-sm ${
                          formData.racePreference.includes(option.label)
                            ? 'border-green-600 dark:border-green-500 bg-green-50 dark:bg-green-900/30 text-gray-900 dark:text-gray-100'
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                        }`}
                      >
                        {formData.racePreference.includes(option.label) && (
                          <div className="absolute top-1 right-1 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                        <span className="mr-2">{option.emoji}</span>
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Relationship Goal */}
                <div className="space-y-2">
                  <label className="text-gray-900 font-medium text-sm">Relationship Goal 💕 (select all that apply)</label>
                  <p className="text-gray-600 text-xs mb-2">This is a mandatory match filter</p>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { label: 'Long-term relationship', emoji: '💍' },
                      { label: 'Short-term relationship', emoji: '💝' },
                      { label: 'Marriage', emoji: '👰' },
                      { label: 'Casual dating', emoji: '☕' },
                      { label: 'New friends', emoji: '👋' },
                      { label: 'Figuring it out', emoji: '🤔' }
                    ].map(option => (
                      <button
                        key={option.label}
                        onClick={() => toggleArrayItem('relationshipGoal', option.label)}
                        className={`relative p-3 rounded-xl border-2 transition-colors text-sm text-left ${
                          formData.relationshipGoal.includes(option.label)
                            ? 'border-green-600 dark:border-green-500 bg-green-50 dark:bg-green-900/30 text-gray-900 dark:text-gray-100'
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                        }`}
                      >
                        {formData.relationshipGoal.includes(option.label) && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                        <span className="mr-2">{option.emoji}</span>
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </SectionDropdown>
            </div>
          )}

          {/* REMOVED Step 3: Name & About - Now handled in temp files */}
          {false && currentStep === 3 && (
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

          {/* REMOVED Step 4: Identity - Now handled in temp files */}
          {false && currentStep === 4 && (
            <div className="space-y-4">
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

              <SectionDropdown 
                title="Interested in" 
                required 
                isOpen={expandedSections.interestedIn} 
                onToggle={() => toggleSection('interestedIn')}
              >
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

              <SectionDropdown 
                title="Political Views" 
                required 
                isOpen={expandedSections.politics} 
                onToggle={() => toggleSection('politics')}
              >
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

              <SectionDropdown 
                title="Pronouns (Optional)" 
                isOpen={expandedSections.pronouns} 
                onToggle={() => toggleSection('pronouns')}
              >
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
          )}

          {/* REMOVED Step 5: Personal Info - Now handled in temp files */}
          {false && currentStep === 5 && (
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="text-gray-900">Age *</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    updateFormData('age', isNaN(val) ? '' : val);
                  }}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-600 outline-none"
                  placeholder="25"
                />
              </div>

              <SectionDropdown 
                title="Exercise Habits" 
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
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      {formData.exerciseHabits === option && '✓ '}{option}
                    </button>
                  ))}
                </div>
              </SectionDropdown>

              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <h3 className="text-purple-900 font-semibold mb-2">Height & Weight</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex gap-4 mb-2">
                      <label className="text-gray-900 flex-1">Height *</label>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Ft"
                        value={formData.heightFt}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          updateFormData('heightFt', isNaN(val) ? '' : val);
                        }}
                        className="w-full p-3 min-w-0 border-2 border-gray-200 rounded-xl focus:border-purple-600 outline-none"
                      />
                      <input
                        type="number"
                        placeholder="In"
                        value={formData.heightIn}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          updateFormData('heightIn', isNaN(val) ? '' : val);
                        }}
                        className="w-full p-3 min-w-0 border-2 border-gray-200 rounded-xl focus:border-purple-600 outline-none"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-gray-900 block mb-2">Weight (lbs) *</label>
                    <input
                      type="number"
                      value={formData.weightLbs}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        updateFormData('weightLbs', isNaN(val) ? '' : val);
                      }}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-600 outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-100">
                    <span className="text-gray-600">Calculated Body Type:</span>
                    <span className="font-semibold text-purple-600">{formData.autoBodyType}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* REMOVED Step 3: Languages - Covered in temp files */}
          {false && currentStep === 3 && (
            <div className="space-y-4">
              <SectionDropdown 
                title="Languages I Speak" 
                required 
                isOpen={expandedSections.commonLanguages} 
                onToggle={() => toggleSection('commonLanguages')}
              >
                <p className="text-gray-600 mb-3 text-sm">Add languages you are fluent in</p>
                
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
              </SectionDropdown>
                
              {/* Custom language input - Common Section */}
              <div className="flex items-center gap-3">
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
              <SectionDropdown 
                title="Uncommon Languages" 
                isOpen={expandedSections.uncommonLanguages} 
                onToggle={() => toggleSection('uncommonLanguages')}
              >
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
              </SectionDropdown>

              {formData.languages.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Selected Languages:</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.languages.map((lang, idx) => (
                      <div key={idx} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center gap-2">
                        <span>{lang.language}</span>
                        <button
                          onClick={() => updateFormData('languages', formData.languages.filter((_, i) => i !== idx))}
                          className="hover:text-purple-900"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* REMOVED Step 4: Age, Height & Location - Covered in temp files */}
          {false && currentStep === 4 && (
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="text-gray-900">Age Range Preference</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-600 text-sm mb-1 block">Min Age</label>
                    <input
                      type="number"
                      min="18"
                      max="99"
                      value={formData.ageMin}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        updateFormData('ageMin', isNaN(val) ? 18 : val);
                      }}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-600 text-sm mb-1 block">Max Age</label>
                    <input
                      type="number"
                      min="18"
                      max="99"
                      value={formData.ageMax}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        updateFormData('ageMax', isNaN(val) ? 99 : val);
                      }}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-600 outline-none"
                    />
                  </div>
                </div>
              </div>

              <SectionDropdown 
                title="Height Preference" 
                isOpen={expandedSections.heightPref} 
                onToggle={() => toggleSection('heightPref')}
              >
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
              </SectionDropdown>

              <SectionDropdown 
                title="Body Type Preference" 
                isOpen={expandedSections.bodyTypePref} 
                onToggle={() => toggleSection('bodyTypePref')}
              >
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
              </SectionDropdown>

              <div className="space-y-3">
                <label className="text-gray-900">Max Distance (miles)</label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={formData.maxDistance}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    updateFormData('maxDistance', isNaN(val) ? 1 : val);
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>1 mile</span>
                  <span>{formData.maxDistance} miles</span>
                  <span>100+ miles</span>
                </div>
              </div>
            </div>
          )}

          {/* REMOVED Step 5: Preferences - Covered in temp files */}
          {false && currentStep === 5 && (
            <div className="space-y-4">
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

              <SectionDropdown 
                title="Political Views" 
                required 
                isOpen={expandedSections.politics} 
                onToggle={() => toggleSection('politics')}
              >
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

              <SectionDropdown 
                title="Race Preference" 
                required 
                isOpen={expandedSections.racePref} 
                onToggle={() => toggleSection('racePref')}
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
              </SectionDropdown>
            </div>
          )}

          {/* REMOVED Step 6: Relationship Goals - Covered in temp files */}
          {false && currentStep === 6 && (
            <div className="space-y-4">
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
                        {formData.marriageDesire === option.label && '✓ '}
                        <span className="mr-2">{option.emoji}</span>
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <SectionDropdown 
                title="Children" 
                required 
                isOpen={expandedSections.children} 
                onToggle={() => toggleSection('children')}
              >
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { label: 'I want children', emoji: '👶' },
                    { label: 'I do not want children', emoji: '🚫' },
                    { label: 'I have children', emoji: '👨‍👩‍👧' },
                    { label: 'Open to children', emoji: '🤷' },
                    { label: 'They have children', emoji: '👪' },
                    { label: 'No more Children', emoji: '🛑' },
                    { label: 'Unsure / No preference', emoji: '🤔' }
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
              </SectionDropdown>
            </div>
          )}

          {/* Step 3: Interests with Accordion */}
          {currentStep === 3 && (
            <div className="space-y-3">
              <HeaderTip title="Your Hobbies & Interests *">
                <p className="font-medium mb-2">Click a category to expand and select specific interests</p>
                <p>Hold any interest to mark it as a mandatory interest or a dealbreaker</p>
              </HeaderTip>
              
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

          {/* Step 4: Food, Music & Entertainment */}
          {currentStep === 4 && (
            <div className="space-y-3">
              <HeaderTip title="Your Preferences *">
                 <p className="font-medium mb-2">Click a category to expand and select your preferences</p>
                 <p>Hold any option to mark as a mandatory interest or a dealbreaker</p>
              </HeaderTip>
              
              {/* Favorite Foods */}
              <SectionDropdown 
                 title="🍕 Favorite Foods" 
                 isOpen={expandedEntertainment === 'Foods'} 
                 onToggle={() => setExpandedEntertainment(expandedEntertainment === 'Foods' ? null : 'Foods')}
              >
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
                              ? 'border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/30 text-gray-900 dark:text-gray-100'
                              : status === 'dealbreaker'
                              ? 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/30 text-gray-900 dark:text-gray-100'
                              : formData.favoriteFoods.includes(option)
                              ? 'border-purple-600 dark:border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-gray-900 dark:text-gray-100'
                              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
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
              </SectionDropdown>

              {/* Games */}
              <SectionDropdown 
                 title="🎮 Games" 
                 isOpen={expandedEntertainment === 'Games'} 
                 onToggle={() => setExpandedEntertainment(expandedEntertainment === 'Games' ? null : 'Games')}
              >
                  <div className="space-y-4">
                    {Object.entries({
                      'Card Games': ['52 Cards/Standard Deck', 'Magic: The Gathering', 'Pokemon', 'Uno', 'Yu-Gi-Oh', 'Other'],
                      'Board Games': ['Classic', 'Cooperative', 'Modern', 'Party Games', 'Strategy', 'Table Top RPG', 'Other'],
                      'Video Games': ['Action', 'FPS', 'Horror', 'MMORPG', 'MOBA', 'Platformer', 'Puzzle', 'Racing', 'RPG', 'Simulation', 'Sports', 'Strategy', 'Survival', 'Other'],
                      'Other': ['Trivia', 'Verbal Games', 'Word Games', 'Other']
                    }).map(([subcat, items]) => (
                      <div key={subcat}>
                        <p className="text-purple-900 mb-2">{subcat}</p>
                        <div className="grid grid-cols-2 gap-2">
                          {items.map(item => {
                            const fullValue = `${subcat}: ${item}`;
                            const hobbyValue = `Games:${fullValue}`; 
                            const status = getInterestStatus('hobbies', hobbyValue);
                            
                            return (
                              <button
                                key={item}
                                onClick={() => updateHobbySubcategory('Games', fullValue)}
                                onMouseDown={() => handleInterestMouseDown('hobbies', hobbyValue)}
                                onMouseUp={handleInterestMouseUp}
                                onMouseLeave={handleInterestMouseUp}
                                onTouchStart={() => handleInterestMouseDown('hobbies', hobbyValue)}
                                onTouchEnd={handleInterestMouseUp}
                                className={`relative p-3 rounded-lg border-2 transition-colors text-left ${
                                  status === 'mandatory'
                                    ? 'border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/30 text-gray-900 dark:text-gray-100'
                                    : status === 'dealbreaker'
                                    ? 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/30 text-gray-900 dark:text-gray-100'
                                    : formData.hobbies['Games']?.includes(fullValue)
                                    ? 'border-purple-600 dark:border-purple-500 bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-200'
                                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                              >
                                {formData.hobbies['Games']?.includes(fullValue) && !status && (
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
              </SectionDropdown>

              {/* Movies & TV */}
              <SectionDropdown 
                 title="🎬 Movies & TV" 
                 isOpen={expandedEntertainment === 'Movies'} 
                 onToggle={() => setExpandedEntertainment(expandedEntertainment === 'Movies' ? null : 'Movies')}
              >
                  <div className="grid grid-cols-2 gap-3">
                    {['Action', 'Anime', 'Artistic', 'Comedy', 'Cooking TV', 'Documentary', 'Drama', 'Fantasy', 'Foreign Films', 'Horror', 'Mystery', 'Reality TV', 'Retro', 'Romance', 'Sci-Fi', 'Shopping TV', 'Super Hero', 'Thriller', 'True Crime', 'No Preference', 'Other'].map(option => {
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
                              ? 'border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/30 text-gray-900 dark:text-gray-100'
                              : status === 'dealbreaker'
                              ? 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/30 text-gray-900 dark:text-gray-100'
                              : formData.moviesTV.includes(option)
                              ? 'border-purple-600 dark:border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-gray-900 dark:text-gray-100'
                              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
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
              </SectionDropdown>

              {/* Music Performing */}
              <SectionDropdown 
                 title="🎤 Music (Performing)" 
                 isOpen={expandedEntertainment === 'MusicPerforming'} 
                 onToggle={() => setExpandedEntertainment(expandedEntertainment === 'MusicPerforming' ? null : 'MusicPerforming')}
              >
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
                              ? 'border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/30 text-gray-900 dark:text-gray-100'
                              : status === 'dealbreaker'
                              ? 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/30 text-gray-900 dark:text-gray-100'
                              : formData.musicPerforming.includes(option)
                              ? 'border-purple-600 dark:border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-gray-900 dark:text-gray-100'
                              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
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
              </SectionDropdown>

              {/* Music Listening */}
              <SectionDropdown 
                 title="🎵 Music (Listening)" 
                 isOpen={expandedEntertainment === 'MusicListening'} 
                 onToggle={() => setExpandedEntertainment(expandedEntertainment === 'MusicListening' ? null : 'MusicListening')}
              >
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
                              ? 'border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/30 text-gray-900 dark:text-gray-100'
                              : status === 'dealbreaker'
                              ? 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/30 text-gray-900 dark:text-gray-100'
                              : formData.musicListening.includes(option)
                              ? 'border-purple-600 dark:border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-gray-900 dark:text-gray-100'
                              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
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
              </SectionDropdown>
            </div>
          )}

          {/* Step 5: Dealbreakers */}
          {currentStep === 5 && (
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
                          ? option === 'Not Picky' 
                            ? 'border-green-600 dark:border-green-500 bg-green-50 dark:bg-green-900/30 text-gray-900 dark:text-gray-100' 
                            : 'border-red-600 dark:border-red-500 bg-red-50 dark:bg-red-900/30 text-gray-900 dark:text-gray-100'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
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

          {/* Step 6: What you want */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <HeaderTip title="What I Am Hoping For">
                 <p className="mb-2">These preferences won't affect your compatibility score, but will be visible to potential matches to help them understand what you're looking for.</p>
                 <hr className="border-blue-200 my-2" />
                 <p className="font-medium">Hold any desire to mark it as:</p>
                 <ul className="mt-1 space-y-1 ml-2">
                   <li><span className="font-semibold">Mandatory ⭐</span> - This is a must-have</li>
                   <li><span className="font-semibold">Dealbreaker ⛔</span> - Won't match without this</li>
                   <li><span className="font-semibold">Highlight ✨</span> - Top 4 shown on your profile (max 4)</li>
                 </ul>
              </HeaderTip>

              <SectionDropdown 
                 title="I want someone who enjoys... 🎯" 
                 isOpen={expandedSections.desiresActivities} 
                 onToggle={() => toggleSection('desiresActivities')}
              >
                  <div className="grid grid-cols-1 gap-3">
                    {['Activism 📢', 'Acting goofy 🤪', 'Alone time 🧘', 'Baking 🧁', 'Being carefree 😌', 'Being the center of attention 🌟', 'Cooking 👨‍🍳', 'Dancing 💃', 'Deep conversations 💭', 'Dining in 🏠', 'Dining out 🍽️', 'Dressing up 👔', 'Going on walks 🚶', 'Holds the door open for me 🚪', 'Lots of time spent together 💑', 'Ordering out 📦', 'Partying 🎉', 'Phone conversations 📞', 'Relaxing at home 🛋️', 'Saving money 💰', 'Shopping 🛍️', 'Social media 📱', 'Tells jokes 😄', 'Tells me "good morning"/"goodnight" everyday 🌅', 'Tells stories 📖', 'Texting 💬', 'Traveling ✈️', 'A clean home 🧹', 'Who surprises me with gifts/flowers 🎁'].map(option => {
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
              </SectionDropdown>

              <SectionDropdown 
                 title="I want someone who... ✨" 
                 isOpen={expandedSections.desiresTraits} 
                 onToggle={() => toggleSection('desiresTraits')}
              >
                  <p className="text-gray-600 mb-3 text-sm">Select traits that are important to you in a partner</p>
                  <div className="grid grid-cols-1 gap-3">
                    {['Does not like gender/social norms 🚫', 'Has a job 💼', 'Is a good listener 👂', 'Is a good talker 🗣️', 'Is a homebody 🏡', 'Is a leader 👑', 'Is ambitious 🎯', 'Is comfortable around other people 👥', 'Is competitive 🏆', 'Is emotional 😢', 'Is encouraging 💪', 'Is feminine 👗', 'Is handy 🔧', 'Is masculine 💪', 'Is nurturing 🤱', 'Is okay with a simple routine 🔄', 'Is okay with being a stay-at-home significant other 🏠', 'Is punctual ⏰', 'Is sensitive 💗', 'Is stoic 🗿', 'Is willing to try new things 🌟', 'Lets me lead 👑', 'Likes gender/social norms 👔', 'Prefers monogamy 💑', 'Prefers open relationships 🔓', 'Wants a progressive lifestyle 🌱', 'Wants a traditional lifestyle 🏛️', 'Willing to do household chores 🧹'].map(option => {
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
              </SectionDropdown>

              {/* About You (Optional) - Moved from Step 1 */}
              <div className="space-y-3 mt-6 pt-6 border-t-2 border-gray-200">
                <label className="text-gray-900 font-semibold">About You (Optional)</label>
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
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {currentStep > initialStep && (
            <button
              onClick={handleBack}
              className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          )}
          {/* Skip button for optional pages (steps 4-6, not on final step 7) */}
          {currentStep >= 3 && currentStep < steps.length - 1 && (
            <button
              onClick={() => setCurrentStep(steps.length - 1)}
              className="px-6 py-4 border-2 border-purple-300 text-purple-600 rounded-full hover:bg-purple-50 transition-colors"
            >
              Skip for now
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex-1 bg-purple-600 text-white py-4 px-6 rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {currentStep < (endStep !== undefined ? endStep : steps.length - 1) ? (
              <>
                Continue
                <ChevronRight className="w-5 h-5" />
              </>
            ) : (
              mode === 'edit' ? 'Save Changes' : 'Start Matching'
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

      {/* Optional Pages Popup */}
      {showOptionalPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-gray-900 text-xl font-bold mb-3">Great progress! 🎉</h3>
            <p className="text-gray-600 mb-6">
              You can complete these optional sections now, or save them for later in the settings menu.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowOptionalPopup(false);
                  setCurrentStep(3);
                }}
                className="w-full p-4 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors"
              >
                Continue to additional profile building
              </button>

              <button
                onClick={() => {
                  setShowOptionalPopup(false);
                  setCurrentStep(steps.length - 1);
                }}
                className="w-full p-4 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Skip for now
              </button>
            </div>
          </div>
        </div>
      )}

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
                className="w-full p-4 rounded-xl border-2 border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/30 text-left hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⛔</span>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">Dealbreaker</p>
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
                className="w-full p-4 rounded-xl border-2 border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/30 text-left hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">Mandatory Interest</p>
                    <p className="text-sm text-gray-600">I specifically want someone who likes this</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleInterestSpecialAction('dealbreaker')}
                className="w-full p-4 rounded-xl border-2 border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/30 text-left hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⛔</span>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">Dealbreaker Interest</p>
                    <p className="text-sm text-gray-600">I cannot be with someone who likes this</p>
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