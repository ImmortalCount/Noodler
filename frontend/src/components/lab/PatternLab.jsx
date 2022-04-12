
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
import { scaleHandler } from './utils';
import { keyMap } from './keymap';
import { setPlayImport } from '../../store/actions/playImportActions';
import ExportModal from '../modal/ExportModal';


export default function PatternLab({importedPatternData}) {

const [notes, setNotes] = useState([['A2'], ['B2'], ['C3'], ['D3'], ['E3'], ['F3'], ['G3'], ['A3']])
const [pattern, setPattern] = useState(['0 1 2 4 7 4 2 1'])
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
const [positionLock, setPositionLock] = useState(false)
const [startOnScaleDegree, setStartOnScaleDegree] = useState(true)
const [generateScaleDegree, setGenerateScaleDegree] = useState(1)
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

    function patternAndScaleToNotes2(patternArr){
        console.log('running PatternAndScaleToNotes2 69')
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
}, [notes, patternType])

// useEffect(() => {
//     // patternAndScaleToNotes()
// }, [scaleNotes])

useEffect(() => {
        let newInfo = {...labInfo}
        const patternDataPrototype = {
            name: name,
            patternName: name,
            desc: '',
            type: patternType,
            length: notes.length,
            pattern: patternType === 'fixed' ? notes : pattern,
            position: [],
            author: '',
            authorId: '',
            dataType: 'pattern',
            pool: '',
        }
        console.log(patternDataPrototype['pattern'], 'dataPrototype')
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
        pattern: patternType === 'fixed'? notes : pattern,
        position: [],
        type: patternType,
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
                let playNote = (obj.note + (Number(obj.octave) + Number(octave)));
                keySynth.triggerAttackRelease(playNote, "8n", now);
                document.removeEventListener('keydown', keydownEvent);
                newNotes.push([playNote])
                setNotes(newNotes)
                }
            } else if (obj !== undefined){
                const now = Tone.now();
                let playNote = (obj.note + (Number(obj.octave) + Number(octave)));
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

function playAll(){
    if (isMuted){
        return
    }
    if (instrumentDisplay === -500){
    Tone.start()
    Tone.Transport.cancel()
    Tone.Transport.stop()
    Tone.Transport.start();
    const convertedChords = chordSequenceToNoteString(notes)
    var count = 0;
    const synthPart = new Tone.Sequence(
        function(time, note) {
          polySynth.triggerAttackRelease(noteStringHandler(note), "10hz", time)
          var highlightedChord = document.getElementById('chord_' + count)
            highlightedChord.className = 'active chord'
            setTimeout(() => {highlightedChord.className = 'inactive chord'}, 500)
            count++
        },
       convertedChords,
        "8n"
      );
      synthPart.start();
      synthPart.loop = 1;
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
                if ((i > 1 && i % 2 === 0) || (i === notes.length - 1)){
                noteArr.push(tempArr)
                tempArr = []
            }
                tempArr.push(strChord)
        }

        let returnObj = {
            displayOnly: false,
            highlight: 1,
            data: [{speed: 1, notes: noteArr}]
        }

        console.log(noteArr, 'noteArr chord lab')
        Tone.start()
        Tone.Transport.cancel()
        dispatch(setPlayImport([returnObj]))
        Tone.Transport.start()

        setTimeout(() => setInstrumentDisplay(-2), 1900)
        setTimeout(() => setInstrumentDisplay(1), 2000)
        setTimeout(() => Tone.Transport.stop(), 2000);
    }
    
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
    
setNotes(returnArr);
}

const handleClickUp = (e) => {
    var clone = [...notes]
    var positionId = e.target.parentNode.parentNode.id;
    var x = positionId.split('_')[1]
    var y = positionId.split('_')[2]
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
    setNotes(clone)
    }
    if (noteOptions === 'octave'){
    var note = Note.pitchClass(notes[x][y])
    var octave = Note.octave(notes[x][y])
    clone[x][y] = note + (octave + 1)
    setNotes(clone)
    }
    if (noteOptions === 'chromatic'){
    let chromaIndex = allChromaticNotes.indexOf(notes[x][y])
    if (allChromaticNotes.indexOf(notes[x][y]) === -1){
        chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(notes[x][y]))
    }
    clone[x][y] = allChromaticNotes[chromaIndex + 1];
    setNotes(clone)
    }
    if (noteOptions === 'insert'){
        clone[x].splice(y + 1, 0, notes[x][y]);
        setNotes(clone)
        }
}

const handleClickDown = (e) => {
    var clone = [...notes]
    var positionId = e.target.parentNode.parentNode.id;
    var x = positionId.split('_')[1]
    var y = positionId.split('_')[2]
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
    setNotes(clone)
    }
    if (noteOptions === 'octave'){
    var note = Note.pitchClass(notes[x][y])
    var octave = Note.octave(notes[x][y])
    clone[x][y] = note + (octave - 1)
    setNotes(clone)
    }
    if (noteOptions === 'chromatic'){
    var chromaIndex = allChromaticNotes.indexOf(notes[x][y])
    if (allChromaticNotes.indexOf(notes[x][y]) === -1){
        chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(notes[x][y]))
    }
    clone[x][y] = allChromaticNotes[chromaIndex - 1];
    setNotes(clone)
    }
    if (noteOptions === 'insert'){
    clone[x].splice(y, 0, notes[x][y]);
    setNotes(clone)
    }
}

const handleDeleteNote = (e) => {
    var clone = [...notes]
    var positionId = e.target.parentNode.id;
    var x = positionId.split('_')[1]
    var y = positionId.split('_')[2]

    clone[x].splice(y, 1)
    setNotes(clone)
}

const handleClickUpAll = () =>{
    var clone = [...notes]
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
    setNotes(clone)
    }
    if (noteOptions === 'octave'){
        for (let x = 0; x < notes.length; x++){
            for (let y = 0; y < notes[x].length; y++){
                var note = Note.pitchClass(notes[x][y])
                var octave = Note.octave(notes[x][y])
                clone[x][y] = note + (octave + 1)
            }
            setNotes(clone)
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
        setNotes(clone)
        }
    }
    if (noteOptions === 'insert'){
        return
    }
}

const handleClickDownAll = () =>{
    var clone = [...notes]
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

    setNotes(clone)
    }
    if (noteOptions === 'octave'){
        for (let x = 0; x < notes.length; x++){
            for (let y = 0; y < notes[x].length; y++){
                const note = Note.pitchClass(notes[x][y])
                const octave = Note.octave(notes[x][y])
                clone[x][y] = note + (octave - 1)
            }
            setNotes(clone)
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
        setNotes(clone)
        }
        }
    if (noteOptions === 'insert'){
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
        clone.push(['C3'])
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
        polySynth.triggerAttackRelease(notes[x], '8n');
    } else if (parentID.split('_').length === 3) {
        const x = parentID.split('_')[1]
        const y = parentID.split('_')[2]
        polySynth.triggerAttackRelease(notes[x][y], '8n')
    } else {
        return
    }
    var thisChord = document.getElementById(parentID)
    thisChord.className = 'active chord'
    setTimeout(() => {thisChord.className ='inactive chord'}, 250)
}

var handleClickUpChord = (e) =>{
    var clone = [...notes]
    var parentID = e.currentTarget.parentNode.parentNode.parentNode.id;
    var x = parentID.split('_')[1]


    if (noteOptions === 'scaler'){
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
    setNotes(clone)
    }
    if (noteOptions === 'octave'){
        for (var y = 0; y < notes[x].length; y++){
            var note = Note.pitchClass(notes[x][y])
            var octave = Note.octave(notes[x][y])
            clone[x][y] = note + (octave + 1)
        }
        setNotes(clone)
        }
    if (noteOptions === 'chromatic'){
        for (var y = 0; y < notes[x].length; y++){
            var chromaIndex = allChromaticNotes.indexOf(notes[x][y])
            if (allChromaticNotes.indexOf(notes[x][y]) === -1){
                chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(notes[x][y]))
            }
    clone[x][y] = allChromaticNotes[chromaIndex + 1];
        }
    setNotes(clone)
    }
    if (noteOptions === 'insert'){
        var newChord = [...clone[x]]
        clone.splice(x, 0, newChord);
        setNotes(clone)
    }
}

var handleClickDownChord = (e) =>{
    var clone = [...notes]
    var parentID = e.currentTarget.parentNode.parentNode.parentNode.id;
    var x = parentID.split('_')[1]

    if (noteOptions === 'scaler'){
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
    setNotes(clone)
    }
    if (noteOptions === 'octave'){
        for (var y = 0; y < notes[x].length; y++){
            var note = Note.pitchClass(notes[x][y])
            var octave = Note.octave(notes[x][y])
            clone[x][y] = note + (octave - 1)
        }
        setNotes(clone)
        }
    if (noteOptions === 'chromatic'){
        for (var y = 0; y < notes[x].length; y++){
            var chromaIndex = allChromaticNotes.indexOf(notes[x][y])
            if (allChromaticNotes.indexOf(notes[x][y]) === -1){
                chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(notes[x][y]))
            }
    clone[x][y] = allChromaticNotes[chromaIndex - 1];
        }
    setNotes(clone)
    }
    if (noteOptions === 'insert'){
        var newChord = [...clone[x]]
        clone.splice(x, 0, newChord);
        setNotes(clone)
    }
}



const handleDeleteChord = (e) => {
    var clone = [...notes]
    var parentID = e.currentTarget.parentNode.parentNode.id;
    var x = parentID.split('_')[1]
    clone.splice(x, 1)
    setNotes(clone);
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
                <div id={'chord_' + i + '_' + j} style={{display: 'flex', flexDirection: 'row', height: '50px', width: '50px', backgroundColor: 'wheat', margin: '1px'}}>
                    {notes[i][j]}
                    {(edit && noteOptions !== 'delete') && <div style={{display: 'flex', flexDirection: 'column'}}>
                    <Icon onClick={handleClickUp} name={(noteOptions === 'insert') ? "plus" : "caret square up" }/><Icon onClick={handleClickDown} name={(noteOptions === 'insert') ? "" : "caret square up" }/>
                    </div>}
                    {(edit && noteOptions === 'delete') &&<Icon onClick={handleDeleteNote} name= 'trash alternate outline' />}
                </div>
            )
        }

        returnArr.push(
            <div  id={'chord_' + i} onClick={handlePlayThis} draggable onDragStart = {dragStartHandler} onDrag = {dragHandler} onDragOver = {dragOverHandler} onDragLeave={dragLeaveHandler} onDrop = {dropHandler}className='inactive chord' style={{display: 'flex', flexDirection: 'column-reverse', margin: '1px', marginBottom: '5px'}}>
            <div onClick={(e) => (handlePlayThis(e, true))} style={{display: 'flex', flexDirection: 'row', marginBottom: '18px'}}>
            { (edit && noteOptions !== 'delete') && <div  style={{display: 'flex', flexDirection: (noteOptions === 'insert') ? 'row' : 'column'}}>
            <Icon onClick={handleClickUpChord} name= {(noteOptions === 'insert') ? "plus" : "caret square up" }/><Icon onClick={handleClickDownChord}name= {(noteOptions === 'insert') ? "" : "caret square down" }/>
            </div>}
            {(edit && noteOptions === 'delete') && <Icon onClick={handleDeleteChord} name= 'trash alternate outline' /> }
            </div>
            {returnChord} 
            </div>
        )
    }
    return returnArr;
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
        type: 'fluid',
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
    setEdit(!edit)
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
                  for (let k = 0; k < patternClone[j].length; k++){
                    if (Note.accidentals(patternClone[j][k]) === '#'){
                        let x = Note.enharmonic(patternClone[j][k])
                        patternClone[j] = x
                    }
                  }
              }
          setNotes(patternClone)
      }
      if (options === 'flats'){
        setChromaticNotes(['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'])
          setOptions('sharps')
          let patternClone = JSON.parse(JSON.stringify(notes))
              for (let j = 0; j < patternClone.length; j++){
                  for (let k = 0; k < patternClone[j].length; k++){
                    if (Note.accidentals(patternClone[j][k]) === 'b'){
                        let x = Note.enharmonic(patternClone[j][k])
                        patternClone[j] = x
                    }
                  }
              }
          setNotes(patternClone)
      }
  }

  const importChordsFromChordLab = () => {
      if (labData?.labInfo?.chordLab?.chords){
        setNotes(labData['labInfo']['chordLab']['chords'])
      } else {
          setNotes([['C3', 'E3', 'G3']])
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
         <Menu.Item onClick={() => console.log(allScaleNotes, ' notes test', Note.sortedNames(allScaleNotes), 'sorted notes test')}> Test</Menu.Item>   
         <Menu.Item onClick={handleEditOptions}> Edit</Menu.Item>       
         <Menu.Item onClick={() => setPatternType('fluid')}> Fluid</Menu.Item> 
         <Menu.Item onClick={() => setPatternType('fixed')}> Fixed <Icon name='anchor'/></Menu.Item>       
         <Menu.Item onClick={() => setPatternType('floating')}> Floating <Icon name='fly'/></Menu.Item>       
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
        <Menu.Item onClick={importChordsFromChordLab}> Import </Menu.Item>
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
        {(edit && !manipulate) && 
        <Button.Group>
            <Button  compact basic active={noteOptions === 'octave'} onClick ={() => setNoteOptions('octave')}>Octave</Button>
            <Button compact basic active={noteOptions === 'scale'} onClick ={() => setNoteOptions('scale')}> Scale</Button>
            <Button  compact basic active={noteOptions === 'chromatic'} onClick ={() => setNoteOptions('chromatic')}>Chromatic</Button>
            <Button  compact basic active={noteOptions === 'insert'} onClick ={() => setNoteOptions('insert')}>Insert</Button>
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
            <div draggable onClick={() => setInputFocus(!inputFocus)} onDragStart={dragStartHandlerSpecial} style={{height: '25px', width: '125px', backgroundColor: 'wheat', display: !inputFocus ? '': 'none' }}>{name}</div>
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
