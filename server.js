const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.env.PORT, 10) || 5173;

// Runtime config initialized from environment variables (configurable in docker-compose / Rancher)
let runtimeConfig = {
  targetName: process.env.TARGET_NAME || 'Nguyễn Trọng Linh',
  probability: parseFloat(process.env.TARGET_PROBABILITY || '99'),
  rigActive: process.env.RIG_ACTIVE !== 'false',
  defaultEntries: process.env.DEFAULT_ENTRIES
    ? process.env.DEFAULT_ENTRIES.split(/[,;\n]/).map(s => s.trim()).filter(Boolean)
    : null
};

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];

  // API endpoint to get / update configuration in real time
  if (reqPath === '/api/config') {
    if (req.method === 'GET') {
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-cache'
      });
      res.end(JSON.stringify(runtimeConfig));
      return;
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (parsed.targetName !== undefined) runtimeConfig.targetName = parsed.targetName;
          if (parsed.probability !== undefined) runtimeConfig.probability = parseFloat(parsed.probability);
          if (parsed.rigActive !== undefined) runtimeConfig.rigActive = Boolean(parsed.rigActive);
          if (Array.isArray(parsed.defaultEntries)) runtimeConfig.defaultEntries = parsed.defaultEntries;

          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ success: true, config: runtimeConfig }));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
        }
      });
      return;
    }
  }

  // Health check endpoint for Rancher / Kubernetes / Docker
  if (reqPath === '/health' || reqPath === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ status: 'ok', uptime: process.uptime() }));
    return;
  }

  // Static file serving
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(__dirname, reqPath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(`500 Internal Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`===============================================`);
  console.log(` Random Wheel Server running on port ${PORT}`);
  console.log(` Configured Target: "${runtimeConfig.targetName}"`);
  console.log(` Configured Probability: ${runtimeConfig.probability}%`);
  console.log(` Rig Active: ${runtimeConfig.rigActive}`);
  console.log(`===============================================`);
});
