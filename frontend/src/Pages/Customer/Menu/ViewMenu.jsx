import { useParams } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useEffect, useState } from "react";
import config from "../../../../../config.json";
import axios from "axios";
import "../../../assets/scss/view-menu.css";

function ViewMenu() {
  const { restaurantId, reservationId } = useParams();

  const [error, setError] = useState(false);
  const [items, setItems] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [menuReservationId, setMenuReservationId] = useState(null);

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
    }

    useEffect(() => {
        const getMenuData = async () => {
          const url = config.Menu.getApiUrl;
          try {
            let result = await axios.get(`${url}/${restaurantId}`);
            setItems(result.data.items);
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
            if (result.data.length > 0) {
              setFormValues((prevFormValues) => {
                const updatedFormValues = { ...prevFormValues };
                result.data[0].items.forEach((item) => {
                  updatedFormValues[item.id] = item.quantity > 0 ? item.quantity : 0;
                });
                return updatedFormValues;
              });
              setMenuReservationId(result.data[0].id);
            }
      
          } catch (err) {
            setError(err);
          }
        }
      
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


    if(menuReservationId) {
        // If reservation already exists then update it
        axios.put(`${config.MenuReservations.updateApiUrl}/${menuReservationId}`, formattedData)
        .then(response => {
            console.log('Update successful:', response.data);
        })
        .catch(error => {
            console.error('Update failed:', error);
        });

    } else {
        // If there is no menu reservation then create a new one
        // TODO: 123 needs to be replaced with user Id from the session once the Auth tasks are completed
        const newMenuReservationId = restaurantId + reservationId + 123; // 123 is the dummy user Id
        const requestBody = {
            items: formattedData,
            reservationId: reservationId,
            restaurantId: restaurantId,
            userId: '123',
          };
        
        axios.post(`${config.MenuReservations.createApiUrl}/${newMenuReservationId}`, requestBody)
        .then((response) => {
            console.log('Response:', response.data);
            setMenuReservationId(newMenuReservationId);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
  }

  const processDelete = () => {
    axios.delete(`${config.MenuReservations.deleteApiUrl}/${menuReservationId}`)
    .then(response => {
        console.log('Record deleted successfully', response.data);
    })
    .catch(error => {
        console.error('Error deleting record', error);
    });
  }

  return (
    <Form className="container mt-5 text-center" onSubmit={handleSubmit}>
        <div className="row">
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
                            <Button 
                                variant="primary input-group-prepend" 
                                onClick={() =>updateItemValue(item.id, --formValues[item.id])} 
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
                                onClick={() =>updateItemValue(item.id, ++formValues[item.id])}
                            >
                                +
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        ))}
        </div>
        <Button variant="success" type="submit" className="submit-btn">Submit Reservation</Button>
        <Button variant="danger" onClick={() => processDelete()} className="delete-btn">Delete Reservation</Button>
        <Button href="#" className="cancel-btn">Cancel Modifications</Button>
    </Form>
  );
}

export default ViewMenu;
