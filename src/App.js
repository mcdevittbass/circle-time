import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import './App.css';
import CircleStage from './components/Stage';
import InputFields from './components/Input';
import Remove from './components/Remove';

//let centerX = window.innerWidth/2;
//let centerY = window.innerHeight/2;

function App() {
  const colorPalette = ['#020887', '#6D326D', '#D56062', '#F37748', '#ECC30B', '#84BCDA', '#5E7416', '#0C595E'];

  const [centerX, setCenterX] = useState(window.innerWidth/2);
  const [centerY, setCenterY] = useState(window.innerHeight/2)
  const [names, setNames] = useStickyState([], 'names');
  const [name, setName] = useStickyState('', 'name'); //current name
  const [keyword, setKeyword] = useStickyState('', 'keyword'); //current keyword
  const [keywords, setKeywords] = useStickyState([], 'keywords');
  const [items, setItems] = useStickyState(names.map(name => generateItems(name)), 'items');
  const [wordItems, setWordItems] = useStickyState(keywords.map(word => generateWordItems(word)), 'keywordItems');

  function setCirclePositions(shapeArr) {
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

  function generateItems(newName) {
    let circle = {
      color: colorPalette[names.length % 8],
      text: newName
    }
    return circle;
  }

  function generateWordItems(newWord) {
    let word = {
      color: colorPalette[keywords.length % 8],
      text: newWord,
      x: 20,
      y: Math.random() * (window.innerHeight - 30)
    }
    return word;
  };

  useEffect(() => {
    console.log(keywords)
    setCirclePositions(items);
  });

  const handleAddName = (newName) => {
    setName(newName);
    const newNames = [...names, newName];
    setNames(newNames);
    const newItem = generateItems(newName);
    const newItemArr = [...items, newItem];
    setItems(newItemArr);
    setCirclePositions(newItemArr);
  }

  const handleAddWord = (newWord) => {
    setKeyword(newWord);
    const newWords = [...keywords, newWord];
    setKeywords(newWords);
    const newWordItem = generateWordItems(newWord);
    const newWordItemArr = [...wordItems, newWordItem];
    setWordItems(newWordItemArr);
  }

  const handleClear = () => {
    setItems([]);
    setNames([]);
    setKeywords([]);
    setWordItems([]);
  }

  return (
    <>
      <Container fluid className='App m-0 p-0' style={{backgroundColor: '#fff'}}> 
        <Row>  
          <Col>  
            <InputFields 
              name={name} 
              setName={setName}
              keyword={keyword}
              setKeyword={setKeyword}
              names={names} 
              keywords={keywords}
              onNameChange={() => handleAddName(name)}
              onWordChange={() => handleAddWord(keyword)}
              />
          </Col>
          <Col>
            <Button style={{backgroundColor:'#ECC30B', border: 'none'}} className='m-2' onClick={handleClear}>Clear all</Button>
          </Col>
          <Col>
            <Remove objs={items} setObjs={setItems} setArray={setNames} buttonText={'Remove a Name'} buttonColor={'#0C595E'} />
          </Col>
          <Col>
            <Remove objs={wordItems} setObjs={setWordItems} setArray={setKeywords} buttonText={'Remove a Keyword'} buttonColor={'#020887'} />
          </Col>
          <CircleStage items={items} setItems={setItems} wordItems={wordItems} />
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