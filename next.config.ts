import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdf-parse pulls in pdfjs-dist, which loads a worker script from a real
  // file path at runtime. Bundling it (the default) mangles that path into
  // an unresolvable chunk reference — keeping it external lets Node resolve
  // it normally from node_modules instead.
  serverExternalPackages: ["pdf-parse", "pdfjs-dist"],
};

export default nextConfig;
