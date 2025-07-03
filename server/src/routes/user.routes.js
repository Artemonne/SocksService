const authRouter = require('express').Router();
const UserController = require('../controllers/User.controller');
const verifyAccessToken = require('../middlewares/verifyAccessToken');

authRouter
  .get('/refreshTokens', UserController.refreshTokens)
  .post('/signUp', UserController.signUp)
  .post('/signIn', UserController.signIn)
  .get('/signOut', UserController.signOut)
  .get('/me', verifyAccessToken, UserController.getMe)

module.exports = authRouter;