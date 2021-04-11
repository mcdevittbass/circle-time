import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, Card, CardTitle, Button, CardText, Row } from 'reactstrap';
import { FirebaseContext } from '../firebase/context';
import DeleteModal from './DeleteModal';
import ConfirmDelete from './ConfirmDelete';

const RoomCard = ({ roomId, setRoomId, authUser, roomRelation }) => {
    const [rooms, setRooms] = useState([]);
    const [isModalOpen, setModal] = useState(false);
    const [isSecondModalOpen, setSecondModal] = useState(false);

    const firebase = useContext(FirebaseContext);
    const history = useHistory();

    const toggleModal = () => setModal(!isModalOpen);

    useEffect(() => {
        (async () => {
            try {
                //get room ids, titles, and dates for the user
                let userRef = await firebase.user(authUser.uid);
                let whichHost = roomRelation === 'owned' ? 'ownedRooms' : 'cohostedRooms';
                userRef.on('value', async (snapshot) => {
                    const val = snapshot.val();
                    const roomsObj = val ? await snapshot.val()[whichHost] : null;
                    if(roomsObj) {
                        const roomsArr = [];
                        for(let room in roomsObj) {
                            const roomTitleSnap = await firebase.room(room).child("title").get();
                            const roomDateSnap = await firebase.room(room).child("date").get();
                            if(roomTitleSnap.exists() && roomDateSnap.exists()) {
                                let date = dateSwitcharoo(roomDateSnap.val());
                                roomsArr.push({key: room, title: roomTitleSnap.val(), date: date});
                            } else {
                                console.log('Could not get info');
                            }
                        }
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

    //helper function to deal with date display
    const dateSwitcharoo = (date) => {
        let justDate = date.slice(0,10);
        return justDate.slice(5) + '-' + justDate.slice(0,4);
    }

    const navToCircle = async (e, room) => {
        // make sure cohost has current access to room (if the main host changes permissions, it won't affect the cohost's list of rooms)
        // if user does not have current access, they may delete that room card with the second modal
        if(roomRelation === 'cohosted') {
            const cohostRef = await firebase.room(room.key).child('cohosts').get();
            const cohosts = cohostRef.val();
            if(!cohosts || !Object.keys(cohosts).includes(authUser.uid)) {
                setSecondModal(true);
                return;
            }
        }
        //reset keyword and talking stick properties before opening again
        firebase.room(room.key).update({lastWords: [], keywordIndex: -1, stickIndex: 0, randomArr: []});

        setRoomId(room.key);
        history.push('/app');
    }

    const handleDelete = async (e, roomKey) => {
        e.preventDefault();
        //look up cohosts, delete room from their user record
        //delete room from host user
        //delete room from rooms db
        //don't delete room if it's a cohost room
        if(roomRelation === 'owned') {
            try {
                const cohostsSnap = await firebase.room(roomKey).child("cohosts").get();
                const cohosts = cohostsSnap.exists() ? cohostsSnap.val() : null;
                if(cohosts) {
                    //eliminate current room from each of the cohost's reference
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
                // remove room from 
                // const hostSnap = await firebase.room(roomKey).child("host").get();
                // const host = hostSnap.exists() ? hostSnap.val() : null;
                // if(host) {
                    const newHostRooms = {};
                    const hostSnap = await firebase.user(authUser.uid).child("ownedRooms").get();
                    const hostRooms = hostSnap.exists() ? hostSnap.val() : null;
                    if(hostRooms) {
                        for(let room in hostRooms) {
                            if(room !== roomKey) newHostRooms[room] = true;
                        }
                    }
                    firebase.user(authUser.uid).update({ownedRooms: newHostRooms});
                //}
    
                firebase.room(roomKey).remove();
    
            } catch(err) {
                console.error(err);
            }
            //if deleting current user as cohost from a room - do not delete room itself
        } else {
            try {
                // remove current user from room's list of cohosts
                const cohostsSnap = await firebase.room(roomKey).child("cohosts").get();
                const cohosts = cohostsSnap.exists() ? cohostsSnap.val() : null;
                if(cohosts) {
                    const newCohosts = {};
                    for(let host in cohosts) {
                        if(host !== authUser.uid) newCohosts[host] = true;
                    }
                    firebase.room(roomKey).update({cohosts: newCohosts})
                }
                
                // remove room from current user's list of cohosted rooms 
                const roomsSnap = await firebase.user(authUser.uid).child("cohostedRooms").get();
                const rooms = roomsSnap.exists() ? roomsSnap.val() : null;
                if(rooms) {
                    const newRooms = {}; 
                    for(let room in rooms) {
                        if(room !== roomKey) newRooms[room] = true;
                    }
                    firebase.user(authUser.uid).update({cohostedRooms: newRooms});
                }
            } catch(err) {
                console.error(err);
            }
        }
        toggleModal();
    }

    return (
        rooms.length ? rooms.map(room => {
            return (
                <Col className='col col-sm-4' key={room.key}>
                    <Card body>
                        <Row>
                            <Col className='col-sm-2 offset-9 p-2'>
                                <DeleteModal 
                                    roomRelation={roomRelation} 
                                    toggleModal={toggleModal} 
                                    handleDelete={(e) => handleDelete(e, room.key)} 
                                    isModalOpen={isModalOpen}
                                />
                            </Col>
                        </Row>
                        <CardTitle><h4>{room.title}</h4></CardTitle>
                        <CardText>{room.date}</CardText>
                        <Button className='submit-button p-1' onClick={(e) => navToCircle(e, room)}>Go to room</Button>
    
                        <ConfirmDelete roomId={room.key} authUser={authUser} isModalOpen={isSecondModalOpen} setModal={setSecondModal}/>
                
                    </Card>
                </Col>
            )
        })
        : <p>No rooms to display yet...</p>
    )
}

export default RoomCard;