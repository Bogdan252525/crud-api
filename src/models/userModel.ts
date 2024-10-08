import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

export type User = {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
};

let users: User[] = [];

export const getAllUsers = (): User[] => users;

export const getUserById = (id: string): User | undefined => {
  return users.find((user) => user.id === id);
};

export const createUser = (
  username: string,
  age: number,
  hobbies: string[]
): User => {
  const newUser: User = { id: uuidv4(), username, age, hobbies };
  users.push(newUser);
  return newUser;
};

export const updateUser = (
  id: string,
  username: string,
  age: number,
  hobbies: string[]
): User | null => {
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex === -1) return null;

  users[userIndex] = { ...users[userIndex], username, age, hobbies };
  return users[userIndex];
};

export const deleteUser = (id: string): boolean => {
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex === -1) return false;

  users.splice(userIndex, 1);
  return true;
};

export const validateUUID = (id: string): boolean => uuidValidate(id);
