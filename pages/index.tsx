import React, {useState} from "react";
import Link from 'next/link'
import dbConnect from '../lib/dbConnect'
import Pet, { Pets } from '../models/Pet'
import { GetServerSideProps } from 'next'
import {Button, Card, Col, Progress, Row, Typography} from "antd";
import moment from "moment";
import {LeftOutlined, RightOutlined} from "@ant-design/icons";
const {Paragraph, Title} = Typography;

type Props = {
  pets: Pets[]
}

function getSuccessRateForDay(date: moment.Moment, habits: Pets[]): number {
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


const Index = ({ pets }: Props) => {
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
      <Paragraph italic>{getSuccessRateForDay(date, pets)}% of daily goals achieved</Paragraph>
      <Row gutter={[16, 8]} style={{flexDirection: 'column'}}>
        {pets.map(habit => (
            <Card key={habit.id} title={habit.name}>
                <p>{habit.age}</p>
                <p>{habit.owner_name}</p>
                <p>{habit.species}</p>
            </Card>
        ))}
      </Row>
      {pets.map((pet) => (
        <div key={pet._id}>
          <div className="card">
            <img src={pet.image_url}  alt={pet.name}/>
            <h5 className="pet-name">{pet.name}</h5>
            <div className="main-content">
              <p className="pet-name">{pet.name}</p>
              <p className="owner">Owner: {pet.owner_name}</p>

              {/* Extra Pet Info: Likes and Dislikes */}
              <div className="likes info">
                <p className="label">Likes</p>
                <ul>
                  {pet.likes.map((data, index) => (
                    <li key={index}>{data} </li>
                  ))}
                </ul>
              </div>
              <div className="dislikes info">
                <p className="label">Dislikes</p>
                <ul>
                  {pet.dislikes.map((data, index) => (
                    <li key={index}>{data} </li>
                  ))}
                </ul>
              </div>

              <div className="btn-container">
                <Link href={{ pathname: '/[id]/edit', query: { id: pet._id } }}>
                  <button className="btn edit">Edit</button>
                </Link>
                <Link href={{ pathname: '/[id]', query: { id: pet._id } }}>
                  <button className="btn view">View</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

/* Retrieves pet(s) data from mongodb database */
export const getServerSideProps: GetServerSideProps<Props> = async () => {
  await dbConnect()

  /* find all the data in our database */
  const result = await Pet.find({})

  /* Ensures all objectIds and nested objectIds are serialized as JSON data */
  const pets = result.map((doc) => {
    const pet = JSON.parse(JSON.stringify(doc))
    return pet
  })

  return { props: { pets: pets } }
}

export default Index
