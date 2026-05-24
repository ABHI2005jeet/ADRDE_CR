import PageHeader from '../components/ui/PageHeader.jsx';
import Badge from '../components/ui/Badge.jsx';
import { useApp } from '../context/AppContext.jsx';
import { can, permissionLabels, rolePermissions } from '../utils/permissions.js';

export default function AccessPage() {
  const { currentUser, users } = useApp();

  if (!can(currentUser, 'manage_users')) {
    return (
      <div className="surface p-6 text-sm text-slate-600 dark:text-slate-400">
        Access control is restricted to administrators.
      </div>
    );
  }

  const allPermissions = Object.keys(permissionLabels);

  return (
    <div>
      <PageHeader
        eyebrow="Security"
        title="Role-Based Access"
        description="Mock permission matrix for MAC module roles"
      />

      <div className="mb-6 surface overflow-x-auto">
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
            {users.map((user) => (
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

      <div className="surface overflow-x-auto p-4">
        <h2 className="mb-4 text-sm font-semibold text-adrde-navy dark:text-slate-100">
          Permission Matrix
        </h2>
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
                    {rolePermissions[role].includes(perm) ? '✓' : '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-slate-500">
        Current session role: <strong>{currentUser?.role}</strong> — navigation and actions reflect these mock permissions.
      </p>
    </div>
  );
}
