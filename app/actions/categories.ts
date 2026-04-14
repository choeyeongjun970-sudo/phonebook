'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getCategories() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', user.id)
    .order('name', { ascending: true });

  if (error) {
    console.error('분류 조회 실패:', error);
    return [];
  }

  return data;
}

export async function addCategory(name: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Unauthorized' };

  const { error } = await supabase.from('categories').insert({ 
    name,
    user_id: user.id 
  });

  if (error) {
    console.error('분류 추가 실패:', error);
    return { success: false };
  }

  revalidatePath('/');
  return { success: true };
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Unauthorized' };

  const { error } = await supabase.from('categories').delete().eq('id', id).eq('user_id', user.id);

  if (error) {
    console.error('분류 삭제 실패:', error);
    return { success: false };
  }

  revalidatePath('/');
  return { success: true };
}
