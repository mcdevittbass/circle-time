import React from 'react';
import { Star, Image, Layer } from 'react-konva';
import lollipop from '../img/lollipop.png';

const image = new window.Image(150, 150);
    image.src = lollipop;

const Stick = (props) => {

    let stickCoordX = props.items.length ? props.items[props.itemIndex].x - 40 : null;
    let stickCoordY = props.items.length ? props.items[props.itemIndex].y : null;
  
      return (
          <Image 
            image={image} 
            draggable
            width={100}
            height={100}
            x={stickCoordX}
            y={stickCoordY} 
          />
        
          /*<Star 
            innerRadius={10}
            outerRadius={20} 
            draggable
            id={'star'} 
            fill="#000" 
            x={stickCoordX} 
          y={stickCoordY}/>*/
      )

  }

  export default Stick;