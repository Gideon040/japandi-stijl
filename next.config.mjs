import { redirects as redirectList } from './redirects.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  // Productpagina's worden op aanvraag gerenderd en lezen de titel van de
  // bijbehorende koopgids uit content/pages; die map moet dus mee in de bundel.
  outputFileTracingIncludes: {
    "/product/[handle]": ["./content/pages/**/*"],
  },
  async redirects() {
    return redirectList;
  },
};

export default nextConfig;
