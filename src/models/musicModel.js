const {Schema, model} = require('mongoose'), {v4} = require('uuid')

const Music = model('Music', new Schema({
  _id: {type: String, default: v4},
  author: {type: Number, ref: 'Admin', required: true},
  type: {type: String, default: ''},
  name: {type: String, default: ''},
  file: {type: String, default: ''},
  total_audios: {type: Number, default: 0},
  step: {type: Number, default: 0},
  status: {type: String, enum: ['process', 'inactive', 'active'], default: 'process'},
  updated_at: {type: Date},
  created_at: {type: Date, default: Date.now}
}))

module.exports = Music