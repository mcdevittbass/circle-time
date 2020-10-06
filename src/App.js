import React, { useState, useEffect } from 'react';
import GoogleSheetsProvider from 'react-db-google-sheets';
import { Container, Row, Col} from 'reactstrap';
import Konva from 'konva';
import './App.css';
import Circles from './components/Circles';
import InputFields from './components/Input';
import Remove from './components/Remove';

//figure out how to re-render on submit
let centerX = window.innerWidth/2;
let centerY = window.innerHeight/2;
console.log(centerX, centerY);

function App() {
  //develop way to render with empty array
  const [names, setNames] = useState(['Betsy', 'Megan']);
  const [name, setName] = useState(''); //current name
  const [keyword, setKeyword] = useState(''); //current keyword
  const [keywords, setKeywords] = useState(['Shade', 'Light']);
  const [item, setItem] = useState({});
  const [items, setItems] = useState(names.map((name, i) => generateItems(name, keywords[i])));

  function setPositions(shapeArr) {
    let paramterA = window.innerWidth*0.375;
    let paramterB = window.innerHeight*0.4;
    const length = shapeArr.length;
    shapeArr.forEach((shape, i) => {
      let angle = (i/length)*Math.PI*2;
      shape.x = Math.cos(angle)*paramterA + centerX;
      shape.y = Math.sin(angle)*paramterB + centerY;
      shape.key = 'node-' + i;
      shape.radius = length < 18 ? 50 : length < 26 ? 40 : 30;
    })
  }
  function generateItems(newName, newKeyword) {
    //const circles = []; 
    //circles.push({
    let circle = {
      color: Konva.Util.getRandomColor(),
      text: newName,
      keyword: newKeyword,
      keywordX: Math.random() * (window.innerWidth),
      keywordY: Math.random() * (window.innerHeight)
    // });
    }
    return circle;
  }

  useEffect(() => setPositions(items));

  const handleAddName = (newName, newWord) => {
    setName(newName);
    const newNames = [...names, newName];
    setNames(newNames);
    setKeyword(newWord);
    const newWords = [...keywords, newWord]
    setKeywords(newWords);
    const newItem = generateItems(newName, newWord)
    setItem(newItem);
    const newItemArr = [...items, newItem];
    setItems(newItemArr);
    setPositions(newItemArr);
  }

  const handleRemoveName = (name) => {

 }

  return (
    <GoogleSheetsProvider>
      <Container fluid className='App m-0 p-0' style={{backgroundColor: '#69A2B0'}}> 
        <Row>  
          <Col>  
            <InputFields 
              name={name} 
              setName={setName}
              keyword={keyword}
              setKeyword={setKeyword}
              names={names} 
              keywords={keywords}
              onNameChange={() => handleAddName(name, keyword)}
              />
          </Col>
          <Col>
            <Remove items={items} setItems={setItems}/>
          </Col>
          <Circles items={items} setItems={setItems} /*keywords={keywords}*//>
        </Row>
      </Container>
    </GoogleSheetsProvider>
  );
}

export default App;
