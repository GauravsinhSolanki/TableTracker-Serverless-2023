import { useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import { useEffect, useState } from "react";
import config from "../../../../config.json";
import axios from "axios";
import "../../../assets/scss/display-menu.css";
import { Button } from "react-bootstrap";
import { AuthCheck } from "../../Customer/Authentication/AuthCheck";

function DisplayMenu() {
  const { restaurantId } = useParams();

  const [error, setError] = useState(false);
  const [items, setItems] = useState(null);

  useEffect(() => {
    const getMenuData = async () => {
      const url = config.Menu.getApiUrl;
      try {
        let result = await axios.get(`${url}/${restaurantId}`);
        setItems(result.data.items);
      } catch (err) {
        setError(err);
      }
    };

    getMenuData();
  }, [restaurantId]);

  const processDelete = () => {
    console.log(config);
    axios
      .delete(`${config.Menu.deleteApiUrl}/${restaurantId}`)
      .then((response) => {
        console.log("Record deleted successfully", response.data);
        // TODO : Redirect to the dashboard which we will see after login
        // Since that feature is pending, it needs to be changed
        //window.location = '/';
      })
      .catch((error) => {
        console.error("Error deleting record", error);
      });
  };

  return (
    <div>
      <div className="row action-buttons">
        <Button href={`/partner/manage-menu/${restaurantId}`}>Edit Menu</Button>
        <Button variant="danger" onClick={processDelete}>
          Delete Menu
        </Button>
      </div>
      <div className="row">
        {items &&
          items.map((item, index) => (
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
                  {item.discount > 0 ? (
                    <>
                      &nbsp;
                      <span className="discounted-price">${item.price}</span>
                      <span>
                        {" "}
                        ${item.price - (item.price * item.discount) / 100}
                      </span>
                    </>
                  ) : (
                    <span> ${item.price}</span>
                  )}
                  <br />
                  <b>Availability</b> :{" "}
                  {item.availability == true ? "Available" : "Unavailable"}
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
      </div>
    </div>
  );
}

const DisplayMenuPage = AuthCheck(DisplayMenu);
export default DisplayMenuPage;
