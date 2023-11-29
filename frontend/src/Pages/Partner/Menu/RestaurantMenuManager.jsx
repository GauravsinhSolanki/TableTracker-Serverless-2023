import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Card } from "react-bootstrap";
import config from "../../../../config.json";
import "../../../assets/scss/manage-menu.css";
import { AuthCheck } from "../../Customer/Authentication/AuthCheck";

function RestaurantMenuManager() {
  const { restaurantId } = useParams();

  const [error, setError] = useState(false);
  const [items, setItems] = useState([]);
  const [hasMenu, setHasMenu] = useState(true);

  // State for form inputs
  const [editedItems, setEditedItems] = useState(null);

  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    img: "",
    availability: true,
    discount: 0,
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
        setHasMenu(false);
        setError(err);
      }
    };
    getMenuData();
  }, [restaurantId]);

  const handleUpdateItem = (index) => {
    // Update the items state with the edited item
    setItems([
      ...items.slice(0, index),
      editedItems[index],
      ...items.slice(index + 1),
    ]);
  };

  const handleAddNewItem = () => {
    if (items == undefined) {
      setItems([]);
    } else {
      // Add the new item to the items state
      setItems([...items, newItem]);
      setEditedItems([...items, newItem]);
    }
    console.log(editedItems);
    // Clear the new item form fields after adding
    setNewItem({
      name: "",
      description: "",
      price: "",
      img: "",
      availability: true,
      discount: 0,
    });
  };

  const handleNewInputChange = (key, value) => {
    setNewItem({ ...newItem, [key]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    items.forEach(function (item, i) {
      item.id = i + 1;
    });

    console.log(items);

    if (hasMenu) {
      // If reservation already exists then update it
      axios
        .put(`${config.Menu.updateApiUrl}/${restaurantId}`, items)
        .then((response) => {
          console.log("Update successful:", response.data);
        })
        .catch((error) => {
          console.error("Update failed:", error);
        });
    } else {
      // If there is no menu  then create a new one
      const requestBody = {
        id: restaurantId,
        restaurantId: restaurantId,
        items: items,
        discount: 0,
      };

      axios
        .post(`${config.Menu.createApiUrl}/${restaurantId}`, requestBody)
        .then((response) => {
          console.log("Response:", response.data);
          setHasMenu(true);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  return (
    <div className="row manage-menu-row">
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
                <Form.Group controlId={`formItemIsAvailable-${index}`}>
                  <Form.Label>Availability</Form.Label>
                  <Form.Control
                    as="select"
                    value={editedItems[index].availability}
                    onChange={(e) => {
                      const newItems = [...editedItems];
                      newItems[index].availability = e.target.value === "true";
                      setEditedItems(newItems);
                    }}
                  >
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId={`formItemDiscount-${index}`}>
                  <Form.Label>Discount</Form.Label>
                  <Form.Control
                    type="text"
                    value={editedItems[index].discount}
                    onChange={(e) => {
                      const newItems = [...editedItems];
                      newItems[index].discount = e.target.value;
                      setEditedItems(newItems);
                    }}
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  onClick={() => handleUpdateItem(index)}
                  className="btn-update"
                >
                  Update Item
                </Button>
              </Form>
            </Card.Body>
          </Card>
        ))}
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
                rows={2}
                value={newItem.description}
                onChange={(e) =>
                  handleNewInputChange("description", e.target.value)
                }
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
            <Form.Group controlId="formItemIsAvailable">
              <Form.Label>Availability</Form.Label>
              <Form.Control
                as="select"
                value={newItem.availability}
                onChange={(e) => {
                  handleNewInputChange("availability", e.target.value);
                }}
              >
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formItemDiscount">
              <Form.Label>Discount</Form.Label>
              <Form.Control
                type="text"
                value={newItem.discount}
                onChange={(e) => {
                  handleNewInputChange("discount", e.target.value);
                }}
              />
            </Form.Group>
            <Button
              variant="primary"
              onClick={handleAddNewItem}
              className="btn-add"
            >
              Add Item
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="row  manage-menu-row action-buttons">
        <Button variant="danger" href={`/partner/menu/${restaurantId}`}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleSubmit}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}

const RestaurantMenuManagerPage = AuthCheck(RestaurantMenuManager);
export default RestaurantMenuManagerPage;
