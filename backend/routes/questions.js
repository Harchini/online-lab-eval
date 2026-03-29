const express = require('express');
const router = express.Router();
const { createQuestion, getQuestions, getQuestion, deleteQuestion } = require('../controllers/questionController');
const { protect, staffOnly } = require('../middleware/authMiddleware');

router.post('/', protect, staffOnly, createQuestion);
router.get('/', protect, getQuestions);
router.get('/:id', protect, getQuestion);
router.delete('/:id', protect, staffOnly, deleteQuestion);

module.exports = router;
