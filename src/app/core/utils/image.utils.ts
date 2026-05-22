const PROXY_URL = 'https://wsrv.nl/';

export function getOptimizedSrc(imageUrl: string, width = 1920, quality = 80): string {
  if (!imageUrl) return '';
  const encodedUrl = encodeURIComponent(imageUrl);
  return `${PROXY_URL}?url=${encodedUrl}&w=${width}&q=${quality}&output=webp&fit=cover`;
}

export function getOptimizedSrcset(imageUrl: string): string {
  if (!imageUrl) return '';
  const encodedUrl = encodeURIComponent(imageUrl);

  return [
    `${PROXY_URL}?url=${encodedUrl}&w=400&q=70&output=webp&fit=cover 400w`,
    `${PROXY_URL}?url=${encodedUrl}&w=800&q=75&output=webp&fit=cover 800w`,
    `${PROXY_URL}?url=${encodedUrl}&w=1200&q=80&output=webp&fit=cover 1200w`,
    `${PROXY_URL}?url=${encodedUrl}&w=1920&q=80&output=webp&fit=cover 1920w`,
  ].join(', ');
}

export function getProductImageSrc(imageUrl: string | null, width = 400): string {
  if (!imageUrl) return '/images/placeholder.svg';
  return getOptimizedSrc(imageUrl, width, 75);
}

export function getProductImageSrcset(imageUrl: string | null): string {
  if (!imageUrl) return '';
  const encodedUrl = encodeURIComponent(imageUrl);

  return [
    `${PROXY_URL}?url=${encodedUrl}&w=200&q=70&output=webp&fit=cover 200w`,
    `${PROXY_URL}?url=${encodedUrl}&w=400&q=75&output=webp&fit=cover 400w`,
    `${PROXY_URL}?url=${encodedUrl}&w=600&q=80&output=webp&fit=cover 600w`,
  ].join(', ');
}
