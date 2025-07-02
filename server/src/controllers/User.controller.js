const bcrypt = require('bcrypt');
const UserService = require('../services/User.service');
const formatResponse = require('../utils/formatResponse');
const jwt = require('jsonwebtoken');
const generateJWTTokens = require('../utils/generateJWTTokens');
const cookieConfig = require('../configs/cookieConfig');
const { User } = require('../../db/models');

class UserController {
  static async refreshTokens(req, res) {
    try {
      const { refreshToken } = req.cookies;
      const { user } = jwt.verify(
        refreshToken,
        process.env.SECRET_REFRESH_TOKEN
      );

      const { accessToken, refreshToken: newRefreshToken } = generateJWTTokens({
        user,
      });
      return res
        .status(200)
        .cookie('refreshToken', newRefreshToken, cookieConfig)
        .json(
          formatResponse(200, 'Успешно продлена пользовательская сессия', {
            user,
            accessToken,
          })
        );
    } catch ({ message }) {
      console.log(
        '=============UserController.refreshTokens=============',
        message
      );
      res
        .status(401)
        .json(formatResponse(401, 'Invalid refreshToken', null, message));
    }
  }

  static async signUp(req, res) {
    const { email, name, password } = req.body;

    const { isValid, error } = User.validateSignUpData({
      email,
      name,
      password,
    });

    if (!isValid) {
      return res
        .status(400)
        .json(formatResponse(400, 'Validation error', null, error));
    }

    const normalizedEmail = email.toLowerCase();
    try {
      const userFound = await UserService.getByEmail(normalizedEmail);

      if (userFound) {
        return res
          .status(400)
          .json(
            formatResponse(
              400,
              'Пользователь с таким email уже существует',
              null,
              'Пользователь с таким email уже существует'
            )
          );
      }

      const newUser = await UserService.create({
        email,
        name,
        password,
      });

      if (!newUser) {
        return res
          .status(500)
          .json(
            formatResponse(
              500,
              'Не удалось создать нового пользователя',
              null,
              'Не удалось создать нового пользователя'
            )
          );
      }

      const { accessToken, refreshToken } = generateJWTTokens({
        user: newUser,
      });

      return res
        .status(201)
        .cookie('refreshToken', refreshToken, cookieConfig)
        .json(
          formatResponse(201, 'Успешная регистрация', {
            user: newUser,
            accessToken,
          })
        );
    } catch ({ message }) {
      console.log('=============UserController.signUp=============', message);
      res
        .status(500)
        .json(formatResponse(500, 'Внутренняя ошибка сервера', null, message));
    }
  }

  static async signIn(req, res) {
    const { email, password } = req.body;

    const { isValid, error } = User.validateSignInData({
      email,
      password,
    });

    if (!isValid) {
      return res
        .status(400)
        .json(formatResponse(400, 'Validation error', null, error));
    }

    const normalizedEmail = email.toLowerCase();
    try {
      const userFound = await UserService.getByEmail(normalizedEmail);

      if (!userFound) {
        return res
          .status(400)
          .json(
            formatResponse(
              400,
              'Пользователь с таким email не найден',
              null,
              'Пользователь с таким email не найден'
            )
          );
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        userFound.password
      );

      if (!isPasswordValid) {
        return res
          .status(400)
          .json(
            formatResponse(400, 'Неверный пароль', null, 'Неверный пароль')
          );
      }

      delete userFound.password;

      const { accessToken, refreshToken } = generateJWTTokens({
        user: userFound,
      });

      return res
        .status(200)
        .cookie('refreshToken', refreshToken, cookieConfig)
        .json(
          formatResponse(200, 'Успешный вход', { user: userFound, accessToken })
        );
    } catch ({ message }) {
      console.log('=============UserController.signIn=============', message);
      res
        .status(500)
        .json(formatResponse(500, 'Внутренняя ошибка сервера', null, message));
    }
  }

  static signOut(req, res) {
    try {
      res
        .clearCookie('refreshToken')
        .json(formatResponse(200, 'Успешно вышли'));
    } catch ({ message }) {
      console.log('=============UserController.signOut=============', message);
      res
        .status(500)
        .json(formatResponse(500, 'Внутренняя ошибка сервера', null, message));
    }
  }
}
module.exports = UserController;
