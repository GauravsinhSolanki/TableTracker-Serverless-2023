import { useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import { useEffect, useState } from "react";
import config from "../../../../config.json";
import axios from "axios";
import "../../../assets/scss/display-menu.css";
import { Button } from "react-bootstrap";

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


  return (
    <div>
        <div className="row action-buttons">
            <Button>
                Edit Menu
            </Button>
            <Button
                variant="danger"
            >
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
                    <br/>
                    <b>Price</b> : {item.price}$
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
      </div>
    </div>
  );
}

export default DisplayMenu;
