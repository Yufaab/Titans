require('dotenv').config();

module.exports = {
  port: process.env.PORT,
  mongouri: process.env.MONGOURI,
};
