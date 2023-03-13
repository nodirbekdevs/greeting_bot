const {Schema, model} = require('mongoose'), {v4} = require('uuid')

const Feedback = model('Feedback', new Schema({
  _id: {type: String, default: v4},
  author: {type: Number, ref: 'User', required: true},
  mark: {type: String, default: ''},
  reason: {type: String, default: ''},
  is_read: {type: Boolean, default: false},
  step: {type: Number, default: 0},
  status: {type: String, enum: ['process', 'inactive', 'active', 'seen', 'done'], default: 'process'},
  created_at: {type: Date, default: Date.now}
}))

module.exports = Feedback
