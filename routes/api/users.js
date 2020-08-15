const express = require('express');
const router = express.Router();

// @route   GET /api/users/test
// @desc    Test route for users
// @access  public

router.get('/test', (req, res) => res.json({msg : 'users work'}));

module.exports = router;