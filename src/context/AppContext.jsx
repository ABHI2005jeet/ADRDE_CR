import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { buildUserFromLogin } from '../services/authService.js';
import {
  getDefaultWorkspace,
  loadSessionUser,
  loadUserWorkspace,
  saveSessionUser,
  saveUserWorkspace,
} from '../services/userStorage.js';
import { users as userSeed } from '../mockData/index.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [theme, setTheme] = useLocalStorage('adrde-theme', 'light');
  const [currentUser, setCurrentUserState] = useState(() => loadSessionUser());
  const [activePage, setActivePage] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const defaultWorkspace = useMemo(() => getDefaultWorkspace(), []);
  const [meetings, setMeetings] = useState(defaultWorkspace.meetings);
  const [agendas, setAgendas] = useState(defaultWorkspace.agendas);
  const [documents, setDocuments] = useState(defaultWorkspace.documents);
  const [letters, setLetters] = useState(defaultWorkspace.letters);
  const [inventory, setInventory] = useState(defaultWorkspace.inventory);
  const [notifications, setNotifications] = useState(defaultWorkspace.notifications);
  const [activities, setActivities] = useState(defaultWorkspace.activities);
  const [users, setUsers] = useState(userSeed);

  const hydratedRef = useRef(false);
  const skipSaveRef = useRef(false);

  const applyWorkspace = useCallback((workspace) => {
    skipSaveRef.current = true;
    setMeetings(workspace.meetings ?? defaultWorkspace.meetings);
    setAgendas(workspace.agendas ?? defaultWorkspace.agendas);
    setDocuments(workspace.documents ?? defaultWorkspace.documents);
    setLetters(workspace.letters ?? defaultWorkspace.letters);
    setInventory(workspace.inventory ?? defaultWorkspace.inventory);
    setNotifications(workspace.notifications ?? defaultWorkspace.notifications);
    setActivities(workspace.activities ?? defaultWorkspace.activities);
    window.setTimeout(() => {
      skipSaveRef.current = false;
    }, 0);
  }, [defaultWorkspace]);

  const persistWorkspace = useCallback(
    (employeeId, overrides = {}) => {
      if (!employeeId) return;
      saveUserWorkspace(employeeId, {
        meetings: overrides.meetings ?? meetings,
        agendas: overrides.agendas ?? agendas,
        documents: overrides.documents ?? documents,
        letters: overrides.letters ?? letters,
        inventory: overrides.inventory ?? inventory,
        notifications: overrides.notifications ?? notifications,
        activities: overrides.activities ?? activities,
      });
    },
    [meetings, agendas, documents, letters, inventory, notifications, activities],
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    if (!currentUser?.employeeId || hydratedRef.current) return;
    const saved = loadUserWorkspace(currentUser.employeeId);
    applyWorkspace(saved || defaultWorkspace);
    hydratedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!currentUser?.employeeId || !hydratedRef.current || skipSaveRef.current) return;
    saveUserWorkspace(currentUser.employeeId, {
      meetings,
      agendas,
      documents,
      letters,
      inventory,
      notifications,
      activities,
    });
  }, [
    currentUser?.employeeId,
    meetings,
    agendas,
    documents,
    letters,
    inventory,
    notifications,
    activities,
  ]);

  const setCurrentUser = (user) => {
    setCurrentUserState(user);
    saveSessionUser(user);
  };

  const addActivity = useCallback(
    (text, actor) => {
      const actorName = actor || currentUser?.name || 'System';
      setActivities((items) => {
        const next = [
          {
            id: `A-${Date.now()}`,
            text,
            actor: actorName,
            time: formatNow(),
          },
          ...items,
        ];
        if (currentUser?.employeeId) {
          persistWorkspace(currentUser.employeeId, { activities: next });
        }
        return next;
      });
    },
    [currentUser, persistWorkspace],
  );

  const login = (credentials) => {
    const user = buildUserFromLogin(credentials);
    const saved = loadUserWorkspace(user.employeeId);
    const workspace = saved || defaultWorkspace;
    const loginActivity = {
      id: `A-${Date.now()}`,
      text: 'User login activity',
      actor: user.name,
      time: formatNow(),
    };
    const nextWorkspace = {
      ...workspace,
      activities: [loginActivity, ...(workspace.activities || [])],
    };
    applyWorkspace(nextWorkspace);
    saveUserWorkspace(user.employeeId, nextWorkspace);
    hydratedRef.current = true;
    setCurrentUser(user);
    setActivePage('dashboard');

    setUsers((list) => {
      const exists = list.some((entry) => entry.employeeId === user.employeeId);
      if (exists) {
        return list.map((entry) =>
          entry.employeeId === user.employeeId
            ? { ...entry, name: user.name, role: user.role, department: user.department }
            : entry,
        );
      }
      return [
        {
          id: `USR-${user.employeeId}`,
          name: user.name,
          employeeId: user.employeeId,
          role: user.role,
          department: user.department,
          status: 'Active',
        },
        ...list,
      ];
    });
  };

  const logout = () => {
    if (currentUser?.employeeId) {
      persistWorkspace(currentUser.employeeId);
    }
    setCurrentUser(null);
    setActivePage('dashboard');
    setSearchQuery('');
    hydratedRef.current = false;
    applyWorkspace(defaultWorkspace);
  };

  const switchRole = (role) => {
    if (!currentUser) return;
    const updated = buildUserFromLogin({
      name: currentUser.name,
      employeeId: currentUser.employeeId,
      role,
    });
    setCurrentUser(updated);
    addActivity(`Role switched to ${role}`, currentUser.name);
    setUsers((list) =>
      list.map((entry) =>
        entry.employeeId === updated.employeeId
          ? { ...entry, role: updated.role, department: updated.department }
          : entry,
      ),
    );
  };

  const runSearch = () => {
    if (searchQuery.trim()) {
      setActivePage('search');
    }
  };

  const toggleTheme = () => setTheme((value) => (value === 'dark' ? 'light' : 'dark'));

  const value = useMemo(
    () => ({
      theme,
      currentUser,
      activePage,
      searchQuery,
      meetings,
      agendas,
      documents,
      letters,
      inventory,
      notifications,
      activities,
      users,
      login,
      logout,
      switchRole,
      toggleTheme,
      setActivePage,
      setSearchQuery,
      runSearch,
      setMeetings,
      setAgendas,
      setDocuments,
      setLetters,
      setInventory,
      setNotifications,
      addActivity,
    }),
    [
      theme,
      currentUser,
      activePage,
      searchQuery,
      meetings,
      agendas,
      documents,
      letters,
      inventory,
      notifications,
      activities,
      users,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function formatNow() {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return context;
}
