import React from "react";
import { Container } from "react-bootstrap";

const RestaurantReviews = () => {
  return (
    <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
      <iframe
        src="https://lookerstudio.google.com/embed/reporting/17186895-0b43-48e2-8fd5-ad252ce9831b/page/tEnnC"
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
