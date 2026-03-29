const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    testCases: [{
        input: { type: String, required: true },
        output: { type: String, required: true },
        marks: { type: Number, required: true }
    }],
    totalMarks: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);
