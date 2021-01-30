import React from 'react';
import { useHistory } from 'react-router-dom';
import { Row, Col, Button, Card, CardBody } from 'reactstrap';
import CardTitle from 'reactstrap/lib/CardTitle';

const AccountPage = (props) => {
    const history = useHistory();

    const handleSignout = (e) => {
        //add code for removing token - or whatever Firebase uses
        history.push('/home');
    }

    const navToCircle = (e) => {
        history.push('/app');
    }

    return (
        <>
            <Row className='row p-4 account-header justify-content-end'>
                <Col className='col-8 col-md-8 offset-md-1'><p>Circle Up</p></Col>
                <Col className='col-4 col-md-2 offset-md-1'>
                    <Button className='submit-button' onClick={handleSignout}>Log Out</Button>
                </Col>
            </Row>

            <Row className='row p-4 justify-content-center'>
                <Button className='submit-button'> + New Circle</Button>
            </Row>

            <Row className='row p-3 m-2'>
                <p>My Circles</p>
            </Row>
            <Row className='row p-3 m-2'>
                <Col className='col col-sm-4'>
                    <Card>
                        <CardBody>
                            <CardTitle>One of my groups</CardTitle>
                            <Button className='submit-button' onClick={navToCircle}>Go to circle</Button>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <Row className='row p-3 m-2'>
                <p>Circles shared with me</p>
            </Row>
            <Row className='row p-3 m-2'>
                <Col className='col col-sm-4'>
                    <Card>
                        <CardBody>
                            <CardTitle>One of my shared groups</CardTitle>
                            <Button className='submit-button' onClick={navToCircle}>Go to circle</Button>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    );
}

export default AccountPage;