import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import dbConnect from "../lib/dbConnect";
import HabitMongoose from "../models/Habit";
import { Habit } from "../shared/types";
import { Button, Card, Col, Progress, Row, Typography } from "antd";
import moment from "moment";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { HabitCard } from "../components/HabitCard";
import { Hero } from "../components/Hero";

const { Paragraph, Title } = Typography;

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

const Index = ({ habits }: Props) => {
  return (
    <>
      <Hero />
      <Progress percent={75} showInfo={false} />
      <Paragraph italic>
        {getSuccessRateForDay(moment(), habits)}% of daily goals achieved
      </Paragraph>
      <Row gutter={[16, 8]} style={{ flexDirection: "column" }}>
        {habits.map((habit) => (
          <HabitCard key={habit._id} habit={habit} />
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
  const result = await HabitMongoose.find({});

  /* Ensures all objectIds and nested objectIds are serialized as JSON data */
  const habits = result.map((doc) => JSON.parse(JSON.stringify(doc)));
  return { props: { habits: habits } };
};

export default Index;
