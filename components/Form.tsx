import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { mutate } from 'swr'
import {Habit} from "../models/Habit";

interface FormData {
  name: string
  weeklyGoal: number
}

interface Error {
  name?: string
  weeklyGoal?: string
}

type Props = {
  formId: string
  habitForm: FormData
  forNewHabit?: boolean
}

const Form = ({ formId, habitForm, forNewHabit = true }: Props) => {
  const router = useRouter()
  const contentType = 'application/json'
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')

  const [form, setForm] = useState<Habit>({
    name: habitForm.name,
    weeklyGoal: habitForm.weeklyGoal
  })

  /* The PUT method edits an existing entry in the mongodb database. */
  const putData = async (form: FormData) => {
    const { id } = router.query

    try {
      const res = await fetch(`/api/habits/${id}`, {
        method: 'PUT',
        headers: {
          Accept: contentType,
          'Content-Type': contentType,
        },
        body: JSON.stringify(form),
      })

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status.toString())
      }

      const { data } = await res.json()

      await mutate(`/api/habits/${id}`, data, false) // Update the local data without a revalidation
      await router.push('/')
    } catch (error) {
      setMessage('Failed to update habit')
    }
  }

  /* The POST method adds a new entry in the mongodb database. */
  const postData = async (form: FormData) => {
    try {
      const res = await fetch('/api/habits', {
        method: 'POST',
        headers: {
          Accept: contentType,
          'Content-Type': contentType,
        },
        body: JSON.stringify(form),
      })

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status.toString())
      }

      router.push('/')
    } catch (error) {
      setMessage('Failed to add habit')
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target
    const value = target.value
    const name = target.name

    setForm({
      ...form,
      [name]: value,
    })
  }

  /* Makes sure habit info is filled */
  const formValidate = () => {
    let err: Error = {}
    if (!form.name) err.name = 'Name is required'
    if (!form.weeklyGoal) err.weeklyGoal = 'Weekly goal is required'
    return err
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const errs = formValidate()

    if (Object.keys(errs).length === 0) {
      forNewHabit ? postData(form) : putData(form)
    } else {
      setErrors({ errs })
    }
  }

  return (
    <>
      <form id={formId} onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          maxLength={20}
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="owner_name">Owner</label>
        <input
          type="text"
          maxLength={20}
          name="owner_name"
          value={form.weeklyGoal}
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn">
          Submit
        </button>
      </form>
      <p>{message}</p>
      <div>
        {Object.keys(errors).map((err, index) => (
          <li key={index}>{err}</li>
        ))}
      </div>
    </>
  )
}

export default Form
