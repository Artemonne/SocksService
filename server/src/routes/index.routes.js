const router = require('express').Router();
const userRoutes = require('./user.routes');
const favouriteRoutes = require('./favourite.routes');
const basketRoutes = require('./basket.routes');
const sockRoutes = require('./sock.routes');
const orderRoutes = require('./order.routes')
const formatResponse = require('../utils/formatResponse');

router.use('/users', userRoutes);
router.use('/favourite', favouriteRoutes);
router.use('/basket', basketRoutes);
router.use('/socks', sockRoutes);
router.use('/order', orderRoutes)




router.use((req, res) => {
  res.status(404).json(formatResponse(404, 'Not found'));
});

module.exports = router;