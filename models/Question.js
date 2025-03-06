const mongoose = require('mongoose');
const { Schema } = mongoose;

const QuestionSchema = new Schema({
    text: {
        type: String,
        required: [true, 'Question text is required']
    },
    option: [{
        type: String,
        required: [true, 'Option is required']
    }],
    keywords: [{
        type: String,
        required: [true, 'Keyword is required']
    }],
    correctAnswerIndex: {
        type: Number,
        required: [true, 'Correct answer index is required']
    }
})

module.exports = mongoose.model('Question', QuestionSchema);