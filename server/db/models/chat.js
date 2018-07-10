const mongoose = require('mongoose')

const Schema = mongoose.Schema

const chatSchema = new Schema({
  chatId: {
    type: String,
    require: true
  },
  from: {
    type: String,
    require: true
  },
  to: {
    type: String,
    require: true
  },
  isRead: {
    type: Boolean,
    require: true,
    default: false
  },
  content: {
    type: String,
    require: true,
    default: ''
  },
  create_time: {
    type: Number,
    default: Date.now
  }
})

module.exports = mongoose.model('chat', chatSchema)
