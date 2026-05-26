import PageHeader from '../components/ui/PageHeader.jsx';
import Badge from '../components/ui/Badge.jsx';
import PermissionNotice from '../components/ui/PermissionNotice.jsx';
import { useApp } from '../context/AppContext.jsx';
import { can, permissionLabels, rolePermissions } from '../utils/permissions.js';

const modeMeta = {
  management: {
    title: 'User Management',
    description: 'Directory of portal users with department and status.',
  },
  roles: {
    title: 'Roles',
    description: 'Role catalogue used by the mock authentication layer.',
  },
  permissions: {
    title: 'Permissions',
    description: 'Permission matrix mapped to each portal role.',
  },
};

export default function UsersPage({ mode = 'management' }) {
  const { currentUser, searchQuery, users } = useApp();
  const meta = modeMeta[mode] || modeMeta.management;
  const canManage = can(currentUser, 'manage_users');
  const query = searchQuery.trim().toLowerCase();

  const filteredUsers = users.filter((user) => {
    if (!query) return true;
    const haystack = `${user.name} ${user.role} ${user.department}`.toLowerCase();
    return haystack.includes(query);
  });

  if (mode !== 'management' && !canManage) {
    return <PermissionNotice>User administration is restricted to authorized roles.</PermissionNotice>;
  }

  if (mode === 'management' && !canManage) {
    return <PermissionNotice>User management is restricted for your role in this prototype.</PermissionNotice>;
  }

  if (mode === 'roles') {
    return (
      <div className="animate-fade-in">
        <PageHeader description={meta.description} eyebrow="Users" title={meta.title} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.keys(rolePermissions).map((role) => (
            <article key={role} className="surface p-5">
              <h2 className="text-base font-semibold text-slate-950 dark:text-white">{role}</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {rolePermissions[role].length} permissions assigned
              </p>
            </article>
          ))}
        </div>
      </div>
    );
  }

  if (mode === 'permissions') {
    const allPermissions = Object.keys(permissionLabels);
    return (
      <div className="animate-fade-in">
        <PageHeader description={meta.description} eyebrow="Users" title={meta.title} />
        <div className="surface overflow-x-auto p-4">
          <table className="min-w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="px-2 py-2">Permission</th>
                {Object.keys(rolePermissions).map((role) => (
                  <th key={role} className="px-2 py-2">
                    {role}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allPermissions.map((perm) => (
                <tr key={perm} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-2 py-2 font-medium">{permissionLabels[perm]}</td>
                  {Object.keys(rolePermissions).map((role) => (
                    <td key={role} className="px-2 py-2 text-center">
                      {rolePermissions[role].includes(perm) ? 'Yes' : '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader description={meta.description} eyebrow="Users" title={meta.title} />
      <div className="surface overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-900/60">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-slate-100 dark:border-slate-800">
                <td className="px-4 py-3 font-medium">{user.name}</td>
                <td className="px-4 py-3">{user.role}</td>
                <td className="px-4 py-3">{user.department}</td>
                <td className="px-4 py-3">
                  <Badge tone="success">{user.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
