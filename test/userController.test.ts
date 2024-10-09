import request from 'supertest';
import startServer from '../src/server';

let server: any;

beforeAll(() => {
  server = startServer(3000);
});

afterAll(() => {
  server.close();
});

describe('User API', () => {
  it('returns an empty array if no user has yet been created', async () => {
    const response = await request(server).get('/api/users');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('creates a new user and returns the created record', async () => {
    const newUser = {
      username: 'John Doe',
      age: 30,
      hobbies: ['reading', 'gaming'],
    };
    const response = await request(server).post('/api/users').send(newUser);
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(newUser);
    expect(response.body).toHaveProperty('id');
  });

  it('returns the user by its ID', async () => {
    const newUser = {
      username: 'John Doe',
      age: 30,
      hobbies: ['reading', 'gaming'],
    };
    const createResponse = await request(server)
      .post('/api/users')
      .send(newUser);
    const userId = createResponse.body.id;

    const response = await request(server).get(`/api/users/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(newUser);
    expect(response.body.id).toBe(userId);
  });

  it('updates the user and returns the updated record', async () => {
    const newUser = {
      username: 'John Doe',
      age: 30,
      hobbies: ['reading', 'gaming'],
    };
    const createResponse = await request(server)
      .post('/api/users')
      .send(newUser);
    const userId = createResponse.body.id;

    const updatedUser = {
      username: 'Jane Doe',
      age: 28,
      hobbies: ['cooking', 'traveling'],
    };
    const updateResponse = await request(server)
      .put(`/api/users/${userId}`)
      .send(updatedUser);
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toMatchObject(updatedUser);
    expect(updateResponse.body.id).toBe(userId);
  });

  it('deletes the user and returns confirmation of successful deletion', async () => {
    const newUser = {
      username: 'John Doe',
      age: 30,
      hobbies: ['reading', 'gaming'],
    };
    const createResponse = await request(server)
      .post('/api/users')
      .send(newUser);
    const userId = createResponse.body.id;

    const deleteResponse = await request(server).delete(`/api/users/${userId}`);
    expect(deleteResponse.status).toBe(204);
    expect(deleteResponse.body).toEqual({});
  });

  it('returns an error if the id is not valid', async () => {
    const response = await request(server).get('/api/users/non-existent-id');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Invalid UUID' });
  });
});
