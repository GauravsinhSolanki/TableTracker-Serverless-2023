import React from "react";
import { Container } from "react-bootstrap";

const RestaurantReviews = () => {
  return (
    <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
      <iframe
        src="https://lookerstudio.google.com/embed/reporting/6d3970b8-656d-4c20-9e71-6a001f1e4d0e/page/p_m5psgs69bd"
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
