const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'font/otf',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.map': 'application/json'
};

const server = http.createServer((req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(reqUrl.pathname);

  // Set permissive CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Handle mock ajax requests for Elementor / JKit if triggered
  if (reqUrl.searchParams.has('jkit-ajax-request')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'success' }));
    return;
  }

  // Normalize path
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(ROOT_DIR, safePath);

  // Check if directory -> check index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  // Check if file exists
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // If it is the 404 page requested specifically
    const is404Page = safePath.includes('hydrafacial-in-karachi');

    res.writeHead(is404Page ? 404 : 200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  // Try appending .html
  if (fs.existsSync(filePath + '.html') && fs.statSync(filePath + '.html').isFile()) {
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache'
    });
    fs.createReadStream(filePath + '.html').pipe(res);
    return;
  }

  // Try checking subfolder index.html (e.g. /about-us -> /about-us/index.html)
  const dirIndexPath = path.join(filePath, 'index.html');
  if (fs.existsSync(dirIndexPath) && fs.statSync(dirIndexPath).isFile()) {
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache'
    });
    fs.createReadStream(dirIndexPath).pipe(res);
    return;
  }

  // Otherwise, fallback to 404.html
  const notFoundPage = path.join(ROOT_DIR, '404.html');
  if (fs.existsSync(notFoundPage)) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    fs.createReadStream(notFoundPage).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  The Ästhetik Clone Server is running!`);
  console.log(`  URL: http://localhost:${PORT}`);
  console.log(`====================================================`);
  console.log(`Available pages:`);
  console.log(`  - Home:                   http://localhost:${PORT}/`);
  console.log(`  - About Us:               http://localhost:${PORT}/about-us/`);
  console.log(`  - Book Appointment:       http://localhost:${PORT}/book-an-appointment/`);
  console.log(`  - HydraFacial:            http://localhost:${PORT}/hydrafacial/`);
  console.log(`  - Treatment Template:     http://localhost:${PORT}/treatment-page-template/`);
  console.log(`  - Elementor 7:            http://localhost:${PORT}/elementor-7/`);
  console.log(`  - Hello World (Blog):     http://localhost:${PORT}/hello-world/`);
  console.log(`  - 404 Error Page:         http://localhost:${PORT}/treatments/hydrafacial-in-karachi/`);
});
