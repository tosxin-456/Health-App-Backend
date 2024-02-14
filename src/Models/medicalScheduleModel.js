const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define schema for the Schedule
const scheduleSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
    type: {
        type: String,
        enum: [ 'RecurringTask', 'SingleTask'],
        required: true
  },
  category: {
    type: String,
    enum: ['Medication', 'Appointment', 'Treatment'],
    required:true
    },
    title: {
        type: String,
        required: true
    },
  description: {
    type:String
  },
  startDate: {
        type: Date,
        required: function () {
          return this.type !== 'SingleTask';
      }
  },
    frequency: {
        type: String,
        enum: ['Daily', 'Weekly', 'Monthly'],
        // required for recurring tasks and habits
        required: function () {
            return this.type !== 'SingleTask';
        }
    },
    // For recurring tasks and habits
  daysOfWeek: {
    type: [Number],
    required: function () {
      return this.type === 'RecurringTask';
      }
  },
    dueDate: {
        type: Date,
      // required for single tasks
      default: function () {
        if (this.type === 'RecurringTask' && this.frequecy === 'Daily') {
          return new Date(Date.now() + (24 * 60 * 60 * 1000));
        } 
        else if (this.type === 'RecurringTask' && this.frequecy === 'Weekly') {
          return new Date(Date.now() + (24 * 60 * 60 * 1000 * 7));
        }
        else if (this.type === 'RecurringTask' && this.frequecy === 'Monthly') {
          const currentDate = new Date();
          const nextMonth = (currentDate.getMonth() + 1) % 12; 
          return nextMonth;
        }
      },
        required: function () {
            return this.type === 'SingleTask';
        }
  },
    completed: {
      type: Boolean,
      default:false
    }
});

// Create a Mongoose model
const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;