import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, Button } from 'reactstrap';
import Instructions from './Instructions';

const InstructionsModal = () => {
    const [isModalOpen, setModal] = useState(false);

    const toggleModal = () => setModal(!isModalOpen);

    return (
        <>
            <Button onClick={toggleModal} className='m-2' style={{backgroundColor: '#6D326D'}}>Instructions</Button>
            <Modal returnFocusAfterClose={false} isOpen={isModalOpen} toggle={toggleModal} className='modal-lg'>
                <ModalHeader toggle={toggleModal}/>
                <ModalBody>
                    <Instructions />
                </ModalBody>
            </Modal>
        </>
    )
}

export default InstructionsModal;