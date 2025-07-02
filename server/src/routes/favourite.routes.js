const router = require('express').Router();
const FavouritesController = require('../controllers/FavouritesController');

router
  .post('/:sockId', FavouritesController.addFavourite)
  .delete('/:sockId', FavouritesController.removeFavourite)
  .get('/:userId', FavouritesController.getFavourites);

module.exports = router;
