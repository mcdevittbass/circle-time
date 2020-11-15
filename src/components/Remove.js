import React, { useState } from 'react';
import { Form, Row, Col, Input, Button, Modal, ModalHeader, ModalBody, Label, FormGroup } from 'reactstrap';


const Remove = ( { objs, setObjs, setArray, buttonText, buttonColor, listText }) => {
    const [isModalOpen, setModal] = useState(false);
    const [checkedBoxes, setChecked] = useState([]);

    const toggleModal = () => {
        setModal(!isModalOpen);
    }

    const handleCheck = (e, item) => {
        if(e.target.checked) {
            setChecked([...checkedBoxes, item]);
        } else {
            setChecked(checkedBoxes.filter(circle => circle !== item));
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        let updatedItems = objs.filter(circle => !checkedBoxes.includes(circle));
        setObjs(updatedItems);
        let updatedNames = updatedItems.map(item => item.text);
        setArray(updatedNames);
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
                        {objs.map(item => (
                            <Row className='form-group px-5 m-0' key={item.key}>
                                <FormGroup>
                                    <Label>
                                        <Input type='checkbox' checked={checkedBoxes.includes(item) ? true : false} onChange={(e) => handleCheck(e, item)}/>
                                            {listText}: {item.text}
                                    </Label>
                                </FormGroup>
                            </Row>
                        ))}
                        <Row className='form-group'>
                            <Col>
                                <Button color="secondary" type="cancel">Cancel</Button>
                            </Col>
                            <Col>
                                <Button color="info" type="submit">Delete selected</Button>
                            </Col>
                        </Row>
                    </Form>
                </ModalBody>
            </Modal>
        </React.Fragment>
    )
}

export default Remove;