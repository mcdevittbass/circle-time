import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import Login from './Login';
import CreateAccount from './CreateAccount';
//controlled form
//option to create account

const HomePage = () => {
    return (
    <Container className='container-fluid'>
        <Row>
            <h1 className='title-text'>Circle Up</h1>
        </Row>
        <Row>
            <Col sm={6}>
                <CreateAccount />
            </Col>
            <Col sm={6} className='login'>
                <Login />
            </Col>
        </Row>
    </Container>
    );
}

export default HomePage;