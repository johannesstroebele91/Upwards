import {SelectProps} from "antd";

export const contentType = "application/json";

export const homePath = "/";
export const newHabitPath = "/NewHabit";

export const defaultCategories: SelectProps['options'] = [
    {
        label: 'Health',
        value: 'health',
    },
    {
        label: 'Work',
        value: 'work',
    },
    {
        label: 'Freetime',
        value: 'freetime',
    },
    {
        label: 'Relations',
        value: 'relations',
    },
    {
        label: 'Administration',
        value: 'administration',
    },
];
