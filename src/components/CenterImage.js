import React, { useState } from 'react';
import { Image } from 'react-konva';
import plate from '../img/plate2.png'; 
//import candle from '../img/candle.gif';
import stillCandles from '../img/still_candles.png';

// let centerX = window.innerWidth/2;
// let centerY = window.innerHeight/2;

const plateImg = new window.Image();  
plateImg.src = plate;

const candleImg = new window.Image();
candleImg.src = stillCandles;

//attempt to use a web image as the center piece - not working 10/12/20
//const webImageURL = 'https://media.giphy.com/media/fi9iBFsZXieAg/giphy.gif';

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
    {name: 'candle', img: candleImg, load: isCandleLoaded},
    {name: 'empty', load: false}
  ]
  
  let currentImgObj = images.find(obj => obj.name === centerImg);
  console.log(currentImgObj.load);

  return (
      <>
      {currentImgObj.load && (
          <Image 
            image={currentImgObj.img}
            visible
            id={'candle'} 
            width={250}
            height={250}
            x={centerX} 
            y={centerY}
            offsetX={125}
            offsetY={125}
            />
          )}
      </>
    )
}

export default CenterImage;