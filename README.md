# URL Shortener API
![Ayush Vishwakarma](https://camo.githubusercontent.com/d2fe44eb84723b4b9b714760a76dcf50c25e3eb03a170db70aba4dfa60d48792/68747470733a2f2f692e6962622e636f2f387a504a7058382f4c6f676f2d72656d6f766562672d707265766965772e706e67)

This is a robust and feature-rich URL shortener service built with Node.js, Express, and MongoDB. It provides a simple API for creating, managing, and tracking shortened URLs. Key features include user authentication, custom aliases, QR code generation, and detailed analytics.

## Features

*   **User Authentication**: Secure user registration and login using JWT (JSON Web Tokens).
*   **URL Shortening**: Generate a unique, short ID for any valid URL.
*   **Custom Aliases**: Users can provide their own custom alias for a shortened URL.
*   **Click Analytics**: Tracks every click on a shortened URL, recording the timestamp, IP address, and user agent.
*   **QR Code Generation**: Instantly generate a QR code for any shortened link.
*   **Soft Deletion & Restoration**: URLs can be "soft-deleted" and restored later.
*   **Automatic Cleanup**: Soft-deleted URLs are permanently removed from the database after 30 days.
*   **Rate Limiting**: Basic rate limiting on URL creation to prevent abuse.

## Tech Stack

*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB with Mongoose
*   **Authentication**: JSON Web Tokens (JWT), bcrypt
*   **URL ID Generation**: `nanoid`
*   **QR Codes**: `qrcode`
*   **Rate Limiting**: `express-rate-limit`
*   **Environment Variables**: `dotenv`

## Getting Started

### Prerequisites

*   Node.js (v14 or higher)
*   npm
*   MongoDB instance (local or cloud-based like MongoDB Atlas)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/ayushvishwakarma04/urlshortner.git
    cd urlshortner
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory and add the following variables:
    ```env
    PORT=8001
    DB=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    ```

4.  **Start the server:**
    ```sh
    npm start
    ```
    The API will be running on `http://localhost:8001`.

## API Endpoints

All endpoints are relative to the base URL.

### Authentication

#### `POST /signup`

Register a new user.

*   **Body:**
    ```json
    {
      "email": "user@example.com",
      "password": "yourpassword"
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "token": "jwt.token.string"
    }
    ```

#### `POST /login`

Log in an existing user.

*   **Body:**
    ```json
    {
      "email": "user@example.com",
      "password": "yourpassword"
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "token": "jwt.token.string"
    }
    ```

### URL Management

All URL Management endpoints require authentication. Provide the JWT token in the `Authorization` header.
`Authorization: Bearer <your_token>`

#### `POST /url`

Create a new short URL.

*   **Headers:** `Authorization: Bearer <your_token>`
*   **Body:**
    ```json
    {
      "url": "https://your-long-url.com/with/a/very/long/path",
      "alias": "my-custom-alias" // Optional
    }
    ```
*   **Response (201 Created):**
    ```json
    {
      "id": "shortId_or_custom_alias"
    }
    ```

#### `GET /url/:shortId`

Redirect to the original long URL.

*   **Example:** `GET /url/my-custom-alias` will redirect to the original URL.
*   This endpoint also logs the visit for analytics.

#### `GET /analytics/:shortId`

Get analytics for a specific short URL.

*   **Example:** `GET /analytics/my-custom-alias`
*   **Response (200 OK):**
    ```json
    {
      "totalClicks": 1,
      "analytics": [
        {
          "timestamp": 1678886400000,
          "ip": "::1",
          "userAgent": "PostmanRuntime/7.29.0",
          "_id": "641..."
        }
      ]
    }
    ```

#### `GET /url/:shortId/qr`

Generate a QR code for a short URL.

*   **Example:** `GET /url/my-custom-alias/qr`
*   **Response (200 OK):**
    ```json
    {
      "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
    }
    ```

#### `POST /url/:shortId/delete`

Soft-delete a URL. The URL will be permanently deleted after 30 days.

*   **Headers:** `Authorization: Bearer <your_token>`
*   **Example:** `POST /url/my-custom-alias/delete`
*   **Response (200 OK):**
    ```json
    {
      "message": "Successfully deleted"
    }
    ```

#### `POST /url/:shortId/restore`

Restore a soft-deleted URL.

*   **Headers:** `Authorization: Bearer <your_token>`
*   **Example:** `POST /url/my-custom-alias/restore`
*   **Response (200 OK):**
    ```json
    {
      "message": "Successfully Restored"
    }
    ```

## Project Structure

```
.
├── controller/       # Contains business logic for routes
│   ├── auth.controller.js
│   ├── qr.controller.js
│   ├── url.controller.js
│   └── url.ratelimiter.js
├── middleware/       # Express middleware (e.g., auth)
│   └── auth.middleware.js
├── models/           # Mongoose schemas
│   ├── url.models.js
│   └── user.model.js
├── routes/           # API route definitions
│   ├── auth.route.js
│   └── url.routes.js
├── connect.js        # MongoDB connection handler
├── index.js          # Main application entry point
├── package.json
└── .env.example      # Environment variable template
