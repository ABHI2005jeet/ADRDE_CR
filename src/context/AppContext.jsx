import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext.jsx';
import { useToast } from './ToastContext.jsx';
import {
  agendaApi,
  inventoryApi,
  letterApi,
  meetingApi,
  messageApi,
  notificationApi,
  documentApi,
  userApi,
  shortcutApi,
} from '../services/api.js';
import { getSocket } from '../services/socketService.js';
import {
  activities as activitySeed,
  agendas as agendaSeed,
  documents as documentSeed,
  inventoryItems as inventorySeed,
  letters as letterSeed,
  meetings as meetingSeed,
  notifications as notificationSeed,
} from '../mockData/index.js';

const AppContext = createContext(null);

function mapMeeting(m) {
  return {
    id: m._id,
    meetingId: m.meetingId,
    title: m.title,
    description: m.description,
    date: m.date,
    time: m.time,
    venue: m.venue,
    department: m.department,
    priority: m.priority,
    agendaNotes: m.agendaNotes,
    participants: m.participants || [],
    attendees: m.participants || [],
    status: m.status,
    auditTrail: m.auditTrail || [],
    createdByName: m.createdByName,
    reviewedByName: m.reviewedByName,
    approvedByName: m.approvedByName,
    rejectionReason: m.rejectionReason,
  };
}

function mapAgenda(a) {
  return {
    id: a._id,
    agendaId: a.agendaId,
    topic: a.topic,
    department: a.department,
    priority: a.priority,
    status: a.status,
    meetingId: a.meetingId,
  };
}

function mapDocument(d) {
  return {
    id: d._id,
    name: d.originalName || d.name,
    type: d.type,
    uploadDate: d.createdAt?.slice?.(0, 10) || d.uploadDate,
    status: d.status,
    category: d.category,
    uploadedByName: d.uploadedByName,
  };
}

function mapLetter(l) {
  return {
    id: l._id,
    letterId: l.letterId,
    direction: l.direction,
    subject: l.subject,
    reference: l.reference,
    status: l.status,
    date: l.date,
    department: l.department,
  };
}

function mapInventory(i) {
  return {
    id: i._id,
    itemId: i.itemId,
    category: i.category,
    name: i.name,
    location: i.location,
    status: i.status,
    custodian: i.assignedTo || i.updatedByName,
    department: i.department,
    assignedTo: i.assignedTo,
  };
}

function mapNotification(n) {
  return {
    id: n._id,
    title: n.title,
    message: n.message,
    type: n.type,
    category: n.category,
    time: new Date(n.createdAt).toLocaleString('en-IN'),
    read: n.read,
  };
}

function mapActivity(a) {
  return {
    id: a._id,
    text: a.text,
    actor: a.actor,
    time: new Date(a.createdAt).toLocaleString('en-IN'),
  };
}

export function AppProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  const [theme, setTheme] = useState(() => localStorage.getItem('adrde-theme') || 'light');
  const [activePage, setActivePage] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const [meetings, setMeetings] = useState(meetingSeed);
  const [agendas, setAgendas] = useState(agendaSeed);
  const [documents, setDocuments] = useState(documentSeed);
  const [letters, setLetters] = useState(letterSeed);
  const [inventory, setInventory] = useState(inventorySeed);
  const [notifications, setNotifications] = useState(notificationSeed);
  const [activities, setActivities] = useState(activitySeed);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [shortcuts, setShortcuts] = useState([]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('adrde-theme', theme);
  }, [theme]);

  const refreshAll = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const [m, a, d, l, inv, n, act, u, inbox, sc] = await Promise.all([
        meetingApi.list(),
        agendaApi.list(),
        documentApi.list(),
        letterApi.list(),
        inventoryApi.list(),
        notificationApi.list(),
        userApi.activities(),
        userApi.list(),
        messageApi.inbox(),
        shortcutApi.list(),
      ]);
      setMeetings(m.map(mapMeeting));
      setAgendas(a.length ? a.map(mapAgenda) : agendaSeed);
      setDocuments(d.map(mapDocument));
      setLetters(l.map(mapLetter));
      setInventory(inv.map(mapInventory));
      setNotifications(n.map(mapNotification));
      setActivities(act.map(mapActivity));
      setUsers(u);
      setMessages(inbox);
      setShortcuts(sc);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, toast]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll, user?.id]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return undefined;
    const onNotification = (payload) => {
      setNotifications((items) => [
        {
          id: payload._id || `N-${Date.now()}`,
          title: payload.title,
          message: payload.message,
          type: payload.type,
          category: payload.category,
          time: 'Just now',
        },
        ...items,
      ]);
    };
    const onMeeting = () => refreshAll();
    const onMessage = () => refreshAll();
    socket.on('notification', onNotification);
    socket.on('notification:broadcast', onNotification);
    socket.on('meeting:updated', onMeeting);
    socket.on('message:new', onMessage);
    return () => {
      socket.off('notification', onNotification);
      socket.off('notification:broadcast', onNotification);
      socket.off('meeting:updated', onMeeting);
      socket.off('message:new', onMessage);
    };
  }, [refreshAll, user?.id]);

  const toggleTheme = () => setTheme((v) => (v === 'dark' ? 'light' : 'dark'));

  const runSearch = async () => {
    if (!searchQuery.trim()) return;
    setActivePage('search');
  };

  const addActivity = (text, actor) => {
    setActivities((items) => [
      { id: `A-${Date.now()}`, text, actor: actor || user?.name || 'System', time: 'Just now' },
      ...items,
    ]);
  };

  const value = useMemo(
    () => ({
      theme,
      currentUser: user,
      activePage,
      searchQuery,
      loading,
      meetings,
      agendas,
      documents,
      letters,
      inventory,
      notifications,
      activities,
      users,
      messages,
      shortcuts,
      setActivePage,
      setSearchQuery,
      runSearch,
      toggleTheme,
      refreshAll,
      setMeetings,
      setAgendas,
      setDocuments,
      setLetters,
      setInventory,
      setNotifications,
      setMessages,
      setShortcuts,
      addActivity,
      meetingApi,
      documentApi,
      letterApi,
      inventoryApi,
      agendaApi,
      messageApi,
      notificationApi,
      shortcutApi,
      userApi,
    }),
    [
      theme,
      user,
      activePage,
      searchQuery,
      loading,
      meetings,
      agendas,
      documents,
      letters,
      inventory,
      notifications,
      activities,
      users,
      messages,
      shortcuts,
      refreshAll,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
}
