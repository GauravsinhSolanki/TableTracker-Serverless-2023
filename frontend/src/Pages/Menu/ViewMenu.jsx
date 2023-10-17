import { useParams } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useEffect, useState } from "react";
import config from "../../../../config.json";
import axios from "axios";
import "../../assets/scss/view-menu.css";

function ViewMenu() {
  const { restaurantId } = useParams();

  const [error, setError] = useState(false);
  const [items, setItems] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const url = config.Menu.getApiUrl;
      try {
        let result = await axios.get(url + restaurantId);
        setItems(result.data.items);
        console.log(result.data.items);
      } catch (err) {
        setError(err);
      }
    };
    getData();
  }, [restaurantId]);

  return (
    <Row className="container mt-5">
        {items && items.map((item, index) => (
            <Card className="menu-item-cards" style={{ width: '18rem' }} key={index} id={"item-" + index}>
                <Card.Img variant="top" src={item.img} />
                <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>
                        {item.description}
                    </Card.Text>
                    <Row className="quantity-row">
                        <Col sm="2">
                            <Button variant="primary input-group-prepend">-</Button>
                        </Col>
                        <Col sm="4">
                            <Form.Control type="qty" placeholder="Qty" value={0} />
                        </Col>
                        <Col sm="2">
                            <Button variant="primary input-group-append">+</Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        ))}
    </Row>
  );
}

export default ViewMenu;
