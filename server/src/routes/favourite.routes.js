const router = require('express').Router();
const FavouritesController = require('../controllers/FavouritesController');

router
  .post('/', FavouritesController.addFavourite)
  .delete('/:sockId', FavouritesController.removeFavourite)
  .get('/:userId', FavouritesController.getFavourites);

module.exports = router;
