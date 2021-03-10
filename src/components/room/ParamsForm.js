import React, {useState, Fragment, useEffect, useContext} from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Input, Label, Col, Button, Row, FormGroup, Modal, ModalBody, ModalHeader, FormText} from 'reactstrap';
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
    const [cohosts, setCohosts] = useState('');

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
                    setCohosts(cohostEmails.join(', '));
                })();
            }
            setButtonText('Update Room');
            setSubmitButtonText('Update Room');
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

    const handleValueChange = (e) => {
        switch(e.target.name) {
            case 'select':
                setCurrentCenterImg(e.target.value);
                break;
            case 'title':
                setTitle(e.target.value);
                break;
            case 'question':
                setTempQ(e.target.value);
                break;
            case 'cohosts':
                setCohosts(e.target.value);
                break;
            default:
                console.log('Unexpected input: ' + e.target.name);
        }
    }

    const handleParticipantChange = (e, index) => {
        const values = [...participantInputs];
        if(e.target.name === 'participant') {
            values[index].name = e.target.value;
        } else {
            values[index].keyword = e.target.value;
        }
        setParticipantInputs(values); 
    }

    const handleAddParticipant = () => {
        const values = [...participantInputs];
        values.push({name: '', keyword: ''});
        setParticipantInputs(values);
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
            setCohosts('');
        }
        toggleModal();
    }

    //helper function to get userIds of cohosts
    const getHosts = async (cohostArr, otherHosts) => {
        for(let cohost of cohostArr) {
            try {
                const response = await 
                    fetch(`https://circle-up-d44b8-default-rtdb.firebaseio.com/users.json?orderBy="email"&equalTo="${cohost}"&print=pretty`);
                try {
                    const data = await response.json();
                    const host = Object.keys(data)[0];
                    otherHosts[host] = true;
                } catch(err) {
                    console.error(err.message);
                }
            } catch(err) {
                console.error(err.message);
            }
        }; 
        return otherHosts;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const cohostArr = cohosts.replaceAll(' ', '').split(',');
        
        (async () => {
            const thisUser = authUser.uid;
            let otherHosts = {};
            let params = {};

            //get user id for each host
            if(cohosts) {
                try {
                    otherHosts = await getHosts(cohostArr, otherHosts);
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
                stickIndex: 0,
                randomArray: [...Array(participantInputs.length).keys()],
                keywordIndex: -1,
                lastWords: []
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
                    firebase.updateRoom(roomId, params);
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
                                <Input type='select' name='select' id='img-select' defaultValue='Select Image' onChange={handleValueChange}>
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
                            <Label>Participants
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
                            <Button color='light' type='button' onClick={handleAddParticipant}> + </Button>
                            </Label>
                        </FormGroup>
                    </Row>
                    <Row className='form-group px-5 m-0'>
                        <FormGroup>
                            <Label>Co-host(s)
                                <Input 
                                    placeholder='Co-host email addresses'
                                    type='text' 
                                    name='cohosts' 
                                    id='cohosts'
                                    value={cohosts}
                                    onChange={handleValueChange}
                                />
                                <FormText>Enter emails addresses of current users, separated by commas.</FormText>
                            </Label>
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