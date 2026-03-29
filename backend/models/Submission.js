const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    code: { type: String, required: true },
    marksObtained: { type: Number, required: true },
    isFullCorrect: { type: Boolean, required: true },
    executionLogs: [{
        testCaseIndex: { type: Number },
        passed: { type: Boolean },
        errorMsg: { type: String }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Submission', SubmissionSchema);
