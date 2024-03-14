require('dotenv').config()
const userModel = require('../Models/userModel')
const currentDate = new Date();
const cryptoHash = require('node:crypto')
const jwt = require('jsonwebtoken')
const profileModel = require('../Models/profileModel')



let month = currentDate.getMonth() + 1;
if (month > 12) {
  month = 1;
}
if (month < 10) {
  month = "0" + month;
}
let year = currentDate.getFullYear();
let date = currentDate.getDate();
const fullDate = `${date}/${month}/${year}`;


function displayTime() {
  const currentDate = new Date();
  let hour = currentDate.getHours();
  if (hour < 10) {
    hour = "0" + hour;
  }
  let minute = currentDate.getMinutes();
  let AmorPm = hour < 12 ? "AM" : "PM";
  if (minute < 10) {
    minute = "0" + minute;
  }
  const full_time = `${hour + 1}:${minute} ${AmorPm}`;
  return { full_time };
}

setInterval(function() {
  const { full_time } = displayTime();
  // console.log(full_time);
},10000);

const fullTime = displayTime().full_time

function generateRandomNumber(digits) {
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function hashValue(value) {
  const hash = cryptoHash.createHash("sha256");
  hash.update(value);
  return hash.digest("base64");
}

const register = async (req, res) => {
  // const result = validator.registerValidator.safeParse(req.body)
  // if(!result.success){
  // return res.status(401).json(formatZodError(result.error.issues))
  // }
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (user) {
      res.status(409).json({ message: 'user account already exists.' });
    } else {
      const password = req.body.password 
      const passwordMatched = await hashValue( password )
      const number = req.body.number
      const name = req.body.name;
      const email = req.body.email;
      const gender = req.body.gender
      const role = req.body.role
      const age = req.body.age
      const firstLetter = name.charAt(0).toUpperCase();
      const lastLetter = name.charAt(-1).toUpperCase();
      const randomNumber = generateRandomNumber(4);
      const userId = `A${firstLetter}${lastLetter}${randomNumber}`;
      const newuser = new userModel({
        id: userId,
        name,
        number,
        email,
        gender,
        age,
        role,
        password:passwordMatched,
        fullDate,
        fullTime
      });
      await newuser.save();
      const newProfile = new profileModel({
        id: newuser.id,
        __id: newuser._id,
        name,
        number,
        email,
        gender,
        age
    })
      await newProfile.save();
      res.json(`new user unique id is ${newuser.id}`);
    }
  } catch (error) {
    res.status(500).json('Could not save user.')
    console.log(error)
  }
};

const login = async (req, res) => {
  try {
    const id = req.body.id;
    const password = req.body.password;

    const user = await userModel.findOne({ id });
    // console.log(user)

    if (user) {
      const passwordMatched = await hashValue( password )
      if (passwordMatched === user.password) {
        const payload = {user_id:user._id,name:user.name, email:user.email, role:user.role, avatar: user.avatar}
        const secretKey = process.env.JWT_SECRET
        const token = jwt.sign(payload, secretKey)
        res.status(200).json(token)
        await userModel.updateOne({ _id: user._id }, { Status: "Online" });
      } else {
        res.status(401).json("Invalid credentials.");     
      }
    } else {
      res.status(404).json("user not found.");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("Could not log in user.");
  }
};

module.exports = {register,login}