const express = require('express');
const router = express.Router();

// @route   GET /api/posts/test
// @desc    Test route for posts
// @access  public

router.get('/test', (req, res) => res.json({msg : 'posts work'}));

module.exports = router;