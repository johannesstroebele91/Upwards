import { NewHabitForm } from "../components/NewHabitForm";

const NewHabit = () => {
  const habitForm = {
    name: "",
    weeklyGoal: 0,
    doneHistory: [],
  };

  return <NewHabitForm formId="add-habit-form" habitForm={habitForm} />;
};

export default NewHabit;
