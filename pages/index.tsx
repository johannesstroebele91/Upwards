import React, {useState} from "react";
import Link from 'next/link'
import dbConnect from '../lib/dbConnect'
import HabitMongoose, {Habit} from '../models/Habit'
import {Button, Card, Col, Progress, Row, Typography} from "antd";
import moment from "moment";
import {LeftOutlined, RightOutlined} from "@ant-design/icons";

const {Paragraph, Title} = Typography;

type Props = {
  habits: Habit[]
}

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
    console.log(habits)
  const [date, setDate] = useState(moment());
  return (
    <>
        <Title style={{marginTop: 24}}>Hey there, Michelle!</Title>
        <Row gutter={[16, 24]} align="middle">
        <Col flex="auto">
          <Title level={4} style={{marginTop: 10}}>{date.format("ddd, MMM. D")}</Title>
        </Col>
        <Col flex="80px">
          <Button icon={<LeftOutlined/>} onClick={() => setDate(moment(date).subtract(1, 'day'))}
          ></Button>
          <Button icon={<RightOutlined/>} onClick={() => setDate(moment(date).add(1, 'day'))}
                  disabled={moment().isSame(date, 'day')}></Button>
        </Col>
      </Row>
      <Progress percent={75} showInfo={false}/>
      <Paragraph italic>{getSuccessRateForDay(date, habits)}% of daily goals achieved</Paragraph>
      <Row gutter={[16, 8]} style={{flexDirection: 'column'}}>
        {habits.map(habit => (
            <Card key={habit._id} title={habit.name}>
                <p>{habit.name}</p>
                <p>{habit.weeklyGoal}</p>
                <div className="btn-container">
                    <Link href={{ pathname: '/[id]/edit', query: { id: habit._id } }}>
                        <button className="btn edit">Edit</button>
                    </Link>
                    <Link href={{ pathname: '/[id]', query: { id: habit._id } }}>
                        <button className="btn view">View</button>
                    </Link>
                </div>

            </Card>
        ))}
      </Row>
    </>
  )
}

/* Retrieves habit(s) data from mongodb database */
export const getServerSideProps: () => Promise<{ props: { habits: any } }> = async () => {
  await dbConnect()

  /* find all the data in our database */
  const result = await HabitMongoose.find({})

  /* Ensures all objectIds and nested objectIds are serialized as JSON data */
  const habits = result.map((doc) => JSON.parse(JSON.stringify(doc)))

  return { props: { habits: habits } }
}

export default Index
