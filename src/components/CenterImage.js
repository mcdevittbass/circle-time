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
    //const [isPlateLoaded, setPlateLoaded] = useState(false);
    const [isCandleLoaded, setCandleLoaded] = useState(false);
    const [ready, setReady] = useState(false);
    //const [webImage] = useImage(webImageURL);

    const handleImgLoad = () => {
        //setPlateLoaded(true);
        setCandleLoaded(true);
      }
    
      const handleLoadError = () => {
        console.log("Failed to load images")
    }

    // plateImg.onload = handleImgLoad;
    // plateImg.onerror = handleLoadError;
    candleImg.onload = handleImgLoad;
    candleImg.onerror = handleLoadError;

    // const imgMap = {
    //   'plate': plateImg,
    //   'candle': candleImg
    // }
    // let imgKey = null;
    // if(isPlateLoaded && isCandleLoaded) {
    //   imgKey = Object.keys(imgMap).filter(key => key === centerImg).join('');
    //   if(imgKey) setReady(true);
    // }
    // console.log(ready); 
    return (
        <>
        {isCandleLoaded && (
            <Image 
              image={candleImg}
              visible
              id={'candle'} 
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