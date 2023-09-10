import mongoose from "mongoose";
import { Moment } from "moment";

export interface HabitMongoose extends mongoose.Document {
  name: string;
  weeklyGoal: number;
  doneHistory?: Moment[];
}

/* HabitSchema  will correspond to a collection in your MongoDB database. */
const HabitSchema = new mongoose.Schema<HabitMongoose>({
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
});

export default mongoose.models.HabitMongoose ||
  mongoose.model<HabitMongoose>("HabitMongoose", HabitSchema);
