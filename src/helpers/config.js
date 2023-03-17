require('dotenv').config()

module.exports = {
  TOKEN: process.env.TOKEN,
  admin_id: process.env.admin_id,
  ffmpeg_path: process.env.ffmpeg_path,
  ffprobe_path: process.env.ffprobe_path,
  mongo: {
    options: {
      useNewUrlParser: process.env.useNewUrlParser,
      useUnifiedTopology: process.env.useUnifiedTopology,
      serverSelectionTimeoutMS: process.env.serverSelectionTimeoutMS
    },
    mongo_url: process.env.mongo_url,
  }
}
