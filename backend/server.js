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
 * ADVANCED BYPASS: Using custom middleware instead of app.get() with wildcards.
 * This avoids the "Missing parameter name" error in Express 5/path-to-regexp 6.
 */
app.use((req, res, next) => {
    // If it's an API request, let it pass to the routers above
    if (req.path.startsWith('/api')) return next();

    // Student SPA fallback
    if (req.path.startsWith('/student')) {
        return res.sendFile(path.join(__dirname, '../frontend/student-app/dist/index.html'));
    }
    // Staff SPA fallback
    if (req.path.startsWith('/staff')) {
        return res.sendFile(path.join(__dirname, '../frontend/staff-app/dist/staff-app/browser/index.html'));
    }
    next();
});

// Handle 404
app.use((req, res) => {
    res.status(404).send('Resource not found');
});

const dbConfig = require('./config/db');
dbConfig.connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('--- DEBUG: server.js listening ---');
    console.log(`Server executing smoothly on port ${PORT}`);
});
