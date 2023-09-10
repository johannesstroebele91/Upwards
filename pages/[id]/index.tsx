import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import dbConnect from "../../lib/dbConnect";
import HabitMongoose from "../../models/Habit";
import { Habit } from "../../shared/types";
import { GetServerSidePropsContext } from "next";
import { Card } from "antd";

type Props = {
  habit: Habit;
};

/* Allows you to view habit card info and delete habit card*/
const HabitPage = ({ habit }: Props) => {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const handleDelete = async () => {
    const habitID = router.query._id;

    try {
      await fetch(`/api/habits/${habitID}`, {
        method: "Delete",
      });
      await router.push("/");
    } catch (error) {
      setMessage("Failed to delete the habit.");
    }
  };

  return (
    <Card key={habit._id} title={habit.name}>
      <p>{habit.weeklyGoal}</p>
      <div className="btn-container">
        <Link href={`/${habit._id}/edit`}>
          <button className="btn edit">Edit</button>
        </Link>
        <button className="btn delete" onClick={handleDelete}>
          Delete
        </button>
      </div>
      {message && <p>{message}</p>}
    </Card>
  );
};

export const getServerSideProps: ({
  params,
}: GetServerSidePropsContext) => Promise<
  | {
      notFound: boolean;
    }
  | { props: { habit: any } }
> = async ({ params }: GetServerSidePropsContext) => {
  await dbConnect();

  if (!params?._id) {
    return {
      notFound: true,
    };
  }

  const habit = await HabitMongoose.findById(params._id).lean();

  if (!habit) {
    return {
      notFound: true,
    };
  }

  /* Ensures all objectIds and nested objectIds are serialized as JSON data */
  const serializedHabit = JSON.parse(JSON.stringify(habit));

  return {
    props: {
      habit: serializedHabit,
    },
  };
};

export default HabitPage;
