const { Sock } = require('../../db/models');
const { Sequelize } = require('sequelize');

class SockService {
  
  static async getGeneratorOptions() {
      
      //* Используем Sequelize.fn для DISTINCT и Sequelize.col для указания колонки
      //*DISTINCT - это SQL-оператор для получения уникальных значений из колонки. Например: SELECT DISTINCT color FROM socks;
    const colors = await Sock.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('color')), 'color']],
      raw: true //? Возвращаем простые объекты вместо экземпляров модели
    });

    const patterns = await Sock.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('pattern')), 'pattern']],
      raw: true
    });

    const images = await Sock.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('image')), 'image']],
      raw: true
    });

    //? Преобразуем результат в массив значений

    return {
      colors: colors.map(item => item.color),
      patterns: patterns.map(item => item.pattern),
      images: images.map(item => item.image)
    };
  }
//*сохранение сгенерированного гавноНоска
  static async saveGeneratedSock({ color, pattern, image, genImage }) {
    return await Sock.create({
      color,
      pattern,
      image,
      genImage,
      price: 1000 //* Пример фиксированной цены, можно сделать динамической
    });
  }

  static async getSockById(id) {
    return await Sock.findByPk(id);
  }
}

module.exports = SockService;