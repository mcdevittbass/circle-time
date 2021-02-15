import React, { useState } from 'react';
import { Form, FormGroup, Col, Input, Label, Button, Card, CardBody, CardHeader} from 'reactstrap';

const PasswordReset = ({ firebase }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [done, setDone] = useState(false);

    const isInvalid = email === '';

    const handleSubmit = (e) => {
        e.preventDefault(); 
        firebase
            .doPasswordReset(email)
            .then(authUser => {
                setEmail('');
                setDone(true);
            })
            .catch(err => {
                setError(err);
            });
    }

    const handleInputChange = (e) => {
        if(e.target.name === 'email') {
            setEmail(e.target.value);
        }
    }

    return (
        done
        ?
        <>
            <span>An email has been sent!</span>
        </>
        :
        <Card>
            <CardHeader>
                <b>Send Email to Reset Password</b>
            </CardHeader>
            <CardBody>
                <Form id="passwordResetForm" onSubmit={handleSubmit}>
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
                    <FormGroup row>
                        <Col md={{size: 10, }} className='text-right'>
                            <Button className='m-1' color="secondary">Cancel</Button>
                            <Button type="submit" disabled={isInvalid} className='submit-button'>
                                Send Email
                            </Button>
                        </Col>
                    </FormGroup>
                    {error && <p>{error.message}</p>}
                </Form>
            </CardBody>
        </Card>
        
    );
}

export default PasswordReset;