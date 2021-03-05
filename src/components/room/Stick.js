import React, { useEffect, useState } from 'react';
import { Image } from 'react-konva';
import feather from '../../img/feather.png';

const featherImage = new window.Image(150, 150);
featherImage.src = feather;

const Stick = ({ stickCoords }) => {
  const [isFeatherLoaded, setLoadFeather] = useState(false);

  useEffect(() => {
      //console.log('feather: ' + isFeatherLoaded);
      if(featherImage.complete) setLoadFeather(true);
  },[]);

  const handleFeatherLoad = () => {
    setLoadFeather(true);
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
          x={stickCoords ? stickCoords.x : null}
          y={stickCoords ? stickCoords.y : null} 
        />)
      }
    </>
    )
  }

  export default Stick;