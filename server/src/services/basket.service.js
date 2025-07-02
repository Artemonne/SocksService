const { Basket, Sock } = require('../../db/models');

class BasketService {
  static async addToBasket(userId, sockId) {
    const item = await Basket.findOne({ where: { userId, sockId } });
    if (item) {
      item.quantity += 1;
      await item.save();
      return item;
    } else {
      // Всегда берём цену из Sock
      const sock = await Sock.findByPk(sockId);
      const price = sock ? sock.price : 0;
      const newItem = await Basket.create({
        userId,
        sockId,
        quantity: 1,
        price,
      });
      return newItem;
    }
  }

  static async updateQuantity(userId, sockId, quantity) {
    const item = await Basket.findOne({ where: { userId, sockId } });
    if (item) {
      if (quantity <= 0) {
        await item.destroy();
        return null;
      }
      item.quantity = quantity;
      await item.save();
      return item;
    }
    throw new Error('Товар не найден в корзине');
  }

  static async getBasket(userId) {
    const items = await Basket.findAll({
      where: { userId },
      include: [{ model: Sock }],
    });
    // Считаем общую сумму
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return { items, total };
  }
}

module.exports = BasketService;
