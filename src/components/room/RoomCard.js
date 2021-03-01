import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, Card, CardTitle, CardBody, Button, CardHeader, Row } from 'reactstrap';
import { FirebaseContext } from '../firebase/context';
import DeleteModal from './DeleteModal';

const RoomCard = ({ roomId, setRoomId, authUser, roomRelation }) => {
    const [rooms, setRooms] = useState([]);
    const [isModalOpen, setModal] = useState(false);

    const firebase = useContext(FirebaseContext);

    const toggleModal = () => setModal(!isModalOpen);

    const handleDelete = async (e, roomKey) => {
        e.preventDefault();
        //look up cohosts, delete room from their user record
        //delete room from host user
        //delete room from rooms db
        try {
            const cohostsSnap = await firebase.room(roomKey).child("cohosts").get();
            const cohosts = cohostsSnap.exists() ? cohostsSnap.val() : null;
            if(cohosts) {
                for(let cohost in cohosts) {
                    let newRooms = {};
                    let snap = await firebase.user(cohost).child("cohostedRooms").get();
                    const rooms = snap.exists() ? snap.val() : null;
                    if(rooms) {
                        for(let room in rooms) {
                            if(room !== roomKey) newRooms[room] = true;
                        }
                    }
                    firebase.user(cohost).update({cohostedRooms: newRooms});

                }
            }

            const hostSnap = await firebase.room(roomKey).child("host").get();
            const host = hostSnap.exists() ? hostSnap.val() : null;
            if(host) {
                const newHostRooms = {};
                const hostSnap = await firebase.user(host).child("ownedRooms").get();
                const hostRooms = hostSnap.exists() ? hostSnap.val() : null;
                if(hostRooms) {
                    for(let room in hostRooms) {
                        if(room !== roomKey) newHostRooms[room] = true;
                    }
                }
                firebase.user(host).update({ownedRooms: newHostRooms});
            }

            firebase.room(roomKey).remove();


        } catch(err) {
            console.error(err);
        }
        toggleModal();
    }

    const dateSwitcharoo = (date) => {
        let justDate = date.slice(0,10);
        return justDate.slice(5) + '-' + justDate.slice(0,4);
    }

    useEffect(() => {
        (async () => {
            try {
                let userRef = await firebase.user(authUser.uid);
                let whichHost = roomRelation === 'owned' ? 'ownedRooms' : 'cohostedRooms';
                userRef.on('value', async (snapshot) => {
                    console.log(snapshot.val());
                    const roomsObj = snapshot.val()[whichHost];
                    console.log(roomsObj);
                    if(roomsObj) {
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
                        console.log(roomsArr)
                        setRooms(roomsArr);
                    } else {
                        setRooms([]);
                    }
                })
            } catch(err) {
                console.error(err);
            } 
        })();

        return () => {
            firebase.user(authUser.uid).off();
        }
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
                        <CardHeader>
                            <Row className='p-2 align-content-center'>
                                <Col>
                                    <CardTitle>{room.title}</CardTitle>
                                </Col>
                                <Col className='col-sm-3'>
                                    <DeleteModal 
                                        roomRelation={roomRelation} 
                                        toggleModal={toggleModal} 
                                        handleDelete={(e) => handleDelete(e, room.key)} 
                                        isModalOpen={isModalOpen}
                                    />
                                </Col>
                            </Row> 
                        </CardHeader>
                        <CardBody>
                            
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