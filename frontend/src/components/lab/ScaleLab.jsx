import {React, useState, useEffect} from 'react'
import { Form, Checkbox , Icon, Dropdown, Menu, Button, TextArea, Input} from 'semantic-ui-react'
import {Scale, ScaleType, Note} from '@tonaljs/tonal';
import * as Tone from 'tone';
import { useDispatch, useSelector } from 'react-redux';
import { setLabData } from '../../store/actions/labDataActions';
import { scaleHandler } from './utils';
import ExportModal from '../modal/ExportModal';

import '../../../public/Do_Mayor_armadura.svg'
import { keySynth } from './synths';
import { setNoteDisplay } from '../../store/actions/noteDisplayActions';
import { setPlayImport } from '../../store/actions/playImportActions';

export default function ScaleLab({importedScaleData, masterInstrumentArray}) {
    const [scaleDataBinary, setScaleDataBinary] = useState([1,0,1,0,1,1,0,1,0,1,0,1])
    const [scaleName, setScaleName] = useState('major');
    const [notes, setNotes] = useState(["C", "D", "E", "F", "G", "A", "B"]);
    const [scaleNumber, setScaleNumber] = useState(2773);
    const [randomRange, setRandomRange] = useState({only: 7, min: 7, max: 7})
    const [display, setDisplay] = useState('off')
    const [description, setDescription] = useState('')
    const [showDescription, setShowDescription] = useState(false)
    const [options, setOptions] = useState('sharps')
    const [playOptions, setPlayOptions] = useState('forward')
    const [randomOptions, setRandomOptions] = useState('all')
    const [exportPool, setExportPool] = useState('global')
    const [inputFocus, setInputFocus] = useState(false)
    const [displayName, setDisplayName] = useState('C major')
    const [instrumentDisplay, setInstrumentDisplay] = useState(-2)
    const isMuted = false;
    const user = JSON.parse(localStorage.getItem('userInfo'))

    function setScale(scaleName){
      const rootChromaticScale = Scale.get(rootNote + ' chromatic').notes
      const scaleNumber = Scale.get(rootNote + ' ' + scaleName).setNum
      const chromaReturn = Scale.get(rootNote + ' ' + scaleName).chroma.split("")

      for (let k = 0; k < chromaReturn.length; k++){
          chromaReturn[k] = Number(chromaReturn[k])
      }
      const returnScale = [];

      for (let j = 0; j < chromaReturn.length; j++){
          if (chromaReturn[j] === 1){
              returnScale.push(rootChromaticScale[j]);
          }
      }

      setScaleName(scaleName);
      setScaleNumber(scaleNumber)
      setScaleDataBinary(chromaReturn);
      setNotes(scaleHandler(returnScale, options));
    }

    const [rootNote, setRootNote] = useState('C')

    const dispatch = useDispatch()

    const labData = useSelector(state => state.labData)
    const {labInfo} = labData



function createScaleSVG(){
    var svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    svg.setAttribute("height", 300);
    svg.setAttribute("width", 300);
    // svg.setAttribute("fill-opacity", 0.5);
    
    var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    rect.setAttribute("width", "100%");
    rect.setAttribute("height", "100%");
    rect.setAttribute("fill", "white");
    svg.appendChild(rect)
    
    //for circular representation:
    var angle = 30;
    var amountCircles = 12;
    var xCenter = 150;
    var yCenter = 150;
    var radius = 100;
    var angleIncrement = 2 * Math.PI / (amountCircles) 
    //main circle
    var mainCircle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
        mainCircle.setAttribute('cx', xCenter );
        mainCircle.setAttribute('cy', yCenter);
        mainCircle.setAttribute('r', radius);
        mainCircle.setAttribute("fill", 'transparent');
        mainCircle.setAttribute("stroke", 'black');
        mainCircle.setAttribute("stroke-width", '2');
        svg.appendChild(mainCircle)
    //inner Circles
    var noteCount = 0;
    for (var i = 0; i < amountCircles; i++){
        var fill;
        if (scaleDataBinary[i] === 1){ 
            fill = 'black'
        } else {
            fill = 'white';
        }
        var circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
        circle.setAttribute('cx', xCenter + (radius * Math.cos(angle)));
        circle.setAttribute('cy', yCenter + (radius * Math.sin(angle)));
        circle.setAttribute('r', 23);
        circle.setAttribute("fill", fill);
        circle.setAttribute("stroke", 'black');
        circle.setAttribute("stroke-width", '2');
        circle.setAttribute("id", 'scale_' + i)
        var noteName = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        noteName.setAttribute('x', xCenter + (radius * Math.cos(angle)));
        noteName.setAttribute('y', yCenter + (radius * Math.sin(angle)));
        noteName.setAttribute('text-anchor', 'middle');
        noteName.setAttribute('fill', 'white');
        noteName.setAttribute('dominant-baseline', 'middle');
        noteName.setAttribute('font-size', '15px');
        if (fill === 'black'){
          noteName.textContent = notes[noteCount];
          noteCount++
        }
        svg.appendChild(circle);
        svg.appendChild(noteName);
        angle += angleIncrement
    }
    //check if its there
    const scaleDiv = document.getElementById('divScaleInteractive');
    if (scaleDiv.firstChild){
        while (scaleDiv.firstChild){
            scaleDiv.removeChild(scaleDiv.firstChild)
        }
    }
    //Add to div
    scaleDiv.appendChild(svg);
  }

   

  useEffect(() => {
    var newNotes = importedScaleData['scale']
    if (newNotes !== undefined){
      var newBinary = importedScaleData['binary']
      var newName = importedScaleData['scaleName']
      var newNumber = importedScaleData['number']
      var newDesc = importedScaleData['desc']
      setNotes(newNotes)
      setScaleName(newName.split(' ').slice(1).join(' '))
      setDisplayName(newName)
      setScaleNumber(newNumber)
      setScaleDataBinary(newBinary)
      setRootNote(newNotes[0])
      setDescription(newDesc)
      createScaleSVG()
    }
  }, [importedScaleData])

  useEffect(() => {
    setDisplayName(rootNote + ' ' + scaleName)
  }, [rootNote, scaleName])

  useEffect (()=>{
    createScaleSVG()
    let newInfo = {...labInfo}
    const scaleDataPrototype = {
        name: displayName,
        scaleName: displayName,
        binary: scaleDataBinary,
        number: scaleNumber,
        desc: description,
        scale: notes,
        dataType: 'scale',
        pool: '',
    }
    newInfo['scaleLab'] = scaleDataPrototype
    dispatch(setLabData(newInfo))
    // sendScaleData(notes)
}, [notes]);

// Change the instrument display data sent to the guitarSVG
useEffect(() => {
  dispatch(setNoteDisplay(convertScaleForDispatch()))
}, [instrumentDisplay, notes])

function convertScaleForDispatch(data){
  var arrOfObj = []
  var dispatchObj = {data: [{speed: 1, notes: [['']]}], displayOnly: true, highlight: []}
  var scaleString = ''

  let localNotes;

  if (data === undefined){
    localNotes = notes
  } else {
    localNotes = data
  }


  for (let i= 0; i < localNotes.length; i++){
    scaleString += localNotes[i] + ' '
  }


  for (let h = 0; h < masterInstrumentArray.length; h++){
    arrOfObj.push(JSON.parse(JSON.stringify(dispatchObj)))
  }

  if (instrumentDisplay === -2){
    return arrOfObj
  } else if (instrumentDisplay === -1){
    for (let j = 0; j < arrOfObj.length; j++){
      arrOfObj[j]['data'][0]['notes'][0] = [scaleString]
    }
    return arrOfObj
  } else {
    arrOfObj[instrumentDisplay - 1]['data'][0]['notes'][0] = [scaleString]
    console.log(arrOfObj, 'arr of obj', scaleString, 'scale string')
    return arrOfObj
  }

}



  function getNotePositions(){
    var acceptableNotes = [
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
    ]
    var cleanNotes = []
    for (var i = 0; i < notes.length; i++){
      if (acceptableNotes.includes(notes[i]) === false){
        cleanNotes.push(Note.enharmonic(notes[i]))
      } else {
        cleanNotes.push(notes[i])
      }
    }
    const notePositionKeyPair = {}
    var count = 0;
    
    for (var j = 0; j < scaleDataBinary.length; j++){
      if (scaleDataBinary[j] === 1){
        notePositionKeyPair[cleanNotes[count]] = 'scale_' + j;
        count++
      }
    }
    return notePositionKeyPair;
  }
    function generateRandomScale(){
      var min = Number(randomRange['min'])
      var max = Number(randomRange['max'])
      var noteNumber = Math.floor(Math.random() * (max - min + 1) + min)
      
        var returnArr = [1,0,0,0,0,0,0,0,0,0,0,0];
        var returnScale = [];
        var rootChromaticScale = Scale.get(rootNote + ' chromatic').notes
        
        var i = 1;
        while (i < noteNumber){
            var randomIndex = (Math.floor(Math.random() * 11) + 1);
            if (returnArr[randomIndex] !== 1){
                returnArr[randomIndex] = 1;
                i += 1;
            }
        }
        for (var j = 0; j < returnArr.length; j++){
            if (returnArr[j] === 1){
                returnScale.push(rootChromaticScale[j]);
            }
        }
        var digit = parseInt(returnArr.join(""), 2)
        if (Scale.get(returnArr.join("")).name === ''){
          setScaleName(digit);
          } else {
          setScaleName(Scale.get(returnArr.join("")).name);
          }
        setScaleNumber(digit)
        setScaleDataBinary(returnArr);
        setNotes(scaleHandler(returnScale, options));
        
    }

    function generateRandomNamedScale(){
      var min = Number(randomRange['min'])
      var max = Number(randomRange['max'])
      if (max < 5){
        return;
      } 
      if (min < 5){
        min = 5
      }
      var allNamed = ScaleType.all();
      var noteNumber = Math.floor(Math.random() * (max - min + 1) + min)
      var allScalesOfACertainLength = [];
      for (var i = 0; i < allNamed.length; i++){
        if (allNamed[i]['intervals'].length === noteNumber){
          allScalesOfACertainLength.push(allNamed[i])
        }
      }
      if (allScalesOfACertainLength.length === 0){
        return;
      } else {
        var randIndex = Math.floor(Math.random() * (allScalesOfACertainLength.length))
        var rootChromaticScale = Scale.get(rootNote + ' chromatic').notes
        var chromaReturn = allScalesOfACertainLength[randIndex]['chroma'].split("")
        for (var k = 0; k < chromaReturn.length; k++){
            chromaReturn[k] = Number(chromaReturn[k])
        }
        var returnScale = [];

        for (var j = 0; j < chromaReturn.length; j++){
            if (chromaReturn[j] === 1){
                returnScale.push(rootChromaticScale[j]);
            }
        }
        setScaleName(allScalesOfACertainLength[randIndex]['name']);
        setScaleNumber(allScalesOfACertainLength[randIndex]['setNum'])
        setScaleDataBinary(chromaReturn);
        setNotes(scaleHandler(returnScale, options));
      }
    }

    function handleRandomClick(){
      if (randomOptions === 'all'){
        generateRandomScale()
      } else if (randomOptions === 'named'){
        generateRandomNamedScale()
      }
    }

    function changeBinary(index, status){
        var returnScale = [];
        var rootChromaticScale = Scale.get(rootNote + ' chromatic').notes
        var clone = [...scaleDataBinary]

        if (status === 'on'){
            clone[index] = 1;
        }
        if (status === 'off'){
            clone[index] = 0;
        }
        for (var j = 0; j < clone.length; j++){
            if (clone[j] === 1){
                returnScale.push(rootChromaticScale[j]);
            }
        }

        var digit = parseInt(clone.join(""), 2)
        if (Scale.get(clone.join("")).name === ''){
          setScaleName(digit);
          } else {
          setScaleName(Scale.get(clone.join("")).name);
          }
        setScaleNumber(digit)
        setScaleDataBinary(clone);
        setNotes(scaleHandler(returnScale, options));
    }

    function generateAllModes(binaryNoteArr){
        var modes = [];
        var cloneScale = [...binaryNoteArr];
        
            for (var i = 0; i < 12; i++){
                    var current = [...cloneScale]
                    if (current[0] === 1){
                        modes.push(current);
                    }
                    
                    cloneScale.push(cloneScale.shift());
                }
            return modes;
        }

    function toggleModes(direction, notes){
    var newRoot;
    var allModes = generateAllModes(scaleDataBinary);
    var rootChromaticScale = Scale.get(rootNote + ' chromatic').notes
    

    if (allModes.length === 0 || allModes.length === undefined){
        return;
    }
    var newBinary = [];
    var returnScale = [];
    var currentNotes = notes;

  //   for (var i = 0; i < allModes[0].length; i++){
  //     if (allModes[0][i] === 1){
  //         currentNotes.push(rootChromaticScale[i]);
  //     }
  // }

    if (direction === 'next'){
        newBinary = allModes[1]
        var newRoot = currentNotes[1]
    }

    if (direction === 'previous'){
        newBinary = allModes[allModes.length - 1];
        var newRoot = currentNotes[currentNotes.length - 1];
    }

    var newRootChromaticScale = Scale.get(newRoot + ' chromatic').notes

    for (var j = 0; j < newBinary.length; j++){
        if (newBinary[j] === 1){
            returnScale.push(newRootChromaticScale[j]);
        }
    }


    var digit = parseInt(newBinary.join(""), 2)
        if (Scale.get(newBinary.join("")).name === ''){
          setScaleName(digit)
          } else {
          setScaleName(Scale.get(newBinary.join("")).name);
          }
        setScaleNumber(digit)
        setScaleDataBinary(newBinary);
        setRootNote(newRoot);
        setNotes(scaleHandler(returnScale, options));
    }

    //---Play notes:
    function playNoteSequence(){
    if (isMuted){
      return
    }

    function handleNotes(){
      var returnValues = [];
      var noteValues =
      [
      'C3', 
      'C#3', 
      'D3', 
      'D#3', 
      'E3', 
      'F3', 
      'F#3', 
      'G3', 
      'G#3', 
      'A3', 
      'A#3', 
      'B3',
      'C4', 
      'C#4', 
      'D4', 
      'D#4', 
      'E4', 
      'F4', 
      'F#4', 
      'G4', 
      'G#4', 
      'A4', 
      'A#4', 
      'B4',
    ]
  
    var rootIndex;
    if (noteValues.indexOf(notes[0] + 3) === -1){
      rootIndex = noteValues.indexOf((Note.enharmonic(notes[0]) + 3))
    } else {
      rootIndex = noteValues.indexOf(notes[0] + 3)
    }
  
    for (var i = 0; i < 13; i++){
      if (i === 12){
        returnValues.push(noteValues[rootIndex + i])
      } else {
        if (scaleDataBinary[i] === 1){
          returnValues.push(noteValues[rootIndex + i])
        }
      }
    }
  
    if (playOptions === 'forward'){
      return returnValues;
    }
    if (playOptions === 'reverse'){
      return returnValues.reverse();
    }
    if (playOptions === 'random'){
      var returnArr = [];
      const startArr = returnValues.shift();
      const endArr = returnValues.pop();
          var j = 1;
          while (j < returnValues.length + 1){
              var randomIndex = (Math.floor(Math.random() * returnValues.length));
              if (returnArr.includes(returnValues[randomIndex]) === false){
                  returnArr.push(returnValues[randomIndex])
                  j += 1;
              }
          }
      returnArr.unshift(startArr)
      returnArr.push(endArr)
      return returnArr
    }
  
      }
    
    let newNotes = handleNotes()

    if (instrumentDisplay === -100){
      Tone.start()
      Tone.Transport.cancel()
      Tone.Transport.stop()
      Tone.Transport.start();
      var position = 0;

      dispatch(setNoteDisplay())

    
      var notePositions = getNotePositions();
      
  //---Synthpart function 
          const synthPart = new Tone.Sequence(
            function(time, note) {
              keySynth.triggerAttackRelease(note, "10hz", time)
              
              var highlightedCircle = document.getElementById(notePositions[Note.pitchClass(note)])
              highlightedCircle.setAttribute('r', 29)
              setTimeout(() => {highlightedCircle.setAttribute('r', 23)}, 250)
              //position
              if (position < notes.length -1){
                  position += 1;
              } else {
                  position = 0;
              }
              //memory
  
            },
           newNotes,
            "8n"
          );
          synthPart.start();
          synthPart.loop = 1;


    } else {
      
      let noteArr = [];
      let tempArr = [];

      for (let i = 0; i < newNotes.length; i++){
          if ((i > 1 && i % 2 === 0) || (i === newNotes.length - 1)){
            noteArr.push(tempArr)
            tempArr = []
          }
          tempArr.push(newNotes[i])
      }

      let returnObj = {
        displayOnly: false,
        highlight: 1,
        data: [{speed: 1, notes: noteArr}]
      }


      Tone.start()
      Tone.Transport.cancel()
      dispatch(setPlayImport([returnObj]))
      Tone.Transport.start()

      setTimeout(() => setInstrumentDisplay(-2), 1900)
      setTimeout(() => setInstrumentDisplay(1), 2000)
      setTimeout(() => Tone.Transport.stop(), 2000);

    }


    
    }
      const dropdownOptionsSharp = [
        { key: 1, text: 'C', value: 'C'},
        { key: 2, text: 'C#', value: 'C#'},
        { key: 3, text: 'D', value: 'D'},
        { key: 4, text: 'D#', value: 'D#'},
        { key: 5, text: 'E', value: 'E'},
        { key: 6, text: 'F', value: 'F'},
        { key: 7, text: 'F#', value: 'F#'},
        { key: 8, text: 'G', value: 'G'},
        { key: 9, text: 'G#', value: 'G#'},
        { key: 10, text: 'A', value: 'A'},
        { key: 11, text: 'A#', value: 'A#'},
        { key: 12, text: 'B', value: 'B'}
      ]

      const dropdownOptionsFlat = [
        { key: 1, text: 'C', value: 'C'},
        { key: 2, text: 'Db', value: 'Db'},
        { key: 3, text: 'D', value: 'D'},
        { key: 4, text: 'Eb', value: 'Eb'},
        { key: 5, text: 'E', value: 'E'},
        { key: 6, text: 'F', value: 'F'},
        { key: 7, text: 'Gb', value: 'Gb'},
        { key: 8, text: 'G', value: 'G'},
        { key: 9, text: 'Ab', value: 'Ab'},
        { key: 10, text: 'A', value: 'A'},
        { key: 11, text: 'Bb', value: 'Bb'},
        { key: 12, text: 'B', value: 'B'}
      ]

      const playDropdownOptions = [
        { key: 'forward', text: 'forward', value: 'forward'},
        { key: 'reverse', text: 'reverse', value: 'reverse'},
        { key: 'random', text: 'random', value: 'random'},
      ]

      const displayDropdownOptions = [
        { key: 'Guitar 1', text: 'Guitar 1', value: 'Guitar 1'},
        { key: 'Guitar 2', text: 'Guitar 2', value: 'Guitar 2'},
        { key: 'Guitar 3', text: 'Guitar 3', value: 'Guitar 3'},
      ]
  
      const dragStartHandler = e => {
        var obj = {id: 'special', className: 'scaleData', message: 
        {scaleName: displayName, 
        scale: notes, 
        binary: scaleDataBinary,
        number: scaleNumber,
        desc: description,
      }, 
        type: 'scaleLab'}
        e.dataTransfer.setData('text', JSON.stringify(obj));
    };

      
      const onChangeDropdown = (e, {value}) => {
        var newRootChromaticScale = Scale.get(value + ' chromatic').notes
        var returnScale = [];
        for (var j = 0; j < scaleDataBinary.length; j++){
          if (scaleDataBinary[j] === 1){
              returnScale.push(newRootChromaticScale[j]);
          }
      }
        setNotes(scaleHandler(returnScale, options))
        setRootNote(value);
      }

      const onChangeRandomRange = (e, {value}) => {
      var thisID = e.target.id
      var clone  = JSON.parse(JSON.stringify(randomRange))
      if (thisID === 'randomRangeMax'){
        clone['max'] = value
      } else if (thisID === 'randomRangeMin'){
        clone['min'] = value
      } else if (thisID === 'randomRangeFull'){
        clone['min'] = 1
        clone['max'] = 12
      } else if (thisID === 'randomRangeOnly'){
        clone['min'] = value
        clone['max'] = value
        clone['only'] = value
      }
      setRandomRange(clone)
      }

      function noteMapper(notes){
        var returnArr = []
        for (var i = 0; i < notes.length; i++){
          returnArr.push(notes[i] + " ")
        }
        return returnArr.join('')
      }
      const handlePlayDropdown = (e, {value}) => {
        setPlayOptions(value)
      }

      const handleInstrumentDisplayDropdown = (e, {value}) => {
        setInstrumentDisplay(value)
      }
      
      function testScaleNotesHighlight(){
        var circle = document.getElementById('scale_' + 5)
        circle.setAttribute('r', 29);
      }

      

      function handleSharpsOrFlats(){
        if (options === 'sharps'){
          setOptions('flats')
          setNotes(scaleHandler(notes, 'flats'));
          setRootNote(Note.enharmonic(rootNote))
        } else if (options === 'flats'){
          setOptions('sharps')
          setNotes(scaleHandler(notes, 'sharps'));
          setRootNote(Note.enharmonic(rootNote))
        }
      }

      function mapMenuItems(){
        return (
            masterInstrumentArray.map((instrument, idx) => 
            <Dropdown.Item
            text={instrument}
            key={'mappedInstr' + idx}
            selected={instrumentDisplay === idx + 1}
            onClick={() => setInstrumentDisplay(idx + 1)}
            />
            )
        )
}

const handleInstrumentDisplay = () => {
  
}

// function handleExport(){
//   const user = JSON.parse(localStorage.getItem('userInfo'))

//   const scaleDataPrototype = {
//       name: rootNote + ' ' + scaleName,
//       scaleName: rootNote + ' ' + scaleName,
//       binary: scaleDataBinary,
//       desc: '',
//       number: scaleNumber,
//       scale: notes,
//       type: 'normal',
//       length: notes.length,
//       dataType: 'scale',
//       author: user['name'],
//       authorId: user['_id'],
//       pool: exportPool,
//   }
//   dispatch(insertData(scaleDataPrototype))
// }

const exportObj = {
      name: rootNote + ' ' + scaleName,
      scaleName: rootNote + ' ' + scaleName,
      binary: scaleDataBinary,
      desc: '',
      number: scaleNumber,
      scale: notes,
      type: 'normal',
      length: notes.length,
      dataType: 'scale',
      author: user?.['name'],
      authorId: user?.['_id'],
      pool: exportPool,
}

// const exportDropdownOptions = [
//   { key: 'global', text: 'global', value: 'global'},
//   { key: 'local', text: 'local', value: 'local'},
// ]

// const handleExportDropdown = (e, {value}) => {
//   const user = JSON.parse(localStorage.getItem('userInfo'))
//   if (value === 'local'){
//       const user = JSON.parse(localStorage.getItem('userInfo'))
//       setExportPool(user['_id'])
//   } else {
//       setExportPool(value)
//   }
// }

const handleScaleNameChange = e => {
  setScaleName(e.target.value)
}

const handleScaleDescriptionChange = e => {
  setDescription(e.target.value)
}

    return (
        <>
        <Menu>
        <Menu.Item onClick={() => handleSharpsOrFlats()}>{options === 'sharps' ? '#' : 'b'}</Menu.Item>
        <Dropdown onChange={onChangeDropdown} options={options === 'sharps' ? dropdownOptionsSharp : dropdownOptionsFlat} text = {`Root: ${rootNote}`} simple item/>
        <Button.Group>
        <Button basic compact onClick={()=> playNoteSequence()}><Icon name='play'/></Button>
        <Dropdown
          simple
          item
          className='button icon'
          options={playDropdownOptions}
          onChange={handlePlayDropdown}
          trigger={<></>}
        />
      </Button.Group>
      <Button.Group>
        <Button basic compact onClick={() => handleRandomClick()}>Generate</Button>
        <Dropdown
          simple
          item
          className='button icon'
        >
          <Dropdown.Menu>
          <Dropdown.Header> generate options</Dropdown.Header>
            <Dropdown.Item>range
            <Dropdown.Menu>
                <Dropdown.Item>
                only:
                <Input type='number' 
                onKeyDown={(e) => {e.preventDefault();}}
                onChange={onChangeRandomRange}
                id='randomRangeOnly'
                min='1'
                max='12'
                value={randomRange['only']}
                style={{cursor: 'none'}}
                />
                </Dropdown.Item>
                <Dropdown.Item>
                min:
                <Input type='number' 
                onKeyDown={(e) => {e.preventDefault();}}
                onChange={onChangeRandomRange}
                id='randomRangeMin'
                min='1'
                max='12'
                style={{cursor: 'none'}}
                value={randomRange['min']}
                />
                </Dropdown.Item>
                <Dropdown.Item>
                max:
                <Input type='number' 
                onKeyDown={(e) => {e.preventDefault();}}
                onChange={onChangeRandomRange}
                id='randomRangeMax'
                min='1'
                max='12'
                style={{cursor: 'none'}}
                value={randomRange['max']}
                />
                </Dropdown.Item>
                <Dropdown.Item
                 id='randomRangeFull'
                 onClick={onChangeRandomRange}>
                full
                </Dropdown.Item> 
              </Dropdown.Menu>
            </Dropdown.Item>
            <Dropdown.Item>randomness
              <Dropdown.Menu>
                <Dropdown.Item active={randomOptions === 'named'} onClick={()=> setRandomOptions('named')}>named scales</Dropdown.Item>
                <Dropdown.Item active={randomOptions === 'all'} onClick={()=> setRandomOptions('all')}>true random</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Header> common scales</Dropdown.Header>
            <Dropdown.Item onClick={() => setScale('major')}> Major</Dropdown.Item>
            <Dropdown.Item onClick={() => setScale('harmonic minor')}> Harmonic Minor</Dropdown.Item>
            <Dropdown.Item onClick={() => setScale('melodic minor')}> Melodic Minor</Dropdown.Item>
            <Dropdown.Item onClick={() => setScale('harmonic major')}> Harmonic Major</Dropdown.Item>
            <Dropdown.Item onClick={() => setScale('double harmonic major')}> Double Harmonic Major</Dropdown.Item>
            <Dropdown.Item onClick={() => setScale('diminished')}> Diminished</Dropdown.Item>
            <Dropdown.Item onClick={() => setScale('whole tone')}> Whole Tone</Dropdown.Item>
          </Dropdown.Menu>
          </Dropdown>
      </Button.Group>
      <Button.Group>
      <Button basic compact onClick={() => toggleModes('previous', notes)}><Icon name='caret left'/></Button>
      <Button basic compact > Mode </Button>
      <Button basic compact onClick={() => toggleModes('next', notes)}><Icon name='caret right'/></Button>
      </Button.Group>
        <Menu.Item onClick={() => setShowDescription(!showDescription)}>Desc</Menu.Item>
        <Dropdown
       simple 
       item
       text = 'Display   ' 
       >
        <Dropdown.Menu>
            <Dropdown.Item selected={instrumentDisplay === -2} onClick={() => setInstrumentDisplay(-2)}> None </Dropdown.Item>
            <Dropdown.Item selected={instrumentDisplay === -1} onClick={() => setInstrumentDisplay(-1)}> All </Dropdown.Item>
             {mapMenuItems()}
          </Dropdown.Menu>
        </Dropdown>
        <Button.Group>
        <ExportModal
        dataType={'Scale'}
        exportObj={exportObj}/>
        </Button.Group>
      </Menu>
        <div>
        <div draggable='true' onClick={() => setInputFocus(true)} onDragStart={dragStartHandler} style={{display: !inputFocus ? '': 'none' , height: '25px', width: '200px', backgroundColor:'lightcoral'}}>{displayName}</div>
        <Input type='text' id={'input_scaleLab'} value={scaleName} ref={input => input && input.focus()} onInput={handleScaleNameChange} onBlur={() => setInputFocus(false)} style={{display: inputFocus ? '': 'none' }}/>
        <p># {scaleNumber} </p>
        {showDescription && <Form>
        <TextArea onInput={handleScaleDescriptionChange} id={'desc_scaleLab'} ref={input => input && input.focus()} placeholder='Description...' value={description} />
        </Form>}
        <p>{noteMapper(notes)}</p>
        </div>
        <div id="divScaleInteractive"></div>
        <div className='binaryRadioSelector' style={{display: 'flex', flexDirection: 'row'}}>
        <Form>
        <Form.Field>
         R
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[0] === 1}
            name='binaryRadioSelector0'
            value='0'
            onClick={() => changeBinary(0, 'on')}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[0] === 0}
            name='binaryRadioSelector0'
            value='1'
            onClick={() => changeBinary(0, 'off')}
          />
        </Form.Field>
      </Form>
      <Form>
        <Form.Field>
        m2
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[1] === 1}
            name='binaryRadioSelector1'
            value='0'
            onClick={() => changeBinary(1, 'on')}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[1] === 0}
            name='binaryRadioSelector1'
            value='1'
            onClick={() => changeBinary(1, 'off')}
          />
        </Form.Field>
      </Form>
      <Form>
        <Form.Field>
        M2
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[2] === 1}
            name='binaryRadioSelector2'
            value='0'
            onClick={() => changeBinary(2, 'on')}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[2] === 0}
            name='binaryRadioSelector2'
            value='1'
            onClick={() => changeBinary(2, 'off')}
          />
        </Form.Field>
      </Form>
      <Form>
        <Form.Field>
        m3
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[3] === 1}
            name='binaryRadioSelector3'
            value='0'
            onClick={() => changeBinary(3, 'on')}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[3] === 0}
            name='binaryRadioSelector3'
            value='1'
            onClick={() => changeBinary(3, 'off')}
          />
        </Form.Field>
      </Form>
      <Form>
        <Form.Field>
        M3
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[4] === 1}
            name='binaryRadioSelector4'
            value='0'
            onClick={() => changeBinary(4, 'on')}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[4] === 0}
            name='binaryRadioSelector4'
            value='1'
            onClick={() => changeBinary(4, 'off')}
          />
        </Form.Field>
      </Form>
      <Form>
        <Form.Field>
        P4
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[5] === 1}
            name='binaryRadioSelector5'
            value='0'
            onClick={() => changeBinary(5, 'on')}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[5] === 0}
            name='binaryRadioSelector5'
            value='1'
            onClick={() => changeBinary(5, 'off')}
          />
        </Form.Field>
      </Form>
      <Form>
        <Form.Field>
        TT
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[6] === 1}
            name='binaryRadioSelector6'
            value='0'
            onClick={() => changeBinary(6, 'on')}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[6] === 0}
            name='binaryRadioSelector6'
            value='1'
            onClick={() => changeBinary(6, 'off')}
          />
        </Form.Field>
      </Form>
      <Form>
        <Form.Field>
        P5
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[7] === 1}
            name='binaryRadioSelector7'
            value='0'
            onClick={() => changeBinary(7, 'on')}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[7] === 0}
            name='binaryRadioSelector7'
            value='1'
            onClick={() => changeBinary(7, 'off')}
          />
        </Form.Field>
      </Form>
      <Form>
        <Form.Field>
        m6
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[8] === 1}
            name='binaryRadioSelector8'
            value='0'
            onClick={() => changeBinary(8, 'on')}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[8] === 0}
            name='binaryRadioSelector8'
            value='1'
            onClick={() => changeBinary(8, 'off')}
          />
        </Form.Field>
      </Form>
      <Form>
        <Form.Field>
        M6
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[9] === 1}
            name='binaryRadioSelector9'
            value='0'
            onClick={() => changeBinary(9, 'on')}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[9] === 0}
            name='binaryRadioSelector9'
            value='1'
            onClick={() => changeBinary(9, 'off')}
          />
        </Form.Field>
      </Form>
      <Form>
        <Form.Field>
        m7
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[10] === 1}
            name='binaryRadioSelector10'
            value='0'
            onClick={() => changeBinary(10, 'on')}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[10] === 0}
            name='binaryRadioSelector10'
            value='1'
            onClick={() => changeBinary(10, 'off')}
          />
        </Form.Field>
      </Form>
      <Form>
        <Form.Field>
        M7
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[11] === 1}
            name='binaryRadioSelector11'
            value='0'
            onClick={() => changeBinary(11, 'on')}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[11] === 0}
            name='binaryRadioSelector11'
            value='1'
            onClick={() => changeBinary(11, 'off')}
          />
        </Form.Field>
      </Form>
        </div>
        </>
    )
}
