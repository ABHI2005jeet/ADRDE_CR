import crypto from 'crypto';

export function createResetToken() {
  const token = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  const expires = Date.now() + 60 * 60 * 1000;
  return { token, hash, expires };
}

export async function sendPasswordResetEmail({ email, name, resetUrl }) {
  const hasSmtp = process.env.SMTP_HOST && process.env.SMTP_USER;

  if (!hasSmtp) {
    console.log('\n--- MOCK PASSWORD RESET EMAIL ---');
    console.log(`To: ${email}`);
    console.log(`Name: ${name}`);
    console.log(`Reset link: ${resetUrl}`);
    console.log('---------------------------------\n');
    return { mode: 'mock', previewUrl: resetUrl };
  }

  // Placeholder for real SMTP — plug nodemailer here when configured
  console.log(`Password reset queued for ${email}`);
  return { mode: 'smtp' };
}

export function departmentForRole(role) {
  const map = {
    Admin: 'Administration',
    'Para Head': 'Aerodynamic Systems',
    Scientist: 'Research & Development',
    'Technical Officer': 'Technical Coordination',
    Staff: 'Administration',
    Intern: 'Instrumentation',
    'Contractual Worker': 'Logistics & Stores',
  };
  return map[role] || 'General Administration';
}
