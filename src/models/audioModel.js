const {Schema, model} = require('mongoose'), {v4} = require('uuid')

const Audio = model('Audio', new Schema({
  _id: {type: String, default: v4},
  author: {type: Number, ref: 'User'},
  poem: {type: String, ref: 'Poem', default: ''},
  renown: {type: String, ref: 'Renown', default: ''},
  felicitation: {type: String, ref: 'Felicitation', default: ''},
  son_name: {type: String, default: ''},
  type: {type: String, enum: ['', 'OTA', 'ONA', 'AKA', 'OPA', 'UKA', 'SINGIL'], default: ''},
  music: {type: String, ref: 'Music'},
  file: {type: String, default: ''},
  step: {type: Number, default: 0},
  status: {type: String, enum: ['process', 'active', 'inactive', 'finishing', 'finished'], default: 'process'},
}, {timestamps: true}))

module.exports = Audio
