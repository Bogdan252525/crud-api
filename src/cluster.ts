import cluster from 'node:cluster';
import { cpus } from 'os';
import startServer from './server';
import { loadBalancer } from './loadBalancer';

const numCPUs = cpus().length;
const ports = Array.from({ length: numCPUs - 1 }, (_, i) => 4001 + i);
const workers = new Map<number, number>();

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  loadBalancer();

  ports.forEach((port) => {
    const worker = cluster.fork({ PORT: port.toString() });

    if (worker.process?.pid !== undefined) {
      workers.set(worker.process.pid, port);
    } else {
      console.error('Worker PID is undefined');
    }
  });

  cluster.on('exit', (worker) => {
    const pid = worker.process?.pid;
    if (pid !== undefined) {
      const port = workers.get(pid);
      console.log(`Worker ${pid} died, starting a new one`);

      if (port !== undefined) {
        const newWorker = cluster.fork({ PORT: port.toString() });
        workers.set(newWorker.process?.pid!, port);
      } else {
        console.error(`Port not found for worker ${pid}`);
      }
    } else {
      console.error('Worker process PID is undefined, cannot restart worker');
    }
  });
} else {
  const port = process.env.PORT || 4001;
  startServer(port);
}
