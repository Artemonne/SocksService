const SockService = require('../services/Sock.service');
const formatResponse = require('../utils/formatResponse');

class SockController {

    //* Получение всех вариантов для генератора
  static async getOptions(req, res) {
    try {
      const options = await SockService.getGeneratorOptions();
      res.status(200).json(formatResponse(200, 'Варианты для генератора', options));
    } catch (error) {
      console.error('Ошибка при получении вариантов:', error);
      res.status(500).json(
        formatResponse(500, 'Ошибка при получении вариантов', null, error.message)
      );
    }
  }

  //* Сохранение нового дизайна носков
  
  static async saveSock(req, res) {
    try {
      //* Валидация
      const { color, pattern, image, genImage } = req.body;
      if (!color || !pattern || !image || !genImage) {
        return res.status(400).json(
          formatResponse(400, 'Не все обязательные поля заполнены')
        );
      }

      const sock = await SockService.saveGeneratedSock({ color, pattern, image, genImage });
      res.status(201).json(formatResponse(201, 'Дизайн сохранен', sock));
    } catch (error) {
      console.error('Ошибка при сохранении дизайна:', error);
      res.status(500).json(
        formatResponse(500, 'Ошибка при сохранении дизайна', null, error.message)
      );
    }
  }

   //* Получение носка по ID
   
  static async getSock(req, res) {
    try {
      const { id } = req.params;
      if (isNaN(id)) {
        return res.status(400).json(
          formatResponse(400, 'Некорректный ID дизайна')
        );
      }

      const sock = await SockService.getSockById(Number(id));
      if (!sock) {
        return res.status(404).json(
          formatResponse(404, 'Дизайн не найден')
        );
      }

      res.status(200).json(formatResponse(200, 'Дизайн носка', sock));
    } catch (error) {
      console.error('Ошибка при получении дизайна:', error);
      res.status(500).json(
        formatResponse(500, 'Ошибка при получении дизайна', null, error.message)
      );
    }
  }
}

module.exports = SockController;