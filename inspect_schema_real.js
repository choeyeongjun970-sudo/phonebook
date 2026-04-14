const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://qjwjdpmyqluspyvldylq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqd2pkcG15cWx1c3B5dmxkeWxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NDMxMTksImV4cCI6MjA5MDUxOTExOX0.opGtGQ1KYXFuJIpdzR4KCj-rbungIEEZmfQJPLvz9WA'
);

async function inspectSchema() {
   // Query a single row from each table to see returned keys
  const { data: contact } = await supabase.from('contacts').select('*').limit(1);
  const { data: category } = await supabase.from('categories').select('*').limit(1);
  
  console.log('Contact columns:', contact ? Object.keys(contact[0]) : 'No data');
  console.log('Category columns:', category ? Object.keys(category[0]) : 'No data');
}

inspectSchema();
