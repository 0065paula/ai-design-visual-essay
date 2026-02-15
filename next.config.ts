import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'docs',
  basePath: '/ai-design-visual-essay',
  assetPrefix: '/ai-design-visual-essay',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
