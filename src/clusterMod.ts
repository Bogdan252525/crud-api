import clusterMod from 'cluster';
import { cpus } from 'os';

const numCPUs = cpus().length;

if (clusterMod.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  const usedPorts = new Set();

  for (let i = 0; i < numCPUs; i++) {
    const port = 4000 + i;
    usedPorts.add(port);
    clusterMod.fork({ PORT: port.toString() });
  }

  clusterMod.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process?.pid} died, starting a new one`);
    let newPort = 4000;
    while (usedPorts.has(newPort)) {
      newPort++;
    }
    usedPorts.add(newPort);
    clusterMod.fork({ PORT: newPort.toString() });
  });
} else {
  const port = process.env.PORT || '4000';

  import('./server.js')
    .then((module) => {
      module.default(port);
    })
    .catch((err) => {
      console.error('An error occurred while importing the server:', err);
    });
}
