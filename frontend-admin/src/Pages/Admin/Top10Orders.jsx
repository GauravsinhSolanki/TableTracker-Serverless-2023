import React from "react";
import { Container } from "react-bootstrap";

const Top10Orders = () => {
    return (
        <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
            <iframe
                src="https://lookerstudio.google.com/embed/reporting/c6815066-3ce5-4c83-b120-4e80e292e2cf/page/tEnnC"
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

export default Top10Orders;