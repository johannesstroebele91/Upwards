import { useRouter } from 'next/router'
import useSWR from 'swr'
import Form from '../../components/Form'

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((json) => json.data)

const EditHabit = () => {
  const router = useRouter()
  const { id } = router.query
  const {
    data: habit,
    error,
    isLoading,
  } = useSWR(id ? `/api/habits/${id}` : null, fetcher)

  if (error) return <p>Failed to load</p>
  if (isLoading) return <p>Loading...</p>
  if (!habit) return null

  const habitForm = {
    name: habit.name,
    weeklyGoal: habit.weeklyGoal,
  }

  return <Form formId="edit-habit-form" habitForm={habitForm} forNewHabit={false} />
}

export default EditHabit
