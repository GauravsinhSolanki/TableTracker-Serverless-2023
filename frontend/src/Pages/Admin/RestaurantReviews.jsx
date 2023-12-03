import React from "react";
import { Container } from "react-bootstrap";

const RestaurantReviews = () => {
  return (
    <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
      <iframe
        src="https://lookerstudio.google.com/reporting/5af98ddd-676e-4765-bcd6-0f846be13831"
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

export default RestaurantReviews;
