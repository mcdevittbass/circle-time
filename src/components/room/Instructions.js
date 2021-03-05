import React from 'react';
import { Card, CardBody, CardHeader, Row, Col} from 'reactstrap';

const Instructions = () => {
    return (
        <Card className='instructions-card'>
            <CardHeader><h5>Helpful Hints</h5></CardHeader>
            <CardBody>
                <Row>
                    <p>Click "Create a Room" to enter your participant names, create a title, 
                        select a center image, and add co-hosts, then navigate to your room!
                        Or, select "Go to Room" for any of your previously-created rooms.</p>
                </Row>
                <Row>
                    <p>Once you are in your room, you can change any of your parameters by 
                        clicking "Update Room."</p>
                </Row>
                <Row>
                    <p>The left and right arrow keys let you move the talking feather clockwise (right arrow)
                        or counterclockwise (left arrow) around the circle.
                    </p>
                </Row>
                <Row>
                    <p>The backslash key (\) allows you to randomize the talking feather. When it returns to
                        the name on the right side of the circle (the first name you entered), it has reached 
                        everyone in the circle.
                    </p>
                </Row>
                <Row>
                    <p>The spacebar key cycles through the keywords you have (optionally) added, adding one to the center at a time.
                        After a word has been in the center, it is added to the "pot." When all words have been in the pot,
                        they return to the left side list.
                    </p>
                </Row>
            </CardBody>
        </Card>
    )
}

export default Instructions;