import {Badge, Button, Card, Col, Input, Row, Select, Switch, Tooltip} from "antd";
import {DeleteOutlined, MinusOutlined, PlusOutlined} from "@ant-design/icons";
import {useRouter} from "next/router";
import {contentType, defaultCategories, homePath} from "../shared/constants";
import {mutate} from "swr";
import {Habit} from "../shared/types";
import React, {useState} from "react";

interface HabitCardProps {
    habit: Habit;
}

export const HabitCard: React.FC<HabitCardProps> = ({habit}) => {
    const router = useRouter();
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(habit.name);
    const [weeklyGoal, setWeeklyGoal] = useState(habit.weeklyGoal);
    const [active, setActive] = useState<boolean>(habit.active);
    const [selectedCategories, setSelectedCategories] = useState<string[]>(habit.categories);

    const editHabit = async (changedHabit: Habit) => {
        try {
            const res = await fetch(`/api/habits/${changedHabit._id}`, {
                method: "PUT",
                headers: {
                    Accept: contentType,
                    "Content-Type": contentType,
                },
                body: JSON.stringify(changedHabit),
            });

            if (!res.ok) {
                console.log(res.status.toString());
            }

            const {data} = await res.json();

            await mutate(`/api/habits/${changedHabit._id}`, data, false);
        } catch (error) {
            console.log("Failed to update habit");
        }

    };

    const handleClick = async (_id: string | undefined) => {
        const contentType = "application/json";
        try {
            const res = await fetch(`/api/habits/${_id}`, {
                method: "DELETE",
                headers: {
                    Accept: contentType,
                    "Content-Type": contentType,
                },
            });

            if (!res.ok) {
                console.log(res.status.toString());
            }
        } catch (error) {
            console.log("Failed to delete habit");
        }
        await router.push(homePath);
    };

    const handleEditClick = () => {
        setEditing(true);
    };

    const handleCancelEdit = () => {
        setEditing(false);
        setName(habit.name);
        setWeeklyGoal(habit.weeklyGoal);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleWeeklyGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWeeklyGoal(parseInt(e.target.value));
    };

    const handleSave = () => {
        void editHabit({...habit, name, weeklyGoal});
        setEditing(false);
    };

    return (
        <Card
            actions={[
                <Tooltip title="Mark Progress (+1)">
                    <PlusOutlined style={{color: '#1677ff'}} className="progress-icon"/>
                </Tooltip>,
                <Tooltip title="It happens (-1)">
                    <MinusOutlined style={{color: 'red'}} className="progress-icon"/>
                </Tooltip>
            ]}
            key={habit._id}
            title={name}
            style={{margin: 15, width: 350}}
        >
            <div style={{position: 'absolute', top: 0, right: 0, display: "flex", marginTop: 12}}>
                {editing && (
                    <>
                        <Button type="primary" onClick={handleSave} style={{marginRight: 9}}>Save</Button>
                        <Button onClick={handleCancelEdit} style={{marginRight: 9}}>Cancel</Button>
                    </>)}
                <div style={{margin: '3px 12px 0 0'}}>
                    <Tooltip placement="topRight" title="Score for progress of the habit">
                        <Badge count={0} showZero style={{marginRight: 12}} color={'grey'}/>
                    </Tooltip>
                    <Tooltip placement="top" title="Delete the habit">
                        <DeleteOutlined className="delete-icon" onClick={() => handleClick(habit._id)}
                        />
                    </Tooltip>

                </div>
            </div>
            <Row style={{display: 'flex', flexDirection: 'column'}} gutter={[12, 12]} wrap={false}>
                <Col>
                    <Row align="middle">
                        <Col span={4} style={{minWidth: 100}}>Name</Col>
                        {!editing ? (
                            <Col>{name} <Button type="link" onClick={handleEditClick}>Edit</Button></Col>
                        ) : (
                            <Col>
                                <Input value={name} onChange={handleNameChange}/>
                            </Col>
                        )}
                    </Row>
                </Col>
                <Col>
                    <Row align="middle">
                        <Col span={4} style={{minWidth: 100}}>Weekly Goal</Col>
                        {!editing ? (
                            <Col>{weeklyGoal} <Button type="link" onClick={handleEditClick}>Edit</Button></Col>
                        ) : (
                            <Col>
                                <Input type="number" value={weeklyGoal.toString()} onChange={handleWeeklyGoalChange}/>
                            </Col>
                        )}
                    </Row>
                </Col>
                <Col>
                    <Row align="middle">
                        <Col span={4} style={{minWidth: 100}}>Active</Col>
                        <Col>
                            <Switch checked={active} onChange={(newActive) => {
                                setActive(newActive)
                                void editHabit({...habit, active: newActive});
                            }}/>
                        </Col>
                    </Row>
                </Col>
                <Col>
                    <Row align="middle">
                        <Col span={4} style={{minWidth: 100}}>Categories</Col>
                        <Col>
                            <Select
                                mode="multiple"
                                style={{display: 'block', minWidth: '200px'}}
                                value={selectedCategories}
                                options={defaultCategories}
                                onChange={(newCategories) => {
                                    setSelectedCategories(newCategories)
                                    void editHabit({
                                        ...habit,
                                        categories: newCategories,
                                    });
                                }}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Card>
    );
};
