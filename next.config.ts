import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",
      "picsum.photos",
      "loremflickr.com",
      "via.placeholder.com",
    ], // Added loremflickr.com to allowed domains
  },
  /* config options here */
};

export default nextConfig;
