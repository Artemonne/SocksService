const { v4: uuidv4 } = require('uuid'); // Если генерируете на сервере
const { Basket } = require('../../db/models');

class CartController {
  static getOrCreateCartIdForSession(req, res) {
    let cartId = req.cookies.cartId; // Пытаемся получить из куки
    if (!cartId) {
      cartId = uuidv4(); // Генерируем новый UUID
      res.cookie('cartId', cartId, { maxAge: 900000, httpOnly: false }); // Устанавливаем куку
    }
    return cartId;
  }

  static async addOrUpdateCartItem(req, res) {
    const { sockId, quantity, price } = req.body;
    const userId = req.user?.id || null; // Если пользователь авторизован
    const cartId = userId ? null : this.getOrCreateCartIdForSession(req, res); // Используем cartId только для анонимных

    try {
      let item;
      if (userId) {
        // Для авторизованного пользователя ищем по userId и sockId
        // Или обновляем существующую корзину пользователя
        item = await Basket.findOne({ where: { userId, sockId } });
        if (item) {
          item.quantity += quantity;
          await item.save();
        } else {
          item = await Basket.create({ userId, sockId, quantity, price });
        }
      } else {
        // Для анонимного пользователя ищем по cartId и sockId
        item = await Basket.findOne({ where: { cartId, sockId } });
        if (item) {
          item.quantity += quantity;
          await item.save();
        } else {
          item = await Basket.create({ cartId, sockId, quantity, price });
        }
      }
      res.status(200).json({ message: 'Товар добавлен/обновлен в корзине' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  }

  static async getCart(req, res) {
    const userId = req.user?.id || null;
    const cartId = userId ? null : req.cookies.cartId; // Получаем cartId из куки для анонимов

    try {
      let items;
      if (userId) {
        items = await Basket.findAll({ where: { userId } });
      } else if (cartId) {
        items = await Basket.findAll({ where: { cartId } });
      } else {
        items = []; // Пустая корзина, если нет ни пользователя, ни cartId
      }
      res.status(200).json({
        items,
        total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  }
}

module.exports = CartController;
