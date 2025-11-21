import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  useCdn: true,
  apiVersion: "2024-01-01",
});

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export function getImageUrl(image: { asset?: { _ref?: string; _type?: string }; url?: string }, width?: number, quality?: number): string {
  // If there's a direct URL, use it
  if (image.url) {
    // Handle markdown-style URLs if present
    const cleanUrl = image.url.replace(/\[([^\]]+)\]\(([^)]+)\)/, '$2');
    return cleanUrl;
  }
  
  // If there's an asset reference, use urlFor
  if (image.asset) {
    let urlBuilder = urlFor(image);
    if (width) urlBuilder = urlBuilder.width(width);
    if (quality) urlBuilder = urlBuilder.quality(quality);
    return urlBuilder.url();
  }
  
  // Fallback
  return '';
}

export async function getPhotos() {
  const query = `*[_type == "photo"] | order(date desc) {
    _id,
    title,
    image {
      asset,
      url
    },
    date,
    category,
    description
  }`;

  return await client.fetch(query);
}

