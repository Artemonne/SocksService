const router = require('express').Router();
const authRouter = require('./user.routes');
const favouriteRoutes = require('./favourite.routes');
const basketRoutes = require('./basket.routes');
const sockRoutes = require('./sock.routes');
const formatResponse = require('../utils/formatResponse');

router.use('/auth', authRouter);
router.use('/favourite', favouriteRoutes);
router.use('/basket', basketRoutes);
router.use('/socks', sockRoutes);




router.use((req, res) => {
  res.status(404).json(formatResponse(404, 'Not found'));
});

module.exports = router;