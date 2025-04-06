# Task Manager Backend with NestJS

[![NestJS](https://img.shields.io/badge/-NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/-TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TypeORM](https://img.shields.io/badge/-TypeORM-1677FF?style=flat-square&logo=typeorm&logoColor=white)](https://typeorm.io/)
[![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/-npm-CB3837?style=flat-square&logo=npm&logoColor=white)](https://www.npmjs.com/)
[![Maintenance](https://img.shields.io/badge/Maintained-yes-green?style=flat-square)](https://github.com/your-username/task-manager-nestjs/graphs/commit-activity)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

This is the backend API for a simple Task Manager application, built using [NestJS](https://nestjs.com/), a progressive Node.js framework for building efficient and scalable server-side applications. It provides functionalities for managing tasks and associating them with users.


# Note that this project is mainly developed as a testing task for a job position in Nadin Soft.
# Task Manager Backend with NestJS

[![NestJS](https://img.shields.io/badge/-NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/-TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TypeORM](https://img.shields.io/badge/-TypeORM-1677FF?style=flat-square&logo=typeorm&logoColor=white)](https://typeorm.io/)
[![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/-npm-CB3837?style=flat-square&logo=npm&logoColor=white)](https://www.npmjs.com/)
[![Maintenance](https://img.shields.io/badge/Maintained-yes-green?style=flat-square)](https://github.com/your-username/task-manager-nestjs/graphs/commit-activity)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

This is the backend API for a simple Task Manager application, built using [NestJS](https://nestjs.com/), a progressive Node.js framework for building efficient and scalable server-side applications. It provides functionalities for managing tasks and associating them with users.

## Features

* **User Authentication:** Secure registration and login for users.
* **Task Management:**
    * Create, read, update, and delete tasks (CRUD operations).
    * Tasks have a title, description, status, and can optionally have attachments.
    * Tasks are associated with specific users.
* **Pagination:** Efficiently retrieve lists of tasks with pagination.
* **Role-Based Authorization:** Basic role management (e.g., admin, user) with protected routes.
* **Data Validation:** Robust input validation using NestJS Pipes.
* **Error Handling:** Comprehensive error handling with appropriate HTTP status codes.
* **JWT Authentication:** Secure authentication using JSON Web Tokens.

## Technologies Used

* **Backend Framework:** [NestJS](https://nestjs.com/) (v10 or later)
* **Language:** [TypeScript](https://www.typescriptlang.org/) (v5.0 or later)
* **Database ORM:** [TypeORM](https://typeorm.io/) (v0.3 or later)
* **Database:** [MySQL](https://www.mysql.com/) (or another database supported by TypeORM)
* **Authentication:** [Passport](http://www.passportjs.org/) with [passport-jwt](https://github.com/mikenicholson/passport-jwt)
* **Validation:** [class-validator](https://github.com/typestack/class-validator) and [class-transformer](https://github.com/typestack/class-transformer) (integrated with NestJS Pipes)
* **Configuration:** [@nestjs/config](https://docs.nestjs.com/techniques/configuration)
* **Testing:** [Jest](https://jestjs.io/) and [@nestjs/testing](https://docs.nestjs.com/testing)
* **Environment Variables:** [dotenv](https://www.npmjs.com/package/dotenv) (managed by `@nestjs/config`)

## Prerequisites

Before you begin, ensure you have the following installed:

* **Node.js:** (>= 18.0.0) - [Download Node.js](https://nodejs.org/)
* **npm:** (>= 9.0.0) or **yarn:** (>= 1.22.0) - Comes with Node.js or [Install Yarn](https://yarnpkg.com/getting-started)
* **MySQL:** (or your chosen database) - [Install MySQL](https://dev.mysql.com/downloads/)

## Installation

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/your-username/task-manager-nestjs.git](https://www.google.com/search?q=https://github.com/your-username/task-manager-nestjs.git)
    cd task-manager-nestjs
    ```

2.  **Install dependencies using npm:**

    ```bash
    npm install
    ```

    **Or using yarn:**

    ```bash
    yarn install
    ```

## Configuration

1.  **Create a `.env` file:** In the root of your project, create a `.env` file based on the `.env.example` file (if provided) or create it manually with the following basic configuration:

    ```env
    NODE_ENV=development
    PORT=3000

    DB_HOST=your_database_host
    DB_PORT=your_database_port
    DB_USER=your_database_user
    DB_PASSWORD=your_database_password
    DB_NAME=your_database_name

    JWT_SECRET=your_secret_jwt_key
    ```

    Replace the placeholder values with your actual database and JWT secret.

2.  **Database Setup:** Ensure your MySQL (or chosen database) server is running and that the database specified in your `.env` file exists. TypeORM will automatically create the tables based on your entities when the application starts (if `synchronize: true` is enabled in your `ormconfig.ts` or `DatabaseModule`, which is generally **not recommended for production**). For production, use database migrations.

## Running the Application

1.  **Start the development server:**

    ```bash
    npm run start:dev
    ```

    **Or using yarn:**

    ```bash
    yarn start:dev
    ```

    This command will build your project and start the server in watch mode, automatically recompiling on file changes.

2.  **Access the API:** The API will be accessible at `http://localhost:3000`.

## API Endpoints

Here's a brief overview of the main API endpoints:

**Authentication:**

* `POST /auth/register`: Register a new user.
    * Request Body: `{ username, password }`
* `POST /auth/login`: Log in an existing user.
    * Request Body: `{ username, password }`
    * Response: `{ access_token }`

**Users (Requires JWT Authentication):**

* `GET /users/profile`: Get the authenticated user's profile.
    * Headers: `Authorization: Bearer <access_token>`

**Tasks (Requires JWT Authentication):**

* `GET /tasks`: Get all tasks for the authenticated user (with optional pagination via `page` and `limit` query parameters).
    * Headers: `Authorization: Bearer <access_token>`
    * Query Parameters: `page` (number, default: 1), `limit` (number, default: 10)
* `POST /tasks`: Create a new task for the authenticated user.
    * Headers: `Authorization: Bearer <access_token>`
    * Request Body: `{ name, description?, attachment? }`
* `GET /tasks/:id`: Get a specific task by ID for the authenticated user.
    * Headers: `Authorization: Bearer <access_token>`
* `PATCH /tasks/:id`: Update a specific task by ID for the authenticated user.
    * Headers: `Authorization: Bearer <access_token>`
    * Request Body: `{ name?, description?, status?, attachment? }`
* `DELETE /tasks/:id`: Delete a specific task by ID for the authenticated user.
    * Headers: `Authorization: Bearer <access_token>`

**(Admin-Protected Endpoints - if implemented):**

* `GET /admin/users`: Get a list of all users (requires admin role).
    * Headers: `Authorization: Bearer <admin_access_token>`

## Database Schema

The application uses TypeORM to define the database schema based on the following entities:

* **`User`:**
    * `id` (INT, Primary Key, Auto-increment)
    * `username` (VARCHAR, Unique)
    * `password` (VARCHAR)
    * `createdAt` (TIMESTAMP, Default: CURRENT_TIMESTAMP)
    * `updatedAt` (TIMESTAMP, Default: CURRENT_TIMESTAMP, On Update: CURRENT_TIMESTAMP)
    * `tasks` (One-to-Many relationship with `Task`)
    * `role` (ENUM, e.g., 'user', 'admin')

* **`Task`:**
    * `id` (INT, Primary Key, Auto-increment)
    * `name` (VARCHAR)
    * `description` (TEXT, Nullable)
    * `status` (ENUM, e.g., 'OPEN', 'IN_PROGRESS', 'DONE', Default: 'OPEN')
    * `attachment` (VARCHAR, Nullable)
    * `userId` (INT, Foreign Key referencing `User.id`, On Delete: CASCADE)
    * `createdAt` (TIMESTAMP, Default: CURRENT_TIMESTAMP)
    * `updatedAt` (TIMESTAMP, Default: CURRENT_TIMESTAMP, On Update: CURRENT_TIMESTAMP)

## Testing

The application includes unit and integration tests using Jest and `@nestjs/testing`.

1.  **Run all tests:**

    ```bash
    npm run test
    ```

    **Or using yarn:**

    ```bash
    yarn test
    ```

2.  **Run test coverage:**

    ```bash
    npm run test:cov
    ```

    **Or using yarn:**

    ```bash
    yarn test:cov
    ```
