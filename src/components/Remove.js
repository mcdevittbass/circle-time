import React, { useState } from 'react';
import { Form, Row, Col, Input, Button, Modal, ModalHeader, ModalBody, Label, FormGroup } from 'reactstrap';


const Remove = ( { items, setItems, setNames }) => {
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
        let updatedItems = items.filter(circle => !checkedBoxes.includes(circle));
        setItems(updatedItems);
        let updatedNames = updatedItems.map(item => item.text);
        setNames(updatedNames);
        toggleModal();
    }

    return (
        <React.Fragment>
            <Button color='secondary' onClick={toggleModal} className='m-2'>
                Remove a name/keyword
            </Button>
            <Modal isOpen={isModalOpen} toggle={toggleModal}>
                <ModalHeader>Select a name/keyword combo</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleSubmit}>   
                        {items.map(item => (
                            <Row className='form-group px-5 m-0' key={item.key}>
                                <FormGroup>
                                    <Label>
                                        <Input type='checkbox' checked={checkedBoxes.includes(item) ? true : false} onChange={(e) => handleCheck(e, item)}/>
                                            Name: {item.text}, Keyword: {item.keyword}
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