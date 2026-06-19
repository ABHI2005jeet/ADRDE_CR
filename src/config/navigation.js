export const portalNavigation = [
  {
    id: 'home',
    label: 'Home',
    page: 'dashboard',
  },
  {
    id: 'meetings',
    label: 'Meetings',
    children: [
      { label: 'Create Meeting', page: 'meetings-create' },
      { label: 'Upcoming Meetings', page: 'meetings-upcoming' },
      { label: 'Calendar View', page: 'calendar' },
      { label: 'Timeline View', page: 'timeline' },
      { label: 'Meeting Reports', page: 'meetings-reports' },
    ],
  },
  {
    id: 'documents',
    label: 'Documents',
    children: [
      { label: 'Upload Documents', page: 'documents-upload' },
      { label: 'View Documents', page: 'documents-view' },
      { label: 'Archive', page: 'documents-archive' },
    ],
  },
  {
    id: 'letters',
    label: 'Letters',
    children: [
      { label: 'Incoming Letters', page: 'letters-incoming' },
      { label: 'Outgoing Letters', page: 'letters-outgoing' },
      { label: 'Draft Letters', page: 'letters-draft' },
    ],
  },
  {
    id: 'inventory',
    label: 'Inventory',
    children: [
      { label: 'Assets', page: 'inventory-assets' },
      { label: 'Equipment', page: 'inventory-equipment' },
      { label: 'Requests', page: 'inventory-requests' },
      { label: 'Tracking', page: 'inventory-tracking' },
    ],
  },
  {
    id: 'users',
    label: 'Users',
    children: [
      { label: 'User Management', page: 'users-management' },
      { label: 'Roles', page: 'users-roles' },
      { label: 'Permissions', page: 'users-permissions' },
    ],
  },
  {
    id: 'reports',
    label: 'Reports',
    children: [
      { label: 'Monthly Reports', page: 'reports-monthly' },
      { label: 'Activity Reports', page: 'reports-activity' },
      { label: 'Download Reports', page: 'reports-download' },
    ],
  },
  {
    id: 'notifications',
    label: 'Notifications',
    children: [
      { label: 'Alerts', page: 'notifications-alerts' },
      { label: 'Updates', page: 'notifications-updates' },
      { label: 'Messages', page: 'notifications-messages' },
    ],
  },
  {
    id: 'inbox',
    label: 'Inbox',
    children: [
      { label: 'Internal Mail', page: 'inbox-mail' },
      { label: 'Chats', page: 'inbox-chats' },
      { label: 'Team Messages', page: 'inbox-team' },
    ],
  },
];

export function getNavSection(activePage) {
  if (!activePage) return 'home';
  if (activePage === 'dashboard' || activePage === 'search') return 'home';
  if (activePage.startsWith('meetings') || activePage === 'calendar' || activePage === 'timeline') {
    return 'meetings';
  }
  if (activePage.startsWith('documents')) return 'documents';
  if (activePage.startsWith('letters')) return 'letters';
  if (activePage.startsWith('inventory')) return 'inventory';
  if (activePage.startsWith('users') || activePage === 'access' || activePage === 'profile') {
    return activePage === 'profile' ? null : 'users';
  }
  if (activePage.startsWith('reports')) return 'reports';
  if (activePage.startsWith('notifications')) return 'notifications';
  if (activePage.startsWith('inbox')) return 'inbox';
  if (activePage.startsWith('lan-') || activePage === 'admin-settings' || activePage === 'settings') return 'home';
  return null;
}
