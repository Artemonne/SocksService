const authRouter = require('express').Router();
const UserController = require('../controllers/User.controller');

authRouter
  .get('/refreshTokens', UserController.refreshTokens)
  .post('/signUp', UserController.signUp)
  .post('/signIn', UserController.signIn)
  .get('/signOut', UserController.signOut);

module.exports = authRouter;