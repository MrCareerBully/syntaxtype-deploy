const { createProxyMiddleware } = require('http-proxy-middleware');

// Reads backend URL from environment variable and falls back to localhost
const target = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

module.exports = function (app) {
  // Proxy requests starting with /api to backend
  app.use(
    '/api',
    createProxyMiddleware({
      target,
      changeOrigin: true,
      secure: false,
      // You can add pathRewrite rules if needed
      // pathRewrite: { '^/api': '/api' },
    })
  );
};
