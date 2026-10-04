import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ngicsvgtxpxmzonotknc.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/**
 * Helper to obtain the current user's JWT access token for FastAPI Authorization headers.
 */
export async function getAuthHeaders(): Promise<Record<string, string>> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      return {
        Authorization: `Bearer ${session.access_token}`,
      };
    }
  } catch (err) {
    console.warn('Supabase session fetch warning:', err);
  }
  return {};
}

export interface UserMemoryItem {
  id: string;
  memory_type: string;
  content: string;
  importance: number;
  created_at: string;
}

/**
 * Fetch all memories remembered for the current user.
 */
export async function fetchUserMemories(apiBase: string = 'http://localhost:8000'): Promise<UserMemoryItem[]> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${apiBase}/api/v1/memory`, {
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.memories || [];
  } catch (err) {
    console.error('Failed to fetch user memories:', err);
    return [];
  }
}

/**
 * Delete a specific memory item.
 */
export async function deleteUserMemory(memoryId: string, apiBase: string = 'http://localhost:8000'): Promise<boolean> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${apiBase}/api/v1/memory/${memoryId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to delete user memory:', err);
    return false;
  }
}
