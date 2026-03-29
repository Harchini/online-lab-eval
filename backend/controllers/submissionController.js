const Submission = require('../models/Submission');
const Question = require('../models/Question');
const { runCode } = require('../utils/codeRunner');

// Student: Submit code and evaluate it against all test cases
exports.submitCode = async (req, res) => {
    try {
        const { questionId, code } = req.body;
        const question = await Question.findById(questionId);
        if (!question) return res.status(404).json({ message: 'Question not found' });

        let marksObtained = 0;
        const executionLogs = [];

        for (let i = 0; i < question.testCases.length; i++) {
            const tc = question.testCases[i];
            const result = await runCode(code, tc.input);

            if (result.success && result.output === tc.output.trim()) {
                marksObtained += tc.marks;
                executionLogs.push({ testCaseIndex: i, passed: true, errorMsg: null });
            } else {
                executionLogs.push({
                    testCaseIndex: i,
                    passed: false,
                    errorMsg: result.error || `Expected: ${tc.output}, Got: ${result.output}`
                });
            }
        }

        const isFullCorrect = marksObtained === question.totalMarks;

        const submission = await Submission.create({
            student: req.user._id,
            question: questionId,
            code,
            marksObtained,
            isFullCorrect,
            executionLogs
        });

        res.json({ submission, marksObtained, totalMarks: question.totalMarks, isFullCorrect, executionLogs });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Student: Run code without submitting (just for error checking)
exports.runCode = async (req, res) => {
    try {
        const { code, input } = req.body;
        const { runCode: runner } = require('../utils/codeRunner');
        const result = await runner(code, input || '');
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Staff: Get all student submissions with marks, ordered by marks
// Advanced MongoDB Technique: Aggregation Pipeline with $lookup, $group, $sort
exports.getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await Submission.aggregate([
            {
                $group: {
                    _id: '$student',
                    totalMarks: { $sum: '$marksObtained' },
                    lastSubmission: { $max: '$createdAt' },
                    submissionCount: { $sum: 1 }
                }
            },
            { $sort: { totalMarks: -1 } },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'studentInfo'
                }
            },
            {
                $project: {
                    _id: 1,
                    totalMarks: 1,
                    lastSubmission: 1,
                    submissionCount: 1,
                    regNo: { $arrayElemAt: ['$studentInfo.regNo', 0] }
                }
            }
        ]);

        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Staff: Get all submissions (with student and question info)
exports.getAllSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find()
            .populate('student', 'regNo')
            .populate('question', 'title totalMarks')
            .sort({ createdAt: -1 });
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
