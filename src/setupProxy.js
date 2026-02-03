const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // Get backend URL from environment variable or use default
  // Note: In Create React App, environment variables must start with REACT_APP_
  const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  console.log('Proxy configured: /api →', backendUrl);

  // Proxy API requests to backend
  app.use(
    '/api',
    createProxyMiddleware({
      target: backendUrl,
      changeOrigin: true,
      secure: false, // Set to true if using HTTPS
      logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'warn',
      onProxyReq: (proxyReq, req, res) => {
        // Log proxied requests in development
        if (process.env.NODE_ENV === 'development') {
          console.log('Proxying:', req.method, req.url, '→', `${backendUrl}${req.url}`);
        }
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err.message);
        console.error('Make sure your backend is running at:', backendUrl);
      },
    })
  );
};
