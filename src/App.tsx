import { useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { SignUpScreen } from './components/SignUpScreen';
import { WelcomeScreen } from './components/WelcomeScreen';
import { SignUpFlow } from './components/SignUpFlow';
import { MainDashboard } from './components/MainDashboard';
import { ChatScreen } from './components/ChatScreen';
import { VoiceChatScreen } from './components/VoiceChatScreen';
import { ProfileReveal } from './components/ProfileReveal';
import { DatePlanner } from './components/DatePlanner';
import { DateFeedback } from './components/DateFeedback';
import { ConversationSettings } from './components/ConversationSettings';

export type Screen = 'login' | 'signupscreen' | 'welcome' | 'signup' | 'dashboard' | 'chat' | 'voice' | 'profile' | 'dateplanner' | 'feedback' | 'conversationSettings';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [friendsList, setFriendsList] = useState<number[]>([]);

  const navigateTo = (screen: Screen, data?: any) => {
    if (data) {
      setSelectedMatch(data);
    }
    setCurrentScreen(screen);
  };

  const handleSaveToFriendsList = (matchId: number) => {
    if (!friendsList.includes(matchId)) {
      setFriendsList([...friendsList, matchId]);
    }
  };

  // Demo match for "Meaningful Conversations" quick access
  const demoMatch = {
    id: 1,
    name: 'Anonymous User',
    compatibility: 92,
    age: 28,
    location: '3 miles away',
    interests: ['Hiking', 'Photography', 'Cooking'],
    sharedInterests: ['Hiking', 'Photography', 'Cooking'],
    mandatoryInterests: ['Hiking', 'Cooking'],
    bio: 'Love exploring new trails and trying new recipes. Looking for someone who enjoys deep conversations and spontaneous adventures.',
    personality: ['Adventurous', 'Creative', 'Thoughtful'],
    conversationDuration: '2 days',
    revealed: false
  };

  const handleMeaningfulConversations = () => {
    setSelectedMatch(demoMatch);
    setCurrentScreen('chat');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      {currentScreen === 'login' && (
        <LoginScreen 
          onComplete={() => navigateTo('welcome')} 
          onSignUp={() => navigateTo('signupscreen')}
        />
      )}
      {currentScreen === 'signupscreen' && (
        <SignUpScreen 
          onComplete={() => navigateTo('welcome')} 
          onBack={() => navigateTo('login')}
        />
      )}
      {currentScreen === 'welcome' && (
        <WelcomeScreen 
          onNext={() => navigateTo('signup')} 
          onMeaningfulConversations={handleMeaningfulConversations}
        />
      )}
      {currentScreen === 'signup' && <SignUpFlow onComplete={() => navigateTo('dashboard')} />}
      {currentScreen === 'dashboard' && <MainDashboard onNavigate={navigateTo} />}
      {currentScreen === 'chat' && <ChatScreen match={selectedMatch} onBack={() => navigateTo('dashboard')} onNavigate={navigateTo} onSaveToFriendsList={handleSaveToFriendsList} />}
      {currentScreen === 'voice' && <VoiceChatScreen match={selectedMatch} onBack={() => navigateTo('chat', selectedMatch)} />}
      {currentScreen === 'profile' && <ProfileReveal match={selectedMatch} onBack={() => navigateTo('chat', selectedMatch)} />}
      {currentScreen === 'dateplanner' && <DatePlanner match={selectedMatch} onBack={() => navigateTo('chat', selectedMatch)} />}
      {currentScreen === 'feedback' && <DateFeedback match={selectedMatch} onClose={() => navigateTo('dashboard')} onSubmit={(feedback) => console.log('Feedback:', feedback)} />}
      {currentScreen === 'conversationSettings' && <ConversationSettings match={selectedMatch} onBack={() => navigateTo('chat', selectedMatch)} onDeleteConversation={() => navigateTo('dashboard')} onSaveToFriendsList={handleSaveToFriendsList} />}
    </div>
  );
}