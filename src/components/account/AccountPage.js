import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Row, Col, Button, Card, CardTitle } from 'reactstrap';
import { FirebaseContext } from '../firebase/context';
import AuthError from '../auth/AuthError';
import ChangePassword from '../auth/ChangePassword';
import ParamsForm from '../room/ParamsForm';
import RoomCard from './RoomCard';
import Instructions from '../room/Instructions';


const SignOut = () => {
    const history = useHistory();
    const firebase = useContext(FirebaseContext);
    
    const handleSignout = (e) => {
        firebase.doSignOut();
        history.push('/home');
    }

    return (
        <Button className='submit-button' onClick={handleSignout}>Log Out</Button>
    )
}

const AccountPage = ( { authUser, roomId, setRoomId }) => {
    const [userName, setUserName] = useState('');

    const firebase = useContext(FirebaseContext);

    useEffect(() => {
        if(authUser) {
            (async () => {
                const snapshot = await firebase.user(authUser.uid).child("name").get();
                const name = snapshot.val();
                setUserName(name);
            })();
        }
    }, [firebase, authUser])
    return (
        !authUser 
        ?
        <AuthError />
        :  
        <>
            {/*Heading with change password and sign out buttons -- later change to dropdown?*/}
            <Row className='row p-4 account-header justify-content-end'>
                <Col className='col-12 col-md-6 offset-md-1'><p>Circle Up</p></Col>
                <Col className='col-6 col-md-2'>
                    <ChangePassword />
                </Col>
                <Col className='col-6 col-md-2 offset-md-1'>
                    <SignOut />  
                </Col>
            </Row>

            <Row>
                <Col className='text-center hello'><h5>Hi, {userName}!</h5></Col>
            </Row>

            <Row>
                <Instructions />
            </Row>

            {/*Button with modal to create room*/}
            <Row className='row p-4'>
                <Col className='text-center p-0'>
                    <ParamsForm authUser={authUser} setRoomId={setRoomId} roomParams={null} />
                </Col>
            </Row>

            <Row>
                <Card body className='text-center'>
                    <CardTitle><h5>My Rooms</h5></CardTitle>
                    <Row>
                        <RoomCard roomId={roomId} setRoomId={setRoomId} authUser={authUser} roomRelation='owned'/>
                    </Row>
                </Card>
            </Row>

            <Row>
                <Card body className='text-center'>
                    <CardTitle><h5>Rooms shared with me</h5></CardTitle>
                    <RoomCard roomId={roomId} setRoomId={setRoomId} authUser={authUser} roomRelation='cohosted'/>
                </Card>
            </Row>
        </>
    );
}

export default AccountPage;