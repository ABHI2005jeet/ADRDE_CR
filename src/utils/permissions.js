export const rolePermissions = {
  Admin: ['all'],
  'Para Head': ['approve_meeting', 'approve_agenda', 'view_reports', 'download_reports', 'view_meetings', 'create_letter', 'manage_users'],
  Scientist: ['create_meeting', 'review_meeting', 'upload_document', 'view_reports', 'download_reports', 'create_letter', 'view_meetings'],
  'Technical Officer': ['create_meeting', 'upload_document', 'manage_inventory', 'create_letter', 'view_meetings', 'manage_tasks'],
  Staff: ['create_meeting', 'view_meetings', 'view_tasks', 'manage_tasks', 'create_letter', 'preview_document'],
  'Contractual Worker': ['view_meetings', 'manage_inventory'],
  Intern: ['view_meetings', 'preview_document', 'submit_suggestion'],
};

export function can(user, permission) {
  if (!user) return false;
  const perms = rolePermissions[user.role] || [];
  if (perms.includes('all')) return true;
  return perms.includes(permission);
}

export const permissionLabels = {
  all: 'Full access',
  view_meetings: 'View meetings',
  create_meeting: 'Create meetings',
  review_meeting: 'Review meetings',
  approve_meeting: 'Approve meetings',
  upload_document: 'Upload documents',
  preview_document: 'Preview documents',
  approve_agenda: 'Approve agendas',
  create_letter: 'Create letters',
  manage_inventory: 'Manage inventory',
  view_reports: 'View reports',
  download_reports: 'Download reports',
  view_tasks: 'View tasks',
  manage_tasks: 'Manage tasks',
  submit_suggestion: 'Submit suggestions',
  manage_users: 'Manage users',
};
