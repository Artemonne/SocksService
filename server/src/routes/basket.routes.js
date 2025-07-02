const router = require('express').Router();
const BasketController = require('../controllers/BasketController');


router
  .post('/', BasketController.addToBasket)
  .get('/quantity', BasketController.updateQuantity)
  .get('/:userId', BasketController.getBasket);

module.exports = router;
