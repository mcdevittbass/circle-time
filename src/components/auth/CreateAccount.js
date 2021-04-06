import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, FormGroup, Col, Input, Label, Button, Card, CardBody, CardHeader } from 'reactstrap';
import { FirebaseContext } from '../firebase/context';

const CreateAccount = ({ setCurrentComponent }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCompare, setPasswordCompare] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState(null);

    const history = useHistory();
    const firebase = useContext(FirebaseContext);

    let isInvalid = password !== passwordCompare ||
        password === '' ||
        email === '' ||
        name === '';

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        //creates authorization
        try {
            const authUser = await firebase.doCreateUserWithEmailAndPassword(email, password)
            try {
                //adds user to realtime database
                await firebase.user(authUser.user.uid)
                    .set({
                        email,
                        name,
                        rooms: {}
                    });
                clearForm();
                setCurrentComponent('Login');
                history.push('/home');
            } catch(err) {
                setError(err);
            }
        } catch(err) {
                setError(err);
            }; 
    }

    const handleInputChange = (e) => {
        if(e.target.name === 'email') {
            setEmail(e.target.value);
        } else if(e.target.name === 'password') {
            setPassword(e.target.value);
        } else if(e.target.name === 'passwordCompare') {
            setPasswordCompare(e.target.value);
        } else {
            setName(e.target.value);
        }
        //console.log(e.target.name + ': ' + e.target.value);
    }

    const clearForm = (e) => {
        setEmail('');
        setPassword('');
        setPasswordCompare('');
    }

    return (
        <Card>
            <CardHeader>
                <b>Create an Account</b>
            </CardHeader>
            <CardBody>
                <Form id="loginForm" onSubmit={handleSubmit}>
                    <FormGroup className="row">
                        <Col>
                            <Label className="col-form-label" htmlFor="email">Name</Label>
                        </Col>
                        <Col className="col-sm-8">
                            <Input type="text" id="name" name="name" placeholder="What would you like us to call you?"
                            value={name}
                            onChange={handleInputChange} />
                        </Col>
                    </FormGroup>
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
                            value={passwordCompare}
                            onChange={handleInputChange}/>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col md={{size: 10, }} className='text-right'>
                            <Button className='m-1' color="secondary" onClick={clearForm}>Cancel</Button>
                            <Button type="submit" className='btn submit-button' disabled={isInvalid}>
                                Create Account
                            </Button>
                        </Col>
                    </FormGroup>
                    {error && <p>{error.message}</p>}
                </Form>
            </CardBody>
        </Card>
        
    );
}

export default CreateAccount;