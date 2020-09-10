import React from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';

const InputFields = (props) => {

    const handleSubmit = (e) => {
        e.preventDefault();
        props.onNameChange(props.name);
        props.onWordChange(props.keyword);
        props.setName('');
        props.setKeyword('');
    }

    return (
        <Form onSubmit={handleSubmit}>
            <FormGroup>
                <Input type="text" name="name" id="name" value={props.name} onChange={e => props.setName(e.target.value)} placeholder="Your Name Here" />
            </FormGroup>
            <FormGroup>
                <Input type="text" name="keyword" id="keyword" value={props.keyword} onChange={e => props.setKeyword(e.target.value)} placeholder="Your Key Word" />
            </FormGroup>
            <Button color="primary" type="submit">Submit</Button>
        </Form>
    )
}

export default InputFields;