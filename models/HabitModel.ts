import mongoose from "mongoose";
import {Moment} from "moment";

export interface HabitModel extends mongoose.Document {
    name: string;
    weeklyGoal: number;
    active: boolean;
    categories: string[]
    doneHistory?: Moment[];
}

/* HabitSchema  will correspond to a collection in your MongoDB database. */
const HabitSchema = new mongoose.Schema<HabitModel>({
    name: {
        type: String,
        required: [true, "Please provide the name of the habit"],
        maxlength: [60, "The name cannot be more than 60 characters"],
    },
    active: {
        type: Boolean,
    },
    categories: {
        type: [String],
    },
    weeklyGoal: {
        type: Number, // Corrected field type
    },
    doneHistory: {
        type: [String],
    },
});

export default mongoose.models.Habits ||
mongoose.model<HabitModel>("Habits", HabitSchema);
