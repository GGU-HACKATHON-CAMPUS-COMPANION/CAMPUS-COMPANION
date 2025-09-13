import { GoogleGenerativeAI } from '@google/generative-ai';
import readline from 'readline';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fetch from 'node-fetch';
import { MongoClient } from 'mongodb';

// Load environment variables
dotenv.config();

// Server Configuration
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5000';
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = 'campus_companion';

// MongoDB Connection
async function connectToMongoDB() {
    try {
        const client = await MongoClient.connect(MONGODB_URI);
        return client.db(DB_NAME);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        return null;
    }
}

// Campus Companion System Prompt
const campusCompanionPrompt = `
You are Campus Companion, a friendly and talkative AI mentor built for college students. 
You're like a supportive senior student who genuinely cares about their academic success and campus life.

🔹 Core Functions:
1. **Timetable & Academic Mentor**
   - Show class schedules and be proactive about missed classes
   - Ask "How was your Computer Science class?" or "Did you catch up on the Physics lecture you missed?"
   - Provide study tips: "Since you missed Math on Monday, I'd suggest reviewing Chapter 5 before Wednesday's class"
   - Offer encouragement: "Don't worry about missing that class, here's what you can do to catch up..."

2. **Announcements & Campus Updates**
   - Share latest notices with enthusiasm: "Exciting news! There's a campus festival coming up!"
   - Connect announcements to student needs: "The library hours are extended - perfect for your upcoming exams!"

3. **Lost & Found Helper**
   - Be empathetic: "Oh no! Losing your ID card is stressful. Let me help you find it or guide you to get a replacement."
   - Offer practical advice: "I found a calculator in the Math building - could this be yours?"

4. **Personal Academic Assistant**
   - Remember student context and be conversational
   - Ask follow-up questions: "How are you feeling about your upcoming Physics exam?"
   - Suggest study groups, library resources, or professor office hours

🔹 Personality Traits:
- **Encouraging**: "You've got this! Missing one class doesn't define your semester."
- **Proactive**: "I noticed you have back-to-back classes on Tuesday. Want me to remind you about lunch breaks?"
- **Conversational**: Use casual language like "Hey!", "That's awesome!", "Uh oh!"
- **Helpful**: Always offer next steps or additional resources
- **Empathetic**: Understand student stress and provide emotional support

🔹 Enhanced Features:
- **Specific Class Content**: "You missed Prof. Lee's Software Engineering class on Thursday. The topic was 'SDLC Models and Agile Methodology' - they covered Waterfall vs Agile development, Scrum framework, sprint planning, and SOLID principles. Next class will be on Requirements gathering techniques."
- **Detailed Catch-up**: Provide exact topics covered, assignments given, and what to study
- **Study Planning**: Use actual class content to create targeted study schedules
- **Assignment Help**: Reference specific homework and projects mentioned in class
- **Motivational Support**: Celebrate achievements and provide encouragement during tough times

🔹 Conversation Style:
- Be warm, friendly, and genuinely interested in their success
- Ask follow-up questions to keep conversations engaging
- Share relevant tips and suggestions beyond just answering questions
- Use emojis occasionally to add personality 😊
- Remember context from previous conversations when possible

🔹 Sample Responses:
- "Hey! I see you have English class in 30 minutes. Since you missed Wednesday's class, you might want to quickly review the assignment on Shakespeare before heading over!"
- "That's great that you found your wallet! 🎉 By the way, how did your Physics exam go yesterday?"
- "I noticed the library extended hours - perfect timing for your upcoming finals! Need help planning a study schedule?"

Act like a **caring academic mentor and friend** who's always ready to help students succeed in their campus journey.
`;

// API Helper Functions with Real Backend Integration
async function getTimetable(userId, day = null) {
    try {
        let url = `${SERVER_URL}/api/chatbot/timetables?userId=${userId}`;
        if (day) url += `&day=${day}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Server error');
        const data = await response.json();
        return data || [];
    } catch (error) {
        console.error('Server not available, using fallback data');
        return [
            // Monday
            { subject: 'Computer Science', day: 'Monday', time: '09:00-10:30', room: 'CS-101', professor: 'Dr. Smith' },
            { subject: 'Mathematics', day: 'Monday', time: '11:00-12:30', room: 'MATH-201', professor: 'Dr. Johnson' },
            { subject: 'Chemistry Lab', day: 'Monday', time: '14:00-16:00', room: 'CHEM-LAB-A', professor: 'Dr. Wilson' },
            // Tuesday
            { subject: 'Physics', day: 'Tuesday', time: '09:00-10:30', room: 'PHY-101', professor: 'Dr. Brown' },
            { subject: 'Data Structures', day: 'Tuesday', time: '11:00-12:30', room: 'CS-102', professor: 'Prof. Anderson' },
            { subject: 'Statistics', day: 'Tuesday', time: '14:00-15:30', room: 'MATH-301', professor: 'Dr. Taylor' },
            // Wednesday
            { subject: 'English Literature', day: 'Wednesday', time: '09:00-10:30', room: 'ENG-201', professor: 'Prof. Davis' },
            { subject: 'Database Systems', day: 'Wednesday', time: '11:00-12:30', room: 'CS-103', professor: 'Dr. Martinez' },
            { subject: 'Physics Lab', day: 'Wednesday', time: '14:00-16:00', room: 'PHY-LAB-B', professor: 'Dr. Brown' },
            // Thursday
            { subject: 'Calculus II', day: 'Thursday', time: '09:00-10:30', room: 'MATH-202', professor: 'Dr. Johnson' },
            { subject: 'Software Engineering', day: 'Thursday', time: '11:00-12:30', room: 'CS-104', professor: 'Prof. Lee' },
            { subject: 'Communication Skills', day: 'Thursday', time: '14:00-15:30', room: 'ENG-101', professor: 'Prof. Garcia' },
            // Friday
            { subject: 'Computer Networks', day: 'Friday', time: '09:00-10:30', room: 'CS-105', professor: 'Dr. Kumar' },
            { subject: 'Linear Algebra', day: 'Friday', time: '11:00-12:30', room: 'MATH-203', professor: 'Prof. White' },
            { subject: 'Programming Lab', day: 'Friday', time: '14:00-16:00', room: 'CS-LAB-A', professor: 'Dr. Smith' },
            // Saturday
            { subject: 'Project Work', day: 'Saturday', time: '09:00-11:00', room: 'CS-106', professor: 'Prof. Anderson' },
            { subject: 'Seminar', day: 'Saturday', time: '11:30-12:30', room: 'SEMINAR-HALL', professor: 'Various Faculty' }
        ];
    }
}

async function getAnnouncements(category = null, limit = 5) {
    try {
        let url = `${SERVER_URL}/api/chatbot/announcements?limit=${limit}`;
        if (category) url += `&category=${category}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Server error');
        const data = await response.json();
        return data || [];
    } catch (error) {
        console.error('Server not available, using fallback data');
        return [
            {
                title: 'Welcome to New Semester',
                content: 'Welcome back students! The new semester begins next week. Please check your timetables.',
                category: 'academic',
                priority: 'high',
                author: 'Admin User'
            },
            {
                title: 'Library Hours Extended',
                content: 'Library will now be open until 10 PM on weekdays during exam period.',
                category: 'general',
                priority: 'medium',
                author: 'Admin User'
            },
            {
                title: 'Campus Festival Next Month',
                content: 'Annual campus festival will be held next month. Registration starts soon!',
                category: 'event',
                priority: 'medium',
                author: 'Admin User'
            }
        ];
    }
}

async function searchLostFound(query, type = null, category = null) {
    try {
        let url = `${SERVER_URL}/api/chatbot/lostfound?`;
        const params = new URLSearchParams();
        
        if (type) params.append('type', type);
        if (category) params.append('category', category);
        if (query) params.append('search', query);
        
        const response = await fetch(url + params.toString());
        if (!response.ok) throw new Error('Server error');
        const data = await response.json();
        return data || [];
    } catch (error) {
        console.error('Server not available, using fallback data');
        return [
            {
                title: 'Lost ID Card',
                description: 'Student ID card with name John Doe, lost near library',
                type: 'lost',
                category: 'documents',
                contactInfo: 'john.doe@campus.edu',
                location: 'Library'
            },
            {
                title: 'Found Calculator',
                description: 'Scientific calculator found in Math building, room 201',
                type: 'found',
                category: 'electronics',
                contactInfo: 'admin@campus.edu',
                location: 'Math Building'
            },
            {
                title: 'Lost Wallet',
                description: 'Black leather wallet with credit cards, lost in cafeteria',
                type: 'lost',
                category: 'personal',
                contactInfo: 'student@campus.edu',
                location: 'Cafeteria'
            }
        ];
    }
}

async function getUserProfile(userId) {
    try {
        // For demo purposes, return mock user data
        // In production, this would require proper JWT authentication
        return {
            name: 'Student User',
            email: `${userId}@campus.edu`,
            studentId: userId.toUpperCase()
        };
    } catch (error) {
        console.error('Server not available, using fallback data');
        return {
            name: 'Admin User',
            email: 'admin@campus.edu',
            studentId: 'ADMIN001'
        };
    }
}

// Enhanced AI Response with Data Integration
async function getEnhancedResponse(message, userId) {
    let contextData = '';
    const lowerMessage = message.toLowerCase();
    const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    
    // Always include current context for better mentoring
    contextData += `\nCurrent Context: Today is ${currentDay}, time is ${currentTime}`;
    
    // Timetable queries with mentoring context
    if (lowerMessage.includes('timetable') || lowerMessage.includes('class') || lowerMessage.includes('schedule') || lowerMessage.includes('missed') || lowerMessage.includes('catch up')) {
        // Get today's timetable if asking about "today"
        const dayFilter = lowerMessage.includes('today') ? currentDay : null;
        const timetable = await getTimetable(userId, dayFilter);
        
        if (timetable.length > 0) {
            contextData += `\nReal-time Timetable Data: ${JSON.stringify(timetable)}`;
            contextData += `\nCurrent Day Filter: ${dayFilter || 'All days'}`;
        }
        
        // Add class content data for academic mentoring
        const classContents = [
            { subject: 'Computer Science', topic: 'Introduction to Algorithms', content: 'Covered Big O notation, time complexity analysis, and basic sorting algorithms like bubble sort and selection sort. Homework: Practice problems 1-5 from Chapter 2.' },
            { subject: 'Software Engineering', topic: 'SDLC Models and Agile Methodology', content: 'Discussed Waterfall vs Agile development, Scrum framework, sprint planning, and user stories. Covered SOLID principles and design patterns. Next class: Requirements gathering techniques.' },
            { subject: 'Database Systems', topic: 'SQL Joins and Subqueries', content: 'Practiced INNER JOIN, LEFT JOIN, RIGHT JOIN operations. Covered correlated and non-correlated subqueries. Assignment: Complete database design project Phase 1.' },
            { subject: 'Data Structures', topic: 'Linked Lists and Stack Implementation', content: 'Implemented singly and doubly linked lists in C++. Covered stack operations (push, pop, peek) and applications. Lab exercise: Build a calculator using stacks.' },
            { subject: 'Physics', topic: 'Electromagnetic Waves and Optics', content: 'Studied wave properties, reflection, refraction, and interference patterns. Solved problems on lens equations and mirror formulas. Quiz next week on Chapter 12.' }
        ];
        contextData += `\nClass Content Data: ${JSON.stringify(classContents)}`;
        contextData += `\nMentoring Context: Use real-time timetable data combined with class content. Provide specific information about current/upcoming classes and help with missed class catch-up using both real data and academic knowledge.`;
    }
    
    // Announcement queries with engagement
    if (lowerMessage.includes('announcement') || lowerMessage.includes('notice') || lowerMessage.includes('news') || lowerMessage.includes('update')) {
        // Check for category-specific requests
        let category = null;
        if (lowerMessage.includes('academic')) category = 'academic';
        else if (lowerMessage.includes('event')) category = 'event';
        else if (lowerMessage.includes('general')) category = 'general';
        
        const announcements = await getAnnouncements(category, 5);
        if (announcements.length > 0) {
            contextData += `\nReal-time Announcements: ${JSON.stringify(announcements)}`;
            contextData += `\nCategory Filter: ${category || 'All categories'}`;
            contextData += `\nEngagement Context: Use real announcement data to provide current campus updates. Show enthusiasm and connect announcements to student needs.`;
        }
    }
    
    // Lost & Found queries with empathy
    if (lowerMessage.includes('lost') || lowerMessage.includes('found') || lowerMessage.includes('missing')) {
        // Determine search parameters
        let type = null, category = null, searchQuery = null;
        
        if (lowerMessage.includes('lost')) type = 'lost';
        else if (lowerMessage.includes('found')) type = 'found';
        
        if (lowerMessage.includes('id') || lowerMessage.includes('card')) category = 'documents';
        else if (lowerMessage.includes('phone') || lowerMessage.includes('calculator')) category = 'electronics';
        else if (lowerMessage.includes('wallet') || lowerMessage.includes('bag')) category = 'personal';
        
        // Extract search terms
        const searchTerms = message.split(' ').filter(word => 
            word.length > 3 && !['lost', 'found', 'missing', 'have', 'been', 'item'].includes(word.toLowerCase())
        );
        if (searchTerms.length > 0) searchQuery = searchTerms[0];
        
        const lostFoundItems = await searchLostFound(searchQuery, type, category);
        if (lostFoundItems.length > 0) {
            contextData += `\nReal-time Lost & Found Items: ${JSON.stringify(lostFoundItems)}`;
            contextData += `\nSearch Parameters: type=${type}, category=${category}, query=${searchQuery}`;
        }
        contextData += `\nEmpathy Context: Use real lost & found data to help students. Be understanding, offer practical help, and provide emotional support with specific item information.`;
    }
    
    // Profile queries with personal touch
    if (lowerMessage.includes('profile') || lowerMessage.includes('who am i') || lowerMessage.includes('my info')) {
        const profile = await getUserProfile(userId);
        if (profile) {
            contextData += `\nUser Profile: ${JSON.stringify(profile)}`;
            contextData += `\nPersonal Context: Use their name, be friendly, and ask about their academic progress and campus experience.`;
        }
    }
    
    // Study and academic help context
    if (lowerMessage.includes('study') || lowerMessage.includes('exam') || lowerMessage.includes('homework') || lowerMessage.includes('assignment')) {
        const timetable = await getTimetable(userId);
        if (timetable.length > 0) {
            // Add specific class content for study help
            const classContents = [
                { subject: 'Computer Science', topic: 'Introduction to Algorithms', content: 'Covered Big O notation, time complexity analysis, and basic sorting algorithms like bubble sort and selection sort. Homework: Practice problems 1-5 from Chapter 2.' },
                { subject: 'Software Engineering', topic: 'SDLC Models and Agile Methodology', content: 'Discussed Waterfall vs Agile development, Scrum framework, sprint planning, and user stories. Covered SOLID principles and design patterns. Next class: Requirements gathering techniques.' },
                { subject: 'Database Systems', topic: 'SQL Joins and Subqueries', content: 'Practiced INNER JOIN, LEFT JOIN, RIGHT JOIN operations. Covered correlated and non-correlated subqueries. Assignment: Complete database design project Phase 1.' },
                { subject: 'Data Structures', topic: 'Linked Lists and Stack Implementation', content: 'Implemented singly and doubly linked lists in C++. Covered stack operations (push, pop, peek) and applications. Lab exercise: Build a calculator using stacks.' },
                { subject: 'Physics', topic: 'Electromagnetic Waves and Optics', content: 'Studied wave properties, reflection, refraction, and interference patterns. Solved problems on lens equations and mirror formulas. Quiz next week on Chapter 12.' }
            ];
            contextData += `\nClass Content for Study Help: ${JSON.stringify(classContents)}`;
            contextData += `\nAcademic Support Context: Use specific class content when available, but also leverage your academic knowledge to explain concepts, provide study tips, and suggest practice materials for any subject the student asks about. Be educational and helpful.`;
        }
    }
    
    // General mentoring context for any interaction
    contextData += `\nGeneral Mentoring Guidelines: Be conversational, ask follow-up questions, show genuine interest in their success, use encouraging language, and always offer additional help or resources. IMPORTANT: When students ask about missed classes, always provide helpful academic content using your knowledge of the subject, even if specific class data isn't available. Give typical topics covered in that course and explain key concepts.`;
    
    return contextData;
}

// Load Conversation History from MongoDB
async function loadConversationHistory(userId) {
    try {
        const db = await connectToMongoDB();
        if (db) {
            const collection = db.collection('conversations');
            const userChat = await collection.findOne({ userId });
            if (userChat && userChat.history) {
                return userChat.history;
            }
        }
        return [{
            role: 'user',
            parts: [{ text: campusCompanionPrompt }]
        }];
    } catch (error) {
        console.error('Error loading conversation history:', error);
        return [{
            role: 'user',
            parts: [{ text: campusCompanionPrompt }]
        }];
    }
}

// Save Conversation History to MongoDB
async function saveConversationHistory(userId, history) {
    try {
        const db = await connectToMongoDB();
        if (db) {
            const collection = db.collection('conversations');
            await collection.updateOne(
                { userId },
                { $set: { userId, history, updatedAt: new Date() } },
                { upsert: true }
            );
        }
    } catch (error) {
        console.error('Error saving conversation history:', error);
    }
}

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 200
}));
app.use(express.json());



const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const modelName = 'gemini-2.0-flash';
const config = {
    temperature: 0.4,
    topP: 1,
    topK: 32,
    maxOutputTokens: 4096,
};

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});

// Chat endpoint
app.post('/chat', upload.single('image'), async (req, res) => {
    try {
        const { userId, message } = req.body;
        const imageFile = req.file;

        if (!userId || (!message && !imageFile)) {
            return res.status(400).json({ error: 'Missing userId or message/image' });
        }

        let history = await loadConversationHistory(userId);

        // Ensure system prompt is included
        if (history.length === 0) {
            history.push({
                role: 'system',
                parts: [{ text: campusCompanionPrompt }]
            });
        }

        // Get enhanced context data
        const contextData = await getEnhancedResponse(message, userId);
        const enhancedMessage = message + contextData;

        const model = ai.getGenerativeModel({
            model: modelName,
            generationConfig: config
        });

        const parts = [];
        if (message) {
            parts.push({ text: enhancedMessage });
        }
        if (imageFile) {
            parts.push({
                inlineData: {
                    mimeType: imageFile.mimetype,
                    data: imageFile.buffer.toString('base64')
                }
            });
        }

        const result = await model.generateContent({
            contents: [...history, { role: 'user', parts }]
        });

        const response = await result.response.text();

        history.push(
            { role: 'user', parts },
            { role: 'model', parts: [{ text: response }] }
        );

        await saveConversationHistory(userId, history);
        res.json({ response });
    } catch (error) {
        console.error('Detailed error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

// Serve static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html on root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
