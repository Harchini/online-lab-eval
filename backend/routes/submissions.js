const express = require('express');
const router = express.Router();
const { submitCode, runCode, getLeaderboard, getAllSubmissions } = require('../controllers/submissionController');
const { protect, staffOnly } = require('../middleware/authMiddleware');

router.post('/submit', protect, submitCode);
router.post('/run', protect, runCode);
router.get('/leaderboard', protect, staffOnly, getLeaderboard);
router.get('/all', protect, staffOnly, getAllSubmissions);

module.exports = router;
