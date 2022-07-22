/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["etherscan.io", "ipfs.io"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};
