require('dotenv').config()
// Import necessary modules
const chatModel = require('../Models/chatModel'); // Assuming you have a model for chat messages
const userModel = require('../Models/userModel')
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro"});

function fetchCurrentDate() {
  // Function to fetch the current date and time
  const getCurrentDate = () => {
    const currentDate = new Date();
    const monthNames = [
      "January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"
    ];
    const currentMonthIndex = currentDate.getMonth();
    const currentMonthName = monthNames[currentMonthIndex];
    const currentDay = currentDate.getDate();
    const currentYear = currentDate.getFullYear();

    // Get hours, minutes, and AM/PM indicator
    let hours = (currentDate.getHours() + 1) % 24; // Increment and wrap around within 24 hours
    const minutes = currentDate.getMinutes();
    const amPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 24-hour format to 12-hour format

    // Format time
    const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${amPm}`;

    // Combine date and time
    return `${currentMonthName} ${currentDay}, ${currentYear} At ${formattedTime}`;
  };

  // Return the getCurrentDate function
  return getCurrentDate;
}

// Get the function that fetches the current date and time
const getCurrentDate = fetchCurrentDate();

// Function to update the fullDate with the current date and time
const updateFullDate = () => {
  const fullDate = getCurrentDate(); // Get the current date and time
  console.log("Full Date:", fullDate); // Log the current date and time
  return fullDate; // Return the current date and time
};

// Call updateFullDate initially to get the current date and time
let fullDate = updateFullDate();

// Log the initial fullDate
console.log(fullDate);

// Set interval to call updateFullDate every minute
setInterval(() => {
  fullDate = updateFullDate(); // Update the fullDate with the current date and time
}, 60000); // 60000 milliseconds = 1 minute

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
      response: text,
      time:fullDate
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

