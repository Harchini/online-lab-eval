const Question = require('../models/Question');

// Staff: Create a Question with Testcases
exports.createQuestion = async (req, res) => {
    try {
        const { title, description, testCases } = req.body;
        const totalMarks = testCases.reduce((sum, tc) => sum + tc.marks, 0);
        const question = await Question.create({ title, description, testCases, totalMarks });
        res.status(201).json(question);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Student: Get all Questions (summary only)
exports.getQuestions = async (req, res) => {
    try {
        const questions = await Question.find({}, 'title description totalMarks');
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Student: Get one Question (with testcases for display)
exports.getQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) return res.status(404).json({ message: 'Question not found' });
        res.json(question);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Staff: Delete Question
exports.deleteQuestion = async (req, res) => {
    try {
        await Question.findByIdAndDelete(req.params.id);
        res.json({ message: 'Question deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
