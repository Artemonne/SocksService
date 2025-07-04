const BasketService = require('../services/basket.service');
const formatResponse = require('../utils/formatResponse');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const { Basket } = require('../../db/models');
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

  //? продолжить
  static async postEmail(req, res) {
    const { orderData } = req.body;

    // Настройка транспорта (пример для Gmail)
    const transporter = nodemailer.createTransport({
      host: 'smtp.mail.ru',
      port: 465,
      secure: true,
      auth: {
        user: 'email',
        pass: 'password',
      },
    });

    const mailOptions = {
      from: 'your.email@gmail.com',
      to: 'office-socks@mail.ru', // куда отправлять заказ
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

  static async shareBasket(req, res) {
    try {
      const { items } = req.body;

      if (!items || items.length === 0) {
        return res.status(400).json({ message: 'Нет товаров для шаринга' });
      }

      // Для каждого товара генерируем уникальный cartId
      const sharedItems = items.map((item) => ({
        sockId: item.sockId,
        quantity: item.quantity,
        price: item.price,
        cartId: uuidv4(), // уникальный для каждого товара
      }));

      await Basket.bulkCreate(sharedItems);

      // Возвращаем массив cartId для восстановления корзины
      const cartIds = sharedItems.map((item) => item.cartId);

      res.json({ cartIds });
    } catch (error) {
      console.error('Ошибка в shareBasket:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  static async getSharedBasket(req, res) {
    try {
      const { cartIds } = req.body; // массив cartId

      if (!cartIds || cartIds.length === 0) {
        return res.status(400).json({ message: 'cartIds не переданы' });
      }

      const items = await Basket.findAll({
        where: { cartId: cartIds },
      });

      const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      res.json({ items, total });
    } catch (error) {
      console.error('Ошибка в getSharedBasket:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }
}

module.exports = BasketController;
