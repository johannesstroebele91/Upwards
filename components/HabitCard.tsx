import {Badge, Card, Col, Row, Select, SelectProps, Switch} from "antd";
import {Habit} from "../shared/types";
import {NextRouter, useRouter} from "next/router";
import {contentType, defaultCategories, homePath} from "../shared/constants";
import {mutate} from "swr";
import React from "react";
import {DeleteOutlined, MinusOutlined, PlusOutlined} from "@ant-design/icons";

interface HabitCardProps {
    habit: Habit;
}

const convertCategories = (categories: string[]): SelectProps['options'] => {
    return defaultCategories?.filter((defaultCategory) =>
        categories && categories.includes(String(defaultCategory.value))
    );
};

/* TODO add edit habit using PUT method for editing an existing entry in the mongodb database. */
const putData = async (form: Habit, router: NextRouter) => {
    const {id} = router.query;

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
            console.log(res.status.toString());
        }

        const {data} = await res.json();

        await mutate(`/api/habits/${id}`, data, false); // Update the local data without a revalidation
        await router.push(homePath);
    } catch (error) {
        console.log("Failed to update habit");
    }
};

export const HabitCard: React.FC<HabitCardProps> = ({habit}) => {
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
                console.log(res.status.toString());
            }
        } catch (error) {
            console.log("Failed to delete habit");
        }
        await router.push(homePath);
    }

    let count = 0;
    return (
        <Card actions={[
            <PlusOutlined/>,
            <MinusOutlined/>

        ]}
              key={habit._id} title={habit.name} style={{margin: 15, width: 350}}>
            <div style={{position: 'absolute', top: 0, right: 0, margin: '12px 12px 0 0'}}>
                {/* TODO 0 grey 1-10 red >11-30 orange > 31-... green */}
                <Badge count={count} showZero style={{position: 'relative', right: 12}} color={'grey'}/>
                <DeleteOutlined onClick={() => handleClick(habit._id)} style={{position: 'relative', top: 2}}/>
            </div>
            <Row style={{display: 'flex', flexDirection: 'column'}} gutter={[12, 12]} wrap={false}>
                <Col>
                    <Row align="middle">
                        <Col span={4} style={{minWidth: 100}}>Name</Col>
                        <Col>{habit.name}</Col>
                    </Row>
                </Col>
                <Col>
                    <Row align="middle">
                        <Col span={4} style={{minWidth: 100}}>Weekly Goal</Col>
                        <Col>{habit.weeklyGoal}</Col>
                    </Row>
                </Col>
                <Col>
                    <Row align="middle">
                        <Col span={4} style={{minWidth: 100}}>Active</Col>
                        <Col><Switch checked={habit.active} disabled/></Col>
                    </Row>
                </Col>
                <Col>
                    <Row align="middle">
                        <Col span={4} style={{minWidth: 100}}>Categories</Col>
                        <Col><Select
                            mode="multiple"
                            style={{display: 'block', minWidth: '200px'}}
                            disabled
                            defaultValue={convertCategories(habit.categories)}
                            options={defaultCategories}
                        /></Col>
                    </Row>
                </Col>
            </Row>
        </Card>
    );
};
