const express = require('express');
const mongoose = require('mongoose');
const quizRoutes = require('./routes/quizRoutes');
const questionRotues = require('./routes/questionRoutes');
const cors = require("cors");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
mongoose.set('strictQuery', true);

const url = 'mongodb://localhost:27017/SimpleQuiz';
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err.message));

app.use('/quizzes', quizRoutes);
app.use('/questions', questionRotues);

app.listen(port, () => console.log(`Server running on port ${port}`));


