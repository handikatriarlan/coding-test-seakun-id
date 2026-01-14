# Blog Post RESTful API

A professional RESTful API for managing blog posts built with Node.js, TypeScript, Express.js, and PostgreSQL.

## 🚀 Features

- **CRUD Operations** - Create, Read, Update, Delete blog posts
- **Pagination** - Efficient pagination for listing posts
- **Input Validation** - Robust validation using Zod
- **Error Handling** - Centralized error handling with custom error classes
- **TypeScript** - Full type safety throughout the codebase
- **Docker Support** - Containerized application with docker-compose
- **Clean Architecture** - Separation of concerns (Controllers, Services, Routes)
- **Security** - Helmet.js for security headers, CORS support
- **Graceful Shutdown** - Proper cleanup on application termination
- **API Testing** - Bruno API collection with comprehensive test cases

## 📋 Tech Stack

| Technology | Purpose              |
| ---------- | -------------------- |
| Node.js 20 | Runtime environment  |
| TypeScript | Type-safe JavaScript |
| Express.js | Web framework        |
| PostgreSQL | SQL database         |
| Zod        | Input validation     |
| Docker     | Containerization     |

## 📁 Project Structure

```
├── src/
│   ├── config/
│   │   └── database.ts         # Database connection pool
│   ├── controllers/
│   │   └── post.controller.ts  # Request handlers
│   ├── middlewares/
│   │   ├── error.middleware.ts # Global error handler
│   │   └── validate.middleware.ts
│   ├── routes/
│   │   ├── index.ts            # Route aggregator
│   │   └── post.routes.ts      # Post endpoints
│   ├── schemas/
│   │   └── post.schema.ts      # Zod validation schemas
│   ├── services/
│   │   └── post.service.ts     # Business logic
│   ├── types/
│   │   └── index.ts            # TypeScript types
│   ├── utils/
│   │   ├── ApiError.ts         # Custom error class
│   │   └── response.ts         # Response helpers
│   ├── scripts/
│   │   └── migrate.ts          # Database migration
│   ├── app.ts                  # Express app setup
│   └── server.ts               # Server entry point
├── migrations/
│   └── 001_create_posts_table.sql
├── bruno/                      # Bruno API tests
│   ├── Health/
│   ├── Posts/
│   ├── Errors/
│   └── environments/
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 20 or higher
- PostgreSQL 14 or higher (or Docker)
- npm or yarn

### Option 1: Using Docker (Recommended)

The easiest way to run the application with all dependencies:

```bash
# Clone the repository
git clone <repository-url>
cd coding-test-seakun-id

# Start all services
docker-compose up --build

# The API will be available at http://localhost:3000
```

### Option 2: Local Development

1. **Install dependencies:**

```bash
npm install
```

2. **Setup environment variables:**

```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. **Create PostgreSQL database:**

```bash
createdb blog_db
```

4. **Run migrations:**

```bash
npm run migrate
```

5. **Start development server:**

```bash
npm run dev
```

## 📚 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Response Format

**Success Response:**

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Paginated Response:**

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 50,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

---

### Endpoints

#### Health Check

```
GET /api/health
```

**Response:**

```json
{
  "success": true,
  "message": "Blog Post API is running",
  "version": "1.0.0",
  "timestamp": "2024-01-13T12:00:00.000Z"
}
```

---

#### List All Posts

```
GET /api/posts
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Page number |
| limit | integer | 10 | Items per page (max: 100) |

**Example Request:**

```bash
curl -X GET "http://localhost:3000/api/posts?page=1&limit=5"
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Welcome to My Blog",
      "content": "This is my first blog post...",
      "created_at": "2024-01-13T12:00:00.000Z",
      "updated_at": "2024-01-13T12:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "totalItems": 10,
    "totalPages": 2,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

#### Get Post by ID

```
GET /api/posts/:id
```

**Example Request:**

```bash
curl -X GET "http://localhost:3000/api/posts/1"
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Welcome to My Blog",
    "content": "This is my first blog post...",
    "created_at": "2024-01-13T12:00:00.000Z",
    "updated_at": "2024-01-13T12:00:00.000Z"
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "error": {
    "code": "POST_NOT_FOUND",
    "message": "Post with id 999 not found"
  }
}
```

---

#### Create Post

```
POST /api/posts
```

**Request Body:**

```json
{
  "title": "My New Post",
  "content": "This is the content of my new post."
}
```

**Example Request:**

```bash
curl -X POST "http://localhost:3000/api/posts" \
  -H "Content-Type: application/json" \
  -d '{"title": "My New Post", "content": "This is the content."}'
```

**Success Response (201):**

```json
{
  "success": true,
  "data": {
    "id": 4,
    "title": "My New Post",
    "content": "This is the content of my new post.",
    "created_at": "2024-01-13T12:30:00.000Z",
    "updated_at": "2024-01-13T12:30:00.000Z"
  },
  "message": "Post created successfully"
}
```

**Validation Error (400):**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "body.title",
        "message": "Title cannot be empty"
      }
    ]
  }
}
```

---

#### Update Post

```
PUT /api/posts/:id
```

**Request Body:**

```json
{
  "title": "Updated Title",
  "content": "Updated content"
}
```

> Note: At least one field (title or content) must be provided.

**Example Request:**

```bash
curl -X PUT "http://localhost:3000/api/posts/1" \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title"}'
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Updated Title",
    "content": "Original content...",
    "created_at": "2024-01-13T12:00:00.000Z",
    "updated_at": "2024-01-13T13:00:00.000Z"
  },
  "message": "Post updated successfully"
}
```

---

#### Delete Post

```
DELETE /api/posts/:id
```

**Example Request:**

```bash
curl -X DELETE "http://localhost:3000/api/posts/1"
```

**Success Response (204):**
No content (empty response body)

**Error Response (404):**

```json
{
  "success": false,
  "error": {
    "code": "POST_NOT_FOUND",
    "message": "Post with id 1 not found"
  }
}
```

---

## 🔧 Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start

# Run database migrations
npm run migrate

# Lint code
npm run lint

# Fix lint errors
npm run lint:fix

# Format code with Prettier
npm run format
```

## 🐳 Docker Commands

```bash
# Build and start all services
docker-compose up --build

# Start in background
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f api

# Rebuild specific service
docker-compose build api
```

## 📊 Database Schema

### Posts Table

| Column     | Type         | Constraints               |
| ---------- | ------------ | ------------------------- |
| id         | SERIAL       | PRIMARY KEY               |
| title      | VARCHAR(255) | NOT NULL                  |
| content    | TEXT         | NOT NULL                  |
| created_at | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP    | Auto-updates on change    |

## 🔒 Environment Variables

| Variable    | Description       | Default     |
| ----------- | ----------------- | ----------- |
| NODE_ENV    | Environment mode  | development |
| PORT        | Server port       | 3000        |
| DB_HOST     | PostgreSQL host   | localhost   |
| DB_PORT     | PostgreSQL port   | 5432        |
| DB_NAME     | Database name     | blog_db     |
| DB_USER     | Database user     | postgres    |
| DB_PASSWORD | Database password | -           |

## 📝 HTTP Status Codes

| Status | Description                    |
| ------ | ------------------------------ |
| 200    | Success (GET, PUT)             |
| 201    | Created (POST)                 |
| 204    | No Content (DELETE)            |
| 400    | Bad Request / Validation Error |
| 404    | Resource Not Found             |
| 500    | Internal Server Error          |

## 🏗️ Architecture Highlights

1. **Clean Architecture** - Clear separation between controllers, services, and data access
2. **Type Safety** - Full TypeScript coverage with strict mode
3. **Validation Layer** - Zod schemas for request validation
4. **Error Handling** - Custom ApiError class with standardized responses
5. **Database** - Connection pooling with graceful shutdown
6. **Security** - Helmet for headers, CORS, input sanitization
7. **Logging** - Morgan for request logging
8. **Docker** - Multi-stage build, non-root user, health checks

## 🧪 API Testing

This project includes a comprehensive Bruno API test collection.

### Using Bruno

1. Install [Bruno](https://www.usebruno.com/)
2. Open the `bruno/` folder as a collection
3. Select the "local" environment
4. Run individual requests or the entire collection

### Test Coverage

- Health check endpoint
- GET all posts (with pagination)
- GET post by ID (success, not found, invalid ID)
- POST create post (success, validation errors)
- PUT update post (full, partial, not found, empty body)
- DELETE post (success, not found, invalid ID)
- Error handling (route not found, invalid JSON)