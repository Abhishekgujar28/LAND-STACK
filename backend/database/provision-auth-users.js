/**
 * Provision Supabase Auth accounts for all canonical officers and citizens
 * with confirmed email and password 'Password123!' so real JWT tokens work for all roles.
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const admin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function provision() {
  console.log('--- PROVISIONING SUPABASE AUTH ACCOUNTS ---');

  // 1. Fetch all officers from DB
  const { data: officers, error: offErr } = await admin.from('government_users').select('id, name, email, role');
  if (offErr) throw offErr;

  // 2. Fetch all citizens from DB
  const { data: citizens, error: citErr } = await admin.from('citizens').select('id, name, email, mobile');
  if (citErr) throw citErr;

  const allAccounts = [
    ...officers.map(o => ({ email: o.email, phone: null, type: 'GOVERNMENT', id: o.id, name: o.name, role: o.role })),
    ...citizens.map(c => ({
      email: c.email,
      phone: c.mobile ? c.mobile.replace(/\D/g, '') : null,
      type: 'CITIZEN',
      id: c.id,
      name: c.name,
      role: 'CITIZEN'
    })),
  ];

  const { data: existingUsersData } = await admin.auth.admin.listUsers();
  const existingEmails = new Set((existingUsersData?.users || []).map(u => u.email?.toLowerCase()));

  for (const acc of allAccounts) {
    if (existingEmails.has(acc.email?.toLowerCase())) {
      console.log(`✅ Existing user: ${acc.email} (${acc.role})`);
      // Update password to Password123! to guarantee login
      const user = existingUsersData.users.find(u => u.email?.toLowerCase() === acc.email?.toLowerCase());
      if (user) {
        await admin.auth.admin.updateUserById(user.id, {
          password: 'Password123!',
          email_confirm: true,
          user_metadata: { name: acc.name, role: acc.role, userType: acc.type, id: acc.id },
        });
      }
      continue;
    }

    console.log(`⚡ Creating user: ${acc.email} (${acc.role})...`);
    const { data: newUser, error: createErr } = await admin.auth.admin.createUser({
      email: acc.email,
      password: 'Password123!',
      email_confirm: true,
      user_metadata: { name: acc.name, role: acc.role, userType: acc.type, id: acc.id },
    });

    if (createErr) {
      console.error(`❌ Failed to create ${acc.email}:`, createErr.message);
    } else {
      console.log(`✅ Created: ${acc.email} (${newUser.user.id})`);
    }
  }

  console.log('--- PROVISIONING COMPLETE ---');
}

provision().catch(console.error);
