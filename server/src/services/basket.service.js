const { Basket, Sock } = require('../../db/models');

class BasketService {
  async addToBasket(userId, sockId, price) {
    const item = await Basket.findOne({ where: { userId, sockId } });
    if (item) {
      item.quantity += 1;
      await item.save();
      return item;
    } else {
      // Получаем цену из socks, если не передана явно
      if (!price) {
        const sock = await Sock.findByPk(sockId);
        price = sock ? sock.price : 0; // Добавьте поле price в socks!
      }
      const newItem = await Basket.create({ userId, sockId, quantity: 1, price });
      return newItem;
    }
  }

  async updateQuantity(userId, sockId, quantity) {
    const item = await Basket.findOne({ where: { userId, sockId } });
    if (item) {
      item.quantity = quantity;
      await item.save();
      return item;
    }
    throw new Error('Товар не найден в корзине');
  }

  async getBasket(userId) {
    const items = await Basket.findAll({
      where: { userId },
      include: [{ model: Sock }]
    });
    // Считаем общую сумму
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return { items, total };
  }
}

module.exports = BasketService
