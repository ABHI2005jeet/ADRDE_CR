export const rolePermissions = {
  Admin: [
    'view_meetings',
    'create_meeting',
    'edit_meeting',
    'delete_meeting',
    'manage_users',
    'upload_document',
    'preview_document',
    'download_document',
    'approve_agenda',
    'view_reports',
    'download_reports',
    'view_tasks',
  ],
  'Para Head': [
    'approve_agenda',
    'preview_document',
    'view_reports',
    'download_reports',
    'view_meetings',
  ],
  Staff: [
    'view_meetings',
    'view_reports',
    'preview_document',
    'download_document',
    'view_tasks',
    'manage_tasks',
  ],
  Employee: [
    'view_meetings',
    'preview_document',
    'submit_suggestion',
    'view_notifications',
  ],
};

export function can(user, permission) {
  if (!user) return false;
  return rolePermissions[user.role]?.includes(permission) || false;
}

export const permissionLabels = {
  create_meeting: 'Create meetings',
  edit_meeting: 'Edit meetings',
  delete_meeting: 'Delete meetings',
  manage_users: 'Manage users',
  upload_document: 'Upload documents',
  preview_document: 'Preview documents',
  download_document: 'Download documents',
  approve_agenda: 'Approve agendas',
  view_reports: 'View reports',
  download_reports: 'Download reports',
  view_tasks: 'View tasks',
  manage_tasks: 'Manage assigned tasks',
  submit_suggestion: 'Submit suggestions',
  view_notifications: 'View notifications',
};
