const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
  username: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  type: {
    type: String,
    require: true
  },
  avatar: String,
  desc: String,
  title: String,
  company: String,
  salary: String
})

module.exports = mongoose.model('user', userSchema)
