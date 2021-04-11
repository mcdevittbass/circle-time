import React, {useState, Fragment, useEffect, useContext} from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Input, Label, Col, Button, Row, FormGroup, Modal, ModalBody, ModalHeader, FormText} from 'reactstrap';
import FormFeedback from 'reactstrap/lib/FormFeedback';
import { FirebaseContext } from '../firebase/context';
import CSVUpload from './CSVUpload';


const ParamsForm = ({ authUser, roomId, setRoomId, roomParams, setDoSpacebarEvent }) => {
    const [isModalOpen, setModal] = useState(false);
    const [buttonText, setButtonText] = useState('+ Create a Room');
    const [submitButtonText, setSubmitButtonText] = useState('Go to Room');
    const [title, setTitle] = useState('');
    const [currentCenterImg, setCurrentCenterImg] = useState('plate');
    const [tempQ, setTempQ] = useState('');
    const [participantInputs, setParticipantInputs] = useState([{name: '', keyword: ''}]);
    const [cohosts, setCohosts] = useState(['']);
    const [cohostValidation, setCohostValidation] = useState(cohosts.map(host => false));
    const [keywordIndex, setKeywordIndex] = useState(-1);
    const [stickIndex, setStickIndex] = useState(0);
    const [lastWords, setLastWords] = useState([]);

    const history = useHistory();
    const firebase = useContext(FirebaseContext);

    const toggleModal = () => setModal(!isModalOpen);

    useEffect(() => {
        if(roomParams) {
            setTitle(roomParams.title);
            setCurrentCenterImg(roomParams.centerImage);
            if(roomParams.question) setTempQ(roomParams.question);
            const participants = roomParams.participants.map((obj, i) => ( {name: obj.name, keyword: roomParams.keywords[i].keyword} ))
            setParticipantInputs(participants);
            if(roomParams.cohosts) {
                (async () => {
                    const cohostEmails = [];
                    for(let host in roomParams.cohosts) {
                        const snapshot = await firebase.user(host).child("email").get();
                        if(snapshot.exists()) {
                            const email = snapshot.val();
                            cohostEmails.push(email);
                        } 
                    }
                    setCohosts(cohostEmails);
                    setCohostValidation(cohostEmails.map(host => false));
                })();
            }
            setButtonText('Update Room');
            setSubmitButtonText('Update Room');
            setStickIndex(roomParams.stickIndex);
            setKeywordIndex(roomParams.keywordIndex);
            setLastWords(roomParams.lastWords ? roomParams.lastWords : []);
        } 
    }, [roomParams, firebase])

    useEffect(() => {
        if(!roomParams) return; 
        if(isModalOpen) {
            setDoSpacebarEvent(false);
        } else {
            setDoSpacebarEvent(true);
        }
    }, [isModalOpen])

    const isInvalid = !title;

    const handleValueChange = async (e) => {
        e.persist();
        let value = e.target.value;
        switch(e.target.name) {
            case 'select':
                setCurrentCenterImg(value);
                break;
            case 'title':
                setTitle(value);
                break;
            case 'question':
                setTempQ(value);
                break;
            default:
                console.log('Unexpected input: ' + e.target.name);
        }
    }

    const handleCohostChange = (e, index) => {
        const cohostArr = [...cohosts];
        cohostArr[index] = e.target.value;
        setCohosts(cohostArr);
    }

    const handleDeleteCohost = index => {
        const values = [...cohosts];
        values.splice(index, 1);
        setCohostValidation(values.map(host => false));
        setCohosts(values);
    }

    const handleParticipantChange = (e, index) => {
        const values = [...participantInputs];
        if(e.target.name === 'participant') {
            values[index].name = e.target.value;
        } else {
            values[index].keyword = e.target.value;
        }
        console.log(values);
        setParticipantInputs(values); 
    }

    const handleAddRow = (e) => {
        if(e.target.name === 'add-cohost') {
            const values = [...cohosts];
            values.push('');
            setCohosts(values);
        } else {
            const values = [...participantInputs];
            values.push({name: '', keyword: ''});
            setParticipantInputs(values);
        }
    }

    const handleDeleteParticipant = index => {
        const values = [...participantInputs];
        values.splice(index, 1);
        setParticipantInputs(values);
    }

    const handleCancel = (e) => {
        e.preventDefault();
        if(!roomParams) {
            setTitle('');
            setCurrentCenterImg('plate');
            setTempQ('');
            setParticipantInputs([{name: '', keyword: ''}]);
            setCohosts(['']);
        }
        toggleModal();
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        let cohostArr = [];
        try {
            const emailVerifications = await firebase.verifyUsers(cohosts);
            let cohostsGTG = true;
            emailVerifications.forEach((emailObj, i) => {
                if(emailObj.verified === false) {
                    console.log(emailObj.email)
                    //alert(`${emailObj.email} is not a registered user. Please check your spelling.`);
                    const values = [...cohostValidation];
                    values[i] = true;
                    setCohostValidation(values);
                    cohostsGTG = false;
                }
            })
            
            if(!cohostsGTG) return;
            cohostArr = emailVerifications.map(obj => obj.email);
            setCohosts(cohostArr);
        } catch(err) {
            console.error(err);
        }
        

        (async () => {
            const thisUser = authUser.uid;
            let otherHosts = {};
            let params = {};

            //get user id for each host
            if(cohostArr.length) {
                try {
                    otherHosts = await firebase.getCohosts(cohostArr, otherHosts);
                    if(otherHosts.error) otherHosts = {};
                } catch(err) {
                    console.error(err);
                }
            }
            let today = new Date().toJSON();
            params = {
                title: title,
                participants: participantInputs.map(part => part.name ? {name: part.name} : {name: ""}) || [],
                keywords: participantInputs.map(part => part.keyword ? {keyword: part.keyword} : {keyword: ""}) || [],
                centerImage: currentCenterImg,
                question: tempQ,
                host: thisUser,
                cohosts: otherHosts,
                date: today,
                stickIndex,
                randomArray: [...Array(participantInputs.length).keys()],
                keywordIndex,
                lastWords
            }
            if(!roomParams) {
                try{
                    const roomKey = await firebase.createRoom(thisUser, params)  //see "updating or deleting data" in firebase docs for updating both records 
                    console.log(roomKey);
                    setRoomId(roomKey);
                } catch(err) {
                    console.error(err);
                }
            } else {
                try {
                    await firebase.updateRoom(roomId, params);
                } catch(err) {
                    console.error(err);
                }      
            } 
        })();       
        toggleModal();
        history.push('/app');
    }
        

    return (
        <React.Fragment>
            <Button style={{backgroundColor: '#0C595E'}} onClick={toggleModal} className='m-2'>
                {buttonText}
            </Button>
            <Modal returnFocusAfterClose={false} isOpen={isModalOpen} toggle={toggleModal} className='modal-lg'>
                <ModalHeader toggle={toggleModal}>Design your Circle Room</ModalHeader>
                <ModalBody style={{margin: 'auto'}}>
                <Form id='paramsForm' onSubmit={handleSubmit}>
                    <Row className='form-group px-5 m-0'>
                        <FormGroup>
                            <Label>Title
                                <Input 
                                    placeholder='Unique Title of Room'
                                    type='text' 
                                    name='title' 
                                    id='title' 
                                    value={title} 
                                    onChange={handleValueChange} 
                                />
                            </Label>
                        </FormGroup>
                    </Row>
                    <Row className='form-group px-5 m-0'>
                        <FormGroup>
                            <Label>Center Image
                                <Input type='select' name='select' id='img-select' defaultValue={currentCenterImg} onChange={handleValueChange}>
                                    <option value='plate'>Plate</option>
                                    <option value='candle'>Candle</option>
                                    <option value='empty'>No Image</option>
                                </Input>
                            </Label>
                        </FormGroup>
                    </Row>
                    <Row className='form-group px-5 m-0'>
                        <FormGroup>
                            <Label>Center Question
                                <Input 
                                    placeholder='Pose your question to the group (not required)'
                                    type='text' 
                                    name='question' 
                                    id='question'
                                    value={tempQ}
                                    onChange={handleValueChange} 
                                /> 
                            </Label>  
                        </FormGroup>      
                    </Row>
                    <Row className='form-group px-5 m-0'>
                        <CSVUpload participantInputs={participantInputs} setParticipantInputs={setParticipantInputs}/>
                    </Row>
                    <Row className='form-group px-5 m-0'>
                        <FormGroup>
                            <Label>Participants</Label>
                            {participantInputs.map((participant, i) => {
                                return (
                                    <Fragment key={`participant-${i}`}>
                                        <Row className='form-group'>
                                            <Col className='col-1 my-auto'>
                                                {i+1}.
                                            </Col>
                                            <Col>
                                                <Input 
                                                    placeholder='Name'
                                                    type='text' 
                                                    name='participant' 
                                                    id='participant'
                                                    value={participant.name || ''}
                                                    onChange={e => handleParticipantChange(e, i)} 
                                                /> 
                                            </Col> 
                                            <Col>
                                                <Input 
                                                    placeholder='Keyword'
                                                    type='text' 
                                                    name='keyword' 
                                                    id='keyword'
                                                    value={participant.keyword || ''}
                                                    onChange={e => handleParticipantChange(e, i)} 
                                                /> 
                                            </Col> 
                                            <Col className='col-1'>
                                                <Button color='light' type='button' onClick={() => handleDeleteParticipant(i)}> x </Button>
                                            </Col> 
                                        </Row>
                                    </Fragment> 
                                )
                            })}
                            <Button color='light' type='button' name='participants' onClick={handleAddRow}> + </Button>
                        </FormGroup>
                    </Row>
                    <Row className='form-group px-5 m-0'>
                        <FormGroup>
                            <Label>Co-host(s)</Label>
                                {cohosts.map((host, i) => {
                                    return (
                                        <Fragment key={'host-' + i}>
                                            <Row className='form-group'>
                                                <Col >
                                                    <Input 
                                                        placeholder='Co-host email addresses'
                                                        type='text' 
                                                        name='cohosts' 
                                                        id='cohosts'
                                                        value={host}
                                                        invalid={cohostValidation[i]}
                                                        onChange={(e) => handleCohostChange(e, i)}
                                                    />
                                                    <FormFeedback>{host} is not a registered user. Please check your spelling.</FormFeedback>
                                                </Col>
                                                <Col className='col-1'>
                                                    <Button color='light' type='button' onClick={() => handleDeleteCohost(i)}> x </Button>
                                                </Col>
                                            </Row>
                                        </Fragment>
                                    )
                                })}
                                <Button color='light' type='button' name='add-cohost' onClick={handleAddRow}> + </Button>
                    
                        </FormGroup>
                    </Row>
                    <Row className='form-group'>
                        <Col className='d-flex justify-content-end'>
                            <Button className='mx-1' color="secondary" type="cancel" onClick={handleCancel}>Cancel</Button>
                            <Button color="info" type="submit" disabled={isInvalid}>{submitButtonText}</Button>
                        </Col>
                    </Row>
                </Form>
                </ModalBody>
            </Modal>
        </React.Fragment>
    )
}

export default ParamsForm;