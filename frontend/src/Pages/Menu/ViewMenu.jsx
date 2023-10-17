import { useParams } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

function ViewMenu() {
  const { restaurantId } = useParams();

  // Now, the 'id' variable contains the 'menu_id' from the URL

  return (
    <div className="container mt-5">
        <h1>Hello {restaurantId}</h1>
        <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src="https://lh3.googleusercontent.com/wAPeTvxh_EwOisF8kMR2L2eOrIOzjfA5AjE28W5asyfGeH85glwrO6zyqL71dCC26R63chADTO7DLOjnqRoXXOAB8t2f4C3QnU6o0BA" />
            <Card.Body>
                <Card.Title>Product Name</Card.Title>
                <Card.Text>
                    Product description goes here.
                </Card.Text>
                <Row>
                    <Col sm="2">
                        <Button variant="primary input-group-prepend">-</Button>
                    </Col>
                    <Col sm="4">
                        <Form.Control type="qty" placeholder="Qty" value={0} />
                    </Col>
                    <Col sm="2">
                        <Button variant="primary nput-group-append">+</Button>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    </div>
  );
}

export default ViewMenu;
