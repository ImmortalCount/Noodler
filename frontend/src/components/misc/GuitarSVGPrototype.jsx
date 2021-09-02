import React from 'react'

//colors: 
// C = red #FF0000
// C# = orangered #FF4500
// D = orange #FFA500
// D# = yellow-orange #FCC404
// E = yellow #FFFF00
// F = yellowgreen #9ACD32
// F# = green #00FF00
// G = Blue-Green #0D98BA
// G# = Blue #0000FF
// A = Blue-Violet #4d1A7F
// A# = Violet #8F00FF
// B = Red-Violet #C71585

//maybe use SVG.js downside is performance though

export default function GuitarSVG() {
  var fillArr = [
  '#FF0000', 
  '#FF4500', 
  '#FFA500', 
  '#FCC404', 
  '#FFFF00', 
  '#9ACD32', 
  '#00FF00', 
  '#0D98BA', 
  '#0000FF', 
  '#4d1A7F',
  '#8F00FF',
  '#C71585' 
];
  var textArr = [
  'C', 
  'C#', 
  'D', 
  'D#', 
  'E', 
  'F', 
  'F#', 
  'G', 
  'G#',
  'A', 
  'A#', 
  'B'
];
  var myInterval;
  var running = false;
  var fillPos = 0;
  function handleClick(){
    if (fillPos < 11){
      fillPos += 1;
    } else {
      fillPos = 0;
    }
    document.getElementById('circle').setAttribute('fill', fillArr[fillPos]);
    document.getElementById('circle').setAttribute('cx', ((fillPos * 40) + 20));
    document.getElementById('text').setAttribute('x', ((fillPos * 40) + 20));
    document.getElementById('text').textContent = textArr[fillPos]
  }
  return (
    <>
    <svg version="1.1"
     baseProfile="full"
     width="800" height="270"
     xmlns="http://www.w3.org/2000/svg">

  <rect width="100%" height="100%" fill="grey" />
  <line x1="0" x2="800" y1="10" y2="10" stroke="black" strokeWidth="0.5"/>
  <line x1="0" x2="800" y1="60" y2="60" stroke="black" strokeWidth="1"/>
  <line x1="0" x2="800" y1="110" y2="110" stroke="black" strokeWidth="1.5"/>
  <line x1="0" x2="800" y1="160" y2="160" stroke="black" strokeWidth="2"/>
  <line x1="0" x2="800" y1="210" y2="210" stroke="black" strokeWidth="2.5"/>
  <line x1="0" x2="800" y1="260" y2="260" stroke="black" strokeWidth="3"/>

  <line x1="2" x2="2" y1="0" y2="285" stroke="black" strokeWidth="5"/>
  <line x1="40" x2="40" y1="0" y2="275" stroke="black" strokeWidth="2"/>
  <line x1="80" x2="80" y1="0" y2="275" stroke="black" strokeWidth="2"/>
  <line x1="120" x2="120" y1="0" y2="275" stroke="black" strokeWidth="2"/>
  <line x1="160" x2="160" y1="0" y2="275" stroke="black" strokeWidth="2"/>
  <line x1="200" x2="200" y1="0" y2="275" stroke="black" strokeWidth="2"/>
  <line x1="240" x2="240" y1="0" y2="275" stroke="black" strokeWidth="2"/>
  <line x1="280" x2="280" y1="0" y2="275" stroke="black" strokeWidth="2"/>
  <line x1="320" x2="320" y1="0" y2="275" stroke="black" strokeWidth="2"/>
  <line x1="360" x2="360" y1="0" y2="275" stroke="black" strokeWidth="2"/>
  <line x1="400" x2="400" y1="0" y2="275" stroke="black" strokeWidth="2"/>
  <line x1="440" x2="440" y1="0" y2="275" stroke="black" strokeWidth="2"/>
  <line x1="480" x2="480" y1="0" y2="275" stroke="black" strokeWidth="2"/>
  <line x1="520" x2="520" y1="0" y2="275" stroke="black" strokeWidth="2"/>
  <line x1="560" x2="560" y1="0" y2="275" stroke="black" strokeWidth="2"/>
  <line x1="600" x2="600" y1="0" y2="275" stroke="black" strokeWidth="2"/>
  <line x1="640" x2="640" y1="0" y2="275" stroke="black" strokeWidth="2"/>
  <line x1="680" x2="680" y1="0" y2="275" stroke="black" strokeWidth="2"/>
  <line x1="720" x2="720" y1="0" y2="275" stroke="black" strokeWidth="2"/>
  <line x1="760" x2="760" y1="0" y2="275" stroke="black" strokeWidth="2"/>

  <circle id='circle' cx= "60" cy="110" r="15" fill ="#8F00FF" stroke="azure" strokeWidth="2" />
  <text id='text' x= "60" y="110" textAnchor='middle' fill='black' dominantBaseline='middle' fontSize='15px'>B</text>
</svg>
<button onClick={
  function(){if (running !== true){myInterval = setInterval(handleClick, 10); running = true}}}>start</button>
<button onClick={function(){clearInterval(myInterval); running = false}}>stop</button>
<button onClick={()=> console.log('working?')}>Working?</button>
</>


  )
}


