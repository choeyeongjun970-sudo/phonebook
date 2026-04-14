'use server';

import { createClient } from '@/utils/supabase/server';

export async function uploadAvatar(file: File, contactId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const ext = file.name.split('.').pop();
  const filePath = `${user.id}/${contactId}.${ext}`;

  const { error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true });

  if (error) {
    console.error('[uploadAvatar] 업로드 실패:', error);
    return null;
  }

  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
  return data.publicUrl;
}
