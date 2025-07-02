const router = require('express').Router();
const userRoutes = require('./user.routes');
const formatResponse = require('../utils/formatResponse');

router.use('/users', userRoutes);

router.use((req, res) => {
  res.status(404).json(formatResponse(404, 'Not found'));
});

module.exports = router;