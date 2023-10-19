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
  const { restaurantId, reservationId } = useParams();

  const [error, setError] = useState(false);
  const [items, setItems] = useState(null);
  const [formValues, setFormValues] = useState({});

  const handleChange = (e, itemId) => {
    // Update the formValues state when input changes
    const { value } = e.target;
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [itemId]: value, 
    }));
  };

  useEffect(() => {
    const getMenuData = async () => {
      const url = config.Menu.getApiUrl;
      try {
        let result = await axios.get(url + restaurantId);
        setItems(result.data.items);
      } catch (err) {
        setError(err);
      }
    };

    const getMenuReservationData = async () => {
        const url = config.MenuReservations.getApiUrl;
        try {
            let result = await axios.get(url + reservationId);
            (result.data[0].items).forEach(item => {
                setFormValues((prevFormValues) => ({
                    ...prevFormValues,
                    [item.id]: item.quantity, 
                  }));
            });
        } catch (err) {
            setError(err);
        }
    }


    getMenuData();
    getMenuReservationData();
  }, [restaurantId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formValues);
  }

  return (
    <Form className="container mt-5 row" onSubmit={handleSubmit}>
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
                            <Form.Control 
                                id={item.id} 
                                type="qty" 
                                placeholder="0"
                                onChange={(e) => handleChange(e, item.id)}
                                value={formValues[item.id] || 0}
                            />
                        </Col>
                        <Col sm="2">
                            <Button variant="primary input-group-append">+</Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        ))}
        <Button type="submit">Submit</Button>
    </Form>
  );
}

export default ViewMenu;
