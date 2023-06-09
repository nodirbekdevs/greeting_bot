const {Schema, model} = require('mongoose'), {v4} = require('uuid')

const Admin = model('Admin', new Schema({
  _id: {type: String, default: v4},
  telegram_id: {type: Number, unique: true, required: true},
  name: {type: String, default: ''},
  username: {type: String, default: ''},
  number: {type: String, default: ''},
  situation: {type: String, default: ''},
  total_poems: {type: Number, default: 0},
  total_renowns: {type: Number, default: 0},
  total_felicitations: {type: Number, default: 0},
  total_musics: {type: Number, default: 0},
  total_audios: {type: Number, default: 0},
  total_advertisements: {type: Number, default: 0},
  step: {type: Number, default: 0},
  status: {type: String, enum: ['active', 'inactive'], default: 'active'}
}, {timestamps: true}))

module.exports = Admin
