import Form from '../components/Form'

const NewHabit = () => {
  const habitForm = {
    name: '',
    weeklyGoal: 0,
    doneHistory: []
  }

  return <Form formId="add-habit-form" habitForm={habitForm} />
}

export default NewHabit
