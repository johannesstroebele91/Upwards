import mongoose from 'mongoose'
import {Moment} from "moment";

export interface Habit  {
  _id?: number;
  name: string;
  weeklyGoal: number;
  doneHistory?: Moment[];}

export interface HabitMongoose extends mongoose.Document {
  _id: number;
  name: string;
  weeklyGoal: number;
  doneHistory?: Moment[];}

/* HabitSchema  will correspond to a collection in your MongoDB database. */
const HabitSchema = new mongoose.Schema<HabitMongoose>({
  _id: {
    type: Number, // Corrected field type
  },
  name: {
    type: String,
    required: [true, "Please provide the name of the habit"],
    maxlength: [60, "The name cannot be more than 60 characters"],
  },
  weeklyGoal: {
    type: Number, // Corrected field type
  },
  doneHistory: {
    type: [String],
  },
})


export default mongoose.models.HabitMongoose || mongoose.model<HabitMongoose>('HabitMongoose', HabitSchema)
