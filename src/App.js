import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import Konva from 'konva';
import './App.css';
import CircleStage from './components/Stage';
import InputFields from './components/Input';
import Remove from './components/Remove';

//figure out how to re-render on submit
let centerX = window.innerWidth/2;
let centerY = window.innerHeight/2;
console.log(centerX, centerY);

function App() {
  const [names, setNames] = useStickyState(['Betsy', 'Megan','John'], 'names');
  const [name, setName] = useStickyState('', 'name'); //current name
  const [keyword, setKeyword] = useStickyState('', 'keyword'); //current keyword
  const [keywords, setKeywords] = useStickyState(['Shade', 'Light'], 'keywords');
  const [items, setItems] = useStickyState(names.map((name, i) => generateItems(name, keywords[i])), 'items');

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
    let circle = {
      color: Konva.Util.getRandomColor(),
      text: newName,
      keyword: newKeyword,
      keywordX: Math.random() * (window.innerWidth),
      keywordY: Math.random() * (window.innerHeight)
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
    const newItem = generateItems(newName, newWord);
    const newItemArr = [...items, newItem];
    setItems(newItemArr);
    setPositions(newItemArr);
  }

  const handleClear = () => {
    setItems([]);
    setNames([]);
    setKeywords([]);
  }

  return (
    <>
      <Container fluid className='App m-0 p-0' style={{backgroundColor: '#69A2B080'}}> 
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
            <Button color='warning' className='m-2' onClick={handleClear}>Clear all</Button>
          </Col>
          <Col>
            <Remove items={items} setItems={setItems} setNames={setNames} />
          </Col>
          <CircleStage items={items} setItems={setItems} />
        </Row>
    </Container>
  </>
  );
}

export default App;


//from https://joshwcomeau.com/react/persisting-react-state-in-localstorage/
function useStickyState(defaultValue, key) {
  const [value, setValue] = useState(() => {
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue !== null
      ? JSON.parse(stickyValue)
      : defaultValue;
  });
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}