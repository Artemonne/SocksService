const path = require('path'); 
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const express = require('express');
const serverConfig = require('./configs/serverConfig');
const indexRouter = require('./routes/index.routes');

const app = express();

serverConfig(app);

const PORT = process.env.PORT || 3001;
app.use('/api', indexRouter);

if (process.env.NETLIFY) {
  app.use('/', indexRouter);
}

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}

module.exports = app;
