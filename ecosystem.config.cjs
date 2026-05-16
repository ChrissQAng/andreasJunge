module.exports = {
  apps: [
    {
      name: 'andreas-junge',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: '/var/www/andreas-junge',
      env: {
        NODE_ENV: 'production',
        PORT: '3000',
      },
      instances: 1,
      autorestart: true,
      max_memory_restart: '1G',
    },
  ],
}
