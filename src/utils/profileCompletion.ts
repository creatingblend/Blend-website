// Profile completion tracking utility

export interface FormData {
  // Name and About
  name: string;
  about: string;
  
  // Personal Info
  age: string | number;
  heightFt: number | '';
  heightIn: number | '';
  weightLbs: number | '';
  exerciseHabits: string;
  
  // Identity
  gender: string;
  orientation: string[];
  race: string;
  military: string;
  pronouns: string[];
  zodiacSign: string;
  
  // Languages
  languages: Array<{ language: string; nativeScript?: string }>;
  
  // Preferences
  religion: string;
  politics: string[];
  racePreference: string[];
  heightPreference: string[];
  bodyTypePreference: string[];
  
  // Relationship
  relationshipGoal: string[];
  marriageDesire: string;
  childrenPreference: string[];
  
  // Interests
  hobbies: Record<string, string[]>;
  favoriteFoods: string[];
  musicPerforming: string[];
  musicListening: string[];
  moviesTV: string[];
  personality: string[];
  dealbreakers: string[];
  
  // Desires
  desiresActivities: string[];
  desiresTraits: string[];
}

export interface ProfileCompletion {
  totalFields: number;
  completedFields: number;
  percentage: number;
  missingMandatory: string[];
  missingOptional: string[];
}

export function calculateProfileCompletion(formData: Partial<FormData>): ProfileCompletion {
  const mandatory: { field: string; check: () => boolean }[] = [
    { field: 'Name', check: () => Boolean(formData.name?.trim()) },
    { field: 'Age', check: () => Boolean(formData.age && typeof formData.age === 'number' && formData.age > 0) },
    { field: 'Gender', check: () => Boolean(formData.gender) },
    { field: 'Orientation', check: () => Boolean(formData.orientation && formData.orientation.length > 0) },
    { field: 'Race', check: () => Boolean(formData.race) },
    { field: 'Languages', check: () => Boolean(formData.languages && formData.languages.length > 0) },
    { field: 'Height', check: () => Boolean(formData.heightFt && formData.heightFt > 0) },
    { field: 'Weight', check: () => Boolean(formData.weightLbs && formData.weightLbs > 0) },
    { field: 'Exercise Habits', check: () => Boolean(formData.exerciseHabits) },
    { field: 'Religion', check: () => Boolean(formData.religion) },
    { field: 'Politics', check: () => Boolean(formData.politics && formData.politics.length > 0) },
    { field: 'Race Preference', check: () => Boolean(formData.racePreference && formData.racePreference.length > 0) },
    { field: 'Relationship Goal', check: () => Boolean(formData.relationshipGoal && formData.relationshipGoal.length > 0) },
    { field: 'Children Preference', check: () => Boolean(formData.childrenPreference && formData.childrenPreference.length > 0) },
  ];

  const optional: { field: string; check: () => boolean }[] = [
    { field: 'About Me', check: () => Boolean(formData.about?.trim()) },
    { field: 'Military Service', check: () => Boolean(formData.military) },
    { field: 'Pronouns', check: () => Boolean(formData.pronouns && formData.pronouns.length > 0) },
    { field: 'Zodiac Sign', check: () => Boolean(formData.zodiacSign) },
    { field: 'Height Preference', check: () => Boolean(formData.heightPreference && formData.heightPreference.length > 0) },
    { field: 'Body Type Preference', check: () => Boolean(formData.bodyTypePreference && formData.bodyTypePreference.length > 0) },
    { field: 'Hobbies', check: () => Boolean(formData.hobbies && Object.keys(formData.hobbies).length > 0) },
    { field: 'Favorite Foods', check: () => Boolean(formData.favoriteFoods && formData.favoriteFoods.length > 0) },
    { field: 'Music (Performing or Listening)', check: () => Boolean((formData.musicPerforming && formData.musicPerforming.length > 0) || (formData.musicListening && formData.musicListening.length > 0)) },
    { field: 'Movies & TV', check: () => Boolean(formData.moviesTV && formData.moviesTV.length > 0) },
    { field: 'Personality Traits', check: () => Boolean(formData.personality && formData.personality.length > 0) },
    { field: 'Dealbreakers', check: () => Boolean(formData.dealbreakers && formData.dealbreakers.length > 0) },
    { field: 'What I Want (Activities)', check: () => Boolean(formData.desiresActivities && formData.desiresActivities.length > 0) },
    { field: 'What I Want (Traits)', check: () => Boolean(formData.desiresTraits && formData.desiresTraits.length > 0) },
  ];

  const completedMandatory = mandatory.filter(m => m.check());
  const completedOptional = optional.filter(o => o.check());
  
  const missingMandatory = mandatory.filter(m => !m.check()).map(m => m.field);
  const missingOptional = optional.filter(o => !o.check()).map(o => o.field);

  const totalFields = mandatory.length + optional.length;
  const completedFields = completedMandatory.length + completedOptional.length;
  const percentage = Math.round((completedFields / totalFields) * 100);

  return {
    totalFields,
    completedFields,
    percentage,
    missingMandatory,
    missingOptional
  };
}

export function hasIncompleteProfile(formData: Partial<FormData>): boolean {
  const completion = calculateProfileCompletion(formData);
  return completion.missingMandatory.length > 0 || completion.missingOptional.length > 0;
}
