
import { React, useState, useEffect, useRef} from 'react'
import * as Tone from 'tone';
import { useDispatch, useSelector} from 'react-redux';
import { insertData } from '../../store/actions/dataPoolActions';
import { toMidi, midiToNoteName } from '@tonaljs/midi';
import { Note, Scale, Chord} from '@tonaljs/tonal';
import { Menu, Button, Input, Icon, Dropdown, Form, TextArea} from 'semantic-ui-react';
import { keySynth } from './synths';
import { setLabData } from '../../store/actions/labDataActions';
import { scaleHandler } from './utils';
import { keyMap } from './keymap';
import ExportModal from '../modal/ExportModal';


export default function PatternLab({importedPatternData}) {

const [notes, setNotes] = useState(['A2', 'B2', 'C3', 'D3', 'E3', 'F3', 'G3', 'A3'])
const [pattern, setPattern] = useState(['0 1 2 4 7 4 2 1'])
const [scaleLock, setScaleLock] = useState(true)
const [playOnKeyPress, setPlayOnKeyPress] = useState(false)
const [name, setName] = useState('Pattern 1')
const [options, setOptions] = useState('sharps')
const [noteOptions, setNoteOptions] = useState('octave')
const [allOptions, setAllOptions] = useState('octave')
const [edit, setEdit] = useState('off')
const [notesTruePatternFalse, setNotesTruePatternFalse] = useState(true)
const [octave, setOctave] = useState(3)
const [generatePatternLength, setGeneratePatternLength] = useState(8)
const [manipulate, setManipulate] = useState(false)
const [playNoteOnClick, setPlayNoteOnClick] = useState(true)
const [startOnScaleDegree, setStartOnScaleDegree] = useState(true)
const [generateScaleDegree, setGenerateScaleDegree] = useState(1)
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

    function patternAndScaleToNotes2(patternArr){
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
        for (var k = 0; k < patternArr.length; k++){
            //check if flag is added to patternArr
            if (typeof patternArr[k] === 'string'){
                notesExport.push(allChromaticNotes[startingChromaticIndex + Number(patternArr[k].split("").slice(1).join(""))])
            } else {
                notesExport.push(allNotes[startingIndex + patternArr[k]])
            }
        }
        setNotes(notesExport)
        // playAll(notesExport)
    }



useEffect(() => {
    if (importedPatternData['pattern'] !== undefined){
        setPattern(importedPatternData['pattern'])
        setName(importedPatternData['patternName'])
        patternAndScaleToNotes2(importedPatternData['pattern'])
    }
    
}, [importedPatternData])

useEffect(() => {
    patternExtraction()
}, [notes])

// useEffect(() => {
//     // patternAndScaleToNotes()
// }, [scaleNotes])

useEffect(() => {
        let newInfo = {...labInfo}
        const patternDataPrototype = {
            name: name,
            patternName: name,
            desc: '',
            type: 'pattern',
            length: notes.length,
            pattern: pattern,
            position: [],
            author: '',
            authorId: '',
            dataType: 'pattern',
            pool: '',
        }
        newInfo['patternLab'] = patternDataPrototype
        dispatch(setLabData(newInfo))
    }, [notes, name, pattern])

// useEffect(() => {
//     patternAndScaleToNotes()
// }, [scaleNotes])

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
    var obj = {id: e.target.id, className: e.target.className, message: '', type: 'patternLab'}
    e.dataTransfer.setData('text', JSON.stringify(obj));
};

const dragStartHandlerSpecial = e => {
    var obj = {id: 'special', className: 'patternData', message: {
        patternName: name,
        pattern: pattern,
        position: []
    }, type: 'patternLabExport'}
    e.dataTransfer.setData('text', JSON.stringify(obj));
}

const dragHandler = e => {
};

const dragOverHandler = e => {
    e.currentTarget.className = 'active note'
    e.preventDefault();
};

const dragLeaveHandler = e => {
    e.currentTarget.className = 'inactive note'
    e.preventDefault();
}

//---------------------
const dropHandler = e => {
    e.currentTarget.className = 'inactive note'
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
                var playNote = (obj.note + (Number(obj.octave) + Number(octave)));
                keySynth.triggerAttackRelease(playNote, "8n", now);
                document.removeEventListener('keydown', keydownEvent);
                newNotes.push(playNote)
                setNotes(newNotes)
                }
            } else if (obj !== undefined){
                const now = Tone.now();
                var playNote = (obj.note + (Number(obj.octave) + Number(octave)));
                keySynth.triggerAttackRelease(playNote, "8n", now);
                document.removeEventListener('keydown', keydownEvent);
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
    if (isMuted){
        return
    }
    Tone.start()
    Tone.Transport.cancel()
    Tone.Transport.stop()
    Tone.Transport.start();
    var count = 0;
    const synthPart = new Tone.Sequence(
        function(time, note) {
          keySynth.triggerAttackRelease(note, "10hz", time)
          var highlightedChord = document.getElementById('pattern_' + count)
            highlightedChord.className = 'active note'
            setTimeout(() => {highlightedChord.className = 'inactive note'}, 250)
            count++
        },
       notes,
        "8n"
      );
      synthPart.start();
      synthPart.loop = 1;
}

function generateRandomMelody(){
    var returnArr = [];
    for (var i = 0; i < generatePatternLength; i++){
        var upOctave = Math.random() < 0.5
        var randomIndex = Math.floor(Math.random() * scaleNotes.length);
        if (upOctave){
            returnArr.push(scaleNotes[randomIndex] + (octave + 1))
        } else {
            returnArr.push(scaleNotes[randomIndex] + octave)
        }
    }
    
setNotes(returnArr);
}

const handleClickUp = (e) => {
    var clone = [...notes]
   const x = e.currentTarget.parentNode.parentNode.id
   const idx = Number(x.split('_')[1])
   if (noteOptions === 'scale'){
        if (allScaleNotes.indexOf(notes[idx]) === -1){
            var chromaIndex = allChromaticNotes.indexOf(notes[idx]);
            if (chromaIndex === -1){
                chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(notes[idx]));
            }
            var matched = false;
            var count = 0;
            while (matched === false){
                if (allScaleNotes.indexOf(allChromaticNotes[chromaIndex + count]) !== -1){
                    clone[idx] = allScaleNotes[allScaleNotes.indexOf(allChromaticNotes[chromaIndex + count])];
                    matched = true;
                } else {
                    count++;
                }
            }
        } else {
        clone[idx] = allScaleNotes[allScaleNotes.indexOf(clone[idx]) + 1];
        }
        setNotes(clone)
   } else if (noteOptions === 'octave'){
        var note = Note.pitchClass(notes[idx])
        var octave = Note.octave(notes[idx])
        clone[idx] = note + (octave + 1)
        setNotes(clone)
   } else if (noteOptions === 'chromatic'){
    var chromaIndex = allChromaticNotes.indexOf(notes[idx])
    if (allChromaticNotes.indexOf(notes[idx]) === -1){
        chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(notes[idx]))
    }
    clone[idx] = allChromaticNotes[chromaIndex + 1];
    setNotes(clone)
   } else if (noteOptions === 'insert'){
       var newNote = clone[idx]
       clone.splice(idx, 0, newNote)
       setNotes(clone)
   } else {
       return
   }
}

const handleClickDown = (e) => {
   var clone = [...notes]
   const x = e.currentTarget.parentNode.parentNode.id
   const idx = Number(x.split('_')[1])
   if (noteOptions === 'scale'){
        if (allScaleNotes.indexOf(notes[idx]) === -1){
            var chromaIndex = allChromaticNotes.indexOf(notes[idx]);
            if (chromaIndex === -1){
                chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(notes[idx]));
            }
            var matched = false;
            var count = 0;
            while (matched === false){
                if (allScaleNotes.indexOf(allChromaticNotes[chromaIndex + count]) !== -1){
                    clone[idx] = allScaleNotes[allScaleNotes.indexOf(allChromaticNotes[chromaIndex + count])];
                    matched = true;
                } else {
                    count--;
                }
            }
        } else {
        clone[idx] = allScaleNotes[allScaleNotes.indexOf(clone[idx]) - 1];
        }
        setNotes(clone)
   } else if (noteOptions === 'octave'){
        var note = Note.pitchClass(notes[idx])
        var octave = Note.octave(notes[idx])
        clone[idx] = note + (octave + -1)
        setNotes(clone)
   } else if (noteOptions === 'chromatic'){
        var chromaIndex = allChromaticNotes.indexOf(notes[idx])
        if (allChromaticNotes.indexOf(notes[idx]) === -1){
            chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(notes[idx]))
        }
        clone[idx] = allChromaticNotes[chromaIndex - 1];
        setNotes(clone)
   } else if (noteOptions === 'insert'){
    var newNote = clone[idx]
    clone.splice(idx, 0, newNote)
    setNotes(clone)
   } else {
       return
   }
}

const handleDeleteNote = (e) => {
    var clone = [...notes]
    const x = e.currentTarget.parentNode.id
    const idx = Number(x.split('_')[1])
    clone.splice(idx, 1)
    console.log(idx)
    setNotes(clone)
}

const handleEditAllUp = () => {
var clone = [...notes]
if (noteOptions === 'scale'){
    for (var i = 0; i < clone.length; i++){
        if (allScaleNotes.indexOf(notes[i]) === -1){
            var chromaIndex = allChromaticNotes.indexOf(notes[i]);
            if (chromaIndex === -1){
                chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(notes[i]));
            }
            var matched = false;
            var count = 0;
            while (matched === false){
                if (allScaleNotes.indexOf(allChromaticNotes[chromaIndex + count]) !== -1){
                    clone[i] = allScaleNotes[allScaleNotes.indexOf(allChromaticNotes[chromaIndex + count])];
                    matched = true;
                } else {
                    count++;
                }
            }
        } else {
        clone[i] = allScaleNotes[allScaleNotes.indexOf(clone[i]) + 1];
        }
    }
    setNotes(clone)
} else if (noteOptions === 'octave') {
    for (var i = 0; i < clone.length; i++){
        var note = Note.pitchClass(notes[i])
        var octave = Note.octave(notes[i])
        clone[i] = note + (octave + 1)
        setNotes(clone)
    }
} else if (noteOptions === 'chromatic'){
    for (var i = 0; i < clone.length; i++){
        var chromaIndex = allChromaticNotes.indexOf(notes[i])
        if (allChromaticNotes.indexOf(notes[i]) === -1){
            chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(notes[i]))
        }
        clone[i] = allChromaticNotes[chromaIndex + 1];
    }
        setNotes(clone)
} else {
    return
}
}


const handleEditAllDown = () => {
    var clone = [...notes]
    if (noteOptions === 'scale'){
        for (var i = 0; i < clone.length; i++){
            if (allScaleNotes.indexOf(notes[i]) === -1){
                var chromaIndex = allChromaticNotes.indexOf(notes[i]);
                if (chromaIndex === -1){
                    chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(notes[i]));
                }
                var matched = false;
                var count = 0;
                while (matched === false){
                    if (allScaleNotes.indexOf(allChromaticNotes[chromaIndex + count]) !== -1){
                        clone[i] = allScaleNotes[allScaleNotes.indexOf(allChromaticNotes[chromaIndex + count])];
                        matched = true;
                    } else {
                        count--;
                    }
                }
            } else {
            clone[i] = allScaleNotes[allScaleNotes.indexOf(clone[i]) - 1];
            }
        }
        setNotes(clone)
    } else if (noteOptions === 'octave') {
        for (var i = 0; i < clone.length; i++){
            var note = Note.pitchClass(notes[i])
            var octave = Note.octave(notes[i])
            clone[i] = note + (octave - 1)
            setNotes(clone)
        }
    } else if (noteOptions === 'chromatic'){
        for (var i = 0; i < clone.length; i++){
            var chromaIndex = allChromaticNotes.indexOf(notes[i])
            if (allChromaticNotes.indexOf(notes[i]) === -1){
                chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(notes[i]))
            }
            clone[i] = allChromaticNotes[chromaIndex - 1];
        }
            setNotes(clone)
    } else {
        return
    }
    }

const handleDeleteAll = () => {
    setNotes([])
    setNoteOptions('delete')
}

const handleAddNoteToEnd = () => {
    const clone = [...notes]
    if (clone.length === 0){
        clone.push('C3')
    } else {
        const lastNote = clone[clone.length - 1]
        clone.push(lastNote)
    }
    setNotes(clone)
}

const handleRemoveNoteFromEnd = () => {
    const clone =  [...notes]
    clone.pop()
    setNotes(clone)
}

const handlePlayThis = (e) => {
    if (playNoteOnClick){
        var elementClicked = e.target.id
        var r = elementClicked.split('_')[0]
        if (r === 'clickup' || r === 'clickdown' || r === 'delete'){
            return
        }
        var parentID = e.currentTarget.id;
        var x = parentID.split('_')[1]
        keySynth.triggerAttackRelease(notes[x], '8n');
        var thisNote = document.getElementById(parentID)
        thisNote.className = 'active note'
        setTimeout(() => {thisNote.className ='inactive note'}, 250)
    } else {
        return
    }
}

function mapNotes(notes){
    return (
        notes.map((note, idx) =>
        <div id={'pattern_' + idx} onClick={handlePlayThis} key={'pattern_' + idx} draggable onDragStart = {dragStartHandler} onDrag = {dragHandler} onDragOver = {dragOverHandler} onDragLeave={dragLeaveHandler} onDrop = {dropHandler}  className='inactive note' style={{display: 'flex', flexDirection: 'row', height: '50px', width: '50px', backgroundColor: 'wheat', margin: '1px'}}>
                        {note}
                        {(edit === 'on' && noteOptions !== 'delete') && <div style={{display: 'flex', flexDirection: (noteOptions === 'insert') ? 'row' : 'column'}}>
                        <Icon id={'clickup_' + idx} onClick={handleClickUp} name={(noteOptions === 'insert') ? "caret square left" : "caret square up"}/><Icon onClick={handleClickDown} id={'clickdown_' + idx} name={(noteOptions === 'insert') ? "caret square right" : "caret square down"}/>
                        </div>}
                        {(edit === 'on' && noteOptions === 'delete') &&<Icon id={'delete_' + idx} onClick={handleDeleteNote} name= 'trash alternate outline' />}
                    </div>
        )
    )
}


const reverseMelody = () => {
    var returnArr = [];
    for (var i = notes.length -1; i > -1; i--){
        returnArr.push(notes[i])
    }
    setNotes(returnArr);
}

const invertMelodyChromatically = () =>{
    var midiNotes = [];
    var noteDistances = [0];
    var invertedNoteDistances = []
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

const invertMelodyScalar = () => {
    var allIndices = [];
    var noteDistances = [];
    var invertedNoteDistances = [];
    var finalNotes = [];

    for (var k = 0; k < notes.length; k++){
        allIndices.push(allScaleNotes.indexOf(notes[k]))
    }

    for (var l = 0; l < allIndices.length; l++){
        noteDistances.push(allIndices[l] - allIndices[0])
    }

    invertedNoteDistances = noteDistances.map(function(e){ if( e === 0){return e} else {return e * -1}})
    var refIndex = allIndices[0]
 
    for (var m = 0; m < invertedNoteDistances.length; m++){
            var finalNote = allScaleNotes[invertedNoteDistances[m] + refIndex]
            finalNotes.push((finalNote))
    }

    setNotes(finalNotes)
}

const shuffleNotes = () => {
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

    var root = scaleNotes[0] + 3
    
    var chromaticNotes = Scale.get('c chromatic').notes
    var allNotes = [];
    var allChromaticNotes = [];
    var patternExport = [];
    for (var i = 0; i < 10; i++){
        for (var j = 0; j < scaleNotes.length; j++){
            allNotes.push(scaleNotes[j] + i)
        }
    }

    for (var m = 0; m < 10; m++){
        for (var n = 0; n < chromaticNotes.length; n++){
            allChromaticNotes.push(chromaticNotes[n] + m)
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

function patternAndScaleToNotes(){
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
// function romanNumeralAssigner(chord, key){
// var chordRoot = chordParser(chord)[0];
// var chordType = chordParser(chord)[1];

// var root = key.split(" ")[0];
// var scale = Scale.get(root + ' chromatic').notes
// var romanNumeralsMajor = [
//         'I',
//         'bII',
//         'II',
//         'bIII',
//         'III',
//         'IV',
//         'bV',
//         'V',
//         'bVI',
//         'VI',
//         'bVII',
//         'VII'
//     ]

// var romanNumeralsMinor = [
//     'i',
//     'bii',
//     'ii',
//     'biii',
//     'iii',
//     'iv',
//     'bv',
//     'v',
//     'bvi',
//     'vi',
//     'bvii',
//     'vii'
//     ]
//     var chordIndex;
//     if (scale.indexOf(chordRoot) === -1){
//         chordIndex = scale.indexOf(Note.enharmonic(chordRoot))
//     } else {
//         chordIndex = scale.indexOf(chordRoot)
//     }
//     if (chordType === 'major'){
//         return romanNumeralsMajor[chordIndex] + chordType;
//     } else {
//         return romanNumeralsMinor[chordIndex] + chordType;
//     }
// }

// function defaultScaleAssigner(chord, key){
// var keyRoot = chordParser(key)[0]
// var keyType = chordParser(key)[1]

// var allNotes = Scale.get( keyRoot + ' chromatic').notes

// var chordDegreeAndTypeToScale = [
//     {major: 'ionian', minor: 'aeolian', dominant: 'mixolydian'},
//     {major: 'lydian #2 #6', minor: 'dorian', dominant: 'mixolydian b6'},
//     {major: 'lydian', minor: 'dorian', dominant: 'mixolydian'},
//     {major: 'lydian', minor: 'dorian', dominant: 'mixolydian b6'},
//     {major: 'double harmonic', minor: 'phrygian', dominant: 'phrygian dominant'},
//     {major: 'lydian', minor: 'melodic minor', dominant: 'mixolydian#11'},
//     {major: 'lydian', minor: 'dorian', dominant: 'altered'},
//     {major: 'mixolydian', minor: 'dorian', dominant: 'mixolydian'},
//     {major: 'lydian', minor: 'dorian', dominant: 'mixolydian b6'},
//     {major: 'lydian', minor: 'aeolian', dominant: 'mixolydian b6'},
//     {major: 'lydian', minor: 'dorian', dominant: 'mixolydian b6'},
//     {major: 'lydian', minor: 'dorian', dominant: 'mixolydian b6'},
// ]

// var majorToMinorIndex = [
//     9,
//     10,
//     11,
//     0,
//     1,
//     2,
//     3,
//     4,
//     5,
//     6,
//     7,
//     8
// ]

// var chordRoot = chordParser(chord)[0];
// var chordType = chordParser(chord)[1];

// var chordIndex;
// if (allNotes.indexOf(chordRoot) === -1){
//     chordIndex = allNotes.indexOf(Note.enharmonic(chordRoot))
// } else {
//     chordIndex = allNotes.indexOf(chordRoot)
// }

// if (keyType === 'minor'){
//     console.log(chordRoot + " " + chordDegreeAndTypeToScale[majorToMinorIndex[chordIndex]][chordType]) 
// } else {
//     console.log(chordRoot + " " + chordDegreeAndTypeToScale[chordIndex][chordType]) 
// }
// }
//====
// function handleExport(){
//     const user = JSON.parse(localStorage.getItem('userInfo'))
//     const patternDataPrototype = {
//         name: name,
//         patternName: name,
//         desc: '',
//         type: 'normal',
//         length: notes.length,
//         dataType: 'pattern',
//         pattern: pattern,
//         position: [],
//         author: user['name'],
//         authorId: user['_id'],
//         pool: exportPool,
//     }
//     dispatch(insertData(patternDataPrototype))
// }

const exportObj = {
        name: name,
        patternName: name,
        desc: '',
        type: 'normal',
        length: notes.length,
        dataType: 'pattern',
        pattern: pattern,
        position: [],
        author: user?.['name'],
        authorId: user?.['_id'],
        pool: exportPool,
}

const handleEditOptions = () => {
    setManipulate(false)
    if (edit === 'off'){
        setEdit('on')
    } else {
        setEdit('off')
    } 
}

const handleManipulateOptions = () => {
    setEdit('off')
    setManipulate(!manipulate)
}

const exportDropdownOptions = [
    { key: 'global', text: 'global', value: 'global'},
    { key: 'local', text: 'local', value: 'local'},
]

const handleExportDropdown = (e, {value}) => {
    const user = JSON.parse(localStorage.getItem('userInfo'))
    if (value === 'local'){
        const user = JSON.parse(localStorage.getItem('userInfo'))
        setExportPool(user['_id'])
    } else {
        setExportPool(value)
    }
  }

  const handleDescriptionChange = e => {
    setDescription(e.target.value)
  }

  function handleSharpsOrFlats(){
      if (options === 'sharps'){
        setChromaticNotes(['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'])
          setOptions('flats')
          let patternClone = JSON.parse(JSON.stringify(notes))
              for (let j = 0; j < patternClone.length; j++){
                  if (Note.accidentals(patternClone[j]) === '#'){
                      let x = Note.enharmonic(patternClone[j])
                      patternClone[j] = x
                  }
              }
          setNotes(patternClone)
      }
      if (options === 'flats'){
        setChromaticNotes(['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'])
          setOptions('sharps')
          let patternClone = JSON.parse(JSON.stringify(notes))
          for (let j = 0; j < patternClone.length; j++){
              if (Note.accidentals(patternClone[j]) === 'b'){
                  let x = Note.enharmonic(patternClone[j])
                  patternClone[j] = x
              }
          }
        setNotes(patternClone)
      }
  }

    return (
        <>
        <Menu>
        <Menu.Item onClick={() => handleSharpsOrFlats()}>{options === 'sharps' ? '#' : 'b'}</Menu.Item>
         <Menu.Item onClick={() => playAll()}><Icon name='play'/></Menu.Item>
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
                <Dropdown.Item>Scale Up</Dropdown.Item>
                <Dropdown.Item>Scale Down</Dropdown.Item>
                <Dropdown.Item>Arpeggio Up</Dropdown.Item>
                <Dropdown.Item>Arpeggio Down</Dropdown.Item>
            </Dropdown.Menu> 
        </Dropdown> 
        </Button.Group> 
         <Menu.Item onClick={handleEditOptions}> Edit</Menu.Item>       
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
        <Menu.Item onClick={() => setShowDescription(!showDescription)}> Desc </Menu.Item>
        <Button.Group>
        {/* <Button basic disabled={localStorage.getItem('userInfo') === null} onClick={()=> handleExport()}>Export</Button>
        <Dropdown
          simple
          item
          disabled={localStorage.getItem('userInfo') === null}
          className='button icon'
          options={exportDropdownOptions}
          onChange={handleExportDropdown}
          trigger={<></>}
        /> */}
        <ExportModal
        dataType={'Pattern'}
        exportObj={exportObj}/>
        </Button.Group>
        </Menu>
        {(edit === 'on' && !manipulate) && 
        <Button.Group>
            <Button  compact basic active={noteOptions === 'octave'} onClick ={() => setNoteOptions('octave')}>Octave</Button>
            <Button compact basic active={noteOptions === 'scale'} onClick ={() => setNoteOptions('scale')}> Scale</Button>
            <Button  compact basic active={noteOptions === 'chromatic'} onClick ={() => setNoteOptions('chromatic')}>Chromatic</Button>
            <Button  compact basic active={noteOptions === 'insert'} onClick ={() => setNoteOptions('insert')}>Insert</Button>
            <Button  compact basic active={noteOptions === 'delete'} onClick ={() => setNoteOptions('delete')}>Delete</Button>
            <Button compact basic onClick={() => handleRemoveNoteFromEnd()}>Note-- </Button>
            <Button compact basic onClick={() => handleAddNoteToEnd()}>Note++ </Button>
            {noteOptions === 'delete' && <Button  compact basic onClick ={handleDeleteAll}>Delete All</Button>}
            {noteOptions !== 'delete' && noteOptions !== 'insert' && <Button  compact basic onClick ={() => handleEditAllUp('up')}>All Up</Button>}
            {noteOptions !== 'delete' && noteOptions !== 'insert' && <Button  compact basic onClick ={() => handleEditAllDown('down')}>All Down</Button>}
            <Button  compact basic onClick ={() => setManipulate(!manipulate)}>Advanced</Button>

        </Button.Group>
        }
        {manipulate &&
        <Button.Group>
            <Button  compact basic onClick ={shuffleNotes}>Shuffle</Button>
            <Button  compact basic onClick ={reverseMelody}>Reverse Melody</Button>
            <Button  compact basic onClick ={invertMelodyChromatically}>Invert Melody</Button>
            <Button  compact basic onClick ={() => patternAndScaleToNotes()}>Fit Pattern To Scale</Button>
            <Button  compact basic  active onClick ={() => setManipulate(!manipulate)}>Advanced</Button>
        </Button.Group>
        }
  
        { notesTruePatternFalse && <div id='display' style={{display: 'flex', flexDirection: 'row'}}>
            {mapNotes(notes)}
        </div>}
        {!notesTruePatternFalse && <div id='display' style={{display: 'flex', flexDirection: 'row'}}>
            {mapNotes(pattern)}
        </div>}
        <div>{notes.length} {notes.length > 1 ? 'notes' : 'note'}</div>
        <div>
            <div draggable onClick={() => setInputFocus(!inputFocus)} onDragStart={dragStartHandlerSpecial} style={{height: '25px', width: '125px', backgroundColor: 'lightblue', display: !inputFocus ? '': 'none' }}>{name}</div>
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
