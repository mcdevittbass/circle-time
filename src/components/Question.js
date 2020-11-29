import React from 'react';
import { Text } from 'react-konva';

const Question = ( { centerX, centerY, questionText}) => {

  return (
    <>
        <Text 
            text={questionText}
            fontFamily='Helvetica'
            fontSize={24}
            fontStyle='bold'
            fill={'#020887'}
            draggable 
            align='center'
            width={400}
            wrap='word'
            offsetX={200}
            x={centerX}
            y={centerY - 30}
            key={'q'}
        />
    </>
    )
  }

  export default Question;