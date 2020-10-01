import React from 'react';
import { Star, Image, Layer } from 'react-konva';
import lollipop from '../img/lollipop.png';

const Stick = (props) => {
    //not rendering image on refresh - just the first render
    const image = new window.Image(150, 150);
    image.src = lollipop;

    let stickCoordX = props.items.length ? props.items[props.itemIndex].x - 40 : null;
    let stickCoordY = props.items.length ? props.items[props.itemIndex].y + 10 : null;
  
    if(props.items.length) {
      return (
        <Layer>
          <Image 
            image={image} 
            draggable
            width={100}
            height={100}
            x={stickCoordX}
            y={stickCoordY} 
          />
        
          {/*<Star 
            innerRadius={10}
            outerRadius={20} 
            draggable
            id={'star'} 
            fill="#000" 
            x={stickCoordX} 
          y={stickCoordY}/>*/}
        </Layer>
      )
    }
    return null;
  }

  export default Stick;