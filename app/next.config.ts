import type { NextConfig } from "next";

console.log("PREFIX", process.env.PREFIX);

const nextConfig: NextConfig = {
  /* config options here */
  basePath: process.env.PREFIX,
  assetPrefix: process.env.PREFIX,
};

export default nextConfig;
