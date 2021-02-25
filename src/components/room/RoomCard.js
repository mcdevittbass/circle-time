import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, Card, CardTitle, CardBody, Button } from 'reactstrap';
import { FirebaseContext } from '../firebase/context';

const RoomCard = ({ roomId, setRoomId, authUser, roomRelation }) => {
    const [rooms, setRooms] = useState([]);

    const firebase = useContext(FirebaseContext);

    const dateSwitcharoo = (date) => {
        let justDate = date.slice(0,10);
        return justDate.slice(5) + '-' + justDate.slice(0,4);
    }

    useEffect(() => {
        (async () => {
            try {
                let snapshot;
                if(roomRelation === 'owned') {
                    snapshot = await firebase.user(authUser.uid).child("ownedRooms").get();
                } else {
                    snapshot = await firebase.user(authUser.uid).child("cohostedRooms").get();
                }
                if(snapshot.exists()) {
                    const roomsObj = snapshot.val();
                    const roomsArr = [];
                    for(let room in roomsObj) {
                        const roomTitleSnap = await firebase.room(room).child("title").get();
                        const roomDateSnap = await firebase.room(room).child("date").get();
                        let date = dateSwitcharoo(roomDateSnap.val());
                        if(roomTitleSnap.exists() && roomDateSnap.exists()) {
                            roomsArr.push({key: room, title: roomTitleSnap.val(), date: date});
                        } else {
                            console.log('Could not get info');
                        }
                    }
                    setRooms(roomsArr);
                }
            } catch(err) {
                console.error(err);
            } 
        })();
    }, [roomId, firebase, roomRelation, authUser.uid]);

    const history = useHistory();
    const navToCircle = (e, room) => {
        setRoomId(room.key);
        history.push('/app');
    }

    return (
        rooms.length ? rooms.map(room => {
            return (
                <Col className='col col-sm-4' key={room.key}>
                    <Card>
                        <CardBody>
                            <CardTitle>{room.title}</CardTitle>
                            <CardBody>{room.date}</CardBody>
                            <Button className='submit-button' onClick={(e) => navToCircle(e, room)}>Go to room</Button>
                        </CardBody>
                    </Card>
                </Col>
            )
        })
        : <p>No rooms to display</p>
    )
}

export default RoomCard;