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
- **🤖 AI Campus Companion Chatbot** - Intelligent conversational assistant with persistent memory

## Tech Stack

- *Frontend:* React.js with Material-UI
- *Backend:* Node.js with Express.js
- *Database:* MongoDB with Advanced Memory Management
- *Authentication:* JWT (JSON Web Tokens)

## Getting Started

### Prerequisites

- Node.js (>=16.0.0)
- npm or yarn
- MongoDB (local or Atlas)
- VS Code or any code editor

### Installation

1. Clone the repository
bash
git clone https://github.com/GGU-HACKATHON-CAMPUS-COMPANION/CAMPUS-COMPANION.git
cd CAMPUS-COMPANION


2. Install backend dependencies
bash
cd backend
npm install


3. Install frontend dependencies
bash
cd ../frontend
npm install


4. Configure environment variables
   - Create .env file in backend folder
   - Add MongoDB connection string and JWT secret

5. Run the application
bash
# Backend (from backend folder)
npm start

# Frontend (from frontend folder)
npm start


## Database Collections

- **announcements** - Campus notices and updates
- **timetables** - Comprehensive class schedules for all days
- **lostfound** - Lost and found items with detailed descriptions
- **users** - User profiles and authentication data
- **conversations** - 🧠 **Persistent AI conversation history for each user**
- **classcontent** - Detailed class topics and content for academic mentoring

## 🧠 Advanced Memory Management

Our Campus Companion features **gracious MongoDB integration** for consistent memory management:

### **Persistent Conversation Storage**
- Every chat interaction is stored in MongoDB with user-specific conversation threads
- AI remembers previous conversations, creating personalized and contextual responses
- Conversation history includes both user messages and AI responses for complete context

### **Intelligent Context Building**
- AI dynamically fetches relevant data (timetables, announcements, lost & found) based on conversation context
- Combines conversation history with real-time campus data for comprehensive responses
- Maintains conversation continuity across sessions and devices

### **Smart Academic Mentoring**
- Tracks missed classes and provides specific catch-up advice
- References previous academic discussions to offer targeted study recommendations
- Builds long-term academic relationship with students through persistent memory

### **Memory Architecture**
```javascript
// Conversation stored per user with complete context
{
  userId: "student123",
  history: [
    { role: "user", parts: [{ text: "What's my timetable?" }] },
    { role: "model", parts: [{ text: "Here's your schedule..." }] }
  ],
  updatedAt: "2024-01-20T10:30:00Z"
}
```

## API Endpoints

### **Server APIs (Port 5001)**
- POST /api/auth/login - User login
- POST /api/auth/register - User registration
- GET /api/announcements - Get campus announcements
- GET /api/timetables - Get class timetables
- GET /api/lostfound - Get lost/found items
- POST /api/lostfound - Post lost/found item

### **Chatbot APIs (Port 3000)**
- **POST /chat** - 🤖 **AI conversation endpoint with persistent memory**
  - Accepts: `{ userId, message, image? }`
  - Returns: Contextual AI response with memory integration
  - Features: Academic mentoring, campus data integration, conversation continuity

## 🤖 AI Chatbot Features

### **Academic Mentor Capabilities**
- **Class Catch-up**: "You missed Prof. Lee's Software Engineering class on Thursday. The topic was 'SDLC Models and Agile Methodology'..."
- **Study Planning**: Creates personalized study schedules based on timetable and conversation history
- **Assignment Help**: References specific homework and projects from class content
- **Motivational Support**: Provides encouragement and academic guidance

### **Smart Campus Integration**
- **Real-time Data**: Fetches live timetables, announcements, and lost & found items
- **Contextual Responses**: Combines campus data with conversation history
- **Proactive Assistance**: Reminds about upcoming classes and deadlines
- **Empathetic Support**: Understanding responses for lost items and academic stress

### **Conversation Intelligence**
- **Memory Persistence**: Remembers all previous conversations per user
- **Context Awareness**: References past discussions for personalized responses
- **Academic Knowledge**: Uses AI knowledge to explain concepts when specific data isn't available
- **Multi-modal Support**: Handles text and image inputs for comprehensive assistance

## 🚀 Quick Start Guide

1. **Start the Server** (Port 5001)
   ```bash
   cd server && npm start
   ```

2. **Start the AI Chatbot** (Port 3000)
   ```bash
   cd chatbot && npm start
   ```

3. **Test the Chatbot**
   ```bash
   curl -X POST http://localhost:3000/chat \
   -H "Content-Type: application/json" \
   -d '{"userId":"student123","message":"What's my timetable today?"}'
   ```

## 🎯 Sample Chatbot Interactions

- **"What's my timetable for today?"** → Shows personalized schedule with room details
- **"I missed Statistics class yesterday"** → Provides specific topic recap and study advice
- **"Any new announcements?"** → Shares latest campus updates with enthusiasm
- **"I lost my wallet"** → Empathetic response with practical next steps
- **"Help me study for Physics exam"** → Creates targeted study plan based on class content

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

---

**🎓 Built with ❤️ for students, by students. Making campus life easier, one conversation at a time!**
