console.log('--- DEBUG: server.js is running (Bypass Mode) ---');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Static folders
app.use('/student', express.static(path.join(__dirname, '../frontend/student-app/dist')));
app.use('/staff', express.static(path.join(__dirname, '../frontend/staff-app/dist/staff-app/browser')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/submissions', require('./routes/submissions'));

// Landing Page
app.get('/', (req, res) => {
    res.render('index', { title: 'Online Lab Evaluation' });
});

/** 
 * SPA FALLBACK: Ensure any sub-path within /student or /staff is served by index.html
 */
app.use((req, res, next) => {
    // Debug logging for production (view in Render logs)
    console.log(`--- Request Path: ${req.path} ---`);

    if (req.path.startsWith('/api')) return next();

    // Student SPA fallback
    if (req.path.startsWith('/student')) {
        const studentIndex = path.join(__dirname, '../frontend/student-app/dist/index.html');
        console.log(`Serving Student App: ${studentIndex}`);
        return res.sendFile(studentIndex);
    }
    
    // Staff SPA fallback
    if (req.path.startsWith('/staff')) {
        const staffIndex = path.join(__dirname, '../frontend/staff-app/dist/staff-app/browser/index.html');
        console.log(`Serving Staff App: ${staffIndex}`);
        return res.sendFile(staffIndex);
    }
    
    next();
});

// Handle 404 for non-SPA paths
app.use((req, res) => {
    console.warn(`404 Not Found: ${req.path}`);
    res.status(404).send('Resource not found');
});

const dbConfig = require('./config/db');
dbConfig.connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('--- DEBUG: server.js listening ---');
    console.log(`Server executing smoothly on port ${PORT}`);
});
