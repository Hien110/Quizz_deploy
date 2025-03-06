require('dotenv').config(); // Đọc biến môi trường từ .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");

const quizRoutes = require('./routes/quizRoutes');
const questionRoutes = require('./routes/questionRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

mongoose.set('strictQuery', true);

// Kết nối MongoDB Atlas
const url = process.env.MONGO_URI;
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Atlas connected'))
.catch(err => console.error('❌ MongoDB connection error:', err.message));

app.use('/quizzes', quizRoutes);
app.use('/questions', questionRoutes);

app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
