import React from "react";
import { Container } from "react-bootstrap";

const RestaurantMostOrders = () => {
  return (
    <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
      <iframe
        src="https://lookerstudio.google.com/embed/reporting/47d3baba-8c82-4fc7-bda7-5e28c9ddc141/page/fC5jD"
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

export default RestaurantMostOrders;
