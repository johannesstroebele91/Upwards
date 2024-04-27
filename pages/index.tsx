import React from "react";
import dbConnect from "../lib/dbConnect";
import HabitModels from "../models/HabitModel";
import {Habit} from "../shared/types";
import {Progress, Row, Typography} from "antd";
import moment from "moment";
import {HabitCard} from "../components/HabitCard";
import {Hero} from "../components/Hero";

const {Paragraph} = Typography;

type Props = {
    habits: Habit[];
};

function getSuccessRateForDay(date: moment.Moment, habits: Habit[]): number {
    /* TODO fix later
          const habitsDone = habits.filter(habit => {
          if (!habit.doneHistory) {
              return false;
          }
          return habit.doneHistory.some(doneDate => moment(doneDate).isSame(date, 'day'));
      });
      const successRate = (habitsDone.length / habits.length) * 100;
      return Math.round(successRate);*/
    return 75;
}

const Index = ({habits}: Props) => {
    return (
        <>
            <Hero/>
            <Progress percent={75} showInfo={false}/>
            <Paragraph italic>
                {getSuccessRateForDay(moment(), habits)}% of daily goals achieved
            </Paragraph>
            <Row gutter={[16, 8]} style={{flexDirection: "column"}}>
                {habits.map((habit) => (
                    <HabitCard key={habit._id} habit={habit}/>
                ))}
            </Row>
        </>
    );
};

/* Retrieves habit(s) data from mongodb database */
export const getServerSideProps: () => Promise<{
    props: { habits: any };
}> = async () => {
    await dbConnect();

    /* find all the data in our database */
    const result = await HabitModels.find({});
    console.log("Habit data retrieved:", result); // Log the retrieved data

    /* Ensures all objectIds and nested objectIds are serialized as JSON data */
    const habits = result.map((doc) => JSON.parse(JSON.stringify(doc)));
    return {props: {habits: habits}};
};

export default Index;
