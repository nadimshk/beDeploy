const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { authenticateUser } = require('../middleware/authMiddleware');

// Route: GET /api/blogs
router.get('/', authenticateUser, blogController.getAllBlogs);

// Route: GET /api/blogs/filtered
router.get('/filtered', authenticateUser, blogController.getFilteredBlogs);

// Route: POST /api/blogs
router.post('/', authenticateUser, blogController.createBlog);

// Route: PUT /api/blogs/:id
router.put('/:id', authenticateUser, blogController.updateBlog);

// Route: DELETE /api/blogs/:id
router.delete('/:id', authenticateUser, blogController.deleteBlog);

module.exports = router;
