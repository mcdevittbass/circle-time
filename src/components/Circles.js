import React, { useState } from 'react';
import Konva from 'konva';
import { Stage, Layer, Circle, Text, Group, Star } from 'react-konva';

let centerX = window.innerWidth/2;
let centerY = window.innerHeight/2;
console.log(centerX, centerY);

function generateItems() {
  const names = ['Betsy', 'Megan', 'John']
  const circles = [];
  const length = names.length;
  for (let i = 0; i < length; i++) {
    let angle = (i/length)*Math.PI*2;
    let radius = 260;
    circles.push({
      x: (Math.cos(angle)*radius) + centerX,
      y: (Math.sin(angle)*radius) + centerY,
      id: 'node-' + i,
      color: Konva.Util.getRandomColor(),
      text: names[i]
    });
  }
  return circles;
}

const Circles = () => {
  const [items, setItems] = useState(generateItems());

  const handleDragStart = e => {
    const id = e.target.name();
    const copiedItems = items.slice();
    const item = copiedItems.find(i => i.id === id);
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
            <Group>
                {items.map(item => (
                    <Group 
                    draggable
                    x={item.x}
                    y={item.y}
                    key={item.id}>
                        <Circle
                        name={item.id}
                        fill={item.color}
                        radius={50}
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
            </Group>
        </Layer>
        <Layer>
            <Star 
            innerRadius={20}
            outerRadius={40} 
            id={'star'} 
            fill="#89b717" 
            x={centerX} 
            y={centerY}/>
        </Layer>
      </Stage>
    );
}
export default Circles;