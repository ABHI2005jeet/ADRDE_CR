import User from '../models/User.js';
import Shortcut from '../models/Shortcut.js';
import Agenda from '../models/Agenda.js';
import { departmentForRole } from './helpers.js';

const DEFAULT_SHORTCUTS = [
  { key: 'adrde-online', title: 'ADRDE Online Services', order: 1 },
  { key: 'drona-services', title: 'DRONA Services', order: 2 },
  { key: 'downloads', title: 'Downloads', order: 3 },
  { key: 'info-security', title: 'Information Security', order: 4 },
  { key: 'misc-docs', title: 'Miscellaneous Documents', order: 5 },
  { key: 'online-td', title: 'Online TD', order: 6 },
  { key: 'user-profile', title: 'User Profile', order: 7 },
  { key: 'notice-section', title: 'Notice Section', order: 8 },
  { key: 'amc-complaint', title: 'AMC Complaint Portal', order: 9 },
  { key: 'lunch-booking', title: 'Lunch Booking', order: 10 },
  { key: 'mac-agenda', title: 'Agenda For MAC Meeting', order: 11 },
  { key: 'drona-home', title: 'DRONA Home', order: 12 },
  { key: 'drona-email', title: 'DRONA E-Mail', order: 13 },
  { key: 'e-cop', title: 'e-COP(PIS)', order: 14 },
  { key: 'imms-v2', title: 'IMMS V2', order: 15 },
  { key: 'mayurpankh', title: 'Mayurpankh', order: 16 },
  { key: 'drdo-directory', title: 'DRDO Directory', order: 17 },
  { key: 'ceptam', title: 'CEPTAM Portal', order: 18 },
];

const DEFAULT_AGENDAS = [
  { agendaId: 'AG-501', topic: 'Subsystem readiness review', department: 'Flight Systems', priority: 'High', status: 'Pending', meetingId: 'MAC-203' },
  { agendaId: 'AG-502', topic: 'Instrumentation calibration plan', department: 'Instrumentation', priority: 'Medium', status: 'Approved', meetingId: 'MAC-203' },
];

export async function seedDatabase() {
  const adminEmail = 'dhirendrakumar8594@gmail.com';
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({
      name: 'Abhijeet Kumar',
      employeeId: 'ADRDE-ADM-001',
      email: adminEmail,
      password: 'Admin@123',
      role: 'Admin',
      department: departmentForRole('Admin'),
      contactInfo: '+91-562-240-0001',
    });
    console.log('Seeded default Admin account');
  }

  for (const item of DEFAULT_SHORTCUTS) {
    await Shortcut.updateOne(
      { key: item.key },
      {
        $setOnInsert: {
          ...item,
          description: `${item.title} — internal ADRDE LAN portal module. Configure external integration from Admin Settings.`,
          category: 'LAN Portal',
        },
      },
      { upsert: true },
    );
  }

  for (const agenda of DEFAULT_AGENDAS) {
    await Agenda.updateOne({ agendaId: agenda.agendaId }, { $setOnInsert: agenda }, { upsert: true });
  }
}
