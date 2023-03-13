const {Schema, model} = require('mongoose'), {v4} = require('uuid')
const kb = require('./../helpers/keyboard-buttons')

const User = model('User', new Schema({
  _id: {type: String, default: v4},
  telegram_id: {type: Number, unique: true, required: true},
  name: {type: String, default: ''},
  username: {type: String, default: ''},
  number: {type: String, default: ''},
  total_audios: {type: Number, default: 0},
  lang: {type: String, enum: ['', kb.language.uz, kb.language.ru], default: ''},
  step: {type: Number, default: 0},
  status: {type: String, enum: ['active', 'inactive'], default: 'active'},
  created_at: {type: Date, default: Date.now()}
}))

module.exports = User
