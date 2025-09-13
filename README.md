# Campus Companion App

## Problem Statement

Create a lightweight web application that helps students navigate campus life. The app should provide quick access to timetables, announcements, and a "lost & found" feature, acting as a mini personal assistant for college life.

## Outcome

Students get a centralized hub for their daily campus needs — timetables, notices, and lost/found updates — improving convenience and reducing confusion.

## Features

- *Timetable Viewer* - View class schedules
- *Notice Board* - Campus announcements and updates
- *Lost & Found* - Post and search for lost/found items
- *Profile Login* - JWT authentication for personalized experience

## Tech Stack

- *Frontend:* React.js with Material-UI
- *Backend:* Node.js with Express.js
- *Database:* MongoDB
- *Authentication:* JWT (JSON Web Tokens)


## Database Collections

- announcements - Campus notices
- timetables - Class schedules
- lostfound - Lost and found items
- users - User profiles

## API Endpoints

- POST /api/auth/login - User login
- POST /api/auth/register - User registration
- GET /api/announcements - Get announcements
- GET /api/timetables - Get timetables
- GET /api/lostfound - Get lost/found items
- POST /api/lostfound - Post lost/found item

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.