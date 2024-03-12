require('dotenv').config()
// Import necessary modules
const chatModel = require('../Models/chatModel'); // Assuming you have a model for chat messages
const userModel = require('../Models/userModel')
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);



const newChatUser = async (req, res) => {
  try {
    const patient = req.user._id
    const user = await userModel.findOne({ _id: patient });
    if (!user) {
      res.status(404).json('no user with this account exists')
    }
    else {
      const model = genAI.getGenerativeModel({ model: "gemini-pro"});
      const prompt = req.body.question
      const result = await model.generateContent(prompt);
      const response =  result.response;
      const text =  response.text();
      return  res.status(200).json(text)
      const newChat = new chatModel({
        sender: patient,
        question,
        response:text
      })
      newChat.save()
    }
  } catch (error) {
    res.status(429).json('an error occured')
    console.log(error)
  }
}
   

const allChatsUser = async(req, res) => {
  try {
    const userId = req.user._id
    if (!userId) {
      res.status(404).json('you are not authorised to access this')
    }
    else {
      const allChatUser = await chatModel.find({ sender: userId })
      if (!allChatUser) {
        res.status(404).json('no chat exists for this user')
      }
      else {
        res.status(200).json(allChatUser)
      }
    }
  } catch (error) {
    console.log(error)
  }
}


module.exports = {newChatUser, allChatsUser}

