import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Row, Col, Button } from 'reactstrap';
import FirebaseContext from '../firebase/context';
import AuthError from '../auth/AuthError';
import ChangePassword from '../auth/ChangePassword';
import ParamsForm from '../room/ParamsForm';
import RoomCard from '../room/RoomCard';


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

            {/*Button with modal to create room*/}
            <Row className='row p-4 justify-content-center'>
                <ParamsForm authUser={authUser} setRoomId={setRoomId} roomParams={null}/>
            </Row>

            <Row className='row p-3 m-2'>
                <p>My Rooms</p>
            </Row>
            <Row className='row p-3 m-2'>
                <RoomCard roomId={roomId} setRoomId={setRoomId} authUser={authUser} roomRelation='owned'/>
            </Row>

            <Row className='row p-3 m-2'>
                <p>Rooms shared with me</p>
            </Row>
            <Row className='row p-3 m-2'>
                <RoomCard roomId={roomId} setRoomId={setRoomId} authUser={authUser} roomRelation='cohosted'/>
            </Row>
        </>
    );
}

export default AccountPage;