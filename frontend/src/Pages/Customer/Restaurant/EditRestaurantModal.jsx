import React, { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { updateRestaurant } from "../../../Services/RestaurantServices/RestaurantServices";
import { Spinner } from "@chakra-ui/react";

const EditRestaurantModal = ({ handleClose, show, restaurant }) => {
  const [formData, setFormData] = useState({
    opening_time: restaurant?.opening_time ?? "10:00",
    closing_time: restaurant?.closing_time ?? "20:00",
    max_tables: restaurant?.max_tables ?? 0,
  });
  const [isLoading, setLoading] = useState(false);

  const handleModalClose = () => {
    handleClose();
  };

  const handleModalSave = async () => {
    setLoading(true);
    const response = await updateRestaurant({
      restaurant_id: restaurant.restaurant_id,
      ...formData,
    });
    if (response.data) {
      handleClose(true);
    }
    setLoading(false);
  };

  const handleChange = (e, key) => {
    setFormData((prevState) => {
      let newState = { ...prevState };
      newState[key] = e.target.value ?? "";
      return { ...newState };
    });
  };

  return (
    <Modal show={show ?? false} onHide={handleModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update restaurant Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={(e) => e.preventDefault()}>
          <Row className="restaurant-edit-form-row">
            <Form.Group as={Col}>
              <Form.Label>opening_time</Form.Label>
              <Form.Control
                required
                type="time"
                placeholder="Opening time"
                value={formData.opening_time}
                onChange={(e) => handleChange(e, "opening_time")}
              />
            </Form.Group>
          </Row>
          <Row className="restaurant-edit-form-row">
            <Form.Group as={Col}>
              <Form.Label>Maximum tables</Form.Label>
              <Form.Control
                required
                type="time"
                placeholder="Closing time"
                value={formData.closing_time}
                onChange={(e) => handleChange(e, "closing_time")}
              />
            </Form.Group>
          </Row>
          <Row className="restaurant-edit-form-row">
            <Form.Group as={Col}>
              <Form.Label>Maximum tables</Form.Label>
              <Form.Control
                required
                type="number"
                placeholder="Maximum tables"
                value={formData.max_tables}
                onChange={(e) => handleChange(e, "max_tables")}
              />
            </Form.Group>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {isLoading ? (
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="lg"
          />
        ) : (
          <>
            <Button variant="primary" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleModalSave}>
              Save
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default EditRestaurantModal;
