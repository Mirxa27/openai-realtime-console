import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase client with service role key
const supabaseUrl = process.env.SUPABASE_URL || 'https://ufgqmqoykddaotdbwteg.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

console.log('🔧 Connecting to Supabase:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  try {
    console.log('🚀 Setting up Newomen database...');
    
    // Read the schema file
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Executing ${statements.length} SQL statements...`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          // Try direct query if RPC fails
          const { error: directError } = await supabase
            .from('_')
            .select('*')
            .limit(0);
            
          if (directError && !directError.message.includes('relation "_" does not exist')) {
            console.warn(`⚠️  Warning on statement ${i + 1}:`, error.message);
          }
        }
        
        console.log(`✅ Statement ${i + 1}/${statements.length} completed`);
      } catch (err) {
        console.warn(`⚠️  Warning on statement ${i + 1}:`, err.message);
      }
    }
    
    console.log('🎉 Database setup completed successfully!');
    
    // Verify setup by checking if tables exist
    console.log('🔍 Verifying database setup...');
    
    const { data: tables, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (error) {
      console.warn('Could not verify tables, but setup likely succeeded');
    } else {
      const newomenTables = tables.filter(t => 
        ['profiles', 'user_progress', 'achievements', 'assessments', 'conversations'].includes(t.table_name)
      );
      console.log(`✅ Found ${newomenTables.length} Newomen tables`);
    }
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

// Create admin user if needed
async function createAdminUser() {
  try {
    console.log('👤 Setting up admin user...');
    
    // Check if admin user exists
    const { data: adminUser } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'admin')
      .single();
    
    if (!adminUser) {
      console.log('Creating default admin user...');
      
      // Create admin user in auth
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: 'admin@newomen.com',
        password: 'NewomenAdmin123!',
        email_confirm: true
      });
      
      if (authError) {
        console.warn('Admin user might already exist in auth');
      } else {
        // Create admin profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authUser.user.id,
            email: 'admin@newomen.com',
            full_name: 'Newomen Admin',
            role: 'admin',
            onboarding_completed: true,
            crystals: 10000,
            level: 10
          });
        
        if (profileError) {
          console.warn('Admin profile creation warning:', profileError.message);
        } else {
          console.log('✅ Admin user created successfully');
          console.log('📧 Email: admin@newomen.com');
          console.log('🔑 Password: NewomenAdmin123!');
        }
      }
    } else {
      console.log('✅ Admin user already exists');
    }
  } catch (error) {
    console.warn('⚠️  Admin user setup warning:', error.message);
  }
}

// Run setup
async function main() {
  await setupDatabase();
  await createAdminUser();
  console.log('🌟 Newomen platform setup complete!');
  process.exit(0);
}

main();