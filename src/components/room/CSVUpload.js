import React from 'react';
import { CSVReader } from 'react-papaparse';
import { Button, Row, Col } from 'reactstrap';

const buttonRef = React.createRef();

const CSVUpload = ({ participantInputs, setParticipantInputs }) => {

    const handleOpenDialog = (e) => {
        if(buttonRef.current) {
            buttonRef.current.open(e);
        }
    }

    const handleOnFileLoad = (data) => {
        const newParticipants = [];
        data.forEach(row => {
            let name = row.data[0];
            let keyword = row.data[1];
            if(name) {
                newParticipants.push({name: name, keyword: keyword})
            }
        });
        setParticipantInputs(newParticipants);
    }

    const handleOnError = (err, file, inputElem, reason) => {
        console.error(err);
    }

    const handleOnRemoveFile = (data) => {
        console.log(data);
    }

    const handleRemove = (e) => {
        e.preventDefault();
        if(buttonRef.current) {
            buttonRef.current.removeFile(e);
            setParticipantInputs([{name: '', keyword: ''}]);
        }
    }

    return (
        <CSVReader
            ref={buttonRef}
            onFileLoad={handleOnFileLoad}
            onError={handleOnError}
            noClick
            noDrag
            config={{}}
            style={{}}
            onRemoveFile={handleOnRemoveFile}
            >
            {({ file }) => (
                <aside>
                    <Row className='m-1'>
                        <Button
                            className='btn-light'
                            type='button'
                            onClick={handleOpenDialog}
                        >
                            Add participants from CSV
                        </Button>
                    </Row>
                    {file && 
                        <Row className='m-1'>
                            <Col>
                                {file.name}
                            </Col>
                            <Col>
                                <Button className='btn-light' style={{border: '1px solid red'}} onClick={handleRemove}>Remove</Button>
                            </Col>
                        </Row>
                    }
                </aside>
            )}
        </CSVReader>
      );
}

export default CSVUpload;