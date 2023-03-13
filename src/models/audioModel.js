const {Schema, model} = require('mongoose'), {v4} = require('uuid')

const Audio = model('Audio', new Schema({
  _id: {type: String, default: v4},
  user: {type: Number, ref: 'User'},
  renown: {type: String, ref: 'Renown'},
  poem: {type: String, ref: 'Poem'},
  son_name: {type: String, default: ''},
  type: {type: String, enum: ['OTA', 'ONA', 'AKA', 'OPA', 'UKA', 'SINGIL'], default: ''},
  music: {type: String, ref: 'Music'},
  file: {type: String, default: ''},
  step: {type: Number, default: 0},
  status: {type: String, enum: ['process', 'active', 'inactive', 'finishing', 'finished'], default: 'active'},
  created_at: {type: Date, default: Date.now()}
}))

module.exports = Audio
