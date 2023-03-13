const {mongo} = require('./config'), {connect} = require('mongoose')

const db = connect(mongo.mongo_url, mongo.options)
  .then(() => {
    console.log('To MongoDb has connected ...')
  })
  .catch((err) => {
    console.log(`To MongoDb has not connected and problem has kept ${err}`)
  })


module.exports = db
