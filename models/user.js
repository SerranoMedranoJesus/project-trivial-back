const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema ({
  name: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  logged_at: {type: Date, required: false},
  correct: {type: Number, default: 0},
  failed: {type: Number, default: 0},
  games: {type: Number, default: 0},
  }, {
    timestamps: { createdAt: 'created_at'}
  }
);

let UserModel = mongoose.model('User', userSchema);

module.exports = UserModel