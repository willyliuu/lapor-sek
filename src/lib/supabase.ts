import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

// Sanitize URL: if it ends with /rest/v1/ or /rest/v1, strip it.
let sanitizedUrl = supabaseUrl;
if (sanitizedUrl.endsWith('/rest/v1/')) {
  sanitizedUrl = sanitizedUrl.slice(0, -9);
} else if (sanitizedUrl.endsWith('/rest/v1')) {
  sanitizedUrl = sanitizedUrl.slice(0, -8);
}

export const isSupabaseConfigured = !!(
  sanitizedUrl &&
  supabaseAnonKey &&
  !sanitizedUrl.includes('your-project') &&
  supabaseAnonKey !== 'your-anon-key'
);

const rawClient = isSupabaseConfigured ? createClient(sanitizedUrl, supabaseAnonKey) : null;

// Proxy wrapper to prevent crashing on import if keys are invalid or missing
export const supabase = new Proxy({} as any, {
  get(target, prop) {
    if (!rawClient) {
      throw new Error(
        `Supabase is not configured. Please check your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local`
      );
    }
    return (rawClient as any)[prop];
  }
});

/**
 * Uploads a photo to Supabase Storage or simulates upload if not configured.
 * @param file The file to upload
 * @param category The issue category, used for fallback mockup images
 * @returns The public URL of the uploaded image
 */
export async function uploadIssuePhoto(file: File, category: string): Promise<string> {
  if (!isSupabaseConfigured) {
    console.warn('Using mock photo upload because Supabase is not configured.');
    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const MOCK_PHOTOS: Record<string, string> = {
      road_damage: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=800&auto=format&fit=crop&q=60',
      flooding: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop&q=60',
      waste: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=800&auto=format&fit=crop&q=60',
      lighting: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&auto=format&fit=crop&q=60',
      facility: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&auto=format&fit=crop&q=60',
      other: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=60',
    };
    return MOCK_PHOTOS[category] || MOCK_PHOTOS['other'];
  }

  const fileExt = file.name.split('.').pop();
  const uniqueId = Math.random().toString(36).substring(2, 15);
  const fileName = `${uniqueId}-${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('issue-photos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || 'image/jpeg',
    });

  if (error) {
    throw error;
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from('issue-photos')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}

