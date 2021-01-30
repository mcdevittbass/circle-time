import React, { useState } from 'react';
import { Form, Row, Col, Input, Button, Modal, ModalHeader, ModalBody, Label, FormGroup } from 'reactstrap';

const ChangeImg = ({ setCenterImg, buttonText, buttonColor }) => {
    const [isModalOpen, setModal] = useState(false);
    const [selected, setSelected] = useState('plate');

    const toggleModal = () => {
        setModal(!isModalOpen);
    }

    const handleSelect = (e) => {
        setSelected(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setCenterImg(selected);
        toggleModal();
    }

    return (
        <React.Fragment>
            <Button style={{backgroundColor: buttonColor }} onClick={toggleModal} className='m-2'>
                {buttonText}
            </Button>
            <Modal isOpen={isModalOpen} toggle={toggleModal}>
                <ModalHeader>Select a name/keyword combo</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleSubmit}>   
                            <Row className='form-group px-5 m-0'>
                                <FormGroup>
                                    <Label>
                                        <Input type='select' name='select' id='img-select' defaultValue='Select Image' onChange={handleSelect}>
                                            <option value='plate'>Plate</option>
                                            <option value='candle'>Candle</option>
                                            <option value='empty'>No Image</option>
                                        </Input>
                                    </Label>
                                </FormGroup>
                            </Row>
                        <Row className='form-group'>
                            <Col>
                                <Button color="secondary" type="cancel">Cancel</Button>
                            </Col>
                            <Col>
                                <Button color="info" type="submit">Submit</Button>
                            </Col>
                        </Row>
                    </Form>
                </ModalBody>
            </Modal>
        </React.Fragment>
    )
}

export default ChangeImg;