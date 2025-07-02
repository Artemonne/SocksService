const UserService = require('../services/User.service');
const isValidId = require('../utils/isValid');
const UserValidator = require('../utils/UserValidator');
const formatResponse = require('../utils/formatResponse');

class UserController {
  static async getAllUsers(req, res) {
    try {
      const user = await UserService.getAll();

      if (user.length === 0) {
        return res.status(200).json(formatResponse(200, 'No user found', []));
      }

      res.status(200).json(formatResponse(200, 'success', user));
    } catch ({message}) {
      console.error(message);
      res
        .status(500)
        .json(formatResponse(500, 'Internal server error', null, message));
    }
  }

  static async getUserById(req, res) {
    const {id} = req.params;

    if (!isValidId(id)) {
      return res.status(400).json(formatResponse(400, 'Invalid task ID'));
    }

    try {
      const user = await UserService.getUser(+id);

      if (!user) {
        return res
          .status(404)
          .json(formatResponse(404, `user with id ${id} not found`));
      }

      res.status(200).json(formatResponse(200, 'success', user));
    } catch ({message}) {
      console.error(message);
      res
        .status(500)
        .json(formatResponse(500, 'Internal server error', null, message));
    }
  }

  static async createUser(req, res) {
    const {name, email, password} = req.body;

    const {isValid, error} = UserValidator.validate({
      name,
      email,
      password,
    });
    if (!isValid) {
      return res
        .status(400)
        .json(formatResponse(400, 'Validation error', null, error));
    }

    try {
      const newUser = await UserService.createUser({
        name,
        email,
        password,
      });

      if (!newUser) {
        return res
          .status(400)
          .json(formatResponse(400, `Failed to create new user`));
      }

      delete newUser.password;
      res.status(201).json(formatResponse(201, 'success', newUser));
    } catch ({message}) {
      console.error(message);
      res
        .status(500)
        .json(formatResponse(500, 'Internal server error', null, message));
    }
  }

  static async updateUser(req, res) {
    const { id } = req.params;
    const {name, email, password} = req.body;

    if (!isValidId(id)) {
      return res.status(400).json(formatResponse(400, 'Invalid task ID'));
    }

    const {isValid, error} = UserValidator.validate({
      name,
      email,
      password,
    });
    if (!isValid) {
      return res
        .status(400)
        .json(formatResponse(400, 'Validation error', null, error));
    }

    try {
      const updatedUser = await UserService.updateUser(+id, {
        name,
        email,
        password,
      });

      if (!updatedUser) {
        return res
          .status(404)
          .json(formatResponse(404, `User with id ${id} not found`));
      }

      delete updatedUser.password;
      res.status(201).json(formatResponse(201, 'success', updatedUser));
    } catch ({message}) {
      console.error(message);
      res
        .status(500)
        .json(formatResponse(500, 'Internal server error', null, message));
    }
  }

  static async deleteUser(req, res) {
    const {id} = req.params;

    if (!isValidId(id)) {
      return res.status(400).json(formatResponse(400, 'Invalid task ID'));
    }

    try {
      const deletedUser = await UserService.deleteUser(+id);

      if (!deletedUser) {
        return res
          .status(404)
          .json(formatResponse(404, `User with id ${id} not found`));
      }

      res
        .status(200)
        .json(formatResponse(200, `User with id ${id} successfully deleted`));
    } catch ({message}) {
      console.error(message);
      res
        .status(500)
        .json(formatResponse(500, 'Internal server error', null, message));
    }
  }
}

module.exports = UserController;
