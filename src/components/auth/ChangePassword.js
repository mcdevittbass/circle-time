import React, { useState, useContext } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Form, Input, FormGroup, Label, Col } from 'reactstrap';
import { FirebaseContext } from '../firebase/context';

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordCompare, setPasswordCompare] = useState('');
    const [error, setError] = useState(null);
    const [isModalOpen, setModal] = useState(false);

    const firebase = useContext(FirebaseContext);

    let isInvalid = newPassword !== passwordCompare ||
        oldPassword === '' ||
        newPassword === '';

    const toggleModal = () => setModal(!isModalOpen);

    const clearValues = () => {
        setOldPassword('');
        setNewPassword('');
        setPasswordCompare('');
    }

    const handleCancel = () => {
        clearValues();
        toggleModal();
    }

    const handleInputChange = (e) => {
        if(e.target.name === 'oldPassword') {
            setOldPassword(e.target.value);
        } else if(e.target.name === 'newPassword') {
            setNewPassword(e.target.value);
        } else if(e.target.name === 'passwordCompare') {
            setPasswordCompare(e.target.value);
        }
    }

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            await firebase.doReauthenticate(oldPassword)
            try {
                await firebase.doPasswordUpdate(newPassword);
                clearValues();
                toggleModal();
            } catch(err) {
                setError(err);
                return;
            }   
        } catch (err) {
            setError(err);
            return;
        }
    }

    return (
        <>
            <Button className='submit-button' onClick={toggleModal}>Change Password</Button>
            <Modal isOpen={isModalOpen} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>Change your password</ModalHeader>
                <ModalBody>
                    <Form id='change-password' onSubmit={handleChangePassword}>
                        <FormGroup className="row">
                            <Col>
                                <Label className="col-form-label" htmlFor="oldPassword">Old Password</Label>
                            </Col>
                            <Col className="col-sm-8">
                                <Input type="password" id="oldPassword" name="oldPassword" placeholder="Old Password"
                                value={oldPassword}
                                onChange={handleInputChange} />
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Col>
                                <Label className="col-form-label" htmlFor="newPassword">New Password</Label>
                            </Col>
                            <Col className="col-sm-8">
                                <Input type="password" id="newPassword" name="newPassword" placeholder="New Password" 
                                value={newPassword}
                                onChange={handleInputChange}/>
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Col>
                                <Label className="col-form-label" htmlFor="passwordCompare">Re-enter New Password</Label>
                            </Col>
                            <Col className="col-sm-8">
                                <Input type="password" id="passwordCompare" name="passwordCompare" placeholder="Same Password" 
                                value={passwordCompare}
                                onChange={handleInputChange}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md={{size: 10, }} className='text-right'>
                                <Button className='m-1' color="secondary" onClick={handleCancel}>Cancel</Button>
                                <Button type="submit" className='btn submit-button' disabled={isInvalid}>
                                    Create Account
                                </Button>
                            </Col>
                        </FormGroup>
                        {error && <p>{error.message}</p>}
                    </Form>
                </ModalBody>
            </Modal>
        </>
    )
}

export default ChangePassword;