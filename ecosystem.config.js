module.exports = {
  apps: [
    {
      name: 'customer-portal',
      script: 'npm',
      args: 'run dev',
      env: {
        PORT: 3000,
        NODE_ENV: 'development'
      },
      watch: true
    },
    {
      name: 'staff-portal',
      script: 'npm',
      args: 'run dev:staff',
      env: {
        PORT: 3001,
        NODE_ENV: 'development'
      },
      watch: true
    }
  ]
}; 