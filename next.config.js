const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  sw: "sw.js",
  buildExcludes: [
    /middleware-manifest\.json$/,
    /_next\/dynamic-css-manifest\.json$/,
  ],
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/cdn\.sanity\.io\/.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "sanity-images",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24, // 24 hours
        },
      },
    },
  ],
});

module.exports = withPWA({
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },
  // Compression
  compress: true,
  // Production optimizations
  poweredByHeader: false,
  reactStrictMode: true,
});
