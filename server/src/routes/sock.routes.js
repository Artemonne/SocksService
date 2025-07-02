const router = require('express').Router();
const SockController = require('../controllers/Sock.controller');

router
  .get('/options', SockController.getOptions)
  .post('/', SockController.saveSock)
  .get('/:id', SockController.getSock);

module.exports = router;