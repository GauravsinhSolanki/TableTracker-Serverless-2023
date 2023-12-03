import React from "react";
import { Container } from "react-bootstrap";

const TopCustomers = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        height: "80vh", // Adjust the height as needed
        width: "80vw", // Adjust the width as needed
        overflow: "hidden",
      }}
    >
      <iframe
        src="https://lookerstudio.google.com/embed/reporting/5af98ddd-676e-4765-bcd6-0f846be13831/page/IV5jD"
        frameBorder="0"
        style={{
          border: "0",
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
        className="review-iframe"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default TopCustomers;


