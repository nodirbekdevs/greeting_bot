const {Schema, model} = require('mongoose'), {v4} = require('uuid')

const Felicitation = model('Felicitation', new Schema({
  _id: {type: String, default: v4},
  author: {type: Number, ref: 'Admin', required: true},
  type: {type: String, enum: ['', 'OTA', 'ONA', 'AKA', 'OPA', 'UKA', 'SINGIL'], default: ''},
  title: {type: String, default: ''},
  content: {type: String, default: ''},
  file: {type: String, default: ''},
  total_audios: {type: Number, default: 0},
  step: {type: Number, default: 0},
  status: {type: String, enum: ['process', 'inactive', 'active'], default: 'process'}
}, {timestamps: true}))

module.exports = Felicitation
