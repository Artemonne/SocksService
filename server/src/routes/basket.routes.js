const router = require('express').Router();
const BasketController = require('../controllers/BasketController');
const CartController = require('../controllers/CartController');

router
  .post('/', BasketController.addToBasket)
  .put('/quantity', BasketController.updateQuantity)
  .get('/:userId', BasketController.getBasket)
  .post('/share', BasketController.shareBasket)
  .post('/share/get', BasketController.getSharedBasket)
  .post('/cart/item', CartController.addOrUpdateCartItem)
  .get('/cart', CartController.getCart)
  .get('/cart/init', (req, res) => {
    const cartId = CartController.getOrCreateCartIdForSession(req, res);
    res.json({ cartId });
  });

module.exports = router;
