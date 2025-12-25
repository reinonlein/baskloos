import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Photo {
  id: string;
  siteid: string;
  title: string;
  date: string;
  category: string;
  description: string | null;
  storage_path: string;
  created_at: string;
  updated_at: string;
}

export interface Website {
  id: string;
  name: string;
  bucket_name: string;
}

export interface PhotoWithBucket extends Photo {
  bucket_name: string;
}

/**
 * Get all photos for the baskloos.nl website
 * First fetches the website record, then fetches all photos for that site
 * Adds the bucket_name from the website to each photo
 */
export async function getPhotos(): Promise<PhotoWithBucket[]> {
  // First, get the website where name = 'baskloos.nl'
  const { data: website, error: websiteError } = await supabase
    .from("websites")
    .select("id, name, bucket_name")
    .eq("name", "baskloos.nl")
    .single();

  if (websiteError || !website) {
    throw new Error(`Failed to fetch website: ${websiteError?.message || "Website not found"}`);
  }

  // Then, get all photos for this website
  const { data: photos, error: photosError } = await supabase
    .from("photos")
    .select("*")
    .eq("siteid", website.id)
    .order("date", { ascending: false });

  if (photosError) {
    throw new Error(`Failed to fetch photos: ${photosError.message}`);
  }

  // Add bucket_name to each photo
  return (photos || []).map((photo) => ({
    ...photo,
    bucket_name: website.bucket_name,
  }));
}

/**
 * Generate a public URL for an image stored in Supabase Storage
 * @param storagePath - The storage path (e.g., "moois.jpg")
 * @param bucketName - The bucket name (e.g., "baskloos")
 * @param width - Optional width for image transformation
 * @param quality - Optional quality (1-100) for image transformation
 * @returns The public URL to the image
 */
export function getImageUrl(
  storagePath: string,
  bucketName: string,
  width?: number,
  quality?: number
): string {
  if (!storagePath || !bucketName) {
    return "";
  }

  const baseUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${storagePath}`;
  
  // Supabase Storage doesn't support image transformations via URL parameters
  // If you need image transformations, you would need to use Supabase's image transformation service
  // or handle it differently. For now, we'll return the base URL.
  // Note: If you have Supabase Image Transformation enabled, you could add:
  // ?width=${width}&quality=${quality} but this requires additional setup.
  
  return baseUrl;
}

