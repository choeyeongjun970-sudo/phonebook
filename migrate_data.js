const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://qjwjdpmyqluspyvldylq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqd2pkcG15cWx1c3B5dmxkeWxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NDMxMTksImV4cCI6MjA5MDUxOTExOX0.opGtGQ1KYXFuJIpdzR4KCj-rbungIEEZmfQJPLvz9WA'
);

const USER_ID = 'cf2a498d-ac7d-43b6-95c4-730bd6964bed';

async function migrate() {
  console.log('Starting migration for user:', USER_ID);

  // Update categories first (due to FK)
  const { data: catData, error: catError } = await supabase
    .from('categories')
    .update({ user_id: USER_ID })
    .is('user_id', null);
  
  if (catError) {
    console.error('Error migrating categories:', catError);
  } else {
    console.log('Categories migrated.');
  }

  // Update contacts
  const { data: conData, error: conError } = await supabase
    .from('contacts')
    .update({ user_id: USER_ID })
    .is('user_id', null);
  
  if (conError) {
    console.error('Error migrating contacts:', conError);
  } else {
    console.log('Contacts migrated.');
  }
}

migrate();
