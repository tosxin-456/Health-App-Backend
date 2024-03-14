const mongoose = require('mongoose');
const Schema = mongoose.Schema


const profileSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  avatar: {
    type:String,
    default:'https://res.cloudinary.com/dba1aezsn/image/upload/v1707492360/Google_h25khv.jpg'
  },
  number: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  height: {
    type: String,
    default:" ",
    required: true
  },  
  weight: {
    type: String,
    default:" ",
    required: true
  },  
  medicalConditions: {
    type: String,
    default:" ",
    required: true
  },
  alergies: {
    type: String,
    default:" ",
    required: true
  },
  verified: {
    type: Boolean,
    default:false
  },
  theme: {
    type: String,
    default: 'light',
    enum:['light', 'dark'],
    required: true
  }
});



const profileModel = mongoose.model('Profiles', profileSchema)
module.exports = profileModel