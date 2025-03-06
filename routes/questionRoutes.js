const express = require('express');
const mongoose = require('mongoose');
const Question = require('../models/Question');

const questionRouter = express.Router();
questionRouter.use(express.json());
questionRouter.use(express.urlencoded({ extended: true }));

questionRouter
    .get('/', async (req, res) => {
        try {
            const questions = await Question.find();
            res.status(200).json(questions);
        } catch (err){
            res.status(500).json({ message: 'Error fetching questions' });
        }
    })

    .post('/', async (req, res) => {
        try {
            const question = new Question(req.body);
            await question.save();
            res.status(201).json();
        } catch (err) {
            res.status(400).json({message: err.message})
        }
    })

questionRouter
  .route("/:questionId")

    .get(async (req, res) => {
        try {
            const question = await Question.findById(req.params.questionId);
            if (!question) return res.status(404).json({ message: "Question not found" });
            res.status(200).json(question);
        } catch (err) {
            res.status(500).json({ message: "Failed to fetch question", error: err.message });
        }
    })

    .put(async (req, res) => {
        try {
            const updatedQuestion = await Question.findByIdAndUpdate(
                req.params.questionId,
                req.body,
                { new: true }
            );
            if (!updatedQuestion) return res.status(404).json({ message: "Question not found" });
            res.status(200).json(updatedQuestion);
        } catch (err) {
            res.status(500).json({ message: "Failed to update question", error: err.message });
        }
    })
    
    .delete( async (req, res) => {
        try {
            const deletedQuestion = await Question.findByIdAndDelete(req.params.questionId);
            if (!deletedQuestion) return res.status(404).json({ message: "Question not found" });
            res.status(200).json({ message: "Question deleted" });
        } catch (err) {
            res.status(500).json({ message: "Failed to delete question", error: err.message });
        }
    });
module.exports = questionRouter;