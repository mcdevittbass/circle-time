import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, FormGroup, Col, Input, Label, Button, Card, CardBody, CardHeader } from 'reactstrap';

const CreateAccount = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCompare, setPasswordCompare] = useState('');

    let history = useHistory();

    const handleSubmit = (e) => {
        if(password !== passwordCompare) {
            alert('Your passwords didn\'t match!');
        } else { 
            history.push('/app');
        }  
    }

    const handleInputChange = (e) => {
        if(e.target.name === 'email') {
            setEmail(e.target.value);
        } else if(e.target.name === 'password') {
            setPassword(e.target.value);
        } else if(e.target.name === 'passwordCompare') {
            setPasswordCompare(e.target.value);
        }
        console.log(e.target.name + ': ' + e.target.value);
    }

    return (
        <Card>
            <CardHeader>
                <b>Create an Account</b>
            </CardHeader>
            <CardBody>
                <Form id="loginForm">
                    <FormGroup className="row">
                        <Col>
                            <Label className="col-form-label" htmlFor="email">Email</Label>
                        </Col>
                        <Col className="col-sm-8">
                            <Input type="email" id="email" name="email" placeholder="Email"
                            value={email}
                            onChange={handleInputChange} />
                        </Col>
                    </FormGroup>
                    <FormGroup className="row">
                        <Col>
                            <Label className="col-form-label" htmlFor="password">Password</Label>
                        </Col>
                        <Col className="col-sm-8">
                            <Input type="password" id="password" name="password" placeholder="Password" 
                            value={password}
                            onChange={handleInputChange}/>
                        </Col>
                    </FormGroup>
                    <FormGroup className="row">
                        <Col>
                            <Label className="col-form-label" htmlFor="passwordCompare">Re-enter Password</Label>
                        </Col>
                        <Col className="col-sm-8">
                            <Input type="password" id="passwordCompare" name="passwordCompare" placeholder="Same Password" 
            
                            onChange={handleInputChange}/>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col md={{size: 10, }} className='text-right'>
                            <Button className='m-1' color="secondary">Cancel</Button>
                            <Button type="submit" className='btn submit-button' onClick={handleSubmit}>
                                Create Account
                            </Button>
                        </Col>
                    </FormGroup>
                </Form>
            </CardBody>
        </Card>
        
    );
}

export default CreateAccount;