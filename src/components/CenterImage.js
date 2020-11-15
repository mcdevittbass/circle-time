import React, { useState } from 'react';
import { Image } from 'react-konva';
import plate from '../img/plate2.png'; 
//import candle from '../img/candle.gif';
import stillCandles from '../img/still_candles.png';


const plateImg = new window.Image();  
plateImg.src = plate;

const candleImg = new window.Image();
candleImg.src = stillCandles;

const CenterImage = ({ centerX, centerY, centerImg}) => {
  const [isPlateLoaded, setPlateLoaded] = useState(false);
  const [isCandleLoaded, setCandleLoaded] = useState(false);

  const handlePlateLoad = () => {
    setPlateLoaded(true);
  }
  const handleCandleLoad = () => {
    setCandleLoaded(true);
  }
  const handleLoadError = () => {
    console.log("Failed to load images")
  }

  plateImg.onload = handlePlateLoad;
  plateImg.onerror = handleLoadError;
  candleImg.onload = handleCandleLoad;
  candleImg.onerror = handleLoadError;

  const images = [
    {name: 'plate', img: plateImg, load: isPlateLoaded},
    {name: 'candle', img: candleImg, load: isCandleLoaded}
  ]
  
  let currentImgObj = images.find(obj => obj.name === centerImg);

  return (
      <>
      {currentImgObj.load && (
          <Image 
            image={currentImgObj.img}
            visible
            id={currentImgObj.name} 
            width={300}
            height={300}
            x={centerX} 
            y={centerY}
            offsetX={150}
            offsetY={150}
            />
          )}
      </>
    )
}

export default CenterImage;