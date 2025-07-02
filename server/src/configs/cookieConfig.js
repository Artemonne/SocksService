const jwtConfig = require("./jwtConfig");

const cookieConfig = {
  access: {
    maxAge: jwtConfig.access.expiresIn, // Время жизни access-токена в cookie
    httpOnly: true,                     // Cookie нельзя прочитать через JavaScript (защита от XSS)
  },
  refresh: {
    maxAge: jwtConfig.refresh.expiresIn, // Время жизни refresh-токена в cookie
    httpOnly: true,                      // То же самое — безопаснее
  },
};

module.exports = cookieConfig;