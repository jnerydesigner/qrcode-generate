module.exports = {
  apps: [
    {
      name: "generated-qrcode",
      script: "./server.js",
      instances: 1,
      autorestart: true,
      wait_read: true,
      watch: true,
      max_memory_restart: "1G",
      listen_timeout: 5000,
      env: {
        SERVER_PORT: 8075,
      },
    },
  ],
};
