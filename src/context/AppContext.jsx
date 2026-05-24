import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { fakeLogin } from '../services/authService.js';
import {
  activities as activitySeed,
  agendas as agendaSeed,
  documents as documentSeed,
  meetings as meetingSeed,
  notifications as notificationSeed,
  users as userSeed,
} from '../mockData/index.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [theme, setTheme] = useLocalStorage('adrde-theme', 'light');
  const [currentUser, setCurrentUser] = useLocalStorage('adrde-current-user', null);
  const [activePage, setActivePage] = useState('dashboard');
  const [meetings, setMeetings] = useState(meetingSeed);
  const [agendas, setAgendas] = useState(agendaSeed);
  const [documents, setDocuments] = useState(documentSeed);
  const [notifications] = useState(notificationSeed);
  const [activities, setActivities] = useState(activitySeed);
  const [users] = useState(userSeed);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const login = (credentials) => {
    const user = fakeLogin(credentials);
    setCurrentUser(user);
    setActivePage('dashboard');
  };

  const logout = () => {
    setCurrentUser(null);
    setActivePage('dashboard');
  };

  const toggleTheme = () => setTheme((value) => (value === 'dark' ? 'light' : 'dark'));

  const addActivity = (text, actor = currentUser?.role || 'System') => {
    setActivities((items) => [
      {
        id: `A-${Date.now()}`,
        text,
        actor,
        time: new Intl.DateTimeFormat('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date()),
      },
      ...items,
    ]);
  };

  const value = useMemo(
    () => ({
      theme,
      currentUser,
      activePage,
      meetings,
      agendas,
      documents,
      notifications,
      activities,
      users,
      login,
      logout,
      toggleTheme,
      setActivePage,
      setMeetings,
      setAgendas,
      setDocuments,
      addActivity,
    }),
    [theme, currentUser, activePage, meetings, agendas, documents, notifications, activities, users],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return context;
}
