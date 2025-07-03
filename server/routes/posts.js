const express = require('express');
const { body, param, validationResult } = require('express-validator');
const Post = require('../models/Post');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// GET /api/posts - Get all blog posts (with pagination, search, and category filter)
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const category = req.query.category || '';

    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) {
      query.category = category;
    }

    const [posts, total] = await Promise.all([
      Post.find(query)
        .populate('author category')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Post.countDocuments(query),
    ]);
    res.json({ posts, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
});

// GET /api/posts/:id - Get a specific blog post
router.get('/:id', [param('id').isMongoId()], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const post = await Post.findById(req.params.id).populate('author category');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    next(err);
  }
});

// POST /api/posts - Create a new blog post (with image upload)
router.post(
  '/',
  upload.single('featuredImage'),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('author').isMongoId().withMessage('Valid author ID required'),
    body('category').isMongoId().withMessage('Valid category ID required'),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const postData = req.body;
      if (req.file) {
        postData.featuredImage = req.file.filename;
      }
      const post = new Post(postData);
      await post.save();
      res.status(201).json(post);
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/posts/:id - Update an existing blog post (with image upload)
router.put(
  '/:id',
  upload.single('featuredImage'),
  [
    param('id').isMongoId(),
    body('title').optional().notEmpty(),
    body('content').optional().notEmpty(),
    body('author').optional().isMongoId(),
    body('category').optional().isMongoId(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const updateData = req.body;
      if (req.file) {
        updateData.featuredImage = req.file.filename;
      }
      const post = await Post.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
      if (!post) return res.status(404).json({ message: 'Post not found' });
      res.json(post);
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/posts/:id - Delete a blog post
router.delete('/:id', [param('id').isMongoId()], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
});

// POST /api/posts/:id/comments - Add a comment to a post
router.post(
  '/:id/comments',
  [
    param('id').isMongoId(),
    body('user').isMongoId().withMessage('Valid user ID required'),
    body('content').notEmpty().withMessage('Comment content is required'),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: 'Post not found' });
      post.comments.push({ user: req.body.user, content: req.body.content });
      await post.save();
      res.status(201).json(post.comments[post.comments.length - 1]);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router; 