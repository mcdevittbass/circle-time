import React, { useEffect, useState} from 'react';
import { Stage, Layer, Circle, Text, Group } from 'react-konva';
import Stick from './Stick';
import CenterImage from './CenterImage';

const CircleStage = ({ items, setItems }) => {
  const [itemIndex, setItemIndex] = useState(0);
  
  useEffect(() => {
    //useEffect fires after component mounts or updates
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      //returning callback means this function will run when the component unmounts or updates
      window.removeEventListener('keyup', handleKeyUp);
    }
  });

  const handleKeyUp = (event) => {
    let currentIndex = itemIndex;
    console.log(event.key);
    switch(event.key) {
      case 'ArrowRight':
        event.preventDefault();
        let addIndex = itemIndex === items.length - 1 ? 0 : currentIndex + 1;
        setItemIndex(addIndex);
        break;
      case 'ArrowLeft': 
        event.preventDefault();
        let minusIndex = itemIndex === 0 ? items.length - 1 : currentIndex - 1;
        setItemIndex(minusIndex);
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
                          offsetX={24}
                          offsetY={6}
                          />
                      </Group>
                  ))}
              {items.map((item, i) => (
                <Text 
                  text={item.keyword}
                  fontFamily='Helvetica'
                  fontSize={24}
                  fill={item.color}
                  draggable 
                  x={item.keywordX}
                  y={item.keywordY}
                  key={i}
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