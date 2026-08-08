import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
