const jwtConfig = {
  access: {
    expiresIn: 1000 * 60 * 3, // время жизни access токена // 3 минуты
  },
  refresh: {
    expiresIn: 1000 * 60 * 60 * 24, // время жизни refresh токена // 24 часа
  },
};

module.exports = jwtConfig;