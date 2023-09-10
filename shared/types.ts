import { Moment } from "moment";

export interface Habit {
  _id?: string;
  name: string;
  weeklyGoal: number;
  doneHistory?: Moment[];
}
