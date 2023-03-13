const {Schema, model} = require('mongoose');

const Payment = model('Payment', new Schema({
  user: {type: String, ref: 'User', required: true},
  amount: {type: Number, default: 0},
  paymentMethod: {type: String, enum: ['credit_card', 'paypal', 'stripe'], default: ''},
  paymentId: {type: String, required: true},
  status: {type: String, enum: ['pending', 'completed', 'failed'], default: 'pending'}
}, {timestamps: true}));

module.exports = Payment;
