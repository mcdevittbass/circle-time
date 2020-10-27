import React, { useEffect, useState} from 'react';
import { Stage, Layer, Circle, Text, Group } from 'react-konva';
import Stick from './Stick';
import CenterImage from './CenterImage';

//to do: set up dragging for keywords so that position persists on reload
// let centerX = window.innerWidth/2;
// let centerY = window.innerHeight/2;

const CircleStage = ({ items, setItems, wordItems, centerX, centerY }) => {
  const [itemIndex, setItemIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [randomNumbers, setRandomNumbers] = useState([...Array(items.length).keys()]);
  
  useEffect(() => {
    console.log(wordItems)
    //useEffect fires after component mounts or updates
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      //returning callback means this function will run when the component unmounts or updates
      window.removeEventListener('keyup', handleKeyUp);
    }
  });

  const handleKeyUp = (event) => {
    let currentItemIndex = itemIndex;
    console.log(event.key);
    switch(event.key) {
      case 'ArrowRight':
        event.preventDefault();
        let addIndex = itemIndex === items.length - 1 ? 0 : currentItemIndex + 1;
        setItemIndex(addIndex);
        break;
      case 'ArrowLeft': 
        event.preventDefault();
        let minusIndex = itemIndex === 0 ? items.length - 1 : currentItemIndex - 1;
        setItemIndex(minusIndex);
        break;
      case 'Enter':
        event.preventDefault(); 
        if(items.length) {
          let randomIndex = Math.floor(Math.random() * randomNumbers.length);
          console.log('random index of numbers: ' + randomIndex);
          setItemIndex(randomNumbers[randomIndex]);
          if(randomNumbers.length <= 1) {
            setRandomNumbers([...Array(items.length).keys()])
        } else {
          setRandomNumbers(randomNumbers.filter(num => num !== randomNumbers[randomIndex]));
        }
        }
        break;
      case ' ':
        event.preventDefault();
        let lastWordIndex = !wordItems.length ? null : wordIndex === 0 ? wordItems.length - 1 : wordIndex - 1;

        if(lastWordIndex) {
          wordItems[lastWordIndex].x = 20;
          wordItems[lastWordIndex].y = Math.random() * (window.innerHeight - 30);

          wordItems[wordIndex].x = centerX - 50;
          wordItems[wordIndex].y = centerY - 15;
          setWordIndex(wordIndex === wordItems.length - 1 ? 0 : wordIndex + 1);
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
        <Stage width={window.innerWidth} height={window.innerHeight}> 
          <Layer>
            <CenterImage />
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
            <Stick items={items} itemIndex={itemIndex}/>
          </Layer>
        </Stage>
    );
}

export default CircleStage;