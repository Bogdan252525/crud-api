import http, { IncomingMessage, ServerResponse } from 'http';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { parse } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4000;

type User = {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
};

let users: User[] = [];

const requestListener = (req: IncomingMessage, res: ServerResponse) => {
  const parsedUrl = parse(req.url || '', true);
  const method = req.method;
  const { pathname } = parsedUrl;

  if (pathname === '/api/users' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
  } else if (
    pathname &&
    pathname.startsWith('/api/users/') &&
    method === 'GET'
  ) {
    const userId = pathname.split('/')[3];
    if (!uuidValidate(userId)) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid UUID');
    } else {
      const user = users.find((u) => u.id === userId);
      if (!user) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('User not found');
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
      }
    }
  } else if (pathname === '/api/users' && method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const { username, age, hobbies } = JSON.parse(body);
        if (!username || typeof age !== 'number' || !Array.isArray(hobbies)) {
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('Missing required fields');
        } else {
          const newUser: User = { id: uuidv4(), username, age, hobbies };
          users.push(newUser);
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(newUser));
        }
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid request body');
      }
    });
  } else if (
    pathname &&
    pathname.startsWith('/api/users/') &&
    method === 'PUT'
  ) {
    const userId = pathname.split('/')[3];
    if (!uuidValidate(userId)) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid UUID');
    } else {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          const { username, age, hobbies } = JSON.parse(body);
          if (!username || typeof age !== 'number' || !Array.isArray(hobbies)) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Missing required fields');
          } else {
            const userIndex = users.findIndex((u) => u.id === userId);
            if (userIndex === -1) {
              res.writeHead(404, { 'Content-Type': 'text/plain' });
              res.end('User not found');
            } else {
              users[userIndex] = {
                ...users[userIndex],
                username,
                age,
                hobbies,
              };
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(users[userIndex]));
            }
          }
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('Invalid request body');
        }
      });
    }
  } else if (
    pathname &&
    pathname.startsWith('/api/users/') &&
    method === 'DELETE'
  ) {
    const userId = pathname.split('/')[3];
    if (!uuidValidate(userId)) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid UUID');
    } else {
      const userIndex = users.findIndex((u) => u.id === userId);
      if (userIndex === -1) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('User not found');
      } else {
        users.splice(userIndex, 1);
        res.writeHead(204);
        res.end();
      }
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Endpoint not found');
  }
};

export default function startServer(port: string) {
  const server = http.createServer(requestListener);
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
