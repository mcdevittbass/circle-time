import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'reactstrap';
import CircleStage from './Stage';
import AuthError from '../auth/AuthError';
import ParamsForm from './ParamsForm';
import { FirebaseContext } from '../firebase/context';
import InstructionsModal from './InstructionsModal';

function Main({ authUser, roomId, setRoomId }) {
  const colorPalette = ['#020887', '#6D326D', '#D56062', '#F37748', '#ECC30B', '#84BCDA', '#5E7416', '#0C595E'];

  const [roomParams, setRoomParams] = useState(null);
  const [centerImg, setCenterImg] = useState('plate');
  const [centerX] = useState(window.innerWidth/2);
  const [centerY] = useState(window.innerHeight/2)
  const [names, setNames] = useState([]);
  const [words, setWords] = useState([]);
  const [initialItems, setInitialItems] = useState(names.map((name, i) => generateItems(name, i)));
  const [items, setItems] = useState(setCirclePositions(initialItems));
  const [initialWordItems, setInitialWordItems] = useState([])
  const [wordItems, setWordItems] = useState([]);
  const [questionText, setQuestionText] = useState('');
  const [wordIndex, setWordIndex] = useState(-1);
  const [lastWords, setLastWords] = useState([]);
  const [doSpacebarEvent, setDoSpacebarEvent] = useState(true);

  const firebase = useContext(FirebaseContext);

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
      const { centerImage, participants, keywords, question, lastWords, keywordIndex } = roomParams;
      setCenterImg(centerImage);
      if(participants) setNames(participants.map(obj => obj.name));
      if(keywords) {
        const justWords = [];
        for(let obj of keywords) {
          if(obj.keyword) justWords.push(obj.keyword);
        }
        if(JSON.stringify(justWords) !== JSON.stringify(words)) {
          setWords(justWords);
        }
      }
      setWordIndex(keywordIndex);
      setLastWords(lastWords || []);
      setQuestionText(question);
    } else {
      console.log('Params was not truthy');
    }
  }, [roomParams]);

  useEffect(() => {
    setInitialItems(names.map((name, i) => generateItems(name, i)));
    setInitialWordItems(words.map(word => generateWordItems(word)));
  }, [names, words]);

  useEffect(() => {
    setItems(setCirclePositions(initialItems));
  }, [initialItems]);

  useEffect(() => {
    setWordItems(setWordPostions(initialWordItems));
  }, [initialWordItems])

 
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
      color: colorPalette[words.length % 8],
      text: newWord,
      // x: 20,
      // y: Math.random() * (window.innerHeight - 30)
    }
    return word;
  };

  function setWordPostions(wordItemArr) {
    let updated = [...wordItemArr];
    if (wordIndex === -1) { //if wordIndex is the default, put all words on the side
      updated = wordItemArr.map((item, i)  => {
        item.x = 20;
        item.y = i*30;
      });
      return updated;
    }

    updated[wordIndex].x = centerX - 50;
    updated[wordIndex].y = centerY - 15;

    lastWords.forEach(lastWord => {
      let centerRadius = 140;
      let length = wordItems.length;
      let angle = (lastWord/length)*Math.PI*2;
      updated[lastWord].x = Math.cos(angle)*centerRadius + centerX - 40;
      updated[lastWord].y = Math.sin(angle)*centerRadius + centerY;
    });

    // const updated = wordItemArr.map((item, i) => {
    //   //if word index is the current word, put it in the center
    //   if (wordIndex === -1) { //if wordIndex is the default, put all words on the side
    //     item.x = 20;
    //     item.y = i*30;
    //   } else if(wordIndex === i) {
    //     item.x = centerX - 50;
    //     item.y = centerY - 15;
    //   } else {
    //     // set the other words around the circle
    //     let centerRadius = 140;
    //     let length = wordItems.length;
    //     let lastWordIndex = lastWords[i];
    //     if(lastWordIndex !== undefined) {
    //       let angle = (i/length)*Math.PI*2;
    //       item.x = Math.cos(angle)*centerRadius + centerX - 40;
    //       item.y = Math.sin(angle)*centerRadius + centerY;
    //     } else {
    //       item.x = 20;
    //       item.y = i*30;
    //     }
    //   }
    //   return item;
    // });
    return updated;
  }

  return (
    !authUser 
    ?
    <AuthError />
    :
    <>
        <Container fluid className='App m-0 p-0' style={{backgroundColor: '#fff'}}> 
            <Row className='justify-content-between'>
                <Col sm={3}>
                  <Link to={'/account'} className='m-0 p-0'>
                    <Button className='m-2 btn-light'> ← Return to Main Page</Button>
                  </Link>
                </Col>
                <Col>
                  <InstructionsModal />
                </Col>
                <Col sm={3}>
                    <ParamsForm  
                      authUser={authUser} 
                      roomId={roomId} 
                      setRoomId={setRoomId} 
                      roomParams={roomParams}
                      setDoSpacebarEvent={setDoSpacebarEvent}
                    />
                </Col>
            </Row>
            <Row style={{margin: 0}}> 
                <CircleStage 
                    items={items} 
                    setItems={setItems} 
                    wordItems={wordItems} 
                    setWordItems={setWordItems}
                    centerX={centerX} 
                    centerY={centerY} 
                    centerImg={centerImg}
                    questionText={questionText}
                    roomId={roomId}
                    wordIndex={wordIndex}
                    setWordIndex={setWordIndex}
                    lastWords={lastWords}
                    doSpacebarEvent={doSpacebarEvent}
                />
            </Row>
        </Container>
    </>
  );
}

export default Main;
