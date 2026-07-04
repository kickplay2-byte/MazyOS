import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  // pdfkit uses fs and dynamic requires internally — exclude from bundling
  serverExternalPackages: ['pdfkit'],
};

export default nextConfig;
