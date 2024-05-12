import {Badge, Button, Card, Col, Input, Row, Select, Switch, Tooltip} from "antd";
import {DeleteOutlined, MinusOutlined, PlusOutlined} from "@ant-design/icons";
import {contentType, defaultCategories} from "../shared/constants";
import {mutate} from "swr";
import {Habit} from "../shared/types";
import React, {useState} from "react";

interface HabitCardProps {
    habit: Habit;
    onDeleteHabit: (_id: string) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({habit, onDeleteHabit}) => {
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(habit.name);
    const [weeklyGoal, setWeeklyGoal] = useState(habit.weeklyGoal);
    const [active, setActive] = useState<boolean>(habit.active);
    const [selectedCategories, setSelectedCategories] = useState<string[]>(habit.categories || []);
    const [progress, setProgress] = useState<number>(habit.progress || 0);

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

    const deleteHabit = async (_id: string | undefined) => {
        if (_id) {
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
            onDeleteHabit(_id);
        } else {
            console.log('Id of the habit that should be deleted was not specified')
        }
    };

    // Edit name and goal
    const editHabitNameAndGoal = () => {
        setEditing(true);
    };
    const changeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };
    const changeWeeklyGoal = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWeeklyGoal(parseInt(e.target.value));
    };
    const cancelEditNameAndGoal = () => {
        setEditing(false);
        setName(habit.name);
        setWeeklyGoal(habit.weeklyGoal);
    };
    const saveNameAndGoal = () => {
        void editHabit({...habit, name, weeklyGoal});
        setEditing(false);
    };

    // Edit progress
    const changeProgress = (increment: number): void => {
        if (increment) {
            let newProgress = progress;
            setProgress(prevProgress => {
                if (increment === -1) {
                    newProgress = prevProgress > 1 ? prevProgress - 1 : 0;
                } else {
                    newProgress = prevProgress + increment;
                }
                return newProgress;
            })
            void editHabit({...habit, progress: newProgress});
        }
    }

    return (
        <Card
            actions={[
                <Button type="text" onClick={() => changeProgress(-1)} style={{width: '80%', height: '100%'}}>
                    <MinusOutlined style={{color: 'red'}}
                                   className="progress-icon"/> </Button>,
                <Button type="text" onClick={() => changeProgress(1)} style={{width: '80%', height: '100%'}}>
                    <PlusOutlined style={{color: '#1677ff'}} className="progress-icon"/>
                </Button>

            ]}
            key={habit._id}
            title={name}
            style={{margin: 15, width: 400,}}
        >
            <div style={{position: 'absolute', top: 0, right: 0, display: "flex", marginTop: 12}}>
                {editing && (
                    <>
                        <Button type="primary" onClick={saveNameAndGoal} style={{marginRight: 9}}>Save</Button>
                        <Button onClick={cancelEditNameAndGoal} style={{marginRight: 9}}>Cancel</Button>
                    </>)}
                <div style={{margin: '3px 12px 0 0'}}>
                    <Tooltip placement="topRight" title="Score for progress of the habit">
                        <Badge count={progress} showZero style={{marginRight: 12}} color={'grey'}/>
                    </Tooltip>
                    <Tooltip placement="top" title="Delete the habit">
                        <DeleteOutlined className="delete-icon" onClick={() => deleteHabit(habit._id)}
                        />
                    </Tooltip>

                </div>
            </div>
            <Row style={{display: 'flex', flexDirection: 'column'}} gutter={[12, 12]} wrap={false}>
                <Col>
                    <Row align="middle">
                        <Col span={4} style={{minWidth: 100}}>Name</Col>
                        {!editing ? (
                            <Col>{name} <Button type="link" onClick={editHabitNameAndGoal}>Edit</Button></Col>
                        ) : (
                            <Col>
                                <Input value={name} onChange={changeName}/>
                            </Col>
                        )}
                    </Row>
                </Col>
                <Col>
                    <Row align="middle">
                        <Col span={4} style={{minWidth: 100}}>Weekly Goal</Col>
                        {!editing ? (
                            <Col>{weeklyGoal} <Button type="link" onClick={editHabitNameAndGoal}>Edit</Button></Col>
                        ) : (
                            <Col>
                                <Input type="number" value={weeklyGoal.toString()} onChange={changeWeeklyGoal}/>
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
