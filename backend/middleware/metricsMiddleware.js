const client = require('prom-client');

// Collect default Node.js metrics (event loop lag, memory, GC, etc.)
client.collectDefaultMetrics({ prefix: 'zynkly_' });

// --- Custom application metrics ---

// Total HTTP requests counter
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

// HTTP request duration histogram
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
});

// Active requests gauge
const httpActiveRequests = new client.Gauge({
  name: 'http_active_requests',
  help: 'Number of active HTTP requests',
});

/**
 * Express middleware that records request count, duration, and active connections.
 */
function metricsMiddleware(req, res, next) {
  // Skip recording the /metrics endpoint itself
  if (req.path === '/metrics') {
    return next();
  }

  httpActiveRequests.inc();
  const end = httpRequestDuration.startTimer();

  res.on('finish', () => {
    const route = req.route ? req.route.path : req.path;
    const labels = {
      method: req.method,
      route,
      status_code: res.statusCode,
    };

    httpRequestsTotal.inc(labels);
    end(labels);
    httpActiveRequests.dec();
  });

  next();
}

module.exports = { metricsMiddleware, client };
