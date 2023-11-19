import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { getRestaurants } from "../Services/RestaurantServices/RestaurantServices";

const RestaurantPopup = (props) => {
  const [restaurants, setRestaurants] = useState(null);
  const [selectedRestaurantName, setSelectedRestaurantName] = useState(null);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);

  const fetchData = async () => {
    const data = await getRestaurants();
    setRestaurants(data);
    if (data?.length > 0) {
      setSelectedRestaurantName(data[0].restaurant_name);
      setSelectedRestaurantId(data[0].restaurant_id);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClose = () => {
    if (props?.handleClose) {
      props.handleClose();
    }
  };

  const handleSave = () => {
    if (props?.handleSave) {
      props.handleSave(selectedRestaurantId, selectedRestaurantName);
    }
  };

  const handleChange = (e) => {
    setSelectedRestaurantId(e.target.value);
    setSelectedRestaurantName(
      e.target.options[e.target.options.selectedIndex].text ?? ""
    );
  };

  return (
    <Modal show={props?.show ?? false} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Select Restaurant</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="restaurant-modal-desc">
          Hello new Partner. Please select a restaurant to finish signup.
        </div>
        <Form.Select onChange={handleChange} value={selectedRestaurantId ?? ""}>
          <option>Select restaurant</option>
          {restaurants?.length > 0 ? (
            restaurants.map((res, index) => {
              return (
                <option
                  key={`res-modal-option-${index}`}
                  value={res.restaurant_id}
                >
                  {res.restaurant_name}
                </option>
              );
            })
          ) : (
            <option>No restaurants found</option>
          )}
        </Form.Select>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RestaurantPopup;
