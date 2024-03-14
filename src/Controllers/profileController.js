const profileModel = require('../Models/profileModel')

const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
  
    const fieldsToUpdate = { ...req.body };
    const updatedProfile = await profileModel.findOneAndUpdate({ id: userId }, fieldsToUpdate, { new: true });
    
    // Check if profile was found and updated
    if (updatedProfile) {
      res.status(200).json('Profile updated successfully');
    } else {
      res.status(404).json( 'Profile not found' );
    }
  } catch (error) {
    console.error(error);
    res.status(500).json('Internal server error');
  }
}

const userProfile = async (req,res)=>{
  try {
  const userId = req.user.email;
   const profile =  await profileModel.findOne({email:userId})
    res.status(200).json(profile)
  }
  catch (error) {
    console.error(error);
    res.status(500).json('could not get the user details'); 
  }
}


module.exports = { updateProfile, userProfile }