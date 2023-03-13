require('dotenv').config()

module.exports = {
  TOKEN: process.env.TOKEN,

  mongo: {
    options: {
      useNewUrlParser: process.env.useNewUrlParser,
      useUnifiedTopology: process.env.useUnifiedTopology,
      serverSelectionTimeoutMS: process.env.serverSelectionTimeoutMS
    },
    mongo_url: process.env.mongo_url,
  },
}
