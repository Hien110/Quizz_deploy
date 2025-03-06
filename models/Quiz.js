const mongoose = require('mongoose');
const { Schema } = mongoose;

const QuizSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    questions: [{ 
        type: mongoose.Schema.Types.ObjectId, ref: 'Question' 
    }]
})

module.exports = mongoose.model('Quiz', QuizSchema);