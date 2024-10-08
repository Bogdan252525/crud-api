import { IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  validateUUID,
} from '../models/userModel.js';

export const userController = (req: IncomingMessage, res: ServerResponse) => {
  const parsedUrl = parse(req.url || '', true);
  const method = req.method;
  const { pathname } = parsedUrl;

  if (pathname === '/api/users' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(getAllUsers()));
  } else if (
    pathname &&
    pathname.startsWith('/api/users/') &&
    method === 'GET'
  ) {
    const userId = pathname.split('/')[3];
    if (!validateUUID(userId)) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid UUID');
    } else {
      const user = getUserById(userId);
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
          const newUser = createUser(username, age, hobbies);
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
    if (!validateUUID(userId)) {
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
            const updatedUser = updateUser(userId, username, age, hobbies);
            if (!updatedUser) {
              res.writeHead(404, { 'Content-Type': 'text/plain' });
              res.end('User not found');
            } else {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(updatedUser));
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
    if (!validateUUID(userId)) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid UUID');
    } else {
      const isDeleted = deleteUser(userId);
      if (!isDeleted) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('User not found');
      } else {
        res.writeHead(204);
        res.end();
      }
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Endpoint not found');
  }
};
