/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    prospeoKey: process.env.PROSPEO_KEY,
    hunterKey: process.env.HUNTER_KEY,
    findyMailKey: process.env.FINDYMAIL_KEY,
 },
};

export default nextConfig;
