import {
  activities as activitySeed,
  agendas as agendaSeed,
  documents as documentSeed,
  inventoryItems as inventorySeed,
  letters as letterSeed,
  meetings as meetingSeed,
  notifications as notificationSeed,
} from '../mockData/index.js';

const workspaceKey = (employeeId) => `adrde-workspace-${employeeId}`;

export function getDefaultWorkspace() {
  return {
    meetings: meetingSeed,
    agendas: agendaSeed,
    documents: documentSeed,
    letters: letterSeed,
    inventory: inventorySeed,
    notifications: notificationSeed,
    activities: activitySeed,
  };
}

export function loadUserWorkspace(employeeId) {
  if (!employeeId) return null;
  try {
    const raw = window.localStorage.getItem(workspaceKey(employeeId));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveUserWorkspace(employeeId, workspace) {
  if (!employeeId) return;
  try {
    window.localStorage.setItem(workspaceKey(employeeId), JSON.stringify(workspace));
  } catch {
    // Storage full or unavailable — ignore for prototype
  }
}

export function loadSessionUser() {
  try {
    const raw = window.localStorage.getItem('adrde-session-user');
    if (!raw) return null;
    const user = JSON.parse(raw);
    if (!user?.employeeId || !user?.name) return null;
    return user;
  } catch {
    return null;
  }
}

export function saveSessionUser(user) {
  if (!user) {
    window.localStorage.removeItem('adrde-session-user');
    return;
  }
  const { name, employeeId, role, department, email } = user;
  window.localStorage.setItem(
    'adrde-session-user',
    JSON.stringify({ name, employeeId, role, department, email }),
  );
}
