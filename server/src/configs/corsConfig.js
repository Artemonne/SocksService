const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.CLIENT_URL,
  process.env.URL,
  process.env.DEPLOY_PRIME_URL,
].filter(Boolean);

module.exports = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },

  optionsSuccessStatus: 200,

  credentials: true,
};
