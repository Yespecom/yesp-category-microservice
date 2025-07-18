# YESP Category Microservice

This microservice handles the management of product categories for the YESP platform. It supports multi-tenancy by connecting to tenant-specific databases and secures its API endpoints using JWT authentication.

## Features

*   CRUD operations for product categories.
*   Automatic slug generation for category names.
*   Multi-tenant database connection (connects to `tenant_<tenantId>` database).
*   Secured API endpoints using JWT.

## Folder Structure

\`\`\`
yesp-category-microservice/
├── models/
│   └── Category.js
├── routes/
│   └── categoryRoutes.js
├── config/
│   └── db.js
├── middleware/
│   └── authMiddleware.js
├── server.js
├── .env
└── package.json
\`\`\`

## Setup and Running Locally

1.  **Create the project directory and files** as provided above.
2.  **Install dependencies:**
    Navigate to the `yesp-category-microservice` directory in your terminal and run:
    \`\`\`bash
    npm install
    \`\`\`
3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory of the project (`yesp-category-microservice/`) and add the following variables:
    \`\`\`env
    PORT=5004
    MAIN_DB_URI=mongodb://localhost:27017/yesp_main_db
    MONGO_URI=mongodb://localhost:27017
    JWT_SECRET=YESP_SUPER_SECRET_KEY
    \`\`\`
    *   `PORT`: The port on which this microservice will run (default: 5004).
    *   `MAIN_DB_URI`: The connection string for your main MongoDB database (used by `connectMainDB`).
    *   `MONGO_URI`: Base URI for your MongoDB instance. Tenant-specific database names will be appended to this.
    *   `JWT_SECRET`: A strong secret key for signing and verifying JWTs.
4.  **Start the Microservice:**
    To start the server in development mode (with `nodemon` for auto-restarts):
    \`\`\`bash
    npm run dev
    \`\`\`
    To start the server in production mode:
    \`\`\`bash
    npm start
    \`\`\`

    You should see a message like: `🚀 Category service running on port 5004`

## API Endpoints

All API endpoints are prefixed with `/api/categories` and require a JWT in the `Authorization: Bearer <token>` header.

### Authentication

The `authMiddleware.js` expects a JWT token in the `Authorization` header. The token should contain `userId`, `tenantId`, `storeId`, and `role` in its payload. You will need a separate service (or a manual way) to generate these JWT tokens.

### 1. Create Category (POST /api/categories)

Creates a new product category.

**Request Body:**

\`\`\`json
{
  "name": "Clothing",
  "description": "All fashion items",
  "image": "https://link.to/image.jpg",
  "parentCategory": null,
  "isActive": true,
  "position": 0
}
\`\`\`

**Example (using Thunder Client / Postman):**

\`\`\`
POST /api/categories
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "name": "Electronics",
  "description": "Gadgets and devices",
  "image": "https://example.com/electronics.jpg"
}
\`\`\`

### 2. Get All Categories (GET /api/categories)

Retrieves all categories associated with the `storeId` from the authenticated user's token.

**Example:**

\`\`\`
GET /api/categories
Authorization: Bearer <your_jwt_token>
\`\`\`

### 3. Update Category (PUT /api/categories/:id)

Updates an existing category by its ID.

**Request Body:** (Partial updates are supported)

\`\`\`json
{
  "name": "Updated Clothing",
  "description": "All fashion items and accessories"
}
\`\`\`

**Example:**

\`\`\`
PUT /api/categories/60c72b2f9b1e8c001c8e4d7a
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "name": "Apparel"
}
\`\`\`

### 4. Delete Category (DELETE /api/categories/:id)

Deletes a category by its ID.

**Example:**

\`\`\`
DELETE /api/categories/60c72b2f9b1e8c001c8e4d7a
Authorization: Bearer <your_jwt_token>
