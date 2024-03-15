const mongoose = require('mongoose');
const Schema = mongoose.Schema


const chatSchema = new Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  response: {
    type: String,
    default:'',
    required: true
  },
  time: {
    type: String,
    required:true
  }
});



const chatModel = mongoose.model('chat', chatSchema)
module.exports = chatModel