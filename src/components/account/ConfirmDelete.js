import React, { useContext } from 'react';
import { Modal, Button, ModalBody, ModalHeader, Row, Col} from 'reactstrap';
import { FirebaseContext } from '../firebase/context';

const ConfirmDelete = ({ roomId, authUser, isModalOpen, setModal }) => {
    
    const firebase = useContext(FirebaseContext);

    const toggleModal = () => setModal(!isModalOpen);

    const handleDelete = async (e) => {
        try {
            const cohostedRoomsRef = await firebase.user(authUser.uid).child('cohostedRooms').get();
            const newRooms = {};
            const rooms = cohostedRoomsRef.val();
            if(rooms) {
                for(let room in rooms) {
                    console.log(room);
                    if(room !== roomId) newRooms[room] = true;
                }
                console.log(newRooms)
                firebase.user(authUser.uid).update({cohostedRooms: newRooms})
            }
            toggleModal();

        } catch(err) {
            console.error(err);
        }
    }


    return (
        <React.Fragment>
            <Modal returnFocusAfterClose={false} isOpen={isModalOpen} toggle={toggleModal} className='modal-lg'>
                <ModalHeader toggle={toggleModal}>Delete Room</ModalHeader>
                <ModalBody style={{margin: 'auto'}}>
                    <Row className='mb-3'>
                        <Col>
                            You no longer have access to this room. Would you like to delete it from your account?
                        </Col>
                    </Row>
                    <Row>
                        <Col className='d-flex justify-content-end'>
                            <Button className='mx-1' color="secondary" type="cancel" onClick={toggleModal}>Cancel</Button>
                            <Button color="info" type="submit" onClick={handleDelete}>Delete</Button>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        </React.Fragment>
    )
}

export default ConfirmDelete;