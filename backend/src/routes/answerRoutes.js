const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Answer = require('../models/Answer');
const Question = require('../models/Question');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/answers/:questionId
// @desc    Post an answer to a question
// @access  Private
router.post(
  '/:questionId',
  [
    protect,
    [body('content', 'Content is required').not().isEmpty()]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const question = await Question.findById(req.params.questionId);
      if (!question) {
        return res.status(404).json({ message: 'Question not found' });
      }

      // Users cannot answer their own questions (standard Q&A practice, optional but good for resume)
      if (question.asker.toString() === req.user.id) {
        return res.status(400).json({ message: 'You cannot answer your own question' });
      }

      const answer = await Answer.create({
        responder: req.user.id,
        content: req.body.content,
        parentQuestion: question._id
      });

      // Update question to include answer
      question.answers.push(answer._id);
      await question.save();

      // Update responder stats: increment answersCount and award 15 points
      await User.findByIdAndUpdate(req.user.id, {
        $inc: { 
          'stats.answersCount': 1,
          points: 15
        }
      });

      const populatedAnswer = await answer.populate('responder', 'username role stats points');
      res.status(201).json(populatedAnswer);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   PUT /api/answers/:id
// @desc    Update an answer
// @access  Private (Owner only)
router.put(
  '/:id',
  [
    protect,
    [body('content', 'Content is required').not().isEmpty()]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let answer = await Answer.findById(req.params.id);
      if (!answer) {
        return res.status(404).json({ message: 'Answer not found' });
      }

      // Check owner
      if (answer.responder.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to edit this answer' });
      }

      answer.content = req.body.content;
      await answer.save();

      const populatedAnswer = await answer.populate('responder', 'username role stats points');
      res.json(populatedAnswer);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   DELETE /api/answers/:id
// @desc    Delete an answer
// @access  Private (Owner or Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    // Check permissions
    if (answer.responder.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const question = await Question.findById(answer.parentQuestion);
    if (question) {
      // Remove answer ref from question
      question.answers = question.answers.filter(
        (ansId) => ansId.toString() !== answer._id.toString()
      );
      
      // If this was the best answer, reset question status to unsolved
      if (answer.isBestAnswer) {
        question.status = 'unsolved';
      }
      await question.save();
    }

    // Deduct stats and points (15 points back)
    await User.findByIdAndUpdate(answer.responder, {
      $inc: { 
        'stats.answersCount': -1,
        points: -15
      }
    });

    // If answer had upvotes, deduct upvotesReceived stat and upvote points (5 points per upvote)
    if (answer.upvotes.length > 0) {
      await User.findByIdAndUpdate(answer.responder, {
        $inc: {
          'stats.upvotesReceived': -answer.upvotes.length,
          points: -(answer.upvotes.length * 5)
        }
      });
    }

    // If answer was best, deduct the 20 bonus points
    if (answer.isBestAnswer) {
      await User.findByIdAndUpdate(answer.responder, {
        $inc: { points: -20 }
      });
    }

    await answer.deleteOne();
    res.json({ message: 'Answer removed successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   PATCH /api/answers/:id/vote
// @desc    Upvote/Downvote (toggle) an answer
// @access  Private
router.patch('/:id/vote', protect, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    // Users cannot upvote their own answers
    if (answer.responder.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot upvote your own answer' });
    }

    const alreadyUpvoted = answer.upvotes.includes(req.user.id);
    let pointsChange = 0;
    let upvoteChange = 0;

    if (alreadyUpvoted) {
      // Remove upvote (toggle off)
      answer.upvotes = answer.upvotes.filter((uid) => uid.toString() !== req.user.id);
      pointsChange = -5;
      upvoteChange = -1;
    } else {
      // Add upvote (toggle on)
      answer.upvotes.push(req.user.id);
      pointsChange = 5;
      upvoteChange = 1;
    }

    await answer.save();

    // Update responder's points and upvotes statistics
    await User.findByIdAndUpdate(answer.responder, {
      $inc: { 
        points: pointsChange,
        'stats.upvotesReceived': upvoteChange
      }
    });

    const populatedAnswer = await answer.populate('responder', 'username role stats points');
    res.json(populatedAnswer);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   PATCH /api/answers/:id/best
// @desc    Mark an answer as "Best Answer"
// @access  Private (Question Asker only)
router.patch('/:id/best', protect, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    const question = await Question.findById(answer.parentQuestion);
    if (!question) {
      return res.status(404).json({ message: 'Parent question not found' });
    }

    // Verify requesting user is the owner of the question
    if (question.asker.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the question creator can select the best answer' });
    }

    // Toggle best answer logic
    const wasBestAnswer = answer.isBestAnswer;

    if (wasBestAnswer) {
      // Unmark as best answer
      answer.isBestAnswer = false;
      question.status = 'unsolved';
      
      // Deduct 20 points from responder
      await User.findByIdAndUpdate(answer.responder, {
        $inc: { points: -20 }
      });
    } else {
      // Reset any existing best answer for this question first
      await Answer.updateMany(
        { parentQuestion: question._id, isBestAnswer: true },
        { $set: { isBestAnswer: false } }
      );
      
      // Mark this one as best answer
      answer.isBestAnswer = true;
      question.status = 'solved';

      // Award 20 points to responder
      await User.findByIdAndUpdate(answer.responder, {
        $inc: { points: 20 }
      });
    }

    await answer.save();
    await question.save();

    const populatedAnswer = await answer.populate('responder', 'username role stats points');
    res.json({ answer: populatedAnswer, questionStatus: question.status });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
