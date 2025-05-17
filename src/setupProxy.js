const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Redirecionamento para a API principal no backend
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
    })
  );

  // Redirecionamento para o servidor de socket.io
  app.use(
    '/socket.io',
    createProxyMiddleware({
      target: 'http://localhost:3002',
      changeOrigin: true,
      ws: true, // Importante para WebSockets
    })
  );
}; 