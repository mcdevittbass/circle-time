import React, { useEffect, useState } from 'react';
import { Image } from 'react-konva';
import feather from '../../img/feather.png';

const featherImage = new window.Image(150, 150);
featherImage.src = feather;

const Stick = ({ items, itemIndex }) => {
  const [isFeatherLoaded, setLoadFeather] = useState(false);
  const [stickCoords, setStickCoords] = useState({x: null, y: null});

  useEffect(() => {
      //console.log('feather: ' + isFeatherLoaded);

      if(featherImage.complete) setLoadFeather(true);
  },[]);

  useEffect(() => {
    let stickCoordX = items.length ? items[itemIndex].x - 40 : null;
    let stickCoordY = items.length ? items[itemIndex].y - 30 : null;
    setStickCoords({x: stickCoordX, y: stickCoordY});
  }, [items, itemIndex])

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
          x={stickCoords.x}
          y={stickCoords.y} 
        />)
      }
    </>
    )
  }

  export default Stick;