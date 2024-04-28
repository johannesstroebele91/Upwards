import React from "react";
import {useRouter} from "next/router";
import {Button, Card, Form, FormInstance, Input, InputNumber, Select, Switch, Typography,} from "antd";
import {contentType, defaultCategories} from "../shared/constants";
import {Habit} from "../shared/types";

const {Title} = Typography;

const formButtonsLayout = {
    wrapperCol: {offset: 8, span: 16},
};

const formInputsLayout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16},
};
export const NewHabitForm = () => {
    const formRef = React.useRef<FormInstance>(null);
    const router = useRouter();

    /* The POST method adds a new entry in the mongodb database. */
    const postHabit = async (habit: Habit) => {
        try {
            const res = await fetch("/api/habits", {
                method: "POST",
                headers: {
                    Accept: contentType,
                    "Content-Type": contentType,
                },
                body: JSON.stringify(habit),
            });

            if (res.ok) {
                console.log('New habit was created')
                console.log(habit)
            }

            // Throw error with status code in case Fetch API req failed
            if (!res.ok) {
                console.log(res.status.toString());
            }
            await router.push("/");
        } catch (error) {
            console.log("Failed to add habit");
        }
    };
    const onReset = () => {
        formRef.current?.resetFields();
    };

    return (
        <Card style={{maxWidth: '700px', padding: '20px', margin: '40px auto 0 auto'}}>
            <Title style={{textAlign: 'center', marginBottom: 30}}>Add a new habit:</Title>
            <Form
                ref={formRef}
                name="control-ref"
                onFinish={(formValues) => postHabit(formValues)}
                style={{maxWidth: 600}}
                {...formInputsLayout}
            >
                <Form.Item label="Name" name="name">
                    <Input required placeholder="e.g. Running"/>
                </Form.Item>

                <Form.Item label="Weekly Goal" name="weeklyGoal">
                    <InputNumber required placeholder="e.g. 3" min={0}/>
                </Form.Item>

                <Form.Item label="Categories" name="categories">
                    <Select
                        mode="multiple"
                        allowClear
                        style={{width: '100%'}}
                        placeholder="e.g. Health"
                        options={defaultCategories}
                    />
                </Form.Item>

                <Form.Item label="Active" valuePropName="checked" name="active">
                    <Switch defaultChecked/>
                </Form.Item>

                <Form.Item {...formButtonsLayout}>
                    <Button type="primary" htmlType="submit" style={{marginRight: '18px'}}>
                        Submit
                    </Button>
                    <Button htmlType="button" onClick={onReset}>Reset</Button>
                </Form.Item>
            </Form>
        </Card>
    );
};
