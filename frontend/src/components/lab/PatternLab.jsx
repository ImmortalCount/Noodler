
import { React, useState, useEffect, useRef} from 'react'
import * as Tone from 'tone';
import { toMidi, midiToNoteName } from '@tonaljs/midi';
import { Note, Scale, Chord} from '@tonaljs/tonal';
import { Menu, Button, Input } from 'semantic-ui-react';
import { keySynth } from './keySynth';


export default function PatternLab({importedPatternData}) {

const chromaticScale = [
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
//['C', 'D', 'E', 'G', 'A']
var [notes, setNotes] = useState(['C4', 'D4', 'E4', 'G5', 'C5', 'B4', 'G4', 'A4'])
var [pattern, setPattern] = useState([''])
var [scaleLock, setScaleLock] = useState(true)
var [playOnKeyPress, setPlayOnKeyPress] = useState(false)
var [name, setName] = useState('Pattern 1')
var scale = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
var octave = 4;

useEffect(() => {
    if (importedPatternData['pattern'] !== undefined){
        setPattern(importedPatternData['pattern'])
        setName(importedPatternData['patternName'])
        console.log(patternAndScaleToNotes(importedPatternData['pattern'], scale))
    }
    
}, [importedPatternData])

useEffect(() => {
    patternExtraction()
}, [notes])

//=======Drag and drop functionality
function changePositionsUsingIDs(startingID, endingID){
    var xfer;
    var clone = [...notes]
    var ex1 = startingID.split('_')[1]
    var ex2 = endingID.split('_')[1]
    xfer = clone[ex1]
    clone.splice(ex1, 1)
    clone.splice(ex2, 0, xfer)
    setNotes(clone)
}

const dragStartHandler = e => {
    var obj = {id: e.target.id, className: e.target.className, message: 'foreign', type: 'foreign'}
    e.dataTransfer.setData('text', JSON.stringify(obj));
};

const dragStartHandlerSpecial = e => {
    var obj = {id: 'special', className: 'patternData', message: {
        patternName: name,
        pattern: pattern,
        position: []
    }, type: 'foreign'}
    e.dataTransfer.setData('text', JSON.stringify(obj));
}

const dragHandler = e => {
};

const dragOverHandler = e => {
    e.currentTarget.className = 'active chord'
    e.preventDefault();
};

const dragLeaveHandler = e => {
    e.currentTarget.className = 'inactive chord'
    e.preventDefault();
}

//---------------------
const dropHandler = e => {
    e.currentTarget.className = 'inactive chord'
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    e.preventDefault();
    var data = JSON.parse(e.dataTransfer.getData("text"));
    changePositionsUsingIDs(data.id, e.target.id)
    e.dataTransfer.clearData();
    
}

var keyMap = [
//lower row
{key: 'z', note: 'C', octave: '0'},
{key: 'x', note: 'D', octave: '0'},
{key: 'c', note: 'E', octave: '0'},
{key: 'v', note: 'F', octave: '0'},
{key: 'b', note: 'G', octave: '0'},
{key: 'n', note: 'A', octave: '0'},
{key: 'm', note: 'B', octave: '0'},
{key: ',', note: 'C', octave: '1'},
{key: '.', note: 'D', octave: '1'},
{key: '/', note: 'E', octave: '1'},
//middle row
{key: 's', note: 'C#', octave: '0'},
{key: 'd', note: 'D#', octave: '0'},
{key: 'g', note: 'F#', octave: '0'},
{key: 'h', note: 'G#', octave: '0'},
{key: 'j', note: 'A#', octave: '0'},
{key: 'l', note: 'C#', octave: '1'},
{key: ';', note: 'D#', octave: '1'},
//upper row
{key: 'q', note: 'C', octave: '1'},
{key: 'w', note: 'D', octave: '1'},
{key: 'e', note: 'E', octave: '1'},
{key: 'r', note: 'F', octave: '1'},
{key: 't', note: 'G', octave: '1'},
{key: 'y', note: 'A', octave: '1'},
{key: 'u', note: 'B', octave: '1'},
{key: 'i', note: 'C', octave: '2'},
{key: 'o', note: 'D', octave: '2'},
{key: 'p', note: 'E', octave: '2'},
//number row
{key: '2', note: 'C#', octave: '1'},
{key: '3', note: 'D#', octave: '1'},
{key: '5', note: 'F#', octave: '1'},
{key: '6', note: 'G#', octave: '1'},
{key: '7', note: 'A#', octave: '1'},
{key: '9', note: 'C#', octave: '2'},
{key: '0', note: 'D#', octave: '2'},
]
var [keyPressed, setKeyPressed] = useState(false);
var keydownEvent = (e) => {
    if (keyPressed === false){
        const newNotes = [...notes];
        if (playOnKeyPress === false){
            return
        } else {
            let obj = keyMap.find(o => o.key === e.key);
            if (scaleLock){
                if (!scale.includes(obj.note)){
                    return
                } else if (obj.note !== undefined) {
                const now = Tone.now();
                var playNote = (obj.note + (Number(obj.octave) + Number(octave)));
                keySynth.triggerAttackRelease(playNote, "8n", now);
                document.removeEventListener('keydown', keydownEvent);
                console.log(obj.note)
                newNotes.push(playNote)
                setNotes(newNotes)
                }
            } else if (obj !== undefined){
                const now = Tone.now();
                var playNote = (obj.note + (Number(obj.octave) + Number(octave)));
                keySynth.triggerAttackRelease(playNote, "8n", now);
                document.removeEventListener('keydown', keydownEvent);
                console.log(obj.note)
                newNotes.push(playNote)
                setNotes(newNotes)
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


function playAll(){
    const now = Tone.now();
    const synth = new Tone.Synth().toDestination()
   for (var i = 0; i < notes.length; i++){
    synth.triggerAttackRelease(notes[i], '8n', now + (i * 0.2))
    // document.getElementById('pattern_' + i).className = 'active';
    }
}

var handleNotesClick = () => {
    console.log(notes);
}

// function randomIntFromInterval(min, max) { // min and max included 
//     return Math.floor(Math.random() * (max - min + 1) + min)
//   }

function generateRandomScale(noteNumber){
    var returnArr = [1,0,0,0,0,0,0,0,0,0,0,0];
    var returnScale = [];
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
            returnScale.push(chromaticScale[j] + 4);
        }
    }
    var digit = parseInt(returnArr.join(""), 2)
    console.log(Scale.get(returnArr.join("")).name, `Scale: ${digit}`)
    setNotes(returnScale)
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
    console.log(modes);
}

function generateRandomMelody(){
    var melodyLength = 8;
    var returnArr = [];
    var testArr = [
        'C2',
        'D2', 
        'E2', 
        'F2', 
        'G2', 
        'A2', 
        'B2', 
        'C3',
        'D3', 
        'E3', 
        'F3', 
        'G3', 
        'A3', 
        'B3',
        'C4',
        'D4', 
        'E4', 
        'F4', 
        'G4', 
        'A4', 
        'B4',  
    ]
    for (var i = 0; i < melodyLength; i++){
        var randomIndex = Math.floor(Math.random() * testArr.length);
        returnArr.push(testArr[randomIndex])
    }
setNotes(returnArr);
}
//still runs a bit funky
function mapNotes(notes){
    return (
        notes.map((note, idx) => 
        <div id={'pattern_' + idx} key={'pattern_' + idx} draggable onDragStart = {dragStartHandler} onDrag = {dragHandler} onDragOver = {dragOverHandler} onDragLeave={dragLeaveHandler} onDrop = {dropHandler}  className='inactive chord' style={{marginLeft: '5px', height: '25px', width: '25px'}}>{note}</div>
        )
    )
}

function reverseMelody(notes){
    var returnArr = [];
    for (var i = notes.length -1; i > -1; i--){
        returnArr.push(notes[i])
    }
    setNotes(returnArr);
}

function invertMelodyChromatically(notes){
    var midiNotes = [];
    var noteDistances = [0];
    var invertedNoteDistances = [];
    var finalNotes = [];
    for (var i = 0; i < notes.length; i++){
        midiNotes.push(toMidi(notes[i]))
    }
    var refNote = midiNotes[0];
    for (var j = 1; j < midiNotes.length; j++){
        noteDistances.push(midiNotes[j] - refNote);
    }
    invertedNoteDistances = noteDistances.map(function(e){ if( e === 0){return e} else {return e * -1}})
    
    for (var k = 0; k < midiNotes.length; k++){
        var finalNote = (invertedNoteDistances[k] + refNote)
        finalNotes.push(midiToNoteName(finalNote, { sharps: true }))
    }
    setNotes(finalNotes)
    
}

function invertMelodyScalar(notes){
    var allNotes = [];
    var allIndices = [];
    var noteDistances = [];
    var invertedNoteDistances = [];
    var finalNotes = [];
    var scale = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
    for (var i = 0; i < 10; i++){
        for (var j = 0; j < scale.length; j++){
            allNotes.push(scale[j] + i)
        }
    }

    // var refNoteIndex = allNotes.indexOf(notes[0]);
    for (var k = 0; k < notes.length; k++){
        allIndices.push(allNotes.indexOf(notes[k]))
    }


    for (var l = 0; l < allIndices.length; l++){
        noteDistances.push(allIndices[l] - allIndices[0])
    }

    invertedNoteDistances = noteDistances.map(function(e){ if( e === 0){return e} else {return e * -1}})
    var refIndex = allIndices[0]
 
    for (var m = 0; m < invertedNoteDistances.length; m++){
            var finalNote = allNotes[invertedNoteDistances[m] + refIndex]
            finalNotes.push((finalNote))
    }

    setNotes(finalNotes)
}

function shuffleNotes(){
    var cloneNotes = [...notes]
    var returnArr = [];
    for (var i = 0; i < cloneNotes.length; i++){
        returnArr.push('')
    }
    var j = 0;
    while (j < cloneNotes.length){
        var randomIndex = Math.floor(Math.random() * cloneNotes.length);
        if (returnArr[randomIndex] === ''){
            returnArr[randomIndex] = cloneNotes[j];
            j++;
        }
    }
    setNotes(returnArr)
}

function patternExtraction(){

    var root = scale[0] + 3
    
    var chromaticScale = Scale.get('c chromatic').notes
    var allNotes = [];
    var allChromaticNotes = [];
    var patternExport = [];
    for (var i = 0; i < 10; i++){
        for (var j = 0; j < scale.length; j++){
            allNotes.push(scale[j] + i)
        }
    }

    for (var m = 0; m < 10; m++){
        for (var n = 0; n < chromaticScale.length; n++){
            allChromaticNotes.push(chromaticScale[n] + m)
        }
    }
 
    var rootIndex = allNotes.indexOf(root);
    var rootChromaticIndex = allChromaticNotes.indexOf(root);
    for (var k = 0; k < notes.length; k++){
        if (allNotes.indexOf(notes[k]) === -1){
            if (allChromaticNotes.indexOf(notes[k]) === -1){
            patternExport.push( "*" + (allChromaticNotes.indexOf(Note.enharmonic(notes[k])) - rootChromaticIndex))
            } else {
            patternExport.push((allChromaticNotes.indexOf(notes[k]) - rootChromaticIndex));
            }
        } else {
            patternExport.push(allNotes.indexOf(notes[k]) - rootIndex)
        }
        
    }
    setPattern(patternExport);
}

function patternAndScaleToNotes(pattern, scale, root){
    var allNotes = [];
    var allChromaticNotes = [];
    var chromaticScale = Scale.get('c chromatic').notes
    var notesExport = [];
    if (root === undefined){
        root = 'C3'
    }
    var simplifiedScale = [];
    for (var h = 0; h < scale.length; h++){
        simplifiedScale.push(Note.simplify(scale[h]))
    }
    //[0, "*1", 1, "*3", 3, 4, "*10"]
    for (var i = 0; i < 10; i++){
        for (var j = 0; j < simplifiedScale.length; j++){
            allNotes.push(simplifiedScale[j] + i)
        }
    }
    allNotes = Note.sortedNames(allNotes);
    //chromatic notes
    for (var m = 0; m < 10; m++){
        for (var n = 0; n < chromaticScale.length; n++){
            allChromaticNotes.push(chromaticScale[n] + m)
        }
    }
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
    for (var k = 0; k < pattern.length; k++){
        //check if flag is added to pattern
        
        if (typeof pattern[k] === 'string'){
            notesExport.push(allChromaticNotes[startingChromaticIndex + Number(pattern[k].split("").slice(1).join(""))])
        } else {
            notesExport.push(allNotes[startingIndex + pattern[k]])
        }
    }
    setNotes(notesExport)
    // playAll(notesExport)
}

function changeOctaves(notes, direction){
    var returnArr = []
    var change;
    if (direction === 'down'){
        change = - 1;
    } else {
        change = 1;
    }
    for (var i = 0; i < notes.length; i++){
            var pitchClass = Note.pitchClass(notes[i])
            var newOct = Number(Note.octave(notes[i])) + change;
            returnArr.push(pitchClass + newOct);
    }
    setNotes(returnArr);
}

function player(pattern, scale, root){
    patternAndScaleToNotes(pattern, scale, root)

}

//takes up/down as direction 
function changeScaleTones(notes, scale, direction){
var allNotes = [];
var returnArr = [];
var mod;

if (direction === 'up'){
    mod = 1;
} else {
    mod = -1;
}

for (var i = 0; i < 10; i++){
    for (var j = 0; j < scale.length; j++){
        allNotes.push(scale[j] + i)
    }
}


for (var k = 0; k < notes.length; k++){
    var shiftedNote = allNotes[allNotes.indexOf(notes[k]) + mod]
    returnArr.push(shiftedNote)
}
    setNotes(returnArr);
}

function clearNotes(){
    setNotes([])
    document.removeEventListener('keydown', keydownEvent);
}

function chordParser(chord){
    var chordArr = chord.split("");
    if (chordArr[1] === '#' || chordArr[1] === 'b'){
        return [chordArr.slice(0, 2).join(''), chordArr.slice(2).join('')]
    } else {
        return [chordArr.slice(0, 1).join(''), chordArr.slice(1).join('')]
    }
}

//key is string A major, B minor, etc
function romanNumeralAssigner(chord, key){
var chordRoot = chordParser(chord)[0];
var chordType = chordParser(chord)[1];

var root = key.split(" ")[0];
var scale = Scale.get(root + ' chromatic').notes
var romanNumeralsMajor = [
        'I',
        'bII',
        'II',
        'bIII',
        'III',
        'IV',
        'bV',
        'V',
        'bVI',
        'VI',
        'bVII',
        'VII'
    ]

var romanNumeralsMinor = [
    'i',
    'bii',
    'ii',
    'biii',
    'iii',
    'iv',
    'bv',
    'v',
    'bvi',
    'vi',
    'bvii',
    'vii'
    ]
    var chordIndex;
    if (scale.indexOf(chordRoot) === -1){
        chordIndex = scale.indexOf(Note.enharmonic(chordRoot))
    } else {
        chordIndex = scale.indexOf(chordRoot)
    }
    if (chordType === 'major'){
        return romanNumeralsMajor[chordIndex] + chordType;
    } else {
        return romanNumeralsMinor[chordIndex] + chordType;
    }
}

function defaultScaleAssigner(chord, key){
var keyRoot = chordParser(key)[0]
var keyType = chordParser(key)[1]

var allNotes = Scale.get( keyRoot + ' chromatic').notes

var chordDegreeAndTypeToScale = [
    {major: 'ionian', minor: 'aeolian', dominant: 'mixolydian'},
    {major: 'lydian #2 #6', minor: 'dorian', dominant: 'mixolydian b6'},
    {major: 'lydian', minor: 'dorian', dominant: 'mixolydian'},
    {major: 'lydian', minor: 'dorian', dominant: 'mixolydian b6'},
    {major: 'double harmonic', minor: 'phrygian', dominant: 'phrygian dominant'},
    {major: 'lydian', minor: 'melodic minor', dominant: 'mixolydian#11'},
    {major: 'lydian', minor: 'dorian', dominant: 'altered'},
    {major: 'mixolydian', minor: 'dorian', dominant: 'mixolydian'},
    {major: 'lydian', minor: 'dorian', dominant: 'mixolydian b6'},
    {major: 'lydian', minor: 'aeolian', dominant: 'mixolydian b6'},
    {major: 'lydian', minor: 'dorian', dominant: 'mixolydian b6'},
    {major: 'lydian', minor: 'dorian', dominant: 'mixolydian b6'},
]

var majorToMinorIndex = [
    9,
    10,
    11,
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8
]

var chordRoot = chordParser(chord)[0];
var chordType = chordParser(chord)[1];

var chordIndex;
if (allNotes.indexOf(chordRoot) === -1){
    chordIndex = allNotes.indexOf(Note.enharmonic(chordRoot))
} else {
    chordIndex = allNotes.indexOf(chordRoot)
}

if (keyType === 'minor'){
    console.log(chordRoot + " " + chordDegreeAndTypeToScale[majorToMinorIndex[chordIndex]][chordType]) 
} else {
    console.log(chordRoot + " " + chordDegreeAndTypeToScale[chordIndex][chordType]) 
}
}

//for scale lab
// console.log(Scale.get("101010010100").name, 'name');
//Drag and Drop Default

    return (
        <>
        <Menu>
         <Menu.Item onClick={() => playAll()}> Play </Menu.Item>   
         <Menu.Item onClick={() => shuffleNotes()}> Shuffle </Menu.Item>   
         <Menu.Item onClick={()=> generateRandomMelody()}> Generate </Menu.Item>    
         <Menu.Item onClick={()=> setScaleLock(!scaleLock)}> Scale lock: {scaleLock ? 'ON' : 'OFF'} </Menu.Item>    
         <Menu.Item onClick={() => setNotes([])}> Clear </Menu.Item>   
         <Menu.Item onClick={() => setPlayOnKeyPress(!playOnKeyPress)}>Play on Keypress: {playOnKeyPress ? 'ON' : 'OFF'} </Menu.Item>
         {/* <Menu.Item> Options </Menu.Item>      
         <Menu.Item> Chords Allowed? </Menu.Item>      
         <Menu.Item> Import Scale Lab </Menu.Item>      
         <Menu.Item> Import Chord Lab </Menu.Item>      
         <Menu.Item> Export </Menu.Item>    */}
        </Menu>
        <Button.Group>
            <Button compact basic onClick ={() => console.log('click')}>preNote</Button>
            <Button  compact basic onClick ={() => console.log('click')}>normalNote</Button>
            <Button  compact basic onClick ={() => console.log('click')}>postNote</Button>
            <Button  compact basic onClick ={() => console.log('click')}>chromatic</Button>
            <Button compact basic onClick ={() => console.log('click')}>scale</Button>
            <Button  compact basic onClick ={() => console.log('click')}>octave</Button>
        </Button.Group>
        <Button.Group>
            <Button  compact basic onClick ={() => console.log('click')}>up</Button>
            <Button  compact basic onClick ={() => console.log('click')}>down</Button>
            <Button  compact basic onClick ={() => console.log('click')}>all chromatic</Button>
            <Button compact basic onClick ={() => console.log('click')}>all scale</Button>
            <Button  compact basic onClick ={() => console.log('click')}>all octave</Button>
        </Button.Group>
        <div>Scale: C Major</div>
        <div>Octave: {octave}</div>
        <div id='display' style={{display: 'flex', flexDirection: 'row'}}>
            Melody: {mapNotes(notes)}
        </div>
        <div>
            Pattern: {pattern}
        </div>
        <div>
            <h3>Export</h3>
            <div draggable onDragStart={dragStartHandlerSpecial} style={{height: '25px', width: '125px', backgroundColor: 'wheat'}}>{name}</div>
        </div>
        <div>
            <h3>Name</h3>
            <Input type='text'
            value={name}
            onInput={e => setName(e.target.value)}
            />
        </div>
        {/* <button> Key Controls</button> */}
        {/* <button onClick={() => generateRandomMelody()}>Generate Random Melody</button> */}
        {/* <button>Length of Melody: 8</button> */}
        {/* <button onClick={() => playAll(notes)}> Play All </button> */}
        {/* <button> Notes </button> */}
        {/* <button>Input: on</button> */}
        {/* <button onClick={handleNotesClick}> Notes display</button>
        <button onClick={() => generateRandomScale(7)}>Generate Random Scale</button> */}
        {/* <button>Generate Random Rhythm</button> */}
        {/* <button>Rhythm duration</button> */}
        {/* <button>Generate Random Melodic Rhythm</button> */}
        {/* <button onClick={() => generateAllModes([1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0])}>All modes</button>
        <button>Scale lock: off</button>
        <button> Next Mode </button>
        <button>Previous Mode</button>
        <button onClick ={() => reverseMelody(notes)}> Reverse Melody </button>
        <button onClick={() => invertMelodyScalar(notes)}> Invert Melody: Scalar</button>
        <button onClick={() => invertMelodyChromatically(notes)}> Invert Melody: Chromatically</button>
        <button onClick={() => shuffleNotes(notes)}>shuffle</button>
        <button onClick={() => changeScaleTones(notes, scale, 'up')}> Up a scale tone</button>
        <button onClick={() => changeScaleTones(notes, scale, 'down')}> Down a scale tone</button>
        <button>up a semitone</button>
        <button>down a semitone</button>
        <button onClick={() => changeOctaves(notes, 'up')}>up an octave</button>
        <button onClick={() => changeOctaves(notes, 'down')}>Down an octave</button>
        <button onClick={() => patternExtraction(notes, scale)}>Pattern extraction</button>
        <button onClick={() => patternAndScaleToNotes(pattern, scale)}>Play extracted pattern</button>
        <button onClick={() => clearNotes()}>Clear notes</button>   */}
        </>
    )
}
