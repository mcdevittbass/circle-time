import React, { useState, useEffect } from 'react';
import { Container, Row } from 'reactstrap';
import CircleStage from './Stage';
import AuthError from '../auth/AuthError';
import ParamsForm from './ParamsForm';

function Main({ authUser, roomId, setRoomId, firebase }) {
  const colorPalette = ['#020887', '#6D326D', '#D56062', '#F37748', '#ECC30B', '#84BCDA', '#5E7416', '#0C595E'];

  const [roomParams, setRoomParams] = useState(null);
  const [centerImg, setCenterImg] = useState('plate');
  const [centerX] = useState(window.innerWidth/2);
  const [centerY] = useState(window.innerHeight/2)
  const [names, setNames] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [initialItems, setInitialItems] = useState(names.map((name, i) => generateItems(name, i)));
  const [items, setItems] = useState(setCirclePositions(initialItems));
  const [wordItems, setWordItems] = useState(keywords.map(word => generateWordItems(word)));
  const [questionText, setQuestionText] = useState('');

  async function listenToRoom (roomId) {
    if(!roomId) return null;
    try {
      const roomRef = await firebase.room(roomId);
      roomRef.on('value', async (snapshot) => {
        const roomData = await snapshot.val();
        //console.log(roomData)
        setRoomParams(roomData);
      });

    } catch(err) {
        console.error(err);
        setRoomParams(null);
    }
  }

  useEffect(() => {
    // set current room ref with account page logic (not here)
    // listen at that room ref
    // get params, set state to those params
    (async () => {
      if(roomId) {
        listenToRoom(roomId);
      } else {
        setRoomParams(null);
      }
    })();

    //stop listening on unmount
    return () => {
      console.log('component unmounted')
      if(roomId) {
        firebase.stopListeningToRoom(roomId);
      }
    }
  },[roomId, centerX, firebase]);

  useEffect(() => {
    if(roomParams) {
      const { centerImage, participants, keywords, question } = roomParams;
      setCenterImg(centerImage);
      if(participants) setNames(participants.map(obj => obj.name));
      if(keywords) setKeywords(keywords.map(obj => obj.name));
      setQuestionText(question);
    } else {
      console.log('Params was not truthy');
    }
  }, [roomParams]);

  useEffect(() => {
    setInitialItems(names.map((name, i) => generateItems(name, i)));
    setWordItems(keywords.map(word => generateWordItems(word)));
  }, [names, keywords]);

  useEffect(() => {
    setItems(setCirclePositions(initialItems));
  }, [initialItems]);

 
  function setCirclePositions(shapeArr) {
    let parameterA = window.innerWidth*0.375;
    let parameterB = window.innerHeight*0.4;
    const length = shapeArr.length;
    let biggestShapeRadius = parameterB*0.2
    const updated = shapeArr.map((shape, i) => {
      let angle = (i/length)*Math.PI*2;
      shape.x = Math.cos(angle)*parameterA + centerX;
      shape.y = Math.sin(angle)*parameterB + centerY;
      shape.key = 'node-' + i;
      shape.radius = length < 18 ? biggestShapeRadius : length < 26 ? biggestShapeRadius*0.8 : biggestShapeRadius*0.6;
      //console.log(shape);
      return shape;
    })
    return updated;
  }

  function generateItems(newName, i) {
    let circle = {
      color: colorPalette[i % 8],
      text: newName
    }
    return circle;
  }

  function generateWordItems(newWord) {
    let word = {
      color: colorPalette[keywords.length % 8],
      text: newWord,
      x: 20,
      y: Math.random() * (window.innerHeight - 30)
    }
    return word;
  };

  return (
    !authUser 
    ?
    <AuthError />
    :
    <>
        <Container fluid className='App m-0 p-0' style={{backgroundColor: '#fff'}}> 
            <Row>
                <ParamsForm 
                  firebase={firebase} 
                  authUser={authUser} 
                  roomId={roomId} 
                  setRoomId={setRoomId} 
                  roomParams={roomParams}
                />
            </Row>
            <Row style={{margin: 0}}> 
                <CircleStage 
                    items={items} 
                    setItems={setItems} 
                    wordItems={wordItems} 
                    centerX={centerX} 
                    centerY={centerY} 
                    centerImg={centerImg}
                    questionText={questionText}
                />
            </Row>
        </Container>
    </>
  );
}

export default Main;
