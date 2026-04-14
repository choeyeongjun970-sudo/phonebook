'use server';

import { createClient } from '@/utils/supabase/server';
import { encrypt, decrypt } from '@/utils/crypto';
import { revalidatePath } from 'next/cache';

export async function getContacts(categoryId?: string, searchTerm?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  let query = supabase
    .from('contacts')
    .select('*, categories(name)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('연락처 조회 실패:', error);
    return [];
  }

  // 복호화 및 필터링 (애플리케이션 레벨)
  const decryptedContacts = data.map((item) => ({
    ...item,
    name: decrypt(item.name),
    phone_number: decrypt(item.phone_number),
  }));

  if (searchTerm) {
    const s = searchTerm.toLowerCase();
    return decryptedContacts.filter(
      (c) =>
        c.name.toLowerCase().includes(s) || 
        c.phone_number.includes(s)
    );
  }

  return decryptedContacts;
}

export async function addContact(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Unauthorized' };

  const name = formData.get('name') as string;
  const phoneNumber = formData.get('phone_number') as string;
  const memo = formData.get('memo') as string;
  const categoryId = formData.get('category_id') as string;

  const avatar_url = formData.get('avatar_url') as string;

  const { error } = await supabase.from('contacts').insert({
    user_id: user.id,
    name: encrypt(name),
    phone_number: encrypt(phoneNumber),
    memo,
    category_id: categoryId || null,
    avatar_url: avatar_url || null,
  });

  if (error) {
    console.error('연락처 추가 실패:', error);
    return { success: false };
  }

  revalidatePath('/');
  return { success: true };
}

export async function updateContact(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Unauthorized' };

  const name = formData.get('name') as string;
  const phoneNumber = formData.get('phone_number') as string;
  const memo = formData.get('memo') as string;
  const categoryId = formData.get('category_id') as string;

  const avatar_url = formData.get('avatar_url') as string;

  const updateData: Record<string, unknown> = {
    name: encrypt(name),
    phone_number: encrypt(phoneNumber),
    memo,
    category_id: categoryId || null,
  };
  if (avatar_url) updateData.avatar_url = avatar_url;

  const { error } = await supabase.from('contacts').update(updateData).eq('id', id).eq('user_id', user.id);

  if (error) {
    console.error('연락처 수정 실패:', error);
    return { success: false };
  }

  revalidatePath('/');
  return { success: true };
}

export async function deleteContact(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Unauthorized' };

  console.log(`[deleteContact] Attempting to delete contact: ${id} (user: ${user.id})`);

  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('[deleteContact] Deletion failed:', error);
    return { success: false, error: error.message };
  }

  console.log(`[deleteContact] Successfully deleted contact: ${id}`);
  revalidatePath('/');
  return { success: true };
}
