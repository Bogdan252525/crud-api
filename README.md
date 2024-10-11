# crud-api

## install app

npm install

## start the app in development mode

npm run start:dev

## start the app in development mode with horizontal scaling

npm run start:multi

## start tests

npm test

## start compilation in JS (files are compiled into the dist folder that appears at the top level)

npm run build

## start the app in production mode (becomes possible after compilation)

npm run one:prod

## start the app in production mode with horizontal scaling (becomes possible after compilation)

npm run multi:prod

## start compilation in JS and start the app in production mode

npm run start:prod

## Implemented endpoint `api/users`:

- **GET** `api/users` is used to get all persons - Server should answer with `status code` **200** and all users records
  - **GET** `api/users/{userId}`
    - Server should answer with `status code` **200** and record with `id === userId` if it exists
    - Server should answer with `status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
    - Server should answer with `status code` **404** and corresponding message if record with `id === userId` doesn't exist
  - **POST** `api/users` is used to create record about new user and store it in database
    - Server should answer with `status code` **201** and newly created record
    - Server should answer with `status code` **400** and corresponding message if request `body` does not contain **required** fields
  - **PUT** `api/users/{userId}` is used to update existing user
    - Server should answer with` status code` **200** and updated record
    - Server should answer with` status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
    - Server should answer with` status code` **404** and corresponding message if record with `id === userId` doesn't exist
  - **DELETE** `api/users/{userId}` is used to delete existing user from database
    - Server should answer with `status code` **204** if the record is found and deleted
    - Server should answer with `status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
    - Server should answer with `status code` **404** and corresponding message if record with `id === userId` doesn't exist

## request example

http://localhost:4000/api/users
