const {Schema, model} = require('mongoose'), {v4} = require('uuid')

const Audio = model('Audio', new Schema({
  _id: {type: String, default: v4},
  author: {type: Number, ref: 'User'},
  type: {type: String, enum: ['', 'OTA', 'ONA', 'AKA', 'OPA', 'UKA', 'SINGIL'], default: ''},
  renown: {type: String, ref: 'Renown', default: ''},
  son_name: {type: String, ref: 'Renown', default: ''},
  poem: {type: String, ref: 'Poem', default: ''},
  felicitation: {type: String, ref: 'Felicitation', default: ''},
  music: {type: String, ref: 'Music'},
  name: {type: String, default: ''},
  content: {type: String, default: ''},
  file: {type: String, default: ''},
  step: {type: Number, default: 0},
  status: {type: String, enum: ['process', 'active', 'inactive'], default: 'process'},
}, {timestamps: true}))

module.exports = Audio
