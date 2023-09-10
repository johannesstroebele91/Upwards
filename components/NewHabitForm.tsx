import React, { useState } from "react";
import { useRouter } from "next/router";
import { mutate } from "swr";
import { Habit } from "../shared/types";
import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Cascader,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Slider,
  Switch,
  TreeSelect,
  Upload,
} from "antd";

interface FormData {
  name: string;
  weeklyGoal: number;
}

interface Error {
  name?: string;
  weeklyGoal?: string;
}

type Props = {
  formId: string;
  habitForm: FormData;
  forNewHabit?: boolean;
};

export const NewHabitForm = ({
  formId,
  habitForm,
  forNewHabit = true,
}: Props) => {
  const router = useRouter();
  const contentType = "application/json";
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const [form, setForm] = useState<Habit>({
    name: habitForm.name,
    weeklyGoal: habitForm.weeklyGoal,
  });

  /* The PUT method edits an existing entry in the mongodb database. */
  const putData = async (form: FormData) => {
    const { id } = router.query;

    try {
      const res = await fetch(`/api/habits/${id}`, {
        method: "PUT",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify(form),
      });

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status.toString());
      }

      const { data } = await res.json();

      await mutate(`/api/habits/${id}`, data, false); // Update the local data without a revalidation
      await router.push("/");
    } catch (error) {
      setMessage("Failed to update habit");
    }
  };

  /* The POST method adds a new entry in the mongodb database. */
  const postData = async (form: FormData) => {
    try {
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify(form),
      });

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status.toString());
      }

      router.push("/");
    } catch (error) {
      setMessage("Failed to add habit");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    setForm({
      ...form,
      [name]: value,
    });
  };

  /* Makes sure habit info is filled */
  const formValidate = () => {
    let err: Error = {};
    if (!form.name) err.name = "Name is required";
    if (!form.weeklyGoal) err.weeklyGoal = "Weekly goal is required";
    return err;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = formValidate();

    if (Object.keys(errs).length === 0) {
      forNewHabit ? postData(form) : putData(form);
    } else {
      setErrors(errs);
    }
  };

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

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

        <label htmlFor="weekly_goal">Weekly Goal</label>
        <input
          type="number"
          max={7}
          name="weeklyGoal"
          value={form.weeklyGoal}
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn">
          Submit
        </button>
      </form>
      <Card>
        <Form {...layout}>
          <Form.Item label="Name">
            <Input value={form.name} onChange={handleChange} required />
          </Form.Item>

          <Form.Item label="Category">
            <Select>
              <Select.Option value="demo">Demo</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Weekly Goal">
            <InputNumber value={form.weeklyGoal} required />
          </Form.Item>

          <Form.Item label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button htmlType="button">Reset</Button>
            <Button type="link" htmlType="button">
              Fill form
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <p>{message}</p>
      <div>
        {Object.values(errors).map((err, index) => (
          //todo refactor later (as string)
          <li key={index}>{err as string}</li>
        ))}
      </div>
    </>
  );
};
