/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Optimization is on so next/image serves resized AVIF/WebP that honor
    // each <Image>'s `sizes`, instead of the multi-MB source PNGs.
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
