import React, { useState } from 'react';
import { Row, Col, Container} from 'reactstrap';
import Konva from 'konva';
import logo from './logo.svg';
import './App.css';
import Circles from './components/Circles';
import InputFields from './components/Input';

//figure out how to re-render on submit
let centerX = window.innerWidth/2;
let centerY = window.innerHeight/2;
console.log(centerX, centerY);

function App() {
  const [names, setNames] = useState(['Betsy', 'Megan', 'John']);
  const [name, setName] = useState(''); //current name
  const [keyword, setKeyword] = useState(''); //current keyword
  const [keywords, setKeywords] = useState(['light', 'dark', 'kind']);
  const [items, setItems] = useState(generateItems(names));

  function generateItems(arr) {
    const circles = [];
    const length = arr.length;
    for (let i = 0; i < length; i++) {
      let angle = (i/length)*Math.PI*2;
      let radius = 260;
      circles.push({
        x: (Math.cos(angle)*radius) + centerX,
        y: (Math.sin(angle)*radius) + centerY,
        id: 'node-' + i,
        color: Konva.Util.getRandomColor(),
        text: arr[i]
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
      <Container>
        <Row className="m-4">
          <Col sm="2">
            <InputFields 
              name={name} 
              setName={setName}
              keyword={keyword}
              setKeyword={setKeyword}
              names={names} 
              keywords={keywords}
              onNameChange={(e) => handleAddName(name)}
              onWordChange={e => handleAddKeyword(keyword)}/>
          </Col>
        </Row>
        <Row>
          <Col>
            <Circles items={items} setItems={setItems} keywords={keywords} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
