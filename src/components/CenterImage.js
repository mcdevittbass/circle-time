import React, { useState } from 'react';
import { Image } from 'react-konva';
import plate from '../img/plate2.png'; 

let centerX = window.innerWidth/2;
let centerY = window.innerHeight/2;

const plateImg = new window.Image();  
plateImg.src = plate;

const CenterImage = () => {
    const [isPlateLoaded, setPlateLoaded] = useState(false);

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
              width={400}
              height={400}
              x={centerX} 
              y={centerY}
              offsetX={200}
              offsetY={200}
              />
            )}
        </>
    )
}

export default CenterImage;