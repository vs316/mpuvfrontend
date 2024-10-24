/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ceptrackerbucket.s3.ap-south-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
  webpack(config) {
    // Add rule for SVG files
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
