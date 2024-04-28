export interface Habit extends HabitWithoutId {
    _id?: string;
}

export interface HabitWithoutId {
    name: string;
    weeklyGoal: number;
    active: boolean;
    categories?: string[];
    progress?: number;
}
