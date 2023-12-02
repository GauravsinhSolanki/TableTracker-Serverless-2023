import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import { useMediaQuery } from "react-responsive";
import { theme } from "../../../theme";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./landingPage.css";

function LandingPage() {
  const isMobile = useMediaQuery({ query: "(max-width: 1080px)" });
  const navigate = useNavigate();

  const handleNavigate = (url) => {
    navigate(url);
  };

  return isMobile ? (
    <Flex
      w="100%"
      minHeight="90vh"
      backgroundColor={theme.primaryBackground}
      flexDir="column"
      alignItems="center"
      justifyContent="start"
    >
      <LandingContent handleNavigate={handleNavigate} />
    </Flex>
  ) : (
    <Flex
      w="100%"
      minHeight="90vh"
      backgroundColor={theme.primaryBackground}
      alignItems="center"
      justifyContent="space-evenly"
    >
      <LandingContent handleNavigate={handleNavigate} />
    </Flex>
  );
}

const LandingContent = ({ handleNavigate }) => (
  <Container>
    <Row className="landing-title">Customer links</Row>
    <Row className="landing-buttons-container">
      <Button
        className="landing-button"
        onClick={(e) => handleNavigate("/admin/login")}
      >
        Admin Login
      </Button>
    </Row>
    <Row className="landing-buttons-container">
      <Button
        className="landing-button"
        onClick={(e) => handleNavigate("/user/login")}
      >
        Customer login
      </Button>
      <Button
        className="landing-button"
        onClick={(e) => handleNavigate("/user/signup")}
      >
        Customer Signup
      </Button>
    </Row>
    <Row className="landing-title">Partner links</Row>
    <Row className="landing-buttons-container">
      <Button
        className="landing-button"
        onClick={(e) => handleNavigate("/partner/login")}
      >
        Partner login
      </Button>
      <Button
        className="landing-button"
        onClick={(e) => handleNavigate("/partner/signup")}
      >
        Partner signup
      </Button>
    </Row>
  </Container>
);

export default LandingPage;
