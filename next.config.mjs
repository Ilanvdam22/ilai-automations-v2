/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Dezelfde URL levert HTML of Markdown, afhankelijk van de Accept-header.
        source: "/((?!_next/|images/).*)",
        headers: [{ key: "Vary", value: "Accept" }],
      },
    ];
  },
};

export default nextConfig;
