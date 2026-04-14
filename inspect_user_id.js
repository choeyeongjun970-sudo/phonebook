const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://qjwjdpmyqluspyvldylq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqd2pkcG15cWx1c3B5dmxkeWxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NDMxMTksImV4cCI6MjA5MDUxOTExOX0.opGtGQ1KYXFuJIpdzR4KCj-rbungIEEZmfQJPLvz9WA'
);

async function inspect() {
  const { data, error } = await supabase
    .from('contacts')
    .select('id, user_id, name, memo');
  
  if (error) {
    console.error('Error fetching contacts:', error);
  } else {
    console.log('Contacts with user_id:', JSON.stringify(data, null, 2));
  }
}

inspect();
