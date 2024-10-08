import http from 'http';
import { userController } from './controllers/userController.js';

const startServer = (port: string | number) => {
  const server = http.createServer(userController);
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

export default startServer;
