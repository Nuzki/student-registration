const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: { type: String, required: true, match: /^[A-Za-z]+$/ },
  lastName: { type: String, required: true, match: /^[A-Za-z]+$/ },
  email: { type: String, required: true, unique: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  password: { type: String, required: true },
  age: { type: Number, required: true, min: 19 },
  address: { type: String, required: true, unique: true },
  marks: { type: Schema.Types.Mixed },
  profilePic: String,
  role: { type: String, enum: ['student', 'teacher'], required: true },
});

module.exports = mongoose.model('User', userSchema);