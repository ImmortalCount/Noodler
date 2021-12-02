import {React, useState, useEffect, useRef} from 'react'
import * as Tone from 'tone';
import { Menu, Button, Input } from 'semantic-ui-react';
import instrumentSamples from '../Instruments/Instruments.js'
import './rhythmlab.css'



export default function RhythmLab({importedRhythmData}) {
    const drumKit = new Tone.Sampler(instrumentSamples.drumkit_jazz).toDestination()
    var initialNotes = [['O'], ['O'], ['O'], ['O']]
    var testPattern = ['A4', 'B4', 'C4', 'D4', 'E4', 'F4', 'G4', 'A5', 'B5', 'C5', 'D5', 'E5', 'F5']
    var [melodyNotes, setMelodyNotes] = useState(['A4', 'B4', 'C4', 'D4', 'A5', 'B4', 'G4'])
    var [name, setName] = useState('Rhythm 1')
    var [notes, setNotes] = useState(initialNotes)
    var [playNoteOrderByID, setPlayNoteOrderByID] = useState([])
    var [mappedNotes, setMappedNotes] = useState([])
    var [metronomeNotes, setMetronomeNotes] = useState([['Db4'], ['Db4'], ['Db4'], ['Db4']])
    var [playConstant, setPlayConstant] = useState(1)
    var [loop, setLoop] = useState(false);
    Tone.Transport.bpm.value = 120
    var [moduleLengthDisplay, setModuleLengthDisplay] = useState(notes.length);
//------Returns an array of objects in order of when they are going to be played, as well as their className by Level and their ID (idx)
useEffect(() => {
    setMappedNotes(mapNotes(notes))
    setMetronomeNotes(setModuleLengthDisplay(notes.length))
    generateMetronomeNotes()
}, [notes])

useEffect(() => {
    generateMetronomeNotes()
}, [moduleLengthDisplay])

useEffect(() => {
    if (importedRhythmData['rhythm'] !== undefined){
        setNotes(importedRhythmData['rhythm'])
        setName(importedRhythmData['rhythmName'])
    }
    
}, [importedRhythmData])

function loopOn(){
    Tone.Transport.loopStart = 0;
    Tone.Transport.loopEnd = 2;

    // console.log(Tone.Transport.loopEnd)
    if (Tone.Transport.loop !== true){
        Tone.Transport.loop = true;
        setLoop(true)
    } else {
        Tone.Transport.loop = false;
        setLoop(false)
    }
    
    
}

function generateMetronomeNotes(){
    var returnArr = [];
    for (var i = 0; i < moduleLengthDisplay; i++){
        returnArr.push(['Db4'])
    }
    setMetronomeNotes(returnArr)
}
var controls = useRef('Add')
const [activeButton, setActiveButton] = useState('Add')

function handleControls(type){
    controls.current = type;
    setActiveButton(type);
}

function getAllParentElementsByID(id){
    var a = document.getElementById(id)
    var els = [];
    while (a){
        els.unshift(a);
        a = a.parentNode
    }
    var classIDs = [];
    for (var i = 0; i < els.length; i++){
        if (els[i].id !== undefined && els[i].id.length !== 0 && els[i].id !== 'root'){
            classIDs.push(els[i])
        }
    }
    return classIDs;
}

function getAllChildElementsById(id){
    var a = document.getElementById(id)
    var els = []
    function innerGetAllChildElementsById(node){
        for (var i = 0; i < node.children.length; i++){
            els.push(node.children[i].id)
            if (node.childNodes[i].hasChildNodes()){
                innerGetAllChildElementsById(node.children[i])
            }
        }
    }
    innerGetAllChildElementsById(a)
    return els;
}


function getPositionInNestedArrayByID(id, notes){
        var ex = id.split('_')
        var returnArr = []
        for (var i = 2; i < ex.length; i++){
          returnArr.push(ex[i])
        } 
        if (returnArr.length === 1){
            return JSON.stringify(notes[returnArr[0]])
        } else if (returnArr.length === 2){
            return JSON.stringify(notes[returnArr[0]][returnArr[1]])
        } else if (returnArr.length === 3){
            return JSON.stringify(notes[returnArr[0]][returnArr[1]][returnArr[2]])
        } else if (returnArr.length === 4){
            return JSON.stringify(notes[returnArr[0]][returnArr[1]][returnArr[2]][returnArr[3]])
        } else if (returnArr.length === 5){
            return JSON.stringify(notes[returnArr[0]][returnArr[1]][returnArr[2]][returnArr[3]][returnArr[4]])
        } else {
            return undefined;
        }
        
    }

//---Interactive Functionality
function changePositionsUsingIDs(startingID, endingID, notes){
    
    var xfer;
    var clone = [...notes]
    var dataDeleteInsert = true;
    var childrenIDs = getAllChildElementsById(startingID)
    var ex1 = startingID.split('_')
        var startingIDCoordinates = []
        for (var i = 2; i < ex1.length; i++){
          startingIDCoordinates.push(Number(ex1[i]))
        }
    var ex2 = endingID.split('_')
        var endingIDCoordinates = []
        for (var j = 2; j < ex2.length; j++){
          endingIDCoordinates.push(Number(ex2[j]))
        }
    if (childrenIDs.includes(endingID)){
        return
    }
    if ((startingIDCoordinates.length  === 1) && (endingIDCoordinates.length) > 1){
        return
    }

    if ((startingIDCoordinates.length > 1) && (endingIDCoordinates.length === 1)){
        return
    }

    //if they are on the same island and the first coordinate is to the left of the original one
    if (startingIDCoordinates[0] === endingIDCoordinates[0]){
        if (endingIDCoordinates[1] > startingIDCoordinates[1]){
            //then delete the starting coordinates AFTER inserting
            dataDeleteInsert = false;
        }
    }
        
        //------
        //Get Data
        if (startingIDCoordinates.length === 1){
            xfer = clone[startingIDCoordinates[0]]
        } else if (startingIDCoordinates.length === 2){
            xfer = clone[startingIDCoordinates[0]][startingIDCoordinates[1]]
        } else if (startingIDCoordinates.length === 3){
            xfer= clone[startingIDCoordinates[0]][startingIDCoordinates[1]][startingIDCoordinates[2]]
        } else if (startingIDCoordinates.length === 4){
            xfer= clone[startingIDCoordinates[0]][startingIDCoordinates[1]][startingIDCoordinates[2]][startingIDCoordinates[3]]
        } else if (startingIDCoordinates.length === 5){
            xfer= clone[startingIDCoordinates[0]][startingIDCoordinates[1]][startingIDCoordinates[2]][startingIDCoordinates[3]][startingIDCoordinates[4]]
        } else {
            return
        }

         //---Delete Original
         if (dataDeleteInsert === true){
            if (startingIDCoordinates.length === 1){
                clone.splice(startingIDCoordinates[0], 1)
            } else if (startingIDCoordinates.length === 2){
                 clone[startingIDCoordinates[0]].splice(startingIDCoordinates[1], 1)
            } else if (startingIDCoordinates.length === 3){
                 clone[startingIDCoordinates[0]][startingIDCoordinates[1]].splice([startingIDCoordinates[2]], 1)
            } else if (startingIDCoordinates.length === 4){
                 clone[startingIDCoordinates[0]][startingIDCoordinates[1]][startingIDCoordinates[2]].splice([startingIDCoordinates[3]], 1)
            } else if (startingIDCoordinates.length === 5){
                clone[startingIDCoordinates[0]][startingIDCoordinates[1]][startingIDCoordinates[2]][startingIDCoordinates[3]].splice([startingIDCoordinates[4]], 1)
            } else {
                return
            }
         }
         
        //-------
        //Insert Data
        if (endingIDCoordinates.length === 1){
            if (clone[endingIDCoordinates[0]] === undefined){
                return
            } else {
                clone.splice(endingIDCoordinates[0], 0, xfer)
            }
        } else if (endingIDCoordinates.length === 2){
            if (clone[endingIDCoordinates[0]][endingIDCoordinates[1]] === undefined){
                return
            } else {
                clone[endingIDCoordinates[0]].splice(endingIDCoordinates[1], 0, xfer) 
            }
        } else if (endingIDCoordinates.length === 3){
            if (clone[endingIDCoordinates[0]][endingIDCoordinates[1]][endingIDCoordinates[2]] === undefined){
                return
            } else {
                clone[endingIDCoordinates[0]][endingIDCoordinates[1]].splice(endingIDCoordinates[2], 0, xfer)
            }
        } else if (endingIDCoordinates.length === 4){
            if (clone[endingIDCoordinates[0]][endingIDCoordinates[1]][endingIDCoordinates[2]][endingIDCoordinates[3]] === undefined){
                return
            } else {
                console.log(clone[endingIDCoordinates[0]][endingIDCoordinates[1]][endingIDCoordinates[2]][endingIDCoordinates[3]])
                clone[endingIDCoordinates[0]][endingIDCoordinates[1]][endingIDCoordinates[2]].splice([endingIDCoordinates[3]], 0, xfer)
            }
        } else if (endingIDCoordinates.length === 5){
            if (clone[endingIDCoordinates[0]][endingIDCoordinates[1]][endingIDCoordinates[2]][endingIDCoordinates[3]][endingIDCoordinates[4]] === undefined){
                return
            } else {
                clone[endingIDCoordinates[0]][endingIDCoordinates[1]][endingIDCoordinates[2]][endingIDCoordinates[3]].splice([endingIDCoordinates[4]], 0, xfer)
            }
        } else {
            return
        }

        if (dataDeleteInsert === false){
            if (startingIDCoordinates.length === 1){
                clone.splice(startingIDCoordinates[0], 1)
            } else if (startingIDCoordinates.length === 2){
                 clone[startingIDCoordinates[0]].splice(startingIDCoordinates[1], 1)
            } else if (startingIDCoordinates.length === 3){
                 clone[startingIDCoordinates[0]][startingIDCoordinates[1]].splice([startingIDCoordinates[2]], 1)
            } else if (startingIDCoordinates.length === 4){
                 clone[startingIDCoordinates[0]][startingIDCoordinates[1]][startingIDCoordinates[2]].splice([startingIDCoordinates[3]], 1)
            } else if (startingIDCoordinates.length === 5){
                clone[startingIDCoordinates[0]][startingIDCoordinates[1]][startingIDCoordinates[2]][startingIDCoordinates[3]].splice([startingIDCoordinates[4]], 1)
            } else {
                return
            }
        }

        setNotes(clone)
        setMappedNotes(mapNotes(clone))
}

function spliceCheck(notes){
    var clone = [...notes]
    clone[1].splice(1, 1, 'X')
    setNotes(clone)
    setMappedNotes(mapNotes(clone))
}

function addNoteAtPosition(endingID, notes){
    var clone = [...notes]
    var ex1 = endingID.split('_')
        var endingIDCoordinates = []
        for (var i = 2; i < ex1.length; i++){
          endingIDCoordinates.push(Number(ex1[i]))
        }
        if (endingIDCoordinates.length === 1){
            clone.splice(endingIDCoordinates[0], 0, 'X')
        } else if (endingIDCoordinates.length === 2){
             clone[endingIDCoordinates[0]].splice(endingIDCoordinates[1], 0, 'X')
        } else if (endingIDCoordinates.length === 3){
             clone[endingIDCoordinates[0]][endingIDCoordinates[1]].splice([endingIDCoordinates[2]], 0, 'X')
        } else if (endingIDCoordinates.length === 4){
             clone[endingIDCoordinates[0]][endingIDCoordinates[1]][endingIDCoordinates[2]].splice([endingIDCoordinates[3]], 0, 'X')
        } else if (endingIDCoordinates.length === 5){
            clone[endingIDCoordinates[0]][endingIDCoordinates[1]][endingIDCoordinates[2]][endingIDCoordinates[3]].splice([endingIDCoordinates[4]], 0, 'X')
        } else {
            return
        }
    setNotes(clone)
    setMappedNotes(mapNotes(clone))
}

function removeNoteAtPosition(endingID, notes){
    var clone = [...notes]
    var ex1 = endingID.split('_')
        var endingIDCoordinates = []
        for (var i = 2; i < ex1.length; i++){
          endingIDCoordinates.push(Number(ex1[i]))
        }
        if (endingIDCoordinates.length === 1){
            clone.splice(endingIDCoordinates[0], 1)
        } else if (endingIDCoordinates.length === 2){
             clone[endingIDCoordinates[0]].splice(endingIDCoordinates[1], 1)
        } else if (endingIDCoordinates.length === 3){
             clone[endingIDCoordinates[0]][endingIDCoordinates[1]].splice([endingIDCoordinates[2]], 1)
        } else if (endingIDCoordinates.length === 4){
             clone[endingIDCoordinates[0]][endingIDCoordinates[1]][endingIDCoordinates[2]].splice([endingIDCoordinates[3]], 1)
        } else if (endingIDCoordinates.length === 5){
            clone[endingIDCoordinates[0]][endingIDCoordinates[1]][endingIDCoordinates[2]][endingIDCoordinates[3]].splice([endingIDCoordinates[4]], 1)
        } else {
            return
        }
    
    setNotes(clone)
    setMappedNotes(mapNotes(clone))
}

function replaceNoteAtPosition(endingID, value, notes){
    var clone = [...notes]
    var ex1 = endingID.split('_')
        var endingIDCoordinates = []
        for (var i = 2; i < ex1.length; i++){
          endingIDCoordinates.push(Number(ex1[i]))
        }
        if (endingIDCoordinates.length === 1){
            clone[endingIDCoordinates[0]] = value;
        } else if (endingIDCoordinates.length === 2){
            clone[endingIDCoordinates[0]][endingIDCoordinates[1]] = value
        } else if (endingIDCoordinates.length === 3){
            clone[endingIDCoordinates[0]][endingIDCoordinates[1]][endingIDCoordinates[2]] = value
        } else if (endingIDCoordinates.length === 4){
            clone[endingIDCoordinates[0]][endingIDCoordinates[1]][endingIDCoordinates[2]][endingIDCoordinates[3]] = value
        } else if (endingIDCoordinates.length === 5){
            clone[endingIDCoordinates[0]][endingIDCoordinates[1]][endingIDCoordinates[2]][endingIDCoordinates[3]][endingIDCoordinates[4]] = value
        } else {
            return
        }
    
    setNotes(clone)
    setMappedNotes(mapNotes(clone))
}

function subDivideNotesAtPosition(endingID, value, notes){
    var clone = [...notes]
    if (getAllChildElementsById(endingID).length !== 0){
        return
    }
    var ex1 = endingID.split('_')
        var endingIDCoordinates = []
        for (var i = 2; i < ex1.length; i++){
          endingIDCoordinates.push(Number(ex1[i]))
        }
        if (endingIDCoordinates.length === 1){
            clone.splice(endingIDCoordinates[0], 1, [value, value])
        } else if (endingIDCoordinates.length === 2){
             clone[endingIDCoordinates[0]].splice(endingIDCoordinates[1], 1, [value, value])
        } else if (endingIDCoordinates.length === 3){
             clone[endingIDCoordinates[0]][endingIDCoordinates[1]].splice([endingIDCoordinates[2]], 1, [value, value])
        } else if (endingIDCoordinates.length === 4){
             clone[endingIDCoordinates[0]][endingIDCoordinates[1]][endingIDCoordinates[2]].splice([endingIDCoordinates[3]], 1, [value, value])
        } else if (endingIDCoordinates.length === 5){
            clone[endingIDCoordinates[0]][endingIDCoordinates[1]][endingIDCoordinates[2]][endingIDCoordinates[3]].splice([endingIDCoordinates[4]], 1, [value, value])
        } else {
            return
        }
    setNotes(clone)
    setMappedNotes(mapNotes(clone))
}

function unDivideNotesAtPosition(endingID, notes){
    var clone = [...notes]
    if (getAllChildElementsById(endingID).length === 0){
        return
    }
    var xfer;
    var ex1 = endingID.split('_')
        var endingIDCoordinates = []
        for (var i = 2; i < ex1.length; i++){
          endingIDCoordinates.push(Number(ex1[i]))
        }
        if (endingIDCoordinates.length === 1){
            return
        } else if (endingIDCoordinates.length === 2){
            xfer = [...clone[endingIDCoordinates[0]][endingIDCoordinates[1]][0]]
             clone[endingIDCoordinates[0]].splice(endingIDCoordinates[1], 1, ...xfer)
        } else if (endingIDCoordinates.length === 3){
            xfer = [...clone[endingIDCoordinates[0]][endingIDCoordinates[1]][endingIDCoordinates[2]][0]]
             clone[endingIDCoordinates[0]][endingIDCoordinates[1]].splice([endingIDCoordinates[2]], 1, ...xfer)
        } else if (endingIDCoordinates.length === 4){
            xfer = [...clone[endingIDCoordinates[0]][endingIDCoordinates[1]][endingIDCoordinates[2]][endingIDCoordinates[3]][0]]
             clone[endingIDCoordinates[0]][endingIDCoordinates[1]][endingIDCoordinates[2]].splice([endingIDCoordinates[3]], 1, ...xfer)
        } else if (endingIDCoordinates.length === 5){
            xfer = [...clone[endingIDCoordinates[0]][endingIDCoordinates[1]][endingIDCoordinates[2]][endingIDCoordinates[3]][endingIDCoordinates[4]][0]]
            clone[endingIDCoordinates[0]][endingIDCoordinates[1]][endingIDCoordinates[2]][endingIDCoordinates[3]].splice([endingIDCoordinates[4]], 1, ...xfer)
        } else {
            return
        }
    
    setNotes(clone)
    setMappedNotes(mapNotes(clone))
}

function lengthenPattern(notes){
    var clone = [...notes]
    clone.push(['O'])
    setNotes(clone)
    setMappedNotes(mapNotes(clone))

}

function shortenPattern(){
    var clone = [...notes]
    clone.pop()
    setNotes(clone)
    setMappedNotes(mapNotes(clone))
}

function mapNotesToRhythm(rhythmNotes, patternNotes){
    var count = 0;
    var clone = [...rhythmNotes]

    function innerMapNotesToRhythm(notes){
        for (var i = 0; i < notes.length; i++){
            if (Array.isArray(notes[i]) === false){
                if (notes[i] === 'O'){
                    if (patternNotes[count] === undefined){
                        notes[i] = 'O'
                    } else {
                        notes[i] = patternNotes[count]
                        count++
                    }
                }
            } else {
                innerMapNotesToRhythm(notes[i])
            }
        }
    }
    innerMapNotesToRhythm(clone)
    setNotes(clone)
    setMappedNotes(mapNotes(clone))
}

function antiMapNotesToRhythm(rhythmNotes){
    var clone = [...rhythmNotes]

    function innerAntiMapNotesToRhythm(notes){
        for (var i = 0; i < notes.length; i++){
            if (Array.isArray(notes[i]) === false){
                if (notes[i] !== 'O' && notes[i] !== 'X'){
                    notes[i] = 'O'
                }
            } else {
                innerAntiMapNotesToRhythm(notes[i])
            }
        }
    }
    innerAntiMapNotesToRhythm(clone)
    setNotes(clone)
    setMappedNotes(mapNotes(clone))
}
//--------------------

//----------useful note flattening
function flattenNotes(notes, returnArr){
        if (returnArr === undefined){
            returnArr = [];
        }
            for (var i = 0; i < notes.length; i++){
                if (Array.isArray(notes[i]) === false){
                    returnArr.push(notes[i])
                } else {
                    flattenNotes(notes[i], returnArr);
                }
            }
        return returnArr;
    }     
//DRAG AND DROP FUNCTIONALITY
 //----------------------------------
 const dragStartHandler = e => {
    var obj = {id: e.target.id, className: e.target.className, message: 'dragside', type: 'dragside'}
    e.dataTransfer.setData('text', JSON.stringify(obj));
    
};

const dragStartHandlerSpecial = e => {
    var obj = {id: 'special', className: 'rhythmData', message: {
        rhythmName: name,
        rhythm: notes,
        length: [notes.length]
    }, type: 'foreign'}
    e.dataTransfer.setData('text', JSON.stringify(obj));
}

const dragHandler = e => {
};

const dragOverHandler = e => {
    e.currentTarget.className = 'active'
    e.preventDefault();
};

const dragLeaveHandler = e => {
    e.currentTarget.className = 'inactive'
    e.preventDefault();
}

//---------------------
const dropHandler = e => {
    // e.currentTarget.className = 'inactive'
    //--HACKY SHIT BELOW!!
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    e.preventDefault();
    const elementsToBeActivated = getAllParentElementsByID(e.target.id)
            for (var j = 0; j < elementsToBeActivated.length; j++){
                elementsToBeActivated[j].className = 'inactive'
            }
    console.log(e.target.id, 'dropped!!')
    var data = JSON.parse(e.dataTransfer.getData("text"));
    changePositionsUsingIDs(data.id, e.target.id, notes)
    e.dataTransfer.clearData();
    
}

const clickHandler = e => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    console.log(e.target.id)
    subDivideNotesAtPosition(e.target.id, e.target.innerText, notes)
    // unDivideNotesAtPosition(e.target.id, notes)
    // removeNoteAtPosition(e.target.id, notes)
    // addNoteAtPosition(e.target.id, notes)
    
    // replaceNoteAtPosition(e.target.id, 'O', notes)
}

//------------------------------------------

function mapNotes(notes){
    var returnArr = [];
    var noteOrderReturnArr = [];
    function innerMapNotes(notes){
        for (var i = 0; i < notes.length; i++){
            var level0Return = [];
            for (var j = 0; j < notes[i].length; j++){
                if (Array.isArray(notes[i][j]) === false){
                    level0Return.push(<div id={'rhythm_note_' + i + '_' + j} key={'rhythm_note_' + i + '_' + j} className='inactive rhythmNote' onClick={clickHandler} draggable onDragStart = {dragStartHandler} onDrag = {dragHandler} onDragOver = {dragOverHandler} onDragLeave={dragLeaveHandler} onDrop = {dropHandler} style={{height: '50px', width: '50px', margin: '10px' }}>{notes[i][j]}</div>)
                    noteOrderReturnArr.push('rhythm_note_' + i + '_' + j)
                }
                else {
                    var level1Return = [];
                    for (var k = 0; k < notes[i][j].length; k++){
                        if (Array.isArray(notes[i][j][k]) === false){
                            level1Return.push(<div id={'rhythm_note_' + i + '_' + j + '_' + k} key={'rhythm_note_' + i + '_' + j + '_' + k} className='inactive rhythmNote' onClick={clickHandler}  draggable onDragStart = {dragStartHandler} onDrag = {dragHandler} onDragOver= {dragOverHandler} onDragLeave={dragLeaveHandler} onDrop = {dropHandler} style={{height: '50px', width: '40px', margin: '10px' }}>{notes[i][j][k]}</div>)
                            noteOrderReturnArr.push('rhythm_note_' + i + '_' + j + '_' + k)
                        } else {
                            var level2Return = [];
                            for (var l = 0; l < notes[i][j][k].length; l++){
                                if (Array.isArray(notes[i][j][k][l]) === false){
                                    level2Return.push(<div id={'rhythm_note_' + i + '_' + j + '_' + k + '_' + l} key={'rhythm_note_' + i + '_' + j + '_' + k + '_' + l} className='inactive rhythmNote' onClick={clickHandler}  draggable onDragStart = {dragStartHandler} onDrag = {dragHandler} onDragOver = {dragOverHandler} onDragLeave={dragLeaveHandler} onDrop = {dropHandler} style={{height: '50px', width: '30px', margin: '10px' }}>{notes[i][j][k][l]}</div>)
                                    noteOrderReturnArr.push('rhythm_note_' + i + '_' + j + '_' + k + '_' + l)
                                } else {
                                    var level3Return = [];
                                    for (var m = 0; m < notes[i][j][k][l].length; m++){
                                        if (Array.isArray(notes[i][j][k][l][m]) === false){
                                            level3Return.push(<div id={'rhythm_note_' + i + '_' + j + '_' + k + '_' + l + '_' + m} key={'rhythm_note_' + i + '_' + j + '_' + k + '_' + l + '_' + m} className='inactive rhythmNote' onClick={clickHandler}  draggable onDragStart = {dragStartHandler} onDrag = {dragHandler} onDragOver = {dragOverHandler} onDragLeave={dragLeaveHandler} onDrop = {dropHandler} style={{height: '50px', width: '20px', margin: '10px' }}>{notes[i][j][k][l][m]}</div>)
                                            noteOrderReturnArr.push('rhythm_note_' + i + '_' + j + '_' + k + '_' + l + '_' + m)
                                        } else {
                                        var level4Return = [];
                                        for (var n = 0; n < notes[i][j][k][l][m].length; n++){
                                            if (Array.isArray(notes[i][j][k][l][m][n]) === false){
                                                level3Return.push(<div id={'rhythm_note_' + i + '_' + j + '_' + k + '_' + l + '_' + m + '_' + n} key={'rhythm_note_' + i + '_' + j + '_' + k + '_' + l + '_' + m + '_' + n} className='inactive rhythmNote' onClick={clickHandler}  draggable onDragStart = {dragStartHandler} onDrag = {dragHandler} onDragOver = {dragOverHandler} onDragLeave={dragLeaveHandler} onDrop = {dropHandler} style={{height: '50px', width: '15px', margin: '10px' }}>{notes[i][j][k][l][m][n]}</div>)
                                                
                                            } else {
                                                
                                                continue;
                                            }
                                        }
                                        level3Return.push(
                                            <div id={'rhythm_note_' + i + '_' + j + '_' + k + '_' + l + '_' + m} key={'rhythm_note_' + i + '_' + j + '_' + k + '_' + l + '_' + m} className='inactive rhythmNote' onClick={clickHandler}  draggable onDragStart = {dragStartHandler} onDrag = {dragHandler} onDragOver = {dragOverHandler} onDragLeave={dragLeaveHandler} onDrop = {dropHandler} style={{margin: '5px', display: 'flex', flexDirection: 'row', alignItems: 'center' , backgroundColor: 'purple'}}>{level4Return}</div>
                                        )
                                        }
                                    }
                                    level2Return.push(
                                        <div id={'rhythm_note_' + i + '_' + j + '_' + k + '_' + l} key={'rhythm_note_' + i + '_' + j + '_' + k + '_' + l} className='inactive rhythmNote' onClick={clickHandler}  draggable onDragStart = {dragStartHandler} onDrag = {dragHandler} onDragOver = {dragOverHandler} onDragLeave={dragLeaveHandler} onDrop = {dropHandler} style={{margin: '5px', display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: 'orange'}}>{level3Return}</div>
                                    )
                                }
                                
                            }
                            level1Return.push(
                                <div id={'rhythm_note_' + i + '_' + j + '_' + k} key={'rhythm_note_' + i + '_' + j + '_' + k} className='inactive rhythmNote' onClick={clickHandler}  draggable onDragStart = {dragStartHandler} onDrag = {dragHandler} onDragOver = {dragOverHandler} onDragLeave={dragLeaveHandler} onDrop = {dropHandler} style={{margin: '5px', display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: 'green'}}>{level2Return}</div>
                            )
                        } 
                    }
                    level0Return.push(
                        <div id={'rhythm_note_' + i + '_' + j} key={'rhythm_note_' + i + '_' + j} className='inactive rhythmNote' onClick={clickHandler}  draggable onDragStart = {dragStartHandler} onDrag = {dragHandler} onDragOver = {dragOverHandler} onDragLeave={dragLeaveHandler} onDrop = {dropHandler} style={{margin: '5px', display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: 'blue'}}>{level1Return}</div>
                        )
                }
            }
            returnArr.push(
                <div id={'rhythm_note_' + i} key={'rhythm_note_' + i} className='inactive rhytmNote' onClick={clickHandler}  draggable onDragStart = {dragStartHandler} onDrag = {dragHandler} onDragOver = {dragOverHandler} onDragLeave={dragLeaveHandler} onDrop = {dropHandler} style={{margin: '5px', display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: 'red' }}>{level0Return}</div>
                )
        }
        return returnArr    
    }
    setPlayNoteOrderByID(noteOrderReturnArr)
    return innerMapNotes(notes);
}

function mapMelodyNotes(melodyNotes){
    return (
        melodyNotes.map((melodyNote, idx) => 
        <div id={'pattern_' + idx} key={'pattern_' + idx} draggable='true' className='inactive' style={{marginLeft: '5px', height: '25px', width: '25px'}}>{melodyNote}</div>
        )
    )
}

//---------------------------------------------
function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
//---random rhythm generator
function randomRhythmGenerator(depth, length){

    if (depth === undefined){
        depth = 1;
    }
    if (length === undefined){
        length = 4;
    }

    var returnArr = [];
    for (var i = 0; i < length; i++){
        var level0Array = [];
        for (var j = 0; j < randomInteger(1, 4); j++){
            var rand = randomInteger(0,2)
            if (rand === 0){
                level0Array.push('X')
            }
            if (rand === 1){
                level0Array.push('O')
            }
            else {
            var level1Array = [];
                for (var k = 0; k < randomInteger(1, 4); k++){
                    var rand2 = randomInteger(0,2)
                    if (rand2 === 0){
                        level1Array.push('X')
                    }
                    if (rand2 === 1){
                        level1Array.push('O')
                    } else {
                        level1Array.push('O')
                    }
                }
                level0Array.push(level1Array)
            }
        }
        returnArr.push(level0Array)
    }
setNotes(returnArr)
}

//---SKETCHY FUNCTION ALERT
function setEverythingToInactive(){
    var elems = document.getElementsByClassName('active rhythmNote')
    for (var i = 0; i < elems.length; i++){
        elems[i].className = 'inactive rhythmNote'
    }
}

function playSynth(){
    Tone.Transport.start();
    var position = 0;
    var previouslyActivated = [];
        const synthPart = new Tone.Sequence(
          function(time, note) {
            if (note !== 'X'){
                if (note === 'O'){
                    drumKit.triggerAttackRelease('B4', "10hz", time);
                } else {
                    drumKit.triggerAttackRelease(note, "10hz", time)
                }
            }
            const elementsToBeActivated = getAllParentElementsByID(playNoteOrderByID[position])

            if (previouslyActivated.length !== 0){
                for (var i = 0; i < previouslyActivated.length; i++){
                    previouslyActivated[i].className = 'inactive rhythmNote'
                }
            }
            previouslyActivated = [];
            for (var j = 0; j < elementsToBeActivated.length; j++){
                elementsToBeActivated[j].className = 'active rhythmNote'
                previouslyActivated.push(elementsToBeActivated[j])
            }

            if (position === flattenNotes(notes).length - 1){
                position = 0;
            } else {
                position++;
            }
          },
         notes,
          (playConstant * Tone.Time('4n').toSeconds())
        );
        
        const metronome = new Tone.Sequence(
            function(time, note) {
              if (note !== 'X'){
                  drumKit.triggerAttackRelease(note, "10hz", time);
              }
            },
           metronomeNotes,
            "4n"
          );
          synthPart.start();
          synthPart.loop = 1;
          metronome.start();
          metronome.loop = 1;
}

function squishTiming(notesLength, barLength){
    const ratioConst = (barLength/notesLength)
    var num = ratioConst
    num = num.toFixed(3);
    return num
}

const handleModuleLengthChange = e => {
    setModuleLengthDisplay(e.target.value)
    Tone.Transport.bpm.value = Math.round(e.target.value);
    setPlayConstant(squishTiming(notes.length, e.target.value))
}

const onChangeModuleLength = e => {
    setModuleLengthDisplay(e.target.value)
}
    return (
        <>
        <Menu>
         <Menu.Item onClick={() => playSynth()}>Play</Menu.Item>  
         <Menu.Item onClick={() => Tone.Transport.stop()}> Stop </Menu.Item> 
         <Menu.Item onClick={() => loopOn(notes)}> Loop: {loop ? 'On' : 'Off'} </Menu.Item>   
         <Menu.Item onClick={()=> randomRhythmGenerator()}> Generate </Menu.Item>   
         <Menu.Item onClick={()=> randomRhythmGenerator()}>  Import </Menu.Item>   
         <Menu.Item onClick={()=> mapNotesToRhythm(notes, testPattern)}>  Map </Menu.Item>   
         {/* <Menu.Item onClick={()=> shortenPattern(notes)}> Shorten </Menu.Item>  
         <Menu.Item onClick={()=> lengthenPattern(notes)}> Lengthen </Menu.Item>   
         <Menu.Item> Edit </Menu.Item>   
         <Menu.Item> Options </Menu.Item>   
         <Menu.Item onClick={()=> spliceCheck(notes)}> Splice Check</Menu.Item>   
         <Menu.Item onClick={()=> mapNotesToRhythm(notes, testPattern)}> Map </Menu.Item>   
         <Menu.Item onClick={()=> antiMapNotesToRhythm(notes)}> Clean </Menu.Item>   
         <Menu.Item> Export </Menu.Item>   
         <Menu.Item> Undo </Menu.Item>   
         <Menu.Item> Redo </Menu.Item>   
         <Menu.Item onClick={() => setEverythingToInactive()}> reset View Test </Menu.Item>   
         <Menu.Item onClick={() =>console.log(notes)}> Notes </Menu.Item>   
         <Menu.Item onClick={() =>console.log(squishTiming(13, 8))}> SquishTiming </Menu.Item>   
         <Menu.Item onClick={() =>console.log(Tone.Time("4n").toSeconds()) * 5}> BPM? </Menu.Item>    */}
        </Menu>
        <Button.Group>
            <Button active ={activeButton === 'X'}compact basic onClick ={() => handleControls('X')}>X</Button>
            <Button active ={activeButton === 'O'} compact basic onClick ={() => handleControls('O')}>O</Button>
            <Button active ={activeButton === 'add'} compact basic onClick ={() =>handleControls('add')}>Add</Button>
            <Button active ={activeButton === 'add'} compact basic onClick ={() =>handleControls('replace')}>Replace</Button>
            <Button active ={activeButton === 'remove'} compact basic onClick ={() => handleControls('remove')}>Notes</Button>
            {/* <Button active ={activeButton === 'subdivide'} compact basic onClick ={() => handleControls('subdivide')}>Subdivide</Button>
            <Button active ={activeButton === 'subdivide'} compact basic onClick ={() => handleControls('2')}>2</Button>
            <Button active ={activeButton === 'subdivide'} compact basic onClick ={() => handleControls('3')}>3</Button>
            <Button active ={activeButton === 'undivide'} compact basic onClick ={() => handleControls('undivide')}>Undivide</Button>
            <Button active ={activeButton === 'lengthen'} compact basic onClick ={() => handleControls('lengthen')}>Lengthen</Button>
            <Button active ={activeButton === 'shorten'} compact basic onClick ={() => handleControls('shorten')}>Shorten</Button>
            <Button active ={activeButton === 'duplicate'} compact basic onClick ={() => handleControls('duplicate')}>Duplicate</Button> */}
        </Button.Group>
        {/* <div>
            <h3>Melody Notes</h3>
            <div style={{display: 'flex', flexDirection: 'row', width: '500px'}} >
           {mapMelodyNotes(melodyNotes)}
       </div>
            <h3>Notes</h3>
        </div> */}
        <div>Length: {moduleLengthDisplay}</div>
        <input type="range" min='1' max='16' step='1' defaultValue={moduleLengthDisplay} onMouseUp={handleModuleLengthChange} onChange={onChangeModuleLength}/>
        
       <div style={{display: 'flex', flexDirection: 'row', width: '500px'}} >
           {mappedNotes}
       </div>
       <div>
            <h3>Rhythm</h3>
            <div draggable onDragStart={dragStartHandlerSpecial} style={{height: '25px', width: '125px', backgroundColor: 'wheat'}}>{name}</div>
        </div>
        <div>
            <h3>Name</h3>
            <Input type='text'
            value={name}
            onInput={e => setName(e.target.value)}
            />
        </div>
        {/* <div>
            <h3>Pattern</h3>
            <div draggable='true' style={{height: '25px', width: '125px', backgroundColor: 'wheat'}}>Pattern</div>
        </div>
        <div>
            <h3>Name</h3>
            <Input type='text'
            value={name}
            onInput={e => setName(e.target.value)}
            />
        </div> */}
        </>
    )
}
