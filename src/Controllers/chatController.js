require('dotenv').config()
// Import necessary modules
const chatModel = require('../Models/chatModel'); // Assuming you have a model for chat messages
const userModel = require('../Models/userModel')
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro"});



const newChatUser = async (req, res) => {
  try {
    const patient = req.user._id
    const user = await userModel.findOne({ _id: patient });
    if (!user) {
      return res.status(404).json('No user with this account exists');
    }
    
    
    const prompt = req.body.question
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const newChat = new chatModel({
      sender: patient,
      question: prompt, // Assuming 'question' should be set to the prompt
      response: text
    });
    await newChat.save(); // Save the new chat message

    return res.status(200).json(text); // Send the generated text in the response
  } catch (error) {
    console.error(error);
    return res.status(500).json('An error occurred');
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

