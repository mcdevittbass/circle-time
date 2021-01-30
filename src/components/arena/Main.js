import React, { useState, useEffect } from 'react';
import { Container, Row } from 'reactstrap';
import CircleStage from './Stage';
import MainButton from './MainButton';

//let centerX = window.innerWidth/2;
//let centerY = window.innerHeight/2;

function Main() {
  const colorPalette = ['#020887', '#6D326D', '#D56062', '#F37748', '#ECC30B', '#84BCDA', '#5E7416', '#0C595E'];

  const [centerImg, setCenterImg] = useStickyState('plate', 'centerImg');
  const [centerX] = useState(window.innerWidth/2);
  const [centerY] = useState(window.innerHeight/2)
  const [names, setNames] = useStickyState([], 'names');
  const [name, setName] = useStickyState('', 'name'); //current name
  const [keyword, setKeyword] = useStickyState('', 'keyword'); //current keyword
  const [keywords, setKeywords] = useStickyState([], 'keywords');
  const [items, setItems] = useStickyState(names.map(name => generateItems(name)), 'items');
  const [wordItems, setWordItems] = useStickyState(keywords.map(word => generateWordItems(word)), 'keywordItems');
  const [questionText, setQuestionText] = useStickyState('', 'question');

  function setCirclePositions(shapeArr) {
    let paramterA = window.innerWidth*0.375;
    let paramterB = window.innerHeight*0.4;
    const length = shapeArr.length;
    let biggestShapeRadius = paramterB*0.2
    shapeArr.forEach((shape, i) => {
      let angle = (i/length)*Math.PI*2;
      shape.x = Math.cos(angle)*paramterA + centerX;
      shape.y = Math.sin(angle)*paramterB + centerY;
      shape.key = 'node-' + i;
      shape.radius = length < 18 ? biggestShapeRadius : length < 26 ? biggestShapeRadius*0.8 : biggestShapeRadius*0.6;
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
    setCirclePositions(items);
    console.log(window.innerWidth, window.innerHeight)
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
                <MainButton
                    centerImg={centerImg}
                    setCenterImg={setCenterImg}
                    items={items}
                    setItems={setItems}
                    wordItems={wordItems}
                    setWordItems={setWordItems}
                    name={name}
                    setName={setName}
                    keyword={keyword}
                    setKeyword={setKeyword}
                    names={names}
                    setNames={setNames}
                    keywords={keywords}
                    setKeywords={setKeywords}
                    setQuestionText={setQuestionText}
                    handleAddName={handleAddName}
                    handleAddWord={handleAddWord}
                    handleClear={handleClear}
                 />
            </Row>
            <Row style={{margin: 0}}> 
                <CircleStage 
                    items={items} 
                    setItems={setItems} 
                    wordItems={wordItems} 
                    centerX={centerX} 
                    centerY={centerY} 
                    centerImg={centerImg}
                    questionText={questionText}
                />
            </Row>
        </Container>
    </>
  );
}

export default Main;


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