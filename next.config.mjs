import { redirects as redirectList } from './redirects.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  async redirects() {
    return redirectList;
  },
};

export default nextConfig;
