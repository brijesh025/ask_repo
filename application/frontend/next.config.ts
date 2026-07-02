import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["0.0.0.0:3000"],
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
