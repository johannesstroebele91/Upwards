import { Button, Col, Progress, Row, Typography } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import moment from "moment";
import { useState } from "react";
const { Paragraph, Title } = Typography;

export const Hero = () => {
  const [date, setDate] = useState(moment());
  return (
    <>
      <Title style={{ marginTop: 24 }}>Hey there, Michelle!</Title>
      <Row gutter={[16, 24]} align="middle">
        <Col flex="auto">
          <Title level={4} style={{ marginTop: 10 }}>
            {date.format("ddd, MMM. D")}
          </Title>
        </Col>
        <Col flex="80px">
          <Button
            icon={<LeftOutlined />}
            onClick={() => setDate(moment(date).subtract(1, "day"))}
          ></Button>
          <Button
            icon={<RightOutlined />}
            onClick={() => setDate(moment(date).add(1, "day"))}
            disabled={moment().isSame(date, "day")}
          ></Button>
        </Col>
      </Row>
    </>
  );
};
