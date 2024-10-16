import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: ['activeTab', 'storage'],
    host_permissions: ['*://*.linkedin.com/*'],
    background: {
      service_worker: 'background.js',
    },
    content_scripts: [
      {
        matches: ['*://*.linkedin.com/*'],
        js: ['content-scripts/content.js'],
      },
    ],
    icons: {
      '16': '/icon/16.png',
      '32': '/icon/32.png',
      '48': '/icon/48.png',
      '96': '/icon/96.png',
      '128': '/icon/128.png',
    },
    action: {},  
  },
});
