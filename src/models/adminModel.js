const {Schema, model} = require('mongoose'), {v4} = require('uuid')

const Admin = model('Admin', new Schema({
  _id: {type: String, default: v4},
  telegram_id: {type: Number, unique: true, required: true},
  name: {type: String, default: ''},
  username: {type: String, default: ''},
  number: {type: String, default: ''},
  step: {type: Number, default: 0},
  status: {type: String, enum: ['active', 'inactive'], default: 'active'},
  created_at: {type: Date, default: Date.now()}
}))

module.exports = Admin
