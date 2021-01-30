import React, { useState } from 'react';
import { Form, Row, Col, Input, Button, Modal, ModalHeader, ModalBody } from 'reactstrap';

const InputFields = (props) => {
    const [isModalOpen, setModal] = useState(false);

    const toggleModal = (e) => {
        if(!isModalOpen) {
            e.preventDefault();
        }
        setModal(!isModalOpen);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(props.name) {
            props.onNameChange(props.name);
        }
        if(props.keyword) {
            props.onWordChange(props.keyword)
        }
        handleClose();
    }
    const handleClose = () => {
        props.setName('');
        props.setKeyword('');
        toggleModal();
    }

    return (
        <React.Fragment>
            <Button style={{backgroundColor:'#5E7416'}} onClick={(e) => toggleModal(e)} className='m-2'>
                Add a name/keyword
            </Button>
            <Modal isOpen={isModalOpen} toggle={toggleModal} size={'sm'}>
                <ModalHeader>Add a name/keyword</ModalHeader>
                <ModalBody>
                    <Form>
                        <Row className='form-group'>
                            <Col>
                                <Input 
                                    type="text" 
                                    name="name" 
                                    id="name" 
                                    value={props.name} 
                                    onChange={e => props.setName(e.target.value)} 
                                    placeholder="Your Name Here" />
                            </Col>
                        </Row>
                        <Row className='form-group'>
                            <Col>
                                <Input 
                                    type="text" 
                                    name="keyword" 
                                    id="keyword" 
                                    value={props.keyword} 
                                    onChange={e => {
                                        props.setKeyword(e.target.value);
                                        e.preventDefault();
                                    }} 
                                    placeholder="Your Key Word" />
                            </Col>
                        </Row>
                        <Row className='form-group'>
                            <Col>
                                <Button color="secondary" onClick={handleClose}>Cancel</Button>
                            </Col>
                            <Col>
                                <Button color="info" onClick={handleSubmit}>Submit</Button>
                            </Col>
                        </Row>
                    </Form>
                </ModalBody>
            </Modal>
        </React.Fragment>
    )
}

export default InputFields;