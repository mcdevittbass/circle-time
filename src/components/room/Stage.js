import React, { useEffect, useState, useContext} from 'react';
import { Stage, Layer, Circle, Text, Group } from 'react-konva';
import Stick from './Stick';
import CenterImage from './CenterImage';
import Question from './Question';
import { FirebaseContext } from '../firebase/context';

//to do: set up dragging for keywords so that position persists on reload

//later - see how to rerender stage when height and width change
let stageWidth = window.innerWidth;
let stageHeight = window.innerHeight;

const CircleStage = ({ items, setItems, wordItems, centerX, centerY, centerImg, questionText, roomId, wordIndex, setWordIndex, lastWords, doSpacebarEvent}) => {
  const [itemIndex, setItemIndex] = useState(0);
  const [randomNumbers, setRandomNumbers] = useState([]);
  const [stickCoords, setStickCoords] = useState({x: null, y: null});
  // const [stageHeight, setStageHeight] = useState(window.innerHeight);
  // const [stageWidth, setStageWidth] = useState(window.innerWidth);

  const firebase = useContext(FirebaseContext);

  // useEffect(() => {
  //   const handleResize = () => {
  //     setStageHeight(window.innerHeight);
  //     setStageWidth(window.innerWidth);
  //     console.log('resized')
  //   }
  //   window.addEventListener('resize', handleResize);

  //   return () => window.removeEventListener('resize', handleResize);
  // })
  
  useEffect(() => {
    //useEffect fires after component mounts or updates
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      //returning callback means this function will run when the component unmounts or updates
      window.removeEventListener('keyup', handleKeyUp);
    }
  });

  useEffect(() => {
    (async () => {
      try {
        firebase.room(roomId).on('value', async (snapshot) => {
          const params = await snapshot.val();
          if(params) {
            const { randomArray, keywordIndex } = params;
            const stickIndex = params.stickIndex ? params.stickIndex : 0;
            setItemIndex(stickIndex);
            setRandomNumbers(randomArray);
            setWordIndex(keywordIndex);
          } 
        })
      } catch(err) {
        console.error(err);
      }
    })();
    return () => {
      firebase.room(roomId).child('stickIndex').off();
    }
    
  }, [items, firebase, roomId])

  useEffect(() => {
    let stickCoordX = items.length ? items[itemIndex].x - 40 : null;
    let stickCoordY = items.length ? items[itemIndex].y - 30 : null;
    setStickCoords({x: stickCoordX, y: stickCoordY});
  }, [itemIndex, items])

  const handleKeyUp = (event) => {
    let currentItemIndex = itemIndex;
    //console.log(event.key);
    switch(event.key) {
      case 'ArrowRight':
        event.preventDefault();
        let addIndex = itemIndex === items.length - 1 ? 0 : currentItemIndex + 1;
        firebase.room(roomId).update({stickIndex: addIndex});
        break;
      case 'ArrowLeft': 
        event.preventDefault();
        let minusIndex = itemIndex === 0 ? items.length - 1 : currentItemIndex - 1;
        firebase.room(roomId).update({stickIndex: minusIndex});
        break;
      case '\\':
        event.preventDefault(); 
        if(items.length && randomNumbers.length) {
          let randomIndex = randomNumbers.length === 1
            ? 0
            : Math.floor(Math.random() * (randomNumbers.length - 1) + 1);
          firebase.room(roomId).update({stickIndex: randomNumbers[randomIndex]})
          if(randomNumbers.length <= 1) {
            firebase.room(roomId).update({randomArray: [...Array(items.length).keys()]})
          } else {
            firebase.room(roomId).update({randomArray: randomNumbers.filter(num => num !== randomNumbers[randomIndex])});
          }
        };
        break;
      case " " || "Spacebar":
        event.preventDefault();  
        if(!doSpacebarEvent) break;
        if(wordItems.length) {
          let newKeywordIndex;
          if(wordIndex <= wordItems.length && wordIndex >= 0) {
            let updatedLastWords = wordIndex === 0 ? [0] : [...lastWords, wordIndex];
            newKeywordIndex = wordIndex === wordItems.length - 1 ? -1 : wordIndex + 1;
            firebase.room(roomId).update({keywordIndex: newKeywordIndex, lastWords: updatedLastWords})
          } else {
            newKeywordIndex =  wordItems.length < 0 ? -1 : wordIndex < 0 ? 0 : wordIndex + 1;
            firebase.room(roomId).update({keywordIndex: newKeywordIndex, lastWords: [-1]});
          }
        }
        break;
      default:
        return;
    }
  }

  const handleDragStart = e => {
    const id = e.target.name();
    const copiedItems = items.slice();
    const item = copiedItems.find(i => i.key === id);
    const index = copiedItems.indexOf(item);
    // remove from the list:
    copiedItems.splice(index, 1);
    // add to the top
    copiedItems.push(item);
    setItems(copiedItems);
  };

  const handleDragEnd = e => {
    const id = e.target.name();
    const copiedItems = items.slice();
    const item = items.find(i => i.id === id);
    const index = items.indexOf(item);
    // update item position
    copiedItems[index] = {
      ...item,
      x: e.target.x(),
      y: e.target.y()
    };
    setItems(copiedItems);
  };

    return (
        <Stage width={stageWidth} height={stageHeight}> 
          <Layer>
            <CenterImage centerX={centerX} centerY={centerY} centerImg={centerImg}/>
            <Question centerX={centerX} centerY={centerY} questionText={questionText}/>
          </Layer>
          <Layer>
              {items.map(item => (
                  <Group 
                  draggable
                  x={item.x}
                  y={item.y}
                  key={item.key}>
                      <Circle
                      name={item.id}
                      fill={item.color}
                      radius={item.radius}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      />
                      <Text 
                      text={item.text}
                      fontFamily='Helvetica'
                      fontSize={16}
                      fill='#FFF'
                      align='center'
                      verticalAlign='middle'
                      offsetX={item.radius}
                      offsetY={item.radius}
                      width={item.radius * 2}
                      height={item.radius * 2}
                      wrap='word'
                      />
                  </Group>
              ))}
              {wordItems.map((wordItem, i) => (
                <Text 
                  text={wordItem.text}
                  fontFamily='Helvetica'
                  fontSize={24}
                  fill={wordItem.color}
                  draggable 
                  x={wordItem.x}
                  y={wordItem.y}
                  key={'wordItem' + i}
                />
                )
              )}  
          </Layer>
          <Layer>
            <Stick stickCoords={stickCoords}/>
          </Layer>
        </Stage>
    );
}

export default CircleStage;