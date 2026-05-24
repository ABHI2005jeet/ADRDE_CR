export const profileByRole = {
  Admin: {
    name: 'Dr. Ananya Rao',
    employeeId: 'ADRDE-ADM-001',
    department: 'MAC Secretariat',
    email: 'admin.mac@adrde.local',
    phone: '+91-562-240-0101',
  },
  'Para Head': {
    name: 'Group Captain S. Mehra',
    employeeId: 'ADRDE-PH-014',
    department: 'Aerodynamic Systems',
    email: 'parahead@adrde.local',
    phone: '+91-562-240-0144',
  },
  Staff: {
    name: 'Kavita Sharma',
    employeeId: 'ADRDE-STF-088',
    department: 'Technical Coordination',
    email: 'staff.mac@adrde.local',
    phone: '+91-562-240-0188',
  },
  Employee: {
    name: 'Rohan Verma',
    employeeId: 'ADRDE-EMP-246',
    department: 'Instrumentation',
    email: 'employee@adrde.local',
    phone: '+91-562-240-0246',
  },
};

export function fakeLogin({ username, role }) {
  const profile = profileByRole[role] || profileByRole.Employee;
  return {
    ...profile,
    employeeId: username?.trim() || profile.employeeId,
    role,
  };
}
