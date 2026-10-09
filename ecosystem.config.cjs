const path = require('node:path');

module.exports = {
  apps: [
    {
      name: 'careertrack',
      script: path.resolve(__dirname, 'server/index.js'),
      node_args: '--experimental-sqlite',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    }
  ]
};
