import React, { useState, useEffect } from 'react';
import { Modal, Button, ModalBody, ModalHeader, Row, Col} from 'reactstrap';

const DeleteModal = ({ roomRelation, toggleModal, handleDelete, isModalOpen }) => {
    
    const [tooltipText, setTooltipText] = useState('');
    const [questionText, setQuestionText] = useState('');

    useEffect(() => {
        if(roomRelation === 'owned') {
            setTooltipText('Delete room');
            setQuestionText('Are you sure you want to delete this room permanently?')
        } else {
            setTooltipText('Remove myself as cohost')
            setQuestionText('Are you sure you want to remove yourself as Co-Host from this room?')
        }
    }, [roomRelation]);

    
    return (
        <React.Fragment>
            <Row style={{marginLeft: 15, marginTop: 10}}>
                <Col>
                    <button className='btn-close' type='button' title={tooltipText} onClick={toggleModal}></button>
                </Col>
            </Row>
            <Modal returnFocusAfterClose={false} isOpen={isModalOpen} toggle={toggleModal} className='modal-lg'>
                <ModalHeader toggle={toggleModal}>Delete Room</ModalHeader>
                <ModalBody style={{margin: 'auto'}}>
                    <Row className='mb-3'>
                        <Col>
                            {questionText}
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

export default DeleteModal;