import { useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useEffect, useState } from "react";
import config from "../../../../config.json";
import axios from "axios";
import "../../../assets/scss/view-menu.css";
import { AuthCheck } from "../Authentication/AuthCheck";

function ViewMenu() {
  const { restaurantId, reservationId } = useParams();

  const [error, setError] = useState(false);
  const [items, setItems] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [menuReservationId, setMenuReservationId] = useState(null);
  const [menuDiscount, setMenuDiscount] = useState(0);

  const handleChange = (e, itemId) => {
    // Update the formValues state when input changes
    const { value } = e.target;
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [itemId]: value,
    }));
  };

  const updateItemValue = (id, value) => {
    setFormValues((formValues) => ({
      ...formValues,
      [id]: value,
    }));
  };

  useEffect(() => {
    const getMenuData = async () => {
      const url = config.Menu.getApiUrl;
      try {
        let result = await axios.get(`${url}/${restaurantId}`);
        setItems(result.data.items);
        if (result.data.discount > 0) {
          setMenuDiscount(result.data.discount);
        }
        setFormValues((prevFormValues) => {
          const updatedFormValues = { ...prevFormValues };
          result.data.items.forEach((item) => {
            updatedFormValues[item.id] = 0;
          });
          return updatedFormValues;
        });
        getMenuReservationData();
      } catch (err) {
        setError(err);
      }
    };

    const getMenuReservationData = async () => {
      const url = config.MenuReservations.getApiUrl;
      try {
        let result = await axios.get(`${url}/${reservationId}`);
        if (result.data && result.data.items) {
          setFormValues((prevFormValues) => {
            const updatedFormValues = { ...prevFormValues };
            result.data.items.forEach((item) => {
              updatedFormValues[item.id] =
                item.quantity > 0 ? item.quantity : 0;
            });
            return updatedFormValues;
          });
          setMenuReservationId(result.data.id);
        }
      } catch (err) {
        setError(err);
      }
    };

    getMenuData();
  }, [restaurantId, reservationId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedData = [];

    for (const key in formValues) {
      // eslint-disable-next-line no-prototype-builtins
      if (formValues.hasOwnProperty(key)) {
        formattedData.push({
          id: key,
          quantity: formValues[key],
        });
      }
    }

    if (menuReservationId) {
      // If reservation already exists then update it
      axios
        .put(
          `${config.MenuReservations.updateApiUrl}/${menuReservationId}`,
          formattedData
        )
        .then((response) => {
          console.log("Update successful:", response.data);
        })
        .catch((error) => {
          console.error("Update failed:", error);
        });
    } else {
      // If there is no menu reservation then create a new one
      const newMenuReservationId =
        restaurantId + reservationId + sessionStorage.getItem("uId");
      const requestBody = {
        items: formattedData,
        reservationId: reservationId,
        restaurantId: restaurantId,
        userId: sessionStorage.getItem("uId"),
      };

      axios
        .post(
          `${config.MenuReservations.createApiUrl}/${newMenuReservationId}`,
          requestBody
        )
        .then((response) => {
          console.log("Response:", response.data);
          setMenuReservationId(newMenuReservationId);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const processDelete = () => {
    axios
      .delete(`${config.MenuReservations.deleteApiUrl}/${menuReservationId}`)
      .then((response) => {
        console.log("Record deleted successfully", response.data);
        window.location = "/restaurantList";
      })
      .catch((error) => {
        console.error("Error deleting record", error);
      });
  };

  return (
    <Form className="container mt-5 text-center" onSubmit={handleSubmit}>
      <div className="row">
        {items &&
          items.map(
            (item, index) =>
              item.availability == true && (
                <Card
                  className="menu-item-cards"
                  style={{ width: "18rem" }}
                  key={index}
                  id={"item-" + index}
                >
                  <Card.Img variant="top" src={item.img} />
                  <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>
                      {item.description}
                      <br />
                      <b>Price</b> :
                      {menuDiscount > 0 ? (
                        <>
                          &nbsp;
                          <span className="discounted-price">
                            ${item.price}
                          </span>
                          <span>
                            {" "}
                            ${item.price - (item.price * menuDiscount) / 100}
                          </span>
                        </>
                      ) : item.discount > 0 ? (
                        <>
                          &nbsp;
                          <span className="discounted-price">
                            ${item.price}
                          </span>
                          <span>
                            {" "}
                            ${item.price - (item.price * item.discount) / 100}
                          </span>
                        </>
                      ) : (
                        <span> ${item.price}</span>
                      )}
                    </Card.Text>
                    <Row className="quantity-row">
                      <Col sm="2">
                        <Button
                          variant="primary input-group-prepend"
                          onClick={() =>
                            updateItemValue(item.id, --formValues[item.id])
                          }
                          disabled={formValues[item.id] == 0}
                        >
                          -
                        </Button>
                      </Col>
                      <Col sm="4">
                        <Form.Control
                          id={item.id}
                          type="qty"
                          placeholder="0"
                          onChange={(e) => handleChange(e, item.id)}
                          value={formValues[item.id] || 0}
                        />
                      </Col>
                      <Col sm="2">
                        <Button
                          variant="primary input-group-append"
                          onClick={() =>
                            updateItemValue(item.id, ++formValues[item.id])
                          }
                        >
                          +
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              )
          )}
      </div>
      <Button variant="success" type="submit" className="submit-btn">
        Submit Reservation
      </Button>
      <Button
        variant="danger"
        onClick={() => processDelete()}
        className="delete-btn"
      >
        Delete Reservation
      </Button>
      <Button href="#" className="cancel-btn">
        Cancel Modifications
      </Button>
    </Form>
  );
}

const ViewMenuPage = AuthCheck(ViewMenu);
export default ViewMenuPage;
