const { sendOrderMail } = require('../services/order.service');
const formatResponse = require('../utils/formatResponse');

class OrderController {
  static async createOrder(req, res) {
    try {
      await sendOrderMail(req.body);
      res.status(200).json(formatResponse(200, 'Заказ успешно отправлен!'));
    } catch (error) {
      res
        .status(500)
        .json(
          formatResponse(500, 'Ошибка при отправке заказа', null, error.message)
        );
    }
  }
}

module.exports = OrderController
