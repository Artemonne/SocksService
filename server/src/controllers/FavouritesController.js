const { Favourite, Sock } = require('../../db/models');
const formatResponse = require('../utils/formatResponse');

class FavouritesController {
  static async addFavourite(req, res) {
    try {
      const { userId, sockId } = req.body;


      // Проверяем, существует ли уже такая запись
      const existingFavourite = await Favourite.findOne({
        where: { userId, sockId },
      });

      if (existingFavourite) {
        return res
          .status(400)
          .json(
            formatResponse(400, 'Носки уже в избранном', existingFavourite)
          );
      }

      const favourite = await Favourite.create({ userId, sockId });
      res
        .status(201)
        .json(formatResponse(201, 'Носки добавлены в избранное', favourite));
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json(
          formatResponse(
            500,
            'Ошибка при добавлении в избранное',
            error.message
          )
        );
    }
  }

  static async removeFavourite(req, res) {
    try {
      const { userId } = req.body;

      const { sockId } = req.params;

      await Favourite.destroy({ where: { userId: userId, sockId: sockId } });
      res
        .status(200)
        .json(formatResponse(200, 'Носки удалены из избранного', null));
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json(
          formatResponse(
            500,
            'Ошибка при удалении из избранного',
            error.message
          )
        );
    }
  }

  static async getFavourites(req, res) {
    try {
      const { userId } = req.params;
      const favourites = await Favourite.findAll({
        where: { userId: userId },
        include: [Sock],
      });

      res.status(200).json(
        formatResponse(
          200,
          'Избранные носки получены',
          favourites.map((fav) => fav.Sock)
        )
      );
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json(
          formatResponse(
            500,
            'Ошибка при получении избранных носочков',
            error.message
          )
        );
    }
  }
}
module.exports = FavouritesController;
