import React, { useState } from 'react';
import { Image } from 'react-konva';
import plate from '../img/plate2.png'; 
import { useImage } from 'use-image';

let centerX = window.innerWidth/2;
let centerY = window.innerHeight/2;

const plateImg = new window.Image();  
plateImg.src = plate;

//attempt to use a web image as the center piece - not working 10/12/20
//const webImageURL = 'https://media.giphy.com/media/fi9iBFsZXieAg/giphy.gif';

const CenterImage = () => {
    const [isPlateLoaded, setPlateLoaded] = useState(false);
    //const [webImage] = useImage(webImageURL);

    const handleImgLoad = () => {
        setPlateLoaded(true);
      }
    
      const handleLoadError = () => {
        console.log("Failed to load")
    }

    plateImg.onload = handleImgLoad;
    plateImg.onerror = handleLoadError;

    return (
        <>
        {isPlateLoaded && (
            <Image 
              image={plateImg}
              visible
              id={'plate'} 
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