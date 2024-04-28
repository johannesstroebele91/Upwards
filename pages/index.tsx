import React from "react";
import dbConnect from "../lib/dbConnect";
import HabitModels from "../models/HabitModel";
import {Habit} from "../shared/types";
import {Row, Typography} from "antd";
import {HabitCard} from "../components/HabitCard";

const {Title, Text} = Typography;

type Props = {
    habits: Habit[];
};

const Index = ({habits}: Props) => {
    return (
        <>
            <Title style={{marginTop: 24}}>Welcome!</Title>
            <Text>Record your progress for your habits or add new habits.<br/>
                The "+" means a positive progress for the habit, "-" a negative one.</Text>

            <Row gutter={[16, 8]} style={{marginTop: '30px'}}>
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

    /* Ensures all objectIds and nested objectIds are serialized as JSON data */
    const habits = result.map((doc) => JSON.parse(JSON.stringify(doc)));
    return {props: {habits: habits}};
};

export default Index;
