const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

// @route   GET /api/questions
// @desc    Get questions with search, tags, status filters
// @access  Public
router.get('/', async (req, res) => {
  const { search, tag, status, asker } = req.query;
  let query = {};

  if (asker) {
    query.asker = asker;
  }

  if (tag) {
    query.tags = tag;
  }

  if (status) {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  try {
    const questions = await Question.find(query)
      .populate('asker', 'username role stats')
      .sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/questions/:id
// @desc    Get question by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('asker', 'username role stats')
      .populate({
        path: 'answers',
        populate: { path: 'responder', select: 'username role stats' }
      });

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json(question);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST /api/questions
// @desc    Create a question
// @access  Private
router.post(
  '/',
  protect,
  upload.single('image'),
  [
    body('title', 'Title is required and should be less than 150 chars')
      .not()
      .isEmpty()
      .isLength({ max: 150 }),
    body('description', 'Description is required').not().isEmpty(),
    body('tags', 'Tags must be provided').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, tags } = req.body;
    let imageUrl = null;

    if (req.file) {
      // If upload is to Cloudinary, req.file.path is the URL.
      // If local storage fallback, req.file.filename exists, we store /uploads/<filename>.
      imageUrl = req.file.path.startsWith('http') 
        ? req.file.path 
        : `/uploads/${req.file.filename}`;
    }

    try {
      if (req.user.points < 10) {
        return res.status(400).json({ message: 'You need at least 10 points to ask a question' });
      }

      const parsedTags = Array.isArray(tags) 
        ? tags 
        : tags.split(',').map(tag => tag.trim()).filter(Boolean);

      const newQuestion = await Question.create({
        asker: req.user.id,
        title,
        description,
        imageUrl,
        tags: parsedTags
      });

      // Increment user's question count statistic and deduct 10 points
      await User.findByIdAndUpdate(req.user.id, {
        $inc: { 
          'stats.questionsCount': 1,
          points: -10
        }
      });

      const populatedQuestion = await newQuestion.populate('asker', 'username role stats points');
      res.status(201).json(populatedQuestion);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   DELETE /api/questions/:id
// @desc    Delete a question
// @access  Private (Owner or Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check permissions (User is owner OR user is admin)
    if (question.asker.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete all child answers associated with this question
    await Answer.deleteMany({ parentQuestion: question._id });

    // Decrement user's question count statistic and refund 10 points
    await User.findByIdAndUpdate(question.asker, {
      $inc: { 
        'stats.questionsCount': -1,
        points: 10
      }
    });

    await question.deleteOne();
    res.json({ message: 'Question removed successfully' });
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;
