# Campus Companion Backend

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   - Copy `.env` file and update values:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/campus-companion
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   JWT_EXPIRE=7d
   BCRYPT_ROUNDS=12
   ```

3. **Database Setup**
   - Ensure MongoDB is running
   - Seed initial data: `npm run seed`

4. **Start Server**
   ```bash
   npm start        # Production
   npm run dev      # Development with nodemon
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Announcements
- `GET /api/announcements` - Get all announcements
- `POST /api/announcements` - Create announcement (auth required)
- `GET /api/announcements/category/:category` - Get by category

### Timetables
- `GET /api/timetables` - Get user timetable (auth required)
- `POST /api/timetables` - Add timetable entry (auth required)
- `GET /api/timetables/day/:day` - Get by day (auth required)
- `DELETE /api/timetables/:id` - Delete entry (auth required)

### Lost & Found
- `GET /api/lostfound` - Get all items
- `POST /api/lostfound` - Post item (auth required)
- `GET /api/lostfound/my-items` - Get user's items (auth required)
- `PATCH /api/lostfound/:id/status` - Update status (auth required)
- `DELETE /api/lostfound/:id` - Delete item (auth required)

### Health Check
- `GET /health` - Server health status

## Security Features

- Helmet.js for security headers
- Rate limiting (100 requests per 15 minutes)
- CORS configuration
- Input validation with express-validator
- JWT authentication
- Password hashing with bcrypt
- Environment-based configuration

## Database Models

- **User**: Authentication and profile data
- **Announcement**: Campus notices with categories
- **Timetable**: User-specific class schedules
- **LostFound**: Lost and found item tracking