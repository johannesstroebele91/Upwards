import { Card } from "antd";
import Link from "next/link";
import { Habit } from "../shared/types";
import { useRouter } from "next/router";

interface HabitCardProps {
  habit: Habit;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit }) => {
  const router = useRouter();

  async function handleClick(_id: string | undefined): Promise<void> {
    const contentType = "application/json";
    try {
      const res = await fetch(`/api/habits/${_id}`, {
        method: "DELETE",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
      });

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status.toString());
      }
    } catch (error) {
      console.log("Failed to delete habit");
    }
    router.push("/");
  }

  return (
    <Card key={habit._id} title={habit.name}>
      <p>{habit.name}</p>
      <p>{habit.weeklyGoal}</p>
      <div className="btn-container">
        <Link href={{ pathname: "/[id]/edit", query: { id: habit._id } }}>
          <button className="btn edit">Edit</button>
        </Link>
        <Link href={{ pathname: "/[id]", query: { id: habit._id } }}>
          <button className="btn view">View</button>
        </Link>
        <button className="btn delete" onClick={() => handleClick(habit._id)}>
          Delete
        </button>
      </div>
    </Card>
  );
};
