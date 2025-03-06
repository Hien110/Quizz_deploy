const express = require("express");
const mongoose = require("mongoose");
const Quiz = require("../models/Quiz");
const Question = require("../models/Question");

const quizRouter = express.Router();
quizRouter.use(express.json());
quizRouter.use(express.urlencoded({ extended: true }));

quizRouter
    //get all quizzes
  .get("/", async (req, res) => {
    try {
      const quizzes = await Quiz.find().populate("questions");
      res.status(200).json(quizzes);
    } catch (err) {
      res.status(500).json({ message: "Error fetching quizzes" });
    }
  })

  //create a new quiz
  .post("/", async (req, res) => {
    try {
      const quiz = new Quiz(req.body);
      await quiz.save();
      res.status(201).json(quiz);
    } catch (err) {
      res.status(400).json({ message: "Can not post" });
    }
  });

quizRouter
  .route("/:quizId")

  //get a quiz by id
  .get(async (req, res) => {
    try {
      const quiz = await Quiz.findById(req.params.quizId).populate("questions");
      if (!quiz) {
        return res
          .status(404)
          .json({ message: "Can not find quiz with id " + req.params.quizId });
      }
      res.json(quiz);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Can not find quiz with id " + req.params.quizId });
    }
  })

    //update a quiz by id
  .put(async (req, res) => {
    try {
      const quiz = await Quiz.findByIdAndUpdate(req.params.quizId, req.body, {
        new: true,
      });
      if (!quiz) {
        return res
          .status(404)
          .json({ message: "Can not find quiz with id " + req.params.quizId });
      }
      res.json(quiz);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Can not find quiz with id " + req.params.quizId });
    }
  })

    //delete a quiz by id
  .delete(async (req, res) => {
    try {
      const quiz = await Quiz.findByIdAndDelete(req.params.quizId);
      if (!quiz) {
        return res
          .status(404)
          .json({ message: "Can not find quiz with id " + req.params.quizId });
      }
      res.status(200).json({ message: "Quiz deleted" });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Can not find quiz with id " + req.params.quizId });
    }
  });

  //populate a quiz by id has capital keyword
quizRouter.get("/:quizId/populate", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId).populate({
      path: "questions",
      match: { keywords: { $in: ["capital"] } },
    });

    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//add a question to a quiz by id
quizRouter.post("/:quizId/question", async (req, res) => {
  try {
    const { text, options, keywords, correctAnswerIndex } = req.body;
    const question = new Question({
      text,
      options,
      keywords,
      correctAnswerIndex,
    });
    await question.save();

    const quiz = await Quiz.findByIdAndUpdate(
      req.params.quizId,
      { $push: { questions: question._id } },
      { new: true }
    ).populate("questions");

    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    res.status(201).json(quiz);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


///add multiple questions to a quiz by id
quizRouter.post("/:quizId/questions", async (req, res) => {
  try {
    const questions = await Question.insertMany(req.body.questions);
    const questionIds = questions.map((q) => q._id);

    const quiz = await Quiz.findByIdAndUpdate(
      req.params.quizId,
      { $push: { questions: { $each: questionIds } } },
      { new: true }
    ).populate("questions");

    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    res.status(201).json(quiz);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
module.exports = quizRouter;
