const BasketService = require('../services/basket.service');
const formatResponse = require('../utils/formatResponse');
const nodemailer = require('nodemailer');

class BasketController {
  static async addToBasket(req, res) {
    const { userId, sockId, price } = req.body;
    try {
      const item = await BasketService.addToBasket(userId, sockId, price);
      res
        .status(201)
        .json(formatResponse(200, 'Носки добавлены в корзину', item));
    } catch (error) {
      console.log(error);

      res
        .status(500)
        .json(
          formatResponse(
            500,
            'Не удалось добавить носки в корзину в контроллере',
            null,
            error.message
          )
        );
    }
  }

  static async updateQuantity(req, res) {
    const { userId, sockId, quantity } = req.body;
    try {
      const item = await BasketService.updateQuantity(userId, sockId, quantity);
      res.status(200).json(formatResponse(200, 'Носки обновлены', item));
    } catch (error) {
      console.log(error);
      res
        .status(404)
        .json(
          formatResponse(
            404,
            'Не удалось обновить в контроллере',
            null,
            error.message
          )
        );
    }
  }

  static async getBasket(req, res) {
    const { userId } = req.params;
    try {
      const basket = await BasketService.getBasket(userId);
      res
        .status(200)
        .json(formatResponse(200, 'Все носки одного в корзине', basket));
    } catch (error) {
      console.log(error);

      res
        .status(500)
        .json(
          formatResponse(
            500,
            'Не удалось найти все носки одного юзера в корзине в контроллере',
            null,
            error.message
          )
        );
    }
  }

  static async postEmail(req, res) {
    const orderData = req.body;

    // Настройка транспорта (пример для Gmail)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your.email@gmail.com',
        pass: 'your_app_password',
      },
    });

    const mailOptions = {
      from: 'your.email@gmail.com',
      to: '79111533013@mail.ru', // куда отправлять заказ
      subject: 'Новый заказ',
      text: JSON.stringify(orderData, null, 2), // или форматированный текст
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Заказ отправлен' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка при отправке письма' });
    }
  }
}

module.exports = BasketController;
