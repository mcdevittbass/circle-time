import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Row, Col, Button, Card, CardBody } from 'reactstrap';
import CardTitle from 'reactstrap/lib/CardTitle';
import FirebaseContext from '../firebase/context';
import AuthError from '../auth/AuthError';
import ChangePassword from '../auth/ChangePassword';


const SignOut = ({ firebase }) => {
    const history = useHistory();

    const handleSignout = (e) => {
        firebase.doSignOut();
        history.push('/home');
    }

    return (
        <Button className='submit-button' onClick={handleSignout}>Log Out</Button>
    )
}

const AccountPage = ( { authUser }) => {
    const history = useHistory();

    const navToCircle = (e) => {
        history.push('/app');
    }

    return (
        !authUser 
        ?
        <AuthError />
        :  
        <>
            <Row className='row p-4 account-header justify-content-end'>
                <Col className='col-12 col-md-6 offset-md-1'><p>Circle Up</p></Col>
                <Col className='col-6 col-md-2'>
                    <FirebaseContext.Consumer>
                        {firebase => <ChangePassword firebase={firebase}/>}
                    </FirebaseContext.Consumer>
                </Col>
                <Col className='col-6 col-md-2 offset-md-1'>
                    <FirebaseContext.Consumer>
                        {firebase => <SignOut firebase={firebase}/>}
                    </FirebaseContext.Consumer>
                </Col>
            </Row>

            <Row className='row p-4 justify-content-center'>
                <Button className='submit-button'> + New Room</Button>
            </Row>

            <Row className='row p-3 m-2'>
                <p>My Rooms</p>
            </Row>
            <Row className='row p-3 m-2'>
                <Col className='col col-sm-4'>
                    <Card>
                        <CardBody>
                            <CardTitle>One of my rooms</CardTitle>
                            <Button className='submit-button' onClick={navToCircle}>Go to circle</Button>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <Row className='row p-3 m-2'>
                <p>Rooms shared with me</p>
            </Row>
            <Row className='row p-3 m-2'>
                <Col className='col col-sm-4'>
                    <Card>
                        <CardBody>
                            <CardTitle>One of my shared rooms</CardTitle>
                            <Button className='submit-button' onClick={navToCircle}>Go to circle</Button>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    );
}

export default AccountPage;