
import { React, useState, useEffect, useRef} from 'react'
import * as Tone from 'tone';
import { useDispatch, useSelector} from 'react-redux';
import { insertData } from '../../store/actions/dataPoolActions';
import { toMidi, midiToNoteName } from '@tonaljs/midi';
import { Note, Scale, Chord} from '@tonaljs/tonal';
import { Menu, Button, Input, Icon, Dropdown, Form, TextArea} from 'semantic-ui-react';
import { keySynth } from './synths';
import { polySynth } from './synths';
import { setLabData } from '../../store/actions/labDataActions';
import { scaleHandler, updateLinkedArrays } from './utils';
import { keyMap } from './keymap';
import { setPlayImport } from '../../store/actions/playImportActions';
import { setNoteDisplay } from '../../store/actions/noteDisplayActions';
import { setDisplayFocus as setDisplayFocusAction } from '../../store/actions/displayFocusActions';
import ExportModal from '../modal/ExportModal';


export default function PatternLab({importedPatternData, masterInstrumentArray}) {
const [playing, setPlaying] = useState(false)
const [data, setData] = useState([{notes: ['C3'], position: 0}, {notes: ['D3'], position: 0}, {notes: ['E3'], position: 0}, {notes: ['F3'], position: 0}, {notes: ['G3'], position: 0}, {notes: ['A3'], position: 0}, {notes: ['B3'], position: 0}, {notes: ['C4'], position: 0}])
const notes = []
const position = []
const [pattern, setPattern] = useState([0,1,2,3,4,5,6,7])
const [scaleLock, setScaleLock] = useState(true)
const [playOnKeyPress, setPlayOnKeyPress] = useState(false)
const [name, setName] = useState('Pattern 1')
const [options, setOptions] = useState('sharps')
const [noteOptions, setNoteOptions] = useState('octave')
const [edit, setEdit] = useState(false)
const [notesTruePatternFalse, setNotesTruePatternFalse] = useState(true)
const [octave, setOctave] = useState(3)
const [generatePatternLength, setGeneratePatternLength] = useState(8)
const [manipulate, setManipulate] = useState(false)
const [playNoteOnClick, setPlayNoteOnClick] = useState(true)
const [instrumentDisplay, setInstrumentDisplay] = useState(-2) 
const [displayFocus, setDisplayFocus] = useState(1)
const [displayAll, setDisplayAll] = useState(false)
const [positionType, setPositionType] = useState('unlocked')
const [patternType, setPatternType] = useState('fluid')
const [exportPool, setExportPool] = useState('global')
const [inputFocus, setInputFocus] = useState(false)
const [chromaticNotes, setChromaticNotes] = useState(['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'])
const [description, setDescription] = useState('')
const [showDescription, setShowDescription] = useState(false)
const isMuted = false;
const user = JSON.parse(localStorage.getItem('userInfo'))

const dispatch = useDispatch()

const labData = useSelector(state => state.labData)
const {labInfo} = labData

const allScaleNotes = [];
const scaleNotes = labInfo && labInfo['scaleLab'] && labInfo['scaleLab']['scale'] ? scaleHandler(labInfo['scaleLab']['scale'], options): Scale.get('c major').notes;
const allChromaticNotes = [];

//generate chromatic notes

for (var o = 0; o < 10; o++){
    for (var p = 0; p < chromaticNotes.length; p++){
        allChromaticNotes.push(chromaticNotes[p] + o)
    }
}

//generate all scale specific notes
    for (var n = 0; n < allChromaticNotes.length; n++){
        if (scaleNotes.includes(Note.pitchClass(allChromaticNotes[n]))){
            allScaleNotes.push(allChromaticNotes[n])
        }
    }

//turn data into notes
for (let i = 0; i < data.length; i++){
    notes.push(data[i]['notes'])
}

//turn data into position
for (let i = 0; i < data.length; i++){
    position.push(data[i]['position'])
}

//Convert pattern and position data into DATA
function handleSetData(notes, position){
    if (position === undefined){
        let newPos = [];
        for (let i = 0; i < notes.length; i++){
            newPos.push(0)
        }
        position = newPos
    }
    let returnArr = [];
    for (let i = 0; i < notes.length; i++){
        let returnObj = {}
        returnObj['notes'] = notes[i]
        if (position[i] !== undefined){
            returnObj['position'] = position[i]
        } else {
            returnObj['position'] = 0;
        }
        returnArr.push(returnObj)
    }
    setData(returnArr)
}

function patternAndScaleToNotes(patternArr){
        console.log(patternArr, 'good patternArr!')
        var notesExport = [];
        var root = scaleNotes[0] + 3
        const allNotes = Note.sortedNames(allScaleNotes);
        //------------
        var startingIndex;
        if (allNotes.indexOf(root) === -1){
            startingIndex = allNotes.indexOf(Note.enharmonic(root))
        } else {
            startingIndex = allNotes.indexOf(root)
        }
        var startingChromaticIndex;
        if (allChromaticNotes.indexOf(root) === -1){
            startingChromaticIndex = allChromaticNotes.indexOf(Note.enharmonic(root))
        } else {
            startingChromaticIndex = allChromaticNotes.indexOf(root);
        }
        for (let k = 0; k < patternArr.length; k++){
            let tempExport = [];
            for (let l = 0; l < patternArr[k].length; l++){
                if (typeof patternArr[k][l] === 'string'){
                    tempExport.push(allChromaticNotes[startingChromaticIndex + Number(patternArr[k][l].split("").slice(1).join(""))])
                } else {
                    tempExport.push(allNotes[startingIndex + patternArr[k][l]])
                }
            }
            notesExport.push(tempExport)
        }

        return notesExport
    }



//Upon importing
useEffect(() => {
    if (importedPatternData['pattern'] !== undefined){
        setPattern(importedPatternData['pattern'])
        setName(importedPatternData['patternName'])
        handleSetData(patternAndScaleToNotes(importedPatternData['pattern']), importedPatternData['position'])
    }
}, [importedPatternData])

//upon updating
useEffect(() => {
    let mostCurrentPattern = patternExtraction()
    setPattern(mostCurrentPattern)
    let newInfo = {...labInfo}
    const patternDataPrototype = {
        name: name,
        patternName: name,
        desc: '',
        type: patternType,
        positionType: positionType,
        length: notes.length,
        pattern: patternType === 'fixed' ? notes : mostCurrentPattern,
        position: position,
        author: '',
        authorId: '',
        dataType: 'pattern',
        pool: '',
    }
    newInfo['patternLab'] = patternDataPrototype
    dispatch(setLabData(newInfo))
    dispatch(setNoteDisplay(convertScaleForDispatch()))
  }, [name, instrumentDisplay, data, displayFocus, displayAll, positionType, patternType])

  useEffect(() => {
    dispatch(setDisplayFocusAction('lab'))
  }, [playAll, instrumentDisplay ])

function convertScaleForDispatch(){
    let clone = sortAllChordsByPitch(notes)
    let focus;
    let displayStyle;
    let pos;
    if (clone[displayFocus] === undefined){
        focus = 0;
    } else {
        focus = displayFocus
    }
    if (displayAll){
        displayStyle = 'special'
    } else {
        displayStyle = false;
    }
    if (positionType === 'locked'){
        if (!displayAll){
            pos = position[focus]
        } else {
            pos = position;
        }
    } else {
        pos = [];
    }
    var arrOfObj = []
    var dispatchObj = {data: [{speed: 1, notes: [['C']], position: pos}], displayOnly: displayStyle, highlight: [], specialHighlight: [displayFocus]}
    var scaleString = ''
    
    if (!displayAll){
        for (let i= 0; i < clone[focus].length; i++){
            if (i === clone[focus].length - 1){
                scaleString += clone[focus][i] 
            } else {
                scaleString += clone[focus][i] + ' '
            }
        }
        scaleString = [scaleString]
    } else {
        let tempArr = []
        
        for (let i = 0; i < clone.length; i++){
            let tempString = ''
            for (let j = 0; j < clone[i].length; j++){
                tempString += clone[i][j] + ' '
            }
            tempArr.push(tempString)
        }
        scaleString = tempArr;
    }

    for (let h = 0; h < masterInstrumentArray.length; h++){
      arrOfObj.push(JSON.parse(JSON.stringify(dispatchObj)))
    }
  
    if (instrumentDisplay === -2){
      return arrOfObj
    } else if (instrumentDisplay === -1){
      for (let j = 0; j < arrOfObj.length; j++){
        arrOfObj[j]['data'][0]['notes'][0] = scaleString
      }
      return arrOfObj
    } else {
      arrOfObj[instrumentDisplay - 1]['data'][0]['notes'][0] = scaleString
      return arrOfObj
    }
}

function sortAllChordsByPitch(chords){
    let tempArr = []
    for (let i = 0; i < chords.length; i++){
        tempArr.push(Note.sortedNames(chords[i]))
    }
    return tempArr
}

//=======Drag and drop functionality
function changePositionsUsingIDs(startingID, endingID){
    var xfer;
    var clone = JSON.parse(JSON.stringify(data))
    var ex1 = startingID.split('_')[1]
    var ex2 = endingID.split('_')[1]
    xfer = clone[ex1]
    clone.splice(ex1, 1)
    clone.splice(ex2, 0, xfer)
    setData(clone)
}

const dragStartHandler = e => {
    var obj = {id: e.target.id, className: e.target.className, message: '', type: 'patternLab'}
    e.dataTransfer.setData('text', JSON.stringify(obj));
};

const dragStartHandlerSpecial = e => {
    var obj = {id: 'special', className: 'patternData', message: {
        patternName: name,
        pattern: patternType === 'fixed'? chordSequenceToNoteString(notes) : pattern,
        position: position,
        type: patternType,
        positionType: positionType,
    }, type: 'patternLabExport'}
    e.dataTransfer.setData('text', JSON.stringify(obj));
}

const dragHandler = e => {
};

const dragOverHandler = e => {
    e.currentTarget.className = 'active pattern'
    e.preventDefault();
};

const dragLeaveHandler = e => {
    e.currentTarget.className = 'inactive pattern'
    e.preventDefault();
}


const dropHandler = e => {
    e.currentTarget.className = 'inactive pattern'
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    e.preventDefault();
    var data = JSON.parse(e.dataTransfer.getData("text"));
    if (data.type !== 'patternLab'){
        return
    } else {
        changePositionsUsingIDs(data.id, e.currentTarget.id)
        e.dataTransfer.clearData();
    }
}
//----------------------------

//KEYPRESS EVENTS
var [keyPressed, setKeyPressed] = useState(false);
var keydownEvent = (e) => {
    if (keyPressed === false){
        const newNotes = [...notes];
        if (playOnKeyPress === false){
            return
        } else {
            let obj = keyMap.find(o => o.key === e.key);
            if (scaleLock){
                if (obj && obj.note && !scaleNotes.includes(obj.note)){
                    return
                } else if (obj && obj.note !== undefined) {
                const now = Tone.now();
                let playNote = (obj.note + (Number(obj.octave) + Number(octave)));
                keySynth.triggerAttackRelease(playNote, "8n", now);
                document.removeEventListener('keydown', keydownEvent);
                newNotes.push([playNote])
                handleSetData(newNotes)
                }
            } else if (obj !== undefined){
                const now = Tone.now();
                let playNote = (obj.note + (Number(obj.octave) + Number(octave)));
                keySynth.triggerAttackRelease(playNote, "8n", now);
                document.removeEventListener('keydown', keydownEvent);
                newNotes.push(playNote)
                handleSetData(newNotes)
        }
        } 
    } 
    setKeyPressed(true)
}

var keyUpEvent = (e) => {
    setKeyPressed(false)
    document.removeEventListener('keyup', keydownEvent);
}

document.addEventListener('keydown', keydownEvent);
document.addEventListener('keyup', keyUpEvent)

//------------------------------

function chordSequenceToNoteString(chords){
    var returnArr = [];
    for (var i = 0; i < chords.length; i++){
        var thisChordString = ''
        for (var j = 0; j < chords[i].length; j++){
            if (j === chords[i].length - 1){
                thisChordString += chords[i][j]
            } else {
                thisChordString += chords[i][j] + ' '
            }
        }
        returnArr.push([thisChordString])
    }
    return returnArr;
}

var intervals = useRef([])

function playAll(){
    if (isMuted){
        return
    }

    let previousInstrumentDisplay = instrumentDisplay
    let gap = Tone.Time('8n').toMilliseconds()
    let totalTime = gap * notes.length;

    if (playing){
        intervals.current.forEach(clearInterval)
        let pattern = document.getElementsByClassName('pattern')
        for (let i = 0; i < pattern.length; i++){
            pattern[i].className = 'inactive pattern'
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
    const convertedChords = chordSequenceToNoteString(notes)
    var count = 0;
    const synthPart = new Tone.Sequence(
        function(time, note) {
          polySynth.triggerAttackRelease(noteStringHandler(note), "10hz", time)
          var highlightedChord = document.getElementById('pattern_' + count)
            highlightedChord.className = 'active pattern'
            setTimeout(() => {highlightedChord.className = 'inactive pattern'}, 250)
            count++
        },
       convertedChords,
        "8n"
      );
      synthPart.start();
      synthPart.loop = 1;
      intervals.current.push(setTimeout(() => Tone.Transport.stop(), totalTime));
      intervals.current.push(setTimeout(() => setPlaying(false), totalTime));
    } else {
        let noteArr = [];
        let tempArr = [];

        for (let i = 0; i < notes.length; i++){
            let strChord = ''
            for (let j = 0; j < notes[i].length; j++){
                if (j === notes[i].length - 1){
                    strChord += notes[i][j]
                } else {
                    strChord += notes[i][j] + ' '
                }
            }   
            tempArr.push(strChord)

            if (((i + 1) % 2 === 0) || (i === notes.length - 1)){
                    noteArr.push(tempArr)
                    tempArr = []
            }
        }
        let pos;
        if (positionType === 'unlocked'){
            pos = [];
        } else {
            pos = position;
        }
        let returnObj = {
            displayOnly: false,
            highlight: 1,
            data: [{speed: 1, notes: noteArr, position: pos}]
        }

        Tone.start()
        Tone.Transport.cancel()
        dispatch(setPlayImport([returnObj]))
        //Manual animation for pattern lab
        for (let i = 0; i < notes.length; i++){
            let highlightedPattern = document.getElementById('pattern_' + i)
            intervals.current.push(setTimeout(() => {highlightedPattern.className = 'active pattern'}, (i) * gap))
            intervals.current.push(setTimeout(() => {highlightedPattern.className = 'inactive pattern'}, (i + 1) * gap))
        }
        Tone.Transport.start()

        intervals.current.push(setTimeout(() => setInstrumentDisplay(-2), totalTime - 100))
        intervals.current.push(setTimeout(() => setInstrumentDisplay(previousInstrumentDisplay), totalTime))
        intervals.current.push(setTimeout(() => Tone.Transport.stop(), totalTime));
        intervals.current.push(setTimeout(() => setPlaying(false), totalTime));
    }
    
}

function setDisplay(){
    dispatch(setNoteDisplay(convertScaleForDispatch()))
}

function generateRandomMelody(){
    var returnArr = [];
    for (var i = 0; i < generatePatternLength; i++){
        var upOctave = Math.random() < 0.5
        var randomIndex = Math.floor(Math.random() * scaleNotes.length);
        if (upOctave){
            returnArr.push([scaleNotes[randomIndex] + (octave + 1)])
        } else {
            returnArr.push([scaleNotes[randomIndex] + octave])
        }
    }

handleSetData(returnArr)
}

function generatePattern(instructions, octave){
    if (octave === undefined){
        octave = 3
    }
    //instructions is an array of positive or negative numbers
    let rootNote = scaleNotes[0] + octave
    let instructionsIndex = 0;
    let currentPosition = allScaleNotes.indexOf(rootNote)
    let returnArr = [[rootNote]]
    for (let i = 0; i < generatePatternLength - 1; i++){
        let newPosition = currentPosition + instructions[instructionsIndex]
        if (allScaleNotes[newPosition] === undefined){
            break;
        }
        returnArr.push([allScaleNotes[newPosition]])
        if (instructionsIndex < instructions.length - 1){
            instructionsIndex++
        } else {
            instructionsIndex = 0
        }
        currentPosition = newPosition
    }
    handleSetData(returnArr)
}

const handleClickUp = (e) => {
    var clone = [...notes]
    var positionId = e.target.parentNode.parentNode.id;
    var x = positionId.split('_')[1]
    var y = positionId.split('_')[2]
    setDisplayFocus(Number(x))
    console.log(x, 'display focus?!?!')
    if (noteOptions === 'scale'){
        if (allScaleNotes.indexOf(notes[x][y]) === -1){
            var chromaIndex = allChromaticNotes.indexOf(notes[x][y]);
            if (chromaIndex === -1){
                chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(notes[x][y]));
            }
            var matched = false;
            var count = 0;
            while (matched === false){
                if (allScaleNotes.indexOf(allChromaticNotes[chromaIndex + count]) !== -1){
                    clone[x][y] = allScaleNotes[allScaleNotes.indexOf(allChromaticNotes[chromaIndex + count])];
                    matched = true;
                } else {
                    count++;
                }
            }
        } else {
        clone[x][y] = allScaleNotes[allScaleNotes.indexOf(notes[x][y]) + 1];
        }
    }
    if (noteOptions === 'octave'){
    var note = Note.pitchClass(notes[x][y])
    var octave = Note.octave(notes[x][y])
    clone[x][y] = note + (octave + 1)
    }
    if (noteOptions === 'chromatic'){
    let chromaIndex = allChromaticNotes.indexOf(notes[x][y])
    if (allChromaticNotes.indexOf(notes[x][y]) === -1){
        chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(notes[x][y]))
    }
    clone[x][y] = allChromaticNotes[chromaIndex + 1];
    }
    if (noteOptions === 'insert'){
        clone[x].splice(y + 1, 0, notes[x][y]);
    }
    handleSetData(clone, position)
}

const handleClickDown = (e) => {
    var clone = [...notes]
    var positionId = e.target.parentNode.parentNode.id;
    var x = positionId.split('_')[1]
    var y = positionId.split('_')[2]
    setDisplayFocus(Number(x))
    if (noteOptions === 'scale'){
        if (allScaleNotes.indexOf(notes[x][y]) === -1){
            var chromaIndex = allChromaticNotes.indexOf(notes[x][y]);
            if (chromaIndex === -1){
                chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(notes[x][y]));
            }
            var matched = false;
            var count = 0;
            while (matched === false){
                if (allScaleNotes.indexOf(allChromaticNotes[chromaIndex + count]) !== -1){
                    clone[x][y] = allScaleNotes[allScaleNotes.indexOf(allChromaticNotes[chromaIndex + count])];
                    matched = true;
                } else {
                    count--;
                }
            }
        } else {
        clone[x][y] = allScaleNotes[allScaleNotes.indexOf(notes[x][y]) - 1];
        }
    }
    if (noteOptions === 'octave'){
    var note = Note.pitchClass(notes[x][y])
    var octave = Note.octave(notes[x][y])
    clone[x][y] = note + (octave - 1)
    }
    if (noteOptions === 'chromatic'){
    var chromaIndex = allChromaticNotes.indexOf(notes[x][y])
    if (allChromaticNotes.indexOf(notes[x][y]) === -1){
        chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(notes[x][y]))
    }
    clone[x][y] = allChromaticNotes[chromaIndex - 1];
    }
    if (noteOptions === 'insert'){
    clone[x].splice(y, 0, notes[x][y]);
    }
    handleSetData(clone, position)
}

var handleClickUpChord = (e) =>{
    var clone = [...notes]
    var clonePosition = [...position]
    var parentID = e.currentTarget.parentNode.parentNode.parentNode.id;
    var x = parentID.split('_')[1]
    setDisplayFocus(Number(x))


    if (noteOptions === 'scale'){
        for (var y = 0; y < notes[x].length; y++){
            if (allScaleNotes.indexOf(notes[x][y]) === -1){
                var chromaIndex = allChromaticNotes.indexOf(notes[x][y]);
                if (chromaIndex === -1){
                    chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(notes[x][y]));
                }
                var matched = false;
                var count = 0;
                while (matched === false){
                    if (allScaleNotes.indexOf(allChromaticNotes[chromaIndex + count]) !== -1){
                        clone[x][y] = allScaleNotes[allScaleNotes.indexOf(allChromaticNotes[chromaIndex + count])];
                        matched = true;

                    } else {
                        count++;
                    }
                }
            } else {
            clone[x][y] = allScaleNotes[allScaleNotes.indexOf(notes[x][y]) + 1];
            }
        }
    }
    if (noteOptions === 'octave'){
        for (var y = 0; y < notes[x].length; y++){
            var note = Note.pitchClass(notes[x][y])
            var octave = Note.octave(notes[x][y])
            clone[x][y] = note + (octave + 1)
        }
        }
    if (noteOptions === 'chromatic'){
        for (var y = 0; y < notes[x].length; y++){
            var chromaIndex = allChromaticNotes.indexOf(notes[x][y])
            if (allChromaticNotes.indexOf(notes[x][y]) === -1){
                chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(notes[x][y]))
            }
    clone[x][y] = allChromaticNotes[chromaIndex + 1];
        }
    }
    if (noteOptions === 'insert'){
        var newChord = [...clone[x]]
        clone.splice(x, 0, newChord);
    }
    if (noteOptions === 'position'){
        clonePosition[x] += 1;
    }

    handleSetData(clone, clonePosition)
}

var handleClickDownChord = (e) =>{
    var clone = [...notes]
    var clonePosition = [...position]
    var parentID = e.currentTarget.parentNode.parentNode.parentNode.id;
    var x = parentID.split('_')[1]
    setDisplayFocus(Number(x))

    if (noteOptions === 'scale'){
        for (var y = 0; y < notes[x].length; y++){
            if (allScaleNotes.indexOf(notes[x][y]) === -1){
                var chromaIndex = allChromaticNotes.indexOf(notes[x][y]);
                if (chromaIndex === -1){
                    chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(notes[x][y]));
                }
                var matched = false;
                var count = 0;
                while (matched === false){
                    if (allScaleNotes.indexOf(allChromaticNotes[chromaIndex + count]) !== -1){
                        clone[x][y] = allScaleNotes[allScaleNotes.indexOf(allChromaticNotes[chromaIndex + count])];
                        matched = true;
                    } else {
                        count--;
                    }
                }
            } else {
            clone[x][y] = allScaleNotes[allScaleNotes.indexOf(notes[x][y]) - 1];
            }
        }
    }
    if (noteOptions === 'octave'){
        for (var y = 0; y < notes[x].length; y++){
            var note = Note.pitchClass(notes[x][y])
            var octave = Note.octave(notes[x][y])
            clone[x][y] = note + (octave - 1)
        }
        }
    if (noteOptions === 'chromatic'){
        for (var y = 0; y < notes[x].length; y++){
            var chromaIndex = allChromaticNotes.indexOf(notes[x][y])
            if (allChromaticNotes.indexOf(notes[x][y]) === -1){
                chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(notes[x][y]))
            }
    clone[x][y] = allChromaticNotes[chromaIndex - 1];
        }
    }
    if (noteOptions === 'insert'){
        var newChord = [...clone[x]]
        clone.splice(x, 0, newChord);
    }
    if (noteOptions === 'position'){
        if (clonePosition[x] > 0){
            clonePosition[x] -= 1
        }
    }
    handleSetData(clone, clonePosition)
}



const handleDeleteChord = (e) => {
    var clone = [...notes]
    var clonePosition = [...position]
    var parentID = e.currentTarget.parentNode.parentNode.id;
    var x = parentID.split('_')[1]
    clone.splice(x, 1)
    clonePosition.splice(x,1)
    handleSetData(clone, clonePosition)
}

const handleDeleteNote = (e) => {
    var clone = [...notes]
    var positionId = e.target.parentNode.id;
    var nOfSiblings = e.target.parentNode.parentNode.childNodes.length - 1
    var x = positionId.split('_')[1]
    var y = positionId.split('_')[2]
    setDisplayFocus(Number(x))

    if (nOfSiblings === 1){
        clone.splice(x, 1)
    } else {
        clone[x].splice(y, 1)
    }

    handleSetData(clone, position)
}

const handleClickUpAll = () =>{
    var clone = [...notes]
    var clonePosition = [...position]
    if (noteOptions === 'scale'){
        for (let x = 0; x < notes.length; x++){
            for (let y = 0; y < notes[x].length; y++){
                if (allScaleNotes.indexOf(notes[x][y]) === -1){
                    let chromaIndex = allChromaticNotes.indexOf(notes[x][y]);
                    if (chromaIndex === -1){
                        chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(notes[x][y]));
                    }
                    var matched = false;
                    var count = 0;
                    while (matched === false){
                        if (allScaleNotes.indexOf(allChromaticNotes[chromaIndex + count]) !== -1){
                            clone[x][y] = allScaleNotes[allScaleNotes.indexOf(allChromaticNotes[chromaIndex + count])];
                            matched = true;
                        } else {
                            count++;
                        }
                    }
                } else {
                clone[x][y] = allScaleNotes[allScaleNotes.indexOf(notes[x][y]) + 1];
                }
            }
        }
    }
    if (noteOptions === 'octave'){
        for (let x = 0; x < notes.length; x++){
            for (let y = 0; y < notes[x].length; y++){
                var note = Note.pitchClass(notes[x][y])
                var octave = Note.octave(notes[x][y])
                clone[x][y] = note + (octave + 1)
            }
            }
        }
    if (noteOptions === 'chromatic'){
        for (let x = 0; x < notes.length; x++){
            for (let y = 0; y < notes[x].length; y++){
                let chromaIndex = allChromaticNotes.indexOf(notes[x][y])
                if (allChromaticNotes.indexOf(notes[x][y]) === -1){
                    chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(notes[x][y]))
                }
        clone[x][y] = allChromaticNotes[chromaIndex + 1];
            }
        }
    }
    if (noteOptions === 'insert'){
        return
    }
    if (noteOptions === 'position'){
        for (let i = 0; i < clonePosition.length; i++){
            clonePosition[i] += 1
        }
    }
    handleSetData(clone, clonePosition)
}

const handleClickDownAll = () =>{
    var clone = [...notes]
    var clonePosition = [...position]
    if (noteOptions === 'scale'){
        for (let x = 0; x < notes.length; x++){
            for (let y = 0; y < notes[x].length; y++){
                if (allScaleNotes.indexOf(notes[x][y]) === -1){
                    var chromaIndex = allChromaticNotes.indexOf(notes[x][y]);
                    if (chromaIndex === -1){
                        chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(notes[x][y]));
                    }
                    var matched = false;
                    var count = 0;
                    while (matched === false){
                        if (allScaleNotes.indexOf(allChromaticNotes[chromaIndex + count]) !== -1){
                            clone[x][y] = allScaleNotes[allScaleNotes.indexOf(allChromaticNotes[chromaIndex + count])];
                            matched = true;
                        } else {
                            count--;
                        }
                    }
                } else {
                clone[x][y] = allScaleNotes[allScaleNotes.indexOf(notes[x][y]) - 1];
                }
            }
        }
    }
    if (noteOptions === 'octave'){
        for (let x = 0; x < notes.length; x++){
            for (let y = 0; y < notes[x].length; y++){
                const note = Note.pitchClass(notes[x][y])
                const octave = Note.octave(notes[x][y])
                clone[x][y] = note + (octave - 1)
            }
            }
        }
    if (noteOptions === 'chromatic'){
        for (let x = 0; x < notes.length; x++){
            for (let y = 0; y < notes[x].length; y++){
                let chromaIndex = allChromaticNotes.indexOf(notes[x][y])
                if (allChromaticNotes.indexOf(notes[x][y]) === -1){
                    chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(notes[x][y]))
                }
        clone[x][y] = allChromaticNotes[chromaIndex - 1];
            }
        }
        }
    if (noteOptions === 'insert'){
        return
    }
    if (noteOptions === 'position'){
        for (let i = 0; i < clonePosition.length; i++){
            if (clonePosition[i] > 0){
                clonePosition[i] -= 1
            }
        }
    }
    handleSetData(clone, clonePosition)
}


const handleDeleteAll = () => {
    handleSetData([])
    setNoteOptions('delete')
}

const handleAddNoteToEnd = () => {
    const clone = [...notes]
    const clonePosition = [...position]
    if (clone.length === 0){
        clone.push(['C3'])
    } else {
        const lastNote = clone[clone.length - 1]
        clone.push(JSON.parse(JSON.stringify(lastNote)))
    }
    if (clonePosition.length === 0){
        clonePosition.push(0)
    } else {
        const lastPosition = clonePosition[clonePosition.length -1]
        clonePosition.push(JSON.parse(JSON.stringify(lastPosition)))
    }
    handleSetData(clone, clonePosition)

}

const handleRemoveNoteFromEnd = () => {
    const clone =  [...notes]
    const clonePosition = [...position]
    clone.pop()
    clonePosition.pop()
    handleSetData(clone, clonePosition)
}

const handlePlayThis = (e, x) => {
    if (!playNoteOnClick){
        return
    }
    let parentID;
    if (x){
        parentID = e.target.parentNode.id
    } else {
        parentID = e.target.id;
    }

    if (parentID.split('_').length === 2){
        const x = parentID.split('_')[1]
        setDisplayFocus(Number(x))
        polySynth.triggerAttackRelease(notes[x], '8n');
    } else if (parentID.split('_').length === 3) {
        const x = parentID.split('_')[1]
        const y = parentID.split('_')[2]
        setDisplayFocus(Number(x))
        polySynth.triggerAttackRelease(notes[x][y], '8n')
    } else {
        return
    }
    var thisChord = document.getElementById(parentID)
    thisChord.className = 'active pattern'
    setTimeout(() => {thisChord.className ='inactive pattern'}, 250)
}

function noteStringHandler(notes){
    var returnArr = []
    if (notes.indexOf(' ') === -1){
        returnArr.push(notes)
    } else {
        returnArr = notes.split(' ')
    }
    return returnArr
}

function mapNotes(notes){
    var returnArr = [];
    if (notes.length === 0){
        return <div></div>
    }
    for (var i = 0; i < notes.length; i++){
        var returnChord = [];
        var pitchClasses = [];
        for (var j = 0; j < notes[i].length; j++){
            pitchClasses.push(Note.pitchClass(notes[i][j]))
            returnChord.push(
                <div id={'pattern_' + i + '_' + j} style={{display: 'flex', flexDirection: 'row', height: '50px', width: '50px', backgroundColor: 'wheat', margin: '1px'}}>
                    {notes[i][j]}
                    {(edit && noteOptions !== 'delete') && <div style={{display: 'flex', flexDirection: 'column'}}>
                    <Icon onClick={handleClickUp} name={(noteOptions === 'insert') ? "plus" : "caret square up" }/><Icon onClick={handleClickDown} name={(noteOptions === 'insert') ? "" : "caret square up" }/>
                    </div>}
                    {(edit && noteOptions === 'delete') &&<Icon onClick={handleDeleteNote} name= 'trash alternate outline' />}
                </div>
            )
        }

        returnArr.push(
            <div  id={'pattern_' + i} onClick={handlePlayThis} draggable onDragStart = {dragStartHandler} onDrag = {dragHandler} onDragOver = {dragOverHandler} onDragLeave={dragLeaveHandler} onDrop = {dropHandler}className='inactive chord' style={{display: 'flex', flexDirection: 'column-reverse', margin: '1px', marginBottom: '5px'}}>
            <div onClick={(e) => (handlePlayThis(e, true))} style={{display: 'flex', flexDirection: 'row', marginBottom: '18px'}}>
            { (edit && noteOptions !== 'delete') && <div  style={{display: 'flex', flexDirection: (noteOptions === 'insert') ? 'row' : 'column'}}>
            <Icon onClick={handleClickUpChord} name= {(noteOptions === 'insert') ? "plus" : "caret square up" }/><Icon onClick={handleClickDownChord}name= {(noteOptions === 'insert') ? "" : "caret square down" }/>
            {(edit && noteOptions === 'position') && <div>{position[i]}</div>}
            </div>}
            {(edit && noteOptions === 'delete') && <Icon onClick={handleDeleteChord} name= 'trash alternate outline' /> }
            </div>
            {returnChord} 
            </div>
        )
    }
    return returnArr;
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


const reverseMelody = () => {
    var returnArr = [];
    for (var i = data.length -1; i > -1; i--){
        returnArr.push(data[i])
    }
    setData(returnArr)
}

//update this so it works when C3 is not the root
function invertMelody(){
    let returnPattern = []
    for (let i = 0; i < pattern.length; i++){
        let tempPattern = [];
        for (let j = 0; j < pattern[i].length; j++){
            if (pattern[i][j] === 0){
                tempPattern.push(pattern[i][j])
            }
            if (typeof pattern[i][j] === 'number' && pattern[i][j] !== 0){
                tempPattern.push(pattern[i][j] * -1)
            }
            if (typeof pattern[i][j] === 'string'){
                let num = Number(pattern[i][j].split("").slice(1).join(""))
                tempPattern.push( '*' + (num * -1))
                console.log(num, '*' + (num * -1))
            }
        }
        returnPattern.push(tempPattern)
    }
    handleSetData(patternAndScaleToNotes(returnPattern))
}

const shuffleNotes = () => {
    var cloneData = [...data]
    var returnArr = [];
    for (var i = 0; i < cloneData.length; i++){
        returnArr.push('')
    }
    var j = 0;
    while (j < cloneData.length){
        var randomIndex = Math.floor(Math.random() * cloneData.length);
        if (returnArr[randomIndex] === ''){
            returnArr[randomIndex] = cloneData[j];
            j++;
        }
    }
    setData(returnArr)
}

function fitPatternToScale(){
    handleSetData(patternAndScaleToNotes(pattern), position)
}

function patternExtraction(){
    var root = scaleNotes[0] + 3
    var allNotes = [];
    var allChromaticNotes = [];
    var patternExport = [];

    for (var m = 0; m < 10; m++){
        for (var n = 0; n < chromaticNotes.length; n++){
                allChromaticNotes.push(chromaticNotes[n] + m)
        }
    }

    for (let j = 0; j < allChromaticNotes.length; j++){
        if (!scaleNotes.includes(Note.pitchClass(allChromaticNotes[j]))){
            if (scaleNotes.includes(Note.pitchClass(Note.enharmonic(allChromaticNotes[j])))){
                allNotes.push(allChromaticNotes[j])
            }
        } else {
            allNotes.push(allChromaticNotes[j])
        }
    }
    
    var rootIndex = allNotes.indexOf(root);
    var rootChromaticIndex = allChromaticNotes.indexOf(root);
    for (var k = 0; k < notes.length; k++){
        let patternChord = [];
        for (var l = 0; l < notes[k].length; l++){
            if (allNotes.indexOf(notes[k][l]) === -1 || patternType === 'floating'){
                if (allChromaticNotes.indexOf(notes[k][l]) === -1){
                patternChord.push( "*" + (allChromaticNotes.indexOf(Note.enharmonic(notes[k][l])) - rootChromaticIndex))
                } else {
                patternChord.push("*" + (allChromaticNotes.indexOf(notes[k][l]) - rootChromaticIndex));
                }
            } else {
                patternChord.push(allNotes.indexOf(notes[k][l]) - rootIndex)
            }
        }
        patternExport.push(patternChord)
    }
    return patternExport
}

const exportObj = {
        name: name,
        patternName: name,
        desc: '',
        type: 'fluid',
        length: notes.length,
        dataType: 'pattern',
        pattern: pattern,
        position: [],
        fixedPosition: false,
        author: user?.['name'],
        authorId: user?.['_id'],
        pool: exportPool,
}

const handleEditOptions = () => {
    setManipulate(false)
    setEdit(!edit)
}

  const handleDescriptionChange = e => {
    setDescription(e.target.value)
  }

  function handleSharpsOrFlats(){
    let patternClone = JSON.parse(JSON.stringify(notes))
      if (options === 'sharps'){
        setChromaticNotes(['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'])
          setOptions('flats')

              for (let j = 0; j < patternClone.length; j++){
                  for (let k = 0; k < patternClone[j].length; k++){
                    if (Note.accidentals(patternClone[j][k]) === '#'){
                        let x = Note.enharmonic(patternClone[j][k])
                        patternClone[j] = [x]
                    }
                  }
              }
      }
      if (options === 'flats'){
        setChromaticNotes(['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'])
          setOptions('sharps')
              for (let j = 0; j < patternClone.length; j++){
                  for (let k = 0; k < patternClone[j].length; k++){
                    if (Note.accidentals(patternClone[j][k]) === 'b'){
                        let x = Note.enharmonic(patternClone[j][k])
                        patternClone[j] = [x]
                    }
                  }
              }
      }

      handleSetData(patternClone, position)
  }

  const importChordsFromChordLab = () => {
      if (labData?.labInfo?.chordLab?.chords){
        handleSetData(labData['labInfo']['chordLab']['chords'])
      } else {
          handleSetData([['C3', 'E3', 'G3']])
      }

  }

  const handlePatternType = () => {
      if (patternType === 'fluid'){
          return ''
      }
      if (patternType === 'fixed'){
          return 'anchor'
      }
      if (patternType === 'floating'){
          return 'fly'
      }
  }

  const handlePositionType = () => {
    if (positionType === 'locked'){
        return 'lock'
    }
    if (positionType === 'unlocked'){
        return ''
    }
  }

    return (
        <>
        <Menu>
        <Menu.Item onClick={() => handleSharpsOrFlats()}>{options === 'sharps' ? '#' : 'b'}</Menu.Item>
         <Menu.Item onClick={() => {playAll(); setPlaying(true)}}><Icon name={playing ? 'stop': 'play'}/></Menu.Item>
         <Button.Group>
         <Button basic onClick={()=> generateRandomMelody()}> Generate </Button>
         <Dropdown
          simple
          item
          className='button icon'
        > 
            <Dropdown.Menu>
                <Dropdown.Header>Generate Options</Dropdown.Header>
                <Dropdown.Item>
                # notes
                <Input type='number' 
                onKeyDown={(e) => {e.preventDefault()}}
                onChange={(e, {value}) => setGeneratePatternLength(value)}
                id='generateChordIntervalRange'
                min='1'
                max='99'
                style={{cursor: 'none'}}
                value={generatePatternLength}
                />
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Header> Common Patterns</Dropdown.Header>
                <Dropdown.Item onClick={() => generatePattern([1])}>Scale Up</Dropdown.Item>
                <Dropdown.Item onClick={() => generatePattern([-1], 4)}>Scale Down</Dropdown.Item>
                <Dropdown.Item onClick={() => generatePattern([2,2,3])}>Arpeggio Up</Dropdown.Item>
                <Dropdown.Item onClick={() => generatePattern([-3, -2, -2], 4)}>Arpeggio Down</Dropdown.Item>
            </Dropdown.Menu> 
        </Dropdown> 
        </Button.Group> 
         <Menu.Item onClick={handleEditOptions}> Edit</Menu.Item>       
         <Dropdown
         simple
         item
         text='Type'
         >
        <Dropdown.Menu>
        <Dropdown.Item active={patternType === 'fluid'} onClick={() => setPatternType('fluid')}> Fluid <Icon name='map'/></Dropdown.Item> 
         <Dropdown.Item active={patternType === 'fixed'} onClick={() => setPatternType('fixed')}> Fixed <Icon name='anchor'/></Dropdown.Item>       
         <Dropdown.Item active={patternType === 'floating'} onClick={() => setPatternType('floating')}> Floating <Icon name='fly'/></Dropdown.Item> 
        </Dropdown.Menu>
        </Dropdown>
        <Dropdown
         simple
         item
         text='Position'
         >
        <Dropdown.Menu>
        <Dropdown.Item active={positionType === 'unlocked'} onClick={() => setPositionType('unlocked')}> Unlocked<Icon name='lock open'/></Dropdown.Item> 
         <Dropdown.Item active={positionType === 'locked'} onClick={() => setPositionType('locked')}> Locked <Icon name='lock'/></Dropdown.Item>       
        </Dropdown.Menu>
        </Dropdown>
         <Dropdown
         simple
         item
         text='Options'
         >
        <Dropdown.Menu>
            <Dropdown.Item onClick={() => setNotesTruePatternFalse(!notesTruePatternFalse)}>
                {notesTruePatternFalse ? 'Change to pattern view': 'Change to note view'} 
            </Dropdown.Item>
            <Dropdown.Item onClick={()=> setScaleLock(!scaleLock)}>
            Scale lock: {scaleLock ? 'on' : 'off'}
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setPlayOnKeyPress(!playOnKeyPress)}>
            Play on Keypress: {playOnKeyPress ? 'on' : 'off'} 
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setPlayNoteOnClick(!playNoteOnClick)}>
            Play Note on Click:{playNoteOnClick ? 'on': 'off'} 
            </Dropdown.Item>
        </Dropdown.Menu>
        </Dropdown>
        <Button.Group>
        <Button basic compact onClick={() => setDisplay()}>Display</Button>
        <Dropdown
            simple 
            item
            className='button icon'
       >

          <Dropdown.Menu>
          <Dropdown.Header>Display Options</Dropdown.Header>
              <Dropdown.Divider/>
                <Dropdown.Item selected={!displayAll} onClick={() => setDisplayAll(false)}> Single Notes </Dropdown.Item>
                <Dropdown.Item selected={displayAll} onClick={() => setDisplayAll(true)}> Full Pattern </Dropdown.Item>
              <Dropdown.Header>Instruments</Dropdown.Header>
              <Dropdown.Divider/>
            <Dropdown.Item selected={instrumentDisplay === -2} onClick={() => setInstrumentDisplay(-2)}> None </Dropdown.Item>
            <Dropdown.Item selected={instrumentDisplay === -1} onClick={() => setInstrumentDisplay(-1)}> All </Dropdown.Item>
             {mapMenuItems()}
          </Dropdown.Menu>
        </Dropdown>
        </Button.Group>

        <Menu.Item onClick={() => setShowDescription(!showDescription)}> Desc </Menu.Item>
        <Menu.Item onClick={importChordsFromChordLab}> Import </Menu.Item>
        <Button.Group>
        <ExportModal
        dataType={'Pattern'}
        exportObj={exportObj}/>
        </Button.Group>
        </Menu>
        {(edit && !manipulate) && 
        <Button.Group>
            <Button  compact basic active={noteOptions === 'octave'} onClick ={() => setNoteOptions('octave')}>Octave</Button>
            <Button compact basic active={noteOptions === 'scale'} onClick ={() => setNoteOptions('scale')}> Scale</Button>
            <Button  compact basic active={noteOptions === 'chromatic'} onClick ={() => setNoteOptions('chromatic')}>Chromatic</Button>
            <Button  compact basic active={noteOptions === 'insert'} onClick ={() => setNoteOptions('insert')}>Insert</Button>
            <Button  compact basic active={noteOptions === 'position'} onClick ={() => setNoteOptions('position')}>Position</Button>
            <Button  compact basic active={noteOptions === 'delete'} onClick ={() => setNoteOptions('delete')}>Delete</Button>
            <Button compact basic onClick={() => handleRemoveNoteFromEnd()}>Note-- </Button>
            <Button compact basic onClick={() => handleAddNoteToEnd()}>Note++ </Button>
            {noteOptions === 'delete' && <Button  compact basic onClick ={handleDeleteAll}>Delete All</Button>}
            {noteOptions !== 'delete' && noteOptions !== 'insert' && <Button  compact basic onClick ={handleClickUpAll}>All Up</Button>}
            {noteOptions !== 'delete' && noteOptions !== 'insert' && <Button  compact basic onClick ={handleClickDownAll}>All Down</Button>}
            <Button  compact basic onClick ={() => setManipulate(!manipulate)}>Advanced</Button>
        </Button.Group>
        }
        {manipulate &&
        <Button.Group>
            <Button  compact basic onClick ={shuffleNotes}>Shuffle</Button>
            <Button  compact basic onClick ={reverseMelody}>Reverse Melody</Button>
            <Button  compact basic onClick ={() => invertMelody()}>Invert Melody</Button>
            <Button  compact basic onClick ={() => fitPatternToScale()}>Fit Pattern To Scale</Button>
            <Button  compact basic onClick ={() => setManipulate(!manipulate)}>Basic</Button>
        </Button.Group>
        }
  
        {notesTruePatternFalse && <div id='display' style={{display: 'flex', flexDirection: 'row', width: '900px', flexWrap: 'wrap'}}>
            {mapNotes(notes)}
        </div>}
        {!notesTruePatternFalse && <div id='display' style={{display: 'flex', flexDirection: 'row', width: '900px', flexWrap: 'wrap'}}>
            {mapNotes(pattern)}
        </div>}
        <div>{notes.length} {notes.length > 1 ? 'notes' : 'note'}</div>
        <div>
            <div draggable onClick={() => setInputFocus(!inputFocus)} onDragStart={dragStartHandlerSpecial} style={{height: '25px', width:'125px', backgroundColor: 'lightblue', display: !inputFocus ? '': 'none' }}>{name}{' '}<Icon name={handlePatternType()} /><Icon name={handlePositionType()} /></div>
            <Input type='text'
            value={name}
            id={'input_patternLab'}
            ref={input => input && input.focus()}
            onBlur={() => setInputFocus(false)}
            onInput={e => setName(e.target.value)}
            style={{display: inputFocus ? '': 'none' }}
            />
        </div>
        {showDescription && <Form>
        <TextArea onInput={handleDescriptionChange} id={'desc_chordLab'} ref={input => input && input.focus()} placeholder='Description...' value={description} />
        </Form>}
        </>
    )
}
