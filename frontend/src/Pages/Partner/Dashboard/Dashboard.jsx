import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";

import "./dashboard.css";
import DailyChart from "./DailyChart";
import WeeklyChart from "./WeeklyChart";
import MonthlyChart from "./MonthlyChart";
import { Flex } from "@chakra-ui/react";
import { theme } from "../../../theme";
import { AuthCheck } from "../../Customer/Authentication/AuthCheck";

const Dashboard = (props) => {
  return (
    <Flex
      w="100%"
      minHeight="90vh"
      backgroundColor={theme.primaryBackground}
      flexDir="column"
      alignItems="center"
      justifyContent="start"
    >
      <Container>
        <Row className="dashboard-row">
          <Col>
            <Card className="dashboard-card">
              <div className="dashboard-card-title">Monthly Trend</div>
              <MonthlyChart />
            </Card>
          </Col>
          <Col>
            <Card className="dashboard-card">
              <div className="dashboard-card-title">Weekly trends</div>
              <WeeklyChart />
            </Card>
          </Col>
        </Row>
        <Row className="dashboard-row">
          <Col>
            <Card className="dashboard-card">
              <div className="dashboard-card-title">Daily view</div>
              <DailyChart />
            </Card>
          </Col>
        </Row>
      </Container>
    </Flex>
  );
};

const DashboardPage = AuthCheck(Dashboard, true);
export default DashboardPage;
