import React, { useState } from 'react';
import { Row, Col} from 'reactstrap';
import Konva from 'konva';
import './App.css';
import Circles from './components/Circles';
import InputFields from './components/Input';

//import useImage from 'use-image';

//figure out how to re-render on submit
let centerX = window.innerWidth/2;
let centerY = window.innerHeight/2;
console.log(centerX, centerY);

function App() {
  //develop way to render with empty array
  const [names, setNames] = useState([]);
  const [name, setName] = useState(''); //current name
  const [keyword, setKeyword] = useState(''); //current keyword
  const [keywords, setKeywords] = useState([]);
  const [items, setItems] = useState(generateItems(names));

  function generateItems(arr) {
    const circles = [];
    const length = arr.length;
    for (let i = 0; i < length; i++) {
      let angle = (i/length)*Math.PI*2;
      let paramterA = window.innerWidth*0.375;
      let paramterB = window.innerHeight*0.5;
      circles.push({
        x: (Math.cos(angle)*paramterA) + centerX,
        y: (Math.sin(angle)*paramterB) + centerY,
        key: 'node-' + i,
        color: Konva.Util.getRandomColor(),
        text: arr[i],
        radius: names.length < 18 ? 50 : names.length < 26 ? 40 : 30
      });
    }
    return circles;
  }

  const handleAddName = (name) => {
    const newNames = [...names, name];
    setNames(newNames);
    setItems(generateItems(newNames));
  }

  const handleRemoveName = (name) => {

 }

 const handleAddKeyword = (word) => {
    const newWords = [...keywords, word];
    setKeywords(newWords);
 }

  return (
    <div className="App">      
      <InputFields 
        name={name} 
        setName={setName}
        keyword={keyword}
        setKeyword={setKeyword}
        names={names} 
        keywords={keywords}
        onNameChange={(e) => handleAddName(name)}
        onWordChange={e => handleAddKeyword(keyword)}/>
      <Circles items={items} setItems={setItems} keywords={keywords}/>
    </div>
  );
}

export default App;
