import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { getRestaurants } from "../Services/RestaurantServices/RestaurantServices";
import { useNavigate } from "react-router-dom";

const RestaurantPopup = (props) => {
  const navigate = useNavigate();

  const handleClose = () => {
    if (props?.handleClose) {
      props.handleClose();
    }
  };

  const handleContinue = () => {
    navigate("/restaurantForm");
  };

  return (
    <Modal show={props?.show ?? false} onHide={handleClose} backdrop="static">
      <Modal.Header>
        <Modal.Title>Select Restaurant</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="restaurant-modal-desc">
          Hello Partner. Please add your restaurant details to proceed.{" "}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleContinue}>
          Continue
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RestaurantPopup;
