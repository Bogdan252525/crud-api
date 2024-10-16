import http from 'http';
import { cpus } from 'os';

const numCPUs = cpus().length - 1;
const ports = Array.from({ length: numCPUs }, (_, i) => 4001 + i);
let currentIndex = 0;

export const loadBalancer = () => {
  const server = http.createServer((req, res) => {
    const targetPort = ports[currentIndex];

    const options = {
      hostname: 'localhost',
      port: targetPort,
      method: req.method,
      path: req.url,
      headers: req.headers,
    };

    const proxy = http.request(options, (targetRes) => {
      res.writeHead(targetRes.statusCode!, targetRes.headers);
      targetRes.pipe(res, { end: true });
    });

    req.pipe(proxy, { end: true });

    proxy.on('error', (err) => {
      console.error(`Proxy error: ${err}`);
      res.writeHead(502);
      res.end('Bad gateway');
    });

    currentIndex = (currentIndex + 1) % ports.length;
  });

  server.listen(4000, () => {
    console.log(`Load balancer running on port 4000`);
    console.log(`Available worker ports: ${ports.join(', ')}`);
  });
};
