import React from 'react';
import { Form, Row, Col, Input, Button } from 'reactstrap';

const InputFields = (props) => {

    const handleSubmit = (e) => {
        e.preventDefault();
        if(props.name.length > 0) {
            props.onNameChange(props.name);
        }
        props.onWordChange(props.keyword);
        props.setName('');
        props.setKeyword('');
    }

    return (
        <Form onSubmit={handleSubmit} className='m-5'>
            <Row className='form-group'>
                <Col sm='2'>
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
                <Col sm='2'>
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
                <Col sm='2'>
                    <Button color="info" type="submit">Submit</Button>
                </Col>
            </Row>
        </Form>
    )
}

export default InputFields;