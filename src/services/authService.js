export const loginRoles = [
  'Para Head',
  'Scientist',
  'Technical Engineer',
  'Staff',
  'Intern',
  'Contractual Worker',
];

const departmentByRole = {
  'Para Head': 'Aerodynamic Systems',
  Scientist: 'Research & Development',
  'Technical Engineer': 'Technical Coordination',
  Staff: 'Administration',
  Intern: 'Instrumentation',
  'Contractual Worker': 'Logistics & Stores',
};

/** Build session user from login form — name comes from user input only */
export function buildUserFromLogin({ name, employeeId, role }) {
  const trimmedId = employeeId?.trim() || '';
  const trimmedName = name?.trim() || 'User';
  return {
    name: trimmedName,
    employeeId: trimmedId,
    role: role || 'Staff',
    department: departmentByRole[role] || 'General Administration',
    email: trimmedId ? `${trimmedId.toLowerCase()}@adrde.local` : '',
  };
}
