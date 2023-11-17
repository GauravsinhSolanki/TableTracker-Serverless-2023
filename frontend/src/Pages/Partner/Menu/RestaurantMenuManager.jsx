import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Card } from "react-bootstrap";
import config from "../../../../config.json";
import "../../../assets/scss/display-menu.css";

function RestaurantMenuManager() {
  const { restaurantId } = useParams();

    const [error, setError] = useState(false);
    const [items, setItems] = useState(null);

    // State for form inputs
    const [editedItems, setEditedItems] = useState(null);

    const [newItem, setNewItem] = useState({
        name: "",
        description: "",
        price: "",
        img: "",
    });

    useEffect(() => {
        const getMenuData = async () => {
            const url = config.Menu.getApiUrl;
            try {
                let result = await axios.get(`${url}/${restaurantId}`);
                setItems(result.data.items);
                // Initialize editedItems with the same data as items
                setEditedItems(result.data.items);
            } catch (err) {
                setError(err);
            }
        };
        getMenuData();
    }, [restaurantId]);

  const handleUpdateItem = (index) => {
    // Update the items state with the edited item
    setItems([...items.slice(0, index), editedItems[index], ...items.slice(index + 1)]);
  };

  const handleAddNewItem = () => {
    // Add the new item to the items state
    setItems([...items, newItem]);
    setEditedItems([...items, newItem]);
    console.log(editedItems)
    // Clear the new item form fields after adding
    setNewItem({ name: "", description: "", price: "", img: "" });
  };

  const handleNewInputChange = (key, value) => {
    setNewItem({ ...newItem, [key]: value });
  };

  return (
    <div className="row">
      {items &&
        items.map((item, index) => (
          <Card
            className="menu-item-cards"
            style={{ width: "18rem" }}
            key={index}
            id={"item-" + index}
          >
            <Card.Body>
              <Form>
                <Form.Group controlId={`formItemName-${index}`}>
                  <Form.Label>Item Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={editedItems[index].name}
                    onChange={(e) => {
                      const newItems = [...editedItems];
                      newItems[index].name = e.target.value;
                      setEditedItems(newItems);
                    }}
                  />
                </Form.Group>
                <Form.Group controlId={`formItemDesc-${index}`}>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={editedItems[index].description}
                    onChange={(e) => {
                      const newItems = [...editedItems];
                      newItems[index].description = e.target.value;
                      setEditedItems(newItems);
                    }}
                  />
                </Form.Group>
                <Form.Group controlId={`formItemPrice-${index}`}>
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="text"
                    value={editedItems[index].price}
                    onChange={(e) => {
                      const newItems = [...editedItems];
                      newItems[index].price = e.target.value;
                      setEditedItems(newItems);
                    }}
                  />
                </Form.Group>
                <Form.Group controlId={`formItemImg-${index}`}>
                  <Form.Label>Image URL</Form.Label>
                  <Form.Control
                    type="text"
                    value={editedItems[index].img}
                    onChange={(e) => {
                      const newItems = [...editedItems];
                      newItems[index].img = e.target.value;
                      setEditedItems(newItems);
                    }}
                  />
                </Form.Group>
                <Button variant="primary" onClick={() => handleUpdateItem(index)}>
                  Update Item
                </Button>
              </Form>
            </Card.Body>
          </Card>
        ))}
        {items && (
        <Card className="menu-item-cards" style={{ width: "18rem" }}>
          <Card.Body>
            <Form>
              <Form.Group controlId="formItemName">
                <Form.Label>Item Name</Form.Label>
                <Form.Control
                  type="text"
                  value={newItem.name}
                  onChange={(e) => handleNewInputChange("name", e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formItemDesc">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newItem.description}
                  onChange={(e) => handleNewInputChange("description", e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formItemPrice">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="text"
                  value={newItem.price}
                  onChange={(e) => handleNewInputChange("price", e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formItemImg">
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                  type="text"
                  value={newItem.img}
                  onChange={(e) => handleNewInputChange("img", e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" onClick={handleAddNewItem}>
                Add Item
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}
        <div className="row action-buttons">
            <Button variant="danger">Cancel</Button>
            <Button variant="success">Save Changes</Button>
      </div>
    </div>
  );
}

export default RestaurantMenuManager;
