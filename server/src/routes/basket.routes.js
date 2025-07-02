const router = require('express').Router();
const BasketController = require('../controllers/BasketController');

router
  .post('/', BasketController.addToBasket)
  .put('/quantity', BasketController.updateQuantity)
  .get('/:userId', BasketController.getBasket)
    //? продолжить
  .post('/send-order', BasketController.postEmail)

module.exports = router;
