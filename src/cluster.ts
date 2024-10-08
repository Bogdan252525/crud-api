import clusterMod from 'cluster';
import { cpus } from 'os';
import startServer from './server.js';

const numCPUs = cpus().length;

if (clusterMod.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    const port = 4000 + i;
    clusterMod.fork({ PORT: port.toString() });
  }

  clusterMod.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process?.pid} died, starting a new one`);
    const port = 4000 + Math.floor(Math.random() * numCPUs);
    clusterMod.fork({ PORT: port.toString() });
  });
} else {
  const port = process.env.PORT || 4000;
  startServer(port);
}
