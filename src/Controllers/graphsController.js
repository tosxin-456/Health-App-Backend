const  Schedule  = require("../Models/medicalScheduleModel");
const  UserModel  = require("../Models/userModel");

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];




const individualSchedulesForUser = async (req, res) => {
  const userId = req.user._id;
  // console.log(userId)
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json('Could not find user');
    }

    const Appointments = await Schedule.aggregate([
      {
        $match: {
          user: user._id,
          category: 'Appointment',
          
        }
      },
      {
        $group: {
          _id: {
            month: { $month: "$startDate" },
            year: { $year: "$startDate" }
          },
          totalSchedules: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          totalSchedules: 1
        }
      }
    ]);

    const medication = await Schedule.aggregate([
      {
        $match: {
          user: user._id,
          category: 'Medication'
        }
      },
      {
        $group: {
          _id: {
            month: { $month: "$startDate" },
            year: { $year: "$startDate" }
          },
          totalSchedules: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          totalSchedules: 1
        }
      }
    ]);
    

    const treatment = await Schedule.aggregate([
      {
        $match: {
          user: user._id,
          category: 'Treatment'
        }
      },
      {
        $group: {
          _id: {
            month: { $month: "$startDate" },
            year: { $year: "$startDate" }
          },
          totalSchedules: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          totalSchedules: 1
        }
      }
    ]);

    const combinedResult = [];
    const currentYear = new Date().getFullYear();

    months.forEach((month, index) => {
      const matchingScheduleComplete = Appointments.find(schedule => schedule.month === index + 1) || { totalSchedules: 0 };
      const matchingScheduleInComplete = medication.find(schedule => schedule.month === index + 1) || { totalSchedules: 0 };
      const matchingTreatment = treatment.find(schedule => schedule.month === index + 1) || { totalSchedules: 0 };

      combinedResult.push({
        month,
        year: currentYear,
        totalAppointments: matchingScheduleComplete.totalSchedules,
        totalMedication: matchingScheduleInComplete.totalSchedules,
        totalTreatment: matchingTreatment.totalSchedules

      });
    });

    return res.status(200).json(combinedResult);
  } catch (error) {
    console.error(error);
    return res.status(500).json('Internal Server Error');
  }
};


const schedulesByUserInTotal = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json('Could not find user');
    }

    const totalCompleted = await Schedule.countDocuments({ user: user._id, completed: true });
    const totalIncomplete = await Schedule.countDocuments({ user: user._id, completed: false });

    return res.status(200).json({ totalCompleted, totalIncomplete });
  } catch (error) {
    console.error(error);
    return res.status(500).json('Internal Server Error');
  }
};


const medicationIntake = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json('Could not find user');
    }

    // Get the current month and year
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Note: Month is zero-based, so we add 1
    const currentDay = currentDate.getDate();

    const startDate = new Date(currentYear, currentMonth - 1, 1); // Start of the current month
    const endDate = new Date(currentYear, currentMonth, 0); // End of the current month

    // Aggregate completed and incomplete medication schedules for the current month
    const medicationData = await Schedule.aggregate([
      {
        $match: {
          user: user._id,
          category: 'Medication', // Only consider medication schedules
          $or: [
            { startDate: { $gte: startDate, $lte: endDate } }, // Start date falls within the current month
            { dueDate: { $gte: startDate, $lte: endDate } }    // End date falls within the current month
          ]
        }
      },
      {
        $group: {
          _id: { $dayOfMonth: "$startDate" }, // Group by day of the month
          medicationTaken: { $sum: { $cond: [{ $eq: ["$completed", true] }, 1, 0] } }, // Count completed schedules
          medicationNotTaken: { $sum: { $cond: [{ $eq: ["$completed", false] }, 1, 0] } } // Count incomplete schedules
        }
      },
      {
        $project: {
          _id: 0,
          day: "$_id",
          medicationTaken: 1,
          medicationNotTaken: 1
        }
      }
    ]);

    // Create an array with days from 1 to the last day of the month
    const daysInMonth = Array.from({ length: endDate.getDate() }, (_, i) => i + 1);

    // Initialize the response array
    const response = daysInMonth.map(day => {
      if (day > currentDay) {
        return { day, medicationTaken: null, medicationNotTaken: null }; // Day hasn't been reached yet
      } else {
        const data = medicationData.find(item => item.day === day);
        return data ? data : { day, medicationTaken: 0, medicationNotTaken: 0 }; // Day has passed and no data available
      }
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json('Internal Server Error');
  }
};







module.exports = { schedulesByUserInTotal , individualSchedulesForUser, medicationIntake };
