# Video Sharing Platform Backend

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?logo=cloudinary&logoColor=white)](https://cloudinary.com/)

A robust backend service for a video sharing platform built with Node.js, Express, and MongoDB. This project provides the foundation for a YouTube-like platform with user authentication, video management, and subscription features.

## ✨ Features

- **User Authentication**
  - Secure registration and login with JWT
  - Email/username login
  - Password reset functionality
  - Protected routes with middleware

- **Video Management**
  - Upload and stream videos
  - Thumbnail support
  - Video details (title, description, duration)
  - View counting
  - Publication status control

- **User Features**
  - Profile management
  - Avatar and cover image uploads
  - Subscription system
  - Watch history

- **API Features**
  - RESTful API design
  - File upload handling
  - Pagination
  - Rate limiting (recommended)
  - CORS enabled

## 🚀 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **Package Manager**: npm

## 📦 Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher) or yarn
- MongoDB (local or cloud instance)
- Cloudinary account (for file storage)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/video-sharing-backend.git
   cd video-sharing-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add the following variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=8000
   
   # JWT
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   ACCESS_TOKEN_EXPIRY=15m
   REFRESH_TOKEN_EXPIRY=7d
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # CORS
   CORS_ORIGIN=http://localhost:3000
   ```

## 🚀 Running the Application

### Development
```bash
npm run dev
# or
yarn dev
```

The server will start on `http://localhost:8000` by default.

### Production
```bash
npm start
# or
yarn start
```

## 📂 Project Structure

```
src/
├── app.js              # Express app configuration
├── config/             # Configuration files
├── constants.js        # Application constants
├── controllers/        # Request handlers
│   └── user.controller.js
├── db/                 # Database connection
│   └── index.js
├── middlewares/        # Custom middleware
│   ├── auth.middleware.js
│   └── multer.middleware.js
├── models/             # Database models
│   ├── subscription.models.js
│   ├── user.models.js
│   └── video.models.js
├── routes/             # API routes
│   └── user.routes.js
└── utils/              # Utility functions
    ├── ApiError.js
    ├── ApiResponse.js
    ├── asyncHandler.js
    └── cloudinary.js
```

## 📚 API Documentation

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/users/register` | POST | Register a new user |
| `/api/v1/users/login` | POST | User login |
| `/api/v1/users/logout` | POST | User logout |
| `/api/v1/users/refresh-token` | POST | Refresh access token |
| `/api/v1/users/change-password` | POST | Change password |

### User

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/users/current-user` | GET | Get current user |
| `/api/v1/users/update-account` | PATCH | Update account details |
| `/api/v1/users/avatar` | PATCH | Update avatar |
| `/api/v1/users/cover-image` | PATCH | Update cover image |

## 🔒 Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `PORT`: Server port (default: 8000)
- `ACCESS_TOKEN_SECRET`: Secret for JWT access tokens
- `REFRESH_TOKEN_SECRET`: Secret for JWT refresh tokens
- `ACCESS_TOKEN_EXPIRY`: Access token expiry (default: 15m)
- `REFRESH_TOKEN_EXPIRY`: Refresh token expiry (default: 7d)
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret
- `CORS_ORIGIN`: Allowed CORS origin (e.g., http://localhost:3000)

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/)
- [Cloudinary](https://cloudinary.com/)

