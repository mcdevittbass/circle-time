import React, { useState } from 'react';
import { Image } from 'react-konva';
import feather from '../img/feather.png';

const featherImage = new window.Image(150, 150);
featherImage.src = feather;

const Stick = (props) => {
  const [isFeatherLoaded, setLoadFeather] = useState(false);

  let stickCoordX = props.items.length ? props.items[props.itemIndex].x - 40 : null;
  let stickCoordY = props.items.length ? props.items[props.itemIndex].y - 30 : null;

  const handleFeatherLoad = () => {
    setLoadFeather(true);
    console.log('feather: ' + isFeatherLoaded);
  }

  featherImage.onload = handleFeatherLoad;

  return (
    <>
      {isFeatherLoaded && (
        <Image 
          image={featherImage} 
          draggable
          width={100}
          height={100}
          x={stickCoordX}
          y={stickCoordY} 
        />)
      }
    </>
    )
  }

  export default Stick;