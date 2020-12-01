import React, { useState } from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalBody} from 'reactstrap';
import InputFields from './Input';
import Remove from './Remove';
import ChangeImg from './ChangeImg';
import QuestionButton from './QuestionButton';

const MainButton = (props) => {
    const [isModalOpen, setModal] = useState(false);

    const toggleModal = () => setModal(!isModalOpen);

    return (
        <React.Fragment>
            <Row style={{marginLeft: 15, marginTop: 10}}>
                <Col>
                    <Button style={{backgroundColor: '#0C595E'}} onClick={toggleModal} className='m-2'>
                        Update Your Environment
                    </Button>
                </Col>
            </Row>
            <Modal isOpen={isModalOpen} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal} />
                <ModalBody style={{margin: 'auto'}}>
                    <Row style={{justifyContent: 'center'}}>  
                        <InputFields 
                            name={props.name} 
                            setName={props.setName}
                            keyword={props.keyword}
                            setKeyword={props.setKeyword}
                            names={props.names} 
                            keywords={props.keywords}
                            onNameChange={() => props.handleAddName(props.name)}
                            onWordChange={() => props.handleAddWord(props.keyword)}
                        />
                    </Row>
                    <Row style={{justifyContent: 'center'}}>
                        <Remove 
                            listText='Name' 
                            objs={props.items} 
                            setObjs={props.setItems} 
                            setArray={props.setNames} 
                            buttonText={'Remove a Name'} 
                            buttonColor={'#0C595E'} 
                        />
                    </Row>
                    <Row style={{justifyContent: 'center'}}>
                        <Remove 
                            listText='Word' 
                            objs={props.wordItems} 
                            setObjs={props.setWordItems} 
                            setArray={props.setKeywords} 
                            buttonText={'Remove a Keyword'} 
                            buttonColor={'#020887'} 
                        />
                    </Row>
                    <Row style={{justifyContent: 'center'}}>
                        <ChangeImg 
                            setCenterImg={props.setCenterImg} 
                            buttonText={'Change Center Image'} 
                            buttonColor={'#6D326D'} 
                        />
                    </Row>
                    <Row style={{justifyContent: 'center'}}>
                        <QuestionButton 
                            style={{backgroundColor:'#ECC30B', border: 'none'}} 
                            className='m-2' 
                            setQuestionText={props.setQuestionText}
                            buttonText='Pose a Question'
                            />
                    </Row>
                    <Row style={{justifyContent: 'center'}}>
                        <Button 
                            style={{backgroundColor:'#ECC30B', border: 'none'}} 
                            className='m-2' 
                            onClick={props.handleClear}>Clear all
                        </Button>
                    </Row>
                </ModalBody>
            </Modal>
        </React.Fragment>
    )
};

export default MainButton;