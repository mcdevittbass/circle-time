import React, { useState } from 'react';
import { Form, Row, Col, Input, Button, Modal, ModalHeader, ModalBody, Label, FormGroup } from 'reactstrap';


const QuestionButton = ( { setQuestionText, buttonText }) => {
    const [isModalOpen, setModal] = useState(false);
    const [tempQ, setTempQ] = useState(''); 

    const toggleModal = () => setModal(!isModalOpen);

    const handleSubmit = (e) => {
        e.preventDefault();
        setQuestionText(tempQ);
        toggleModal();
    }

    const handleClose = (e) => {
        e.preventDefault();
        setTempQ('');
        toggleModal();
    }

    return (
        <React.Fragment>
            <Button onClick={toggleModal} className='m-2'>
                {buttonText}
            </Button>
            <Modal isOpen={isModalOpen} toggle={toggleModal}>
                <ModalHeader>Select a name/keyword combo</ModalHeader>
                <ModalBody>
                    <Form>   
                        <Row className='form-group px-5'>
                            <Col>
                                <Input 
                                    placeholder='Pose your question to the group'
                                    type='text' 
                                    name='question' 
                                    id='question'
                                    value={tempQ}
                                    onChange={e => setTempQ(e.target.value)} 
                                /> 
                            </Col>        
                        </Row>
                        <Row style={{justifyContent: 'right'}}>
                            <Col>
                                <Button color="secondary" type="cancel" onClick={handleClose}>Cancel</Button>
                            </Col>
                            <Col>
                                <Button color="info" type="submit" onClick={handleSubmit}>Submit</Button>
                            </Col>
                        </Row>
                    </Form>
                </ModalBody>
            </Modal>
        </React.Fragment>
    )
}

export default QuestionButton;