import {React, useState, useEffect, useRef} from 'react'
import { Form, Checkbox , Icon, Dropdown, Menu, Button, TextArea, Input} from 'semantic-ui-react'
import {Scale, ScaleType, Note} from '@tonaljs/tonal';
import * as Tone from 'tone';
import FileSaver from 'file-saver'
import { useDispatch, useSelector } from 'react-redux';
import { setLabData } from '../../store/actions/labDataActions';
import { scaleHandler } from './utils';
import { turnNotesIntoMidi } from '../midi/midifunctions';
import ExportModal from '../modal/ExportModal';
import '../../../public/Do_Mayor_armadura.svg'
import { polySynth } from './synths';
import { setNoteDisplay } from '../../store/actions/noteDisplayActions';
import { setPlayImport } from '../../store/actions/playImportActions';
import { setDisplayFocus } from '../../store/actions/displayFocusActions';
import { createSVGElement, setAttributes } from '../svg/svgUtils';

export default function ScaleLab({importedScaleData, masterInstrumentArray, display, free, update, setUpdate, labSplit}) {
    const [playing, setPlaying] = useState(false);
    const [scaleDataBinary, setScaleDataBinary] = useState([1,0,1,0,1,1,0,1,0,1,0,1])
    const [scaleName, setScaleName] = useState('major');
    const [notes, setNotes] = useState(["C", "D", "E", "F", "G", "A", "B"]);
    const [scaleNumber, setScaleNumber] = useState(2773);
    const [randomRange, setRandomRange] = useState({only: 7, min: 7, max: 7})
    const [description, setDescription] = useState('')
    const [showDescription, setShowDescription] = useState(false)
    const [options, setOptions] = useState('sharps')
    const [playOptions, setPlayOptions] = useState('forward')
    const [randomOptions, setRandomOptions] = useState('all')
    const [exportPool, setExportPool] = useState('global')
    const [inputFocus, setInputFocus] = useState(false)
    const [displayName, setDisplayName] = useState('C major')
    const [instrumentDisplay, setInstrumentDisplay] = useState(-1)
    const [localDisplay, setLocalDisplay] = useState(true)
    const [opened, setOpened] = useState(false)
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
    const svg = createSVGElement('svg')
    const svgAttrs = {'height': 300, 'width': 300}
    setAttributes(svg, svgAttrs)
    
    //container
    const rect = createSVGElement('rect')
    const rectAttrs = {'width': "100%", 'height': '100%', 'fill': 'white'}
    setAttributes(rect, rectAttrs)
    svg.appendChild(rect)
    
    //for circular representation:
    var angle = 30;
    var amountCircles = 12;
    var xCenter = 150;
    var yCenter = 150;
    var radius = 100;
    var angleIncrement = 2 * Math.PI / (amountCircles) 
    //main circle
    const mainCircle = createSVGElement('circle')
    const mainCircleAttrs = {'cx': xCenter, 'cy': yCenter, 'r': radius, 'fill': 'transparent', 'stroke': 'black', "stroke-width": '2'}
    setAttributes(mainCircle, mainCircleAttrs)
    svg.appendChild(mainCircle)
    //inner Circles
    var noteCount = 0;
    for (let i = 0; i < amountCircles; i++){
        let fill;
        if (scaleDataBinary[i] === 1){ 
            fill = 'black'
        } else {
            fill = 'white';
        }
        const circle = createSVGElement('circle')
        let noteID;
        if (free){
          noteID = 'scale_' + i + '_1'
        } else {
          noteID = 'scale_' + i
        }
        const circleAttrs =  {'cx': xCenter + (radius * Math.cos(angle)), 'cy': yCenter + (radius * Math.sin(angle)), 'r': 23, "fill": fill, "stroke": 'black', "stroke-width": '2', "class": "scale_circle", "id": noteID}
        setAttributes(circle, circleAttrs)
        const noteName = createSVGElement('text')
        const noteNameAttrs = {'x': xCenter + (radius * Math.cos(angle)), 'y': yCenter + (radius * Math.sin(angle)), 'text-anchor': 'middle', 'fill': 'white', 'dominant-baseline': 'middle', 'font-size': '15px'}
        setAttributes(noteName, noteNameAttrs)
        if (fill === 'black'){
          noteName.textContent = notes[noteCount];
          noteCount++
        }
        svg.appendChild(circle);
        svg.appendChild(noteName);
        angle += angleIncrement
    }
    //check if its there
    let scaleDiv;
    if (free){
      scaleDiv = document.getElementById('divScaleInteractive1')
    } else {
      scaleDiv = document.getElementById('divScaleInteractive')
    };
    if (scaleDiv.firstChild){
        while (scaleDiv.firstChild){
            scaleDiv.removeChild(scaleDiv.firstChild)
        }
    }
    //Add to div
    scaleDiv.appendChild(svg);
  }

  //manual update
  useEffect(() => {
    if (update && labSplit){
      setUpdate(false)
      if (labInfo['scaleLab']){

      }
      const importedScaleData = labInfo['scaleLab']
      if (importedScaleData){
      setNotes(importedScaleData['scale'])
      setScaleName(importedScaleData['scaleName'].split(' ').slice(1).join(' '))
      setDisplayName(importedScaleData['scaleName'])
      setScaleNumber(importedScaleData['number'])
      setScaleDataBinary(importedScaleData['binary'])
      setRootNote(importedScaleData['scale'][0])
      setDescription(importedScaleData['desc'])
      createScaleSVG()
      }
    }
  }, [update])

  useEffect(() => {
    if (importedScaleData){
      const newNotes = importedScaleData['scale']
    if (newNotes !== undefined){
      const newBinary = importedScaleData['binary']
      const newName = importedScaleData['scaleName']
      const newNumber = importedScaleData['number']
      const newDesc = importedScaleData['desc']
      setNotes(newNotes)
      setScaleName(newName.split(' ').slice(1).join(' '))
      setDisplayName(newName)
      setScaleNumber(newNumber)
      setScaleDataBinary(newBinary)
      setRootNote(newNotes[0])
      setDescription(newDesc)
      createScaleSVG()
    }
    }
    
  }, [importedScaleData])

  useEffect(() => {
    setDisplayName(rootNote + ' ' + scaleName)
  }, [rootNote, scaleName])

  useEffect (()=>{
    createScaleSVG()
    let newInfo = {...labInfo}
    const scaleDataPrototype = {
        name: rootNote + ' ' + scaleName,
        scaleName: rootNote + ' ' + scaleName,
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

useEffect(() => {
  dispatch(setDisplayFocus('lab'))
}, [playNoteSequence, instrumentDisplay ])

function convertScaleForDispatch(){
  var arrOfObj = []
  var dispatchObj = {data: [{speed: 1, notes: [['']], position: []}], displayOnly: true, highlight: []}
  var scaleString = ''

  let localNotes = notes;

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

    function setDisplay(){
      dispatch(setNoteDisplay(convertScaleForDispatch()))
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

    //this is where you store all of the setTimout
    var intervals = useRef([])

    //---Play notes:
    function playNoteSequence(){
    //if muted
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
    let previousInstrumentDisplay = instrumentDisplay
    let notePositions = getNotePositions();
    let newNotes = handleNotes()
    let gap = Tone.Time('8n').toMilliseconds()
    let totalTime = gap * newNotes.length;

    //if playing, stop it
    if (playing){
      intervals.current.forEach(clearInterval)
      let circles = document.getElementsByClassName('scale_circle')
      for (let i = 0; i < circles.length; i++){
        circles[i].setAttribute('r', 23)
      }
      Tone.Transport.cancel()
      Tone.Transport.stop()
      setInstrumentDisplay(-2)
      setTimeout(() => setPlaying(false), 0)
      setTimeout(() => setInstrumentDisplay(previousInstrumentDisplay), 50)
    } else if (instrumentDisplay === -2){
        Tone.start()
        Tone.Transport.cancel()
        Tone.Transport.stop()
        Tone.Transport.start();
        var position = 0;
        dispatch(setNoteDisplay())
    //---Synthpart function 
            const synthPart = new Tone.Sequence(
              function(time, note) {
                polySynth.triggerAttackRelease(note, 0.5, time)
                let findID = notePositions[Note.pitchClass(note)]
                if (free){
                  findID = notePositions[Note.pitchClass(note)] + '_1'
                }
                var highlightedCircle = document.getElementById(findID)
                highlightedCircle.setAttribute('r', 29)
                intervals.current.push(setTimeout(() => {highlightedCircle.setAttribute('r', 23)}, gap))
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

            intervals.current.push(setTimeout(() => Tone.Transport.stop(), totalTime));
            intervals.current.push(setTimeout(() => setPlaying(false), totalTime));
            

      } else {
      let noteArr = [];
      let tempArr = [];

      for (let i = 0; i < newNotes.length; i++){
          tempArr.push(newNotes[i])

          if ((i + 1) % 2 === 0 || (i === newNotes.length - 1)){
            noteArr.push(tempArr)
            tempArr = []
          }
      }

      let returnObj = {
        displayOnly: false,
        highlight: 1,
        data: [{speed: 1, notes: noteArr, position:[]}]
      }

      Tone.start()
      Tone.Transport.cancel()
      dispatch(setPlayImport([returnObj]))
      //Manual animation for scale lab
      for (let i = 0; i < newNotes.length; i++){
        let findID = notePositions[Note.pitchClass(newNotes[i])]
          if (free){
              findID = notePositions[Note.pitchClass(newNotes[i])] + '_1'
            }
        let highlightedCircle = document.getElementById(findID)
        intervals.current.push(setTimeout(() => {highlightedCircle.setAttribute('r', 29)}, (i) * gap))
        intervals.current.push(setTimeout(() => {highlightedCircle.setAttribute('r', 23)}, (i + 1) * gap))
      }

      Tone.Transport.start()
      intervals.current.push(setTimeout(() => setInstrumentDisplay(-2), totalTime - 100))
      intervals.current.push(setTimeout(() => setInstrumentDisplay(previousInstrumentDisplay), totalTime))
      intervals.current.push(setTimeout(() => Tone.Transport.stop(), totalTime));
      intervals.current.push(setTimeout(() => setPlaying(false), totalTime));
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

const exportObj = {
      name: rootNote + ' ' + scaleName,
      scaleName: rootNote + ' ' + scaleName,
      scaleType: scaleName,
      binary: scaleDataBinary,
      desc: description,
      number: scaleNumber,
      scale: notes,
      type: 'normal',
      length: notes.length,
      dataType: 'scale',
      author: user?.['name'],
      authorId: user?.['_id'],
      pool: exportPool,
}

const handleScaleNameChange = e => {
  setScaleName(e.target.value)
}

const handleScaleDescriptionChange = e => {
  setDescription(e.target.value)
}

const dropHandler =(e) => {
  if (!free){
    return
  }
  const data = JSON.parse(e.dataTransfer.getData("text"));
  if (data['className'] !== 'scaleData'){
    return
  }
  const importedScaleData = data['message']
  const newNotes = importedScaleData['scale']
  const newBinary = importedScaleData['binary']
  const newName = importedScaleData['scaleName']
  const newNumber = importedScaleData['number']
  const newDesc = importedScaleData['desc']

  setNotes(newNotes)
  setScaleName(newName.split(' ').slice(1).join(' '))
  setDisplayName(newName)
  setScaleNumber(newNumber)
  setScaleDataBinary(newBinary)
  setRootNote(newNotes[0])
  setDescription(newDesc)
  createScaleSVG()

  e.stopPropagation();
  e.nativeEvent.stopImmediatePropagation();
  e.preventDefault();
  e.dataTransfer.clearData();
}

const onDragOver = e => {
  e.preventDefault();
  console.log('draggin over!!')
}

function downloadAsMidi(name){

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
      returnValues.push([noteValues[rootIndex + i]])
    } else {
      if (scaleDataBinary[i] === 1){
        returnValues.push([noteValues[rootIndex + i]])
      }
    }
  }
  var midi = turnNotesIntoMidi(returnValues)
  let blob = new Blob([midi.toArray()], {type: "audio/midi"});
  FileSaver.saveAs(blob,  name + ".mid")
}

    return (
        <div onDrop={dropHandler} onDragOver={onDragOver} style={ free ? {'height': '200px', display: display ? '' : 'none'} : {}}>
        <Menu>
        <Menu.Item onClick={() => handleSharpsOrFlats()}>{options === 'sharps' ? '#' : 'b'}</Menu.Item>
        <Dropdown onChange={onChangeDropdown} options={options === 'sharps' ? dropdownOptionsSharp : dropdownOptionsFlat} text = {`Root: ${rootNote}`} simple item/>
        <Button.Group>
        <Button basic compact onClick={()=> {playNoteSequence(); setPlaying(true)}}><Icon name={playing ? 'stop' : 'play'}/></Button>
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
        <Button.Group>
        <Button basic compact onClick={() => setDisplay()}>Display</Button>
        <Dropdown
       simple 
       item
       className='button icon'
       >
        <Dropdown.Menu>
            <Dropdown.Header>Local Display</Dropdown.Header>
            <Dropdown.Item selected={localDisplay} onClick={() => setLocalDisplay(true)}> Show Scale Graphic </Dropdown.Item>
            <Dropdown.Item selected={!localDisplay} onClick={() => setLocalDisplay(false)}> Hide Scale Graphic </Dropdown.Item>
            <Dropdown.Divider/>
            <Dropdown.Header>Instrument Display</Dropdown.Header>
            <Dropdown.Item selected={instrumentDisplay === -2} onClick={() => setInstrumentDisplay(-2)}> None </Dropdown.Item>
            <Dropdown.Item selected={instrumentDisplay === -1} onClick={() => setInstrumentDisplay(-1)}> All </Dropdown.Item>
             {mapMenuItems()}
             <Dropdown.Divider/>
          </Dropdown.Menu>
        </Dropdown>
        </Button.Group>
        <Button.Group>
        <Button basic onClick={() => setOpened(true)}>Export</Button>
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
        <div style={{display: localDisplay ? '' : 'none'}} id={free ? "divScaleInteractive1" : 'divScaleInteractive'}></div>
        <div className='binaryRadioSelector' style={{flexDirection: 'row', display: localDisplay ? 'flex' : 'none'}}>
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
        <ExportModal
        dataType={'scale'}
        exportObj={exportObj}
        opened={opened}
        setOpened={setOpened}
        changeParentName={setScaleName}
        changeParentDesc={setDescription}
        downloadAsMidi={downloadAsMidi}
        />
        </div>
    )
}
