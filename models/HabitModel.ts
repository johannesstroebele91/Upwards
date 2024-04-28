import mongoose from "mongoose";
import {HabitWithoutId} from "../shared/types";

export interface HabitModel extends HabitWithoutId, mongoose.Document {
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
        type: Number,
    },
    progress: {
        type: Number,
    },
});

export default mongoose.models.Habits ||
mongoose.model<HabitModel>("Habits", HabitSchema);
