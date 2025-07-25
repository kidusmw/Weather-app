const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/weather',
    createProxyMiddleware({
      target: 'https://api.openweathermap.org',
      changeOrigin: true,
      pathRewrite: {
        '^/api/weather': '/data/2.5/weather',
      },
      onError: (err, req, res) => {
        console.log('Proxy Error:', err);
        res.status(500).json({ error: 'Weather API unavailable' });
      },
    })
  );
};
