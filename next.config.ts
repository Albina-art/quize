import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Минимальный бандл для Docker (node server.js из .next/standalone) */
  output: "standalone",
};

export default nextConfig;
