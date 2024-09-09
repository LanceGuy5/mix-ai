import path from 'path';
import { fileURLToPath } from 'url';

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, options) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    config.resolve.alias['@'] = path.join(__dirname, 'src');
    return config;
  },
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  distDir: 'build',
};

export default nextConfig;
