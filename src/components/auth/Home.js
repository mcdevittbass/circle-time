import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import Login from './Login';
import CreateAccount from './CreateAccount';
import FirebaseContext from '../firebase/context';
import PasswordReset from './PasswordReset';


const HomePage = () => {
    const [currentComponent, setCurrentComponent] = useState('Login');
    const [switchText, setSwitchText] = useState('Don\'t have an account? Create One');

    const handleChangeComponent = (e) => {
        if(currentComponent  === 'Login') {
            setCurrentComponent('Create Account');
            setSwitchText('Already have an account? Login');
        } else {
            setCurrentComponent('Login');
            setSwitchText('Don\'t have an account? Create One');
        }
    }

    const handlePasswordResetDisplay = (e) => {
        e.preventDefault();
        setCurrentComponent('Password Reset');
        setSwitchText('Login');
    }

    return (
    <>
        <Row className='login-header'>
            <Col xs={12} className='text-center title-text'>
                <h1>Circle Up</h1>
            </Col>
        </Row>
        <Container className='container-fluid'>
            <Row style={{padding: 3, justifyContent: 'center'}}>
                <Col sm={6}>
                    <FirebaseContext.Consumer>
                        {currentComponent === 'Login' ? 
                            firebase => <Login firebase={firebase}/> :
                            currentComponent === 'Create Account' ?
                            firebase => <CreateAccount firebase={firebase}/> :
                            firebase => <PasswordReset firebase={firebase}/> 
                        }
                    </FirebaseContext.Consumer>
                </Col>
            </Row>
            <Row>
                <Col className='text-center m-4'>
                    <Button color='light' onClick={handleChangeComponent}>{switchText}</Button>
                </Col>
            </Row>
            { currentComponent !== 'Password Reset' &&
            <Row>
                <Col className='text-center m-4'>
                    <Button color='light' onClick={handlePasswordResetDisplay}>Forgot your password? Click to reset.</Button>
                </Col>
            </Row>
            }
        </Container>
    </>
    );
}

export default HomePage;