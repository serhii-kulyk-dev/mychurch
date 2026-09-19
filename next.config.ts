import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [48, 64, 96, 128, 192, 256, 384],
  },
  /* The listing page is gone: there is one ambassador, so /ambassadors
     goes straight to its page. */
  async redirects() {
    return [{ source: "/ambassadors", destination: "/ambassadors/nove-zhyttia", permanent: true }];
  },
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
