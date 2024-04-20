import path from 'path';

import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sassOptions = {
  includePaths: [path.join(__dirname, 'styles')],
};

const nextConfig = {
  sassOptions,
};

export default nextConfig;