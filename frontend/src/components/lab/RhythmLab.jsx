import {React, useState, useEffect, useRef} from 'react'
import * as Tone from 'tone';
import { Menu, Button, Input, Dropdown, Form, TextArea, Icon } from 'semantic-ui-react';
import { useDispatch, useSelector} from 'react-redux';
import { insertData } from '../../store/actions/dataPoolActions';
import { setLabData } from '../../store/actions/labDataActions';
import { drumKit } from './synths';
import ExportModal from '../modal/ExportModal'
import './lab.css'



export default function RhythmLab({importedRhythmData, display, free, update, setUpdate, labSplit}) {
    const [playing, setPlaying] = useState(false)
    const initialNotes = [['O', 'O'], ['O', 'O'], ['O', 'O'], ['O', 'O']]
    const [name, setName] = useState('Rhythm 1')
    const [notes, setNotes] = useState(initialNotes)
    const [playNoteOrderByID, setPlayNoteOrderByID] = useState([])
    const [mappedNotes, setMappedNotes] = useState([])
    const [metronomeNotes, setMetronomeNotes] = useState([['Db4'], ['Db4'], ['Db4'], ['Db4']])
    const [playConstant, setPlayConstant] = useState(1)
    const [edit, setEdit] = useState(false);
    const [stretchCompress, setStretchCompress] = useState(false)
    const [noteSlots, setNoteSlots] = useState(8)
    const [moduleLengthDisplay, setModuleLengthDisplay] = useState(notes.length);
    const [exportPool, setExportPool] = useState('global')
    const [inputFocus, setInputFocus] = useState(false)
    const [description, setDescription] = useState('')
    const [showDescription, setShowDescription] = useState(false)
    const [barLength, setBarLength] = useState(4)
    const [nestingDepth, setNestingDepth] = useState(0)
    const [opened, setOpened] = useState(false)
    const user = JSON.parse(localStorage.getItem('userInfo'))
    const isMuted = false;
    const dispatch = useDispatch()

    const labData = useSelector(state => state.labData)
    const {labInfo} = labData

//manual update
useEffect(() => {
    if (update && labSplit){
        setUpdate(false)
        const importedRhythmData =  labInfo['rhythmLab']
        if (importedRhythmData){
            setNotes(importedRhythmData['rhythm'])
            setName(importedRhythmData['rhythmName'])
            setPlayConstant(importedRhythmData['speed'])
            setDescription(importedRhythmData['desc'])
        }
    }
}, [update])

//update for imported data
useEffect(() => {
    if (importedRhythmData?.['rhythm']){
        setNotes(importedRhythmData['rhythm'])
        setName(importedRhythmData['rhythmName'])
        setPlayConstant(importedRhythmData['speed'])
        setDescription(importedRhythmData['desc'])
    }
    
}, [importedRhythmData])

useEffect(() => {
    var lengthDisplay = notes.length * (1/playConstant)
    var roundedDisplay = Math.round((lengthDisplay + Number.EPSILON) * 100) / 100
    setModuleLengthDisplay(roundedDisplay)
}, [notes])

useEffect(() => {
    setMappedNotes(mapNotes(notes))
    setMetronomeNotes(moduleLengthDisplay)
    generateMetronomeNotes()
    returnNotes()
    let newInfo = {...labInfo}
        const rhythmDataPrototype = {
            name: name,
            rhythmName: name,
            desc: description,
            rhythm: JSON.parse(JSON.stringify(notes)),
            length: moduleLengthDisplay,
            notes: noteSlots,
            speed: playConstant,
            author: '',
            authorId: '',
            dataType: 'rhythm',
            pool: '',
        }
        newInfo['rhythmLab'] = rhythmDataPrototype
        dispatch(setLabData(newInfo))
}, [notes, name, moduleLengthDisplay])

function generateMetronomeNotes(){
    var returnArr = [];
    for (var i = 0; i < moduleLengthDisplay; i++){
        returnArr.push(['Db4'])
    }
    setMetronomeNotes(returnArr)
}
var controls = useRef('add')
const [activeButton, setActiveButton] = useState('add')
var subdivision = useRef(2)
var [subdivisionValue, setSubdivisionValue] = useState(2)

function handleControls(type){
    controls.current = type;
    setActiveButton(type);
}

function handleSubdivision(value){
    subdivision.current = value;
    setSubdivisionValue(value)
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

//---Interactive Functionality
function changePositionsUsingIDs(startingID, endingID, notes){
    
    var xfer;
    var clone = [...notes]
    var dataDeleteInsert = true;
    var childrenIDs = getAllChildElementsById(startingID)
    var nOfSiblings = document.getElementById(startingID).parentNode.childNodes.length
    var ex1 = startingID.split('_')
        var startingIDCoordinates = []
        for (var i = 2; i < ex1.length; i++){
            if (ex1[i] !== 'free'){
                startingIDCoordinates.push(Number(ex1[i]))
            }
        }
    var ex2 = endingID.split('_')
        var endingIDCoordinates = []
        for (var j = 2; j < ex2.length; j++){
        if (ex2[j] !== 'free'){
            endingIDCoordinates.push(Number(ex2[j]))
        }
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
            if (nOfSiblings === 1){
                return
            }
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

function addNoteAtPosition(endingID, notes){
    var clone = [...notes]
    var ex1 = endingID.split('_')
        var endingIDCoordinates = []
        for (var i = 2; i < ex1.length; i++){
            if (ex1[i] !== 'free'){
                endingIDCoordinates.push(Number(ex1[i]))
            }
        }
        if (endingIDCoordinates.length === 1){
            return
        } else if (endingIDCoordinates.length === 2){
             clone[endingIDCoordinates[0]].splice(endingIDCoordinates[1] + 1, 0, 'O')
        } else if (endingIDCoordinates.length === 3){
             clone[endingIDCoordinates[0]][endingIDCoordinates[1]].splice([endingIDCoordinates[2]] + 1, 0, 'O')
        } else if (endingIDCoordinates.length === 4){
             clone[endingIDCoordinates[0]][endingIDCoordinates[1]][endingIDCoordinates[2]].splice([endingIDCoordinates[3]] + 1, 0, 'O')
        } else if (endingIDCoordinates.length === 5){
            clone[endingIDCoordinates[0]][endingIDCoordinates[1]][endingIDCoordinates[2]][endingIDCoordinates[3]].splice([endingIDCoordinates[4]] + 1, 0, 'O')
        } else {
            return
        }
    setNotes(clone)
    setMappedNotes(mapNotes(clone))
}

//FUNCTIONS 
function removeNoteAtPosition(endingID, notes){
    //check if its an actual playable note
    if (getAllChildElementsById(endingID).length !== 0){
        return
    }
    var clone = [...notes]
    var ex1 = endingID.split('_')
    var parentId = document.getElementById(endingID).parentNode.id
    var nOfSiblings = document.getElementById(endingID).parentNode.childNodes.length

    var endingIDCoordinates = []
        for (var i = 2; i < ex1.length; i++){
            if (ex1[i] !== 'free'){
                endingIDCoordinates.push(Number(ex1[i]))
            }
        }
    if (nOfSiblings === 1){
        unDivideNotesAtPosition(parentId, notes)
        
    } else {
        if (endingIDCoordinates.length === 2){
            clone[endingIDCoordinates[0]].splice(endingIDCoordinates[1], 1)
        } else if (endingIDCoordinates.length === 3){
             clone[endingIDCoordinates[0]][endingIDCoordinates[1]].splice([endingIDCoordinates[2]], 1)
        } else if (endingIDCoordinates.length === 4){
             clone[endingIDCoordinates[0]][endingIDCoordinates[1]][endingIDCoordinates[2]].splice([endingIDCoordinates[3]], 1)
        } else if (endingIDCoordinates.length === 5){
            clone[endingIDCoordinates[0]][endingIDCoordinates[1]][endingIDCoordinates[2]][endingIDCoordinates[3]].splice([endingIDCoordinates[4]], 1)
        } else if (endingIDCoordinates.length === 6) {
            clone[endingIDCoordinates[0]][endingIDCoordinates[1]][endingIDCoordinates[2]][endingIDCoordinates[3]][endingIDCoordinates[4]].splice([endingIDCoordinates[5]], 1)
        } else {
            return
        }
    }
        
        
    
    setNotes(clone)
    setMappedNotes(mapNotes(clone))
}

function replaceNoteAtPosition(endingID, notes){
    const clone = [...notes]
    const ex1 = endingID.split('_')
    let startValue;
    let value;
    if (document.getElementById(endingID).innerHTML.length > 1){
        return
    } else {
        startValue = document.getElementById(endingID).innerHTML
    }

    if (startValue === 'X'){
        value = 'O'
    } else {
        value ='X'
    }

        var endingIDCoordinates = []
        for (var i = 2; i < ex1.length; i++){
            if (ex1[i] !== 'free'){
                endingIDCoordinates.push(Number(ex1[i]))
            }
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
    let insertData = []

    for (var i = 0; i < subdivision.current; i++){
        insertData.push(value)
    }

    var ex1 = endingID.split('_')
        var endingIDCoordinates = []
        for (let i = 2; i < ex1.length; i++){
            if (ex1[i] !== 'free'){
                endingIDCoordinates.push(Number(ex1[i]))
            }
        }
        if (endingIDCoordinates.length === 1){
            clone.splice(endingIDCoordinates[0], 1, insertData)
        } else if (endingIDCoordinates.length === 2){
             clone[endingIDCoordinates[0]].splice(endingIDCoordinates[1], 1, insertData)
        } else if (endingIDCoordinates.length === 3){
             clone[endingIDCoordinates[0]][endingIDCoordinates[1]].splice([endingIDCoordinates[2]], 1, insertData)
        } else if (endingIDCoordinates.length === 4){
             clone[endingIDCoordinates[0]][endingIDCoordinates[1]][endingIDCoordinates[2]].splice([endingIDCoordinates[3]], 1, insertData)
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
            if (ex1[i] !== 'free'){
                endingIDCoordinates.push(Number(ex1[i]))
            }  
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
    if (clone.length === 1){
        return
    } else {
        clone.pop()
        setNotes(clone)
        setMappedNotes(mapNotes(clone))
    }
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

function returnNotes(){
    var count = 0;
    const flattenedNotes = flattenNotes(notes)
    for (var i = 0; i < flattenedNotes.length;i++){
        if (flattenedNotes[i] === 'O'){
            count++
        }
    }
    setNoteSlots(count)
}
//DRAG AND DROP FUNCTIONALITY
 //----------------------------------
 const dragStartHandler = e => {
    var obj = {id: e.target.id, className: e.target.className, message: 'dragside', type: 'rhythmLab'}
    e.dataTransfer.setData('text', JSON.stringify(obj));
    
};

const dragStartHandlerSpecial = e => {
    var obj = {id: 'special', className: 'rhythmData', message: {
        name: name,
        rhythmName: name,
        desc: description,
        rhythm: JSON.parse(JSON.stringify(notes)),
        length: moduleLengthDisplay,
        notes: noteSlots,
        speed: playConstant,
        author: '',
        authorId: '',
        dataType: 'rhythm',
        pool: '',
    }, type: 'rhythmLabExport'}
    console.log(obj)
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
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    e.preventDefault();
    const elementsToBeActivated = getAllParentElementsByID(e.target.id)
            for (var j = 0; j < elementsToBeActivated.length; j++){
                elementsToBeActivated[j].className = 'inactive'
            }
    var data = JSON.parse(e.dataTransfer.getData("text"));
    if (data.type !== 'rhythmLab'){
        return
    } else {
        changePositionsUsingIDs(data.id, e.target.id, notes)
    }
    e.dataTransfer.clearData();
    
}

const clickHandler = e => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if (controls.current === 'subdivide'){
        subDivideNotesAtPosition(e.target.id, e.target.innerText, notes)
    } else if (controls.current === 'undivide'){
        unDivideNotesAtPosition(e.target.id, notes)
    } else if (controls.current === 'add'){
        addNoteAtPosition(e.target.id, notes)
    } else if (controls.current === 'remove'){
        removeNoteAtPosition(e.target.id, notes)
    } else if (controls.current === 'replace'){
        replaceNoteAtPosition(e.target.id, notes)
    }else {
        return
    }
}

//------------------------------------------

function mapNotes(notes){
    var returnArr = [];
    var noteOrderReturnArr = [];
    function innerMapNotes(notes){
        for (var i = 0; i < notes.length; i++){
            let xtra = ''
            if (free){
                xtra = '_free'
            }
            var level0Return = [];
            for (var j = 0; j < notes[i].length; j++){
                if (Array.isArray(notes[i][j]) === false){
                    level0Return.push(<div id={'rhythm_note_' + i + '_' + j + xtra} key={'rhythm_note_' + i + '_' + j} className='inactive rhythmNote' onClick={clickHandler} draggable onDragStart = {dragStartHandler} onDrag = {dragHandler} onDragOver = {dragOverHandler} onDragLeave={dragLeaveHandler} onDrop = {dropHandler} style={{height: '50px', width: '50px', margin: '10px' }}>{notes[i][j]}</div>)
                    noteOrderReturnArr.push('rhythm_note_' + i + '_' + j + xtra)
                }
                else {
                    var level1Return = [];
                    for (var k = 0; k < notes[i][j].length; k++){
                        if (Array.isArray(notes[i][j][k]) === false){
                            level1Return.push(<div id={'rhythm_note_' + i + '_' + j + '_' + k + xtra} key={'rhythm_note_' + i + '_' + j + '_' + k} className='inactive rhythmNote' onClick={clickHandler}  draggable onDragStart = {dragStartHandler} onDrag = {dragHandler} onDragOver= {dragOverHandler} onDragLeave={dragLeaveHandler} onDrop = {dropHandler} style={{height: '50px', width: '40px', margin: '10px' }}>{notes[i][j][k]}</div>)
                            noteOrderReturnArr.push('rhythm_note_' + i + '_' + j + '_' + k + xtra)
                        } else {
                            var level2Return = [];
                            for (var l = 0; l < notes[i][j][k].length; l++){
                                if (Array.isArray(notes[i][j][k][l]) === false){
                                    level2Return.push(<div id={'rhythm_note_' + i + '_' + j + '_' + k + '_' + l + xtra} key={'rhythm_note_' + i + '_' + j + '_' + k + '_' + l} className='inactive rhythmNote' onClick={clickHandler}  draggable onDragStart = {dragStartHandler} onDrag = {dragHandler} onDragOver = {dragOverHandler} onDragLeave={dragLeaveHandler} onDrop = {dropHandler} style={{height: '50px', width: '30px', margin: '10px' }}>{notes[i][j][k][l]}</div>)
                                    noteOrderReturnArr.push('rhythm_note_' + i + '_' + j + '_' + k + '_' + l + xtra)
                                } else {
                                    var level3Return = [];
                                    for (var m = 0; m < notes[i][j][k][l].length; m++){
                                        if (Array.isArray(notes[i][j][k][l][m]) === false){
                                            level3Return.push(<div id={'rhythm_note_' + i + '_' + j + '_' + k + '_' + l + '_' + m + xtra} key={'rhythm_note_' + i + '_' + j + '_' + k + '_' + l + '_' + m} className='inactive rhythmNote' onClick={clickHandler}  draggable onDragStart = {dragStartHandler} onDrag = {dragHandler} onDragOver = {dragOverHandler} onDragLeave={dragLeaveHandler} onDrop = {dropHandler} style={{height: '50px', width: '20px', margin: '10px' }}>{notes[i][j][k][l][m]}</div>)
                                            noteOrderReturnArr.push('rhythm_note_' + i + '_' + j + '_' + k + '_' + l + '_' + m + xtra)
                                        } else {
                                        var level4Return = [];
                                        for (var n = 0; n < notes[i][j][k][l][m].length; n++){
                                            if (Array.isArray(notes[i][j][k][l][m][n]) === false){
                                                level3Return.push(<div id={'rhythm_note_' + i + '_' + j + '_' + k + '_' + l + '_' + m + '_' + n + xtra} key={'rhythm_note_' + i + '_' + j + '_' + k + '_' + l + '_' + m + '_' + n} className='inactive rhythmNote' onClick={clickHandler}  draggable onDragStart = {dragStartHandler} onDrag = {dragHandler} onDragOver = {dragOverHandler} onDragLeave={dragLeaveHandler} onDrop = {dropHandler} style={{height: '50px', width: '15px', margin: '10px' }}>{notes[i][j][k][l][m][n]}</div>)
                                                noteOrderReturnArr.push('rhythm_note_' + i + '_' + j + '_' + k + '_' + l + '_' + m  + '_' + n + xtra)
                                            } else {
                                                
                                                continue;
                                            }
                                        }
                                        level3Return.push(
                                            <div id={'rhythm_note_' + i + '_' + j + '_' + k + '_' + l + '_' + m + xtra} key={'rhythm_note_' + i + '_' + j + '_' + k + '_' + l + '_' + m} className='inactive rhythmNote' onClick={clickHandler}  draggable onDragStart = {dragStartHandler} onDrag = {dragHandler} onDragOver = {dragOverHandler} onDragLeave={dragLeaveHandler} onDrop = {dropHandler} style={{margin: '5px', display: 'flex', flexDirection: 'row', alignItems: 'center' , backgroundColor: 'black'}}>{level4Return}</div>
                                        )
                                        }
                                    }
                                    level2Return.push(
                                        <div id={'rhythm_note_' + i + '_' + j + '_' + k + '_' + l + xtra} key={'rhythm_note_' + i + '_' + j + '_' + k + '_' + l} className='inactive rhythmNote' onClick={clickHandler}  draggable onDragStart = {dragStartHandler} onDrag = {dragHandler} onDragOver = {dragOverHandler} onDragLeave={dragLeaveHandler} onDrop = {dropHandler} style={{margin: '5px', display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: 'lightgreen'}}>{level3Return}</div>
                                    )
                                }
                                
                            }
                            level1Return.push(
                                <div id={'rhythm_note_' + i + '_' + j + '_' + k + xtra} key={'rhythm_note_' + i + '_' + j + '_' + k} className='inactive rhythmNote' onClick={clickHandler}  draggable onDragStart = {dragStartHandler} onDrag = {dragHandler} onDragOver = {dragOverHandler} onDragLeave={dragLeaveHandler} onDrop = {dropHandler} style={{margin: '5px', display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: 'lightblue'}}>{level2Return}</div>
                            )
                        } 
                    }
                    level0Return.push(
                        <div id={'rhythm_note_' + i + '_' + j + xtra} key={'rhythm_note_' + i + '_' + j} className='inactive rhythmNote' onClick={clickHandler}  draggable onDragStart = {dragStartHandler} onDrag = {dragHandler} onDragOver = {dragOverHandler} onDragLeave={dragLeaveHandler} onDrop = {dropHandler} style={{margin: '5px', display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: 'lightsalmon'}}>{level1Return}</div>
                        )
                }
            }
            returnArr.push(
                <div id={'rhythm_note_' + i + xtra} key={'rhythm_note_' + i} className='inactive rhytmNote' onClick={clickHandler}  draggable onDragStart = {dragStartHandler} onDrag = {dragHandler} onDragOver = {dragOverHandler} onDragLeave={dragLeaveHandler} onDrop = {dropHandler} style={{margin: '5px', display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: 'lightcoral' }}>{level0Return}</div>
                )
        }
        return returnArr    
    }
    setPlayNoteOrderByID(noteOrderReturnArr)
    return innerMapNotes(notes);
}

//---------------------------------------------
function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
//---random rhythm generator
function randomRhythmGenerator(maxDepth, length){

    console.log(maxDepth, length)

    if (maxDepth === undefined){
        maxDepth = 0;
    }
    if (length === undefined){
        length = 4;
    }


    function recursiveRandomRhythmFunction(currentDepth){
        if (currentDepth === undefined){
            currentDepth = 0;
        }
        var thisLevelArray = [];
        for (let j = 0; j < randomInteger(1, 4); j++){
            let rand = randomInteger(0,2)
            if (rand === 0){
                thisLevelArray.push('X')
            }
            if (rand === 1){
                thisLevelArray.push('O')
            }
            if (rand === 2){
                if (currentDepth >= maxDepth){
                    thisLevelArray.push('X')
                } else {
                    thisLevelArray.push(recursiveRandomRhythmFunction(currentDepth + 1))
                }
            }
        }
        return thisLevelArray;
    }

    let returnArr = [];
    for (let i = 0; i < length; i++){
        returnArr.push(recursiveRandomRhythmFunction())
    }
setNotes(returnArr)
}

function playSynth(){
    if (isMuted){
        return
    }

    let gap = Tone.Time('4n').toMilliseconds()
    let totalTime = gap * moduleLengthDisplay;
    if (playing){
        let rhythmNotes = document.getElementsByClassName('rhythmNote')
        for (let i = 0; i < rhythmNotes.length; i++){
            rhythmNotes[i].className = 'inactive rhythmNote'
        }
        Tone.Transport.cancel()
        Tone.Transport.stop()
        setTimeout(() => setPlaying(false), 0)
    } else {
    Tone.start()
    Tone.Transport.cancel();
    Tone.Transport.stop();
    Tone.Transport.start();
    var tempNotes = [...notes]
    tempNotes.push(['X'])
    var position = 0;
    var previouslyActivated = [];
        const synthPart = new Tone.Sequence(
          function(time, note) {
            if (note !== 'X'){
                if (note === 'O'){
                    drumKit.triggerAttackRelease('B4', 0.5, time);
                } else {
                    drumKit.triggerAttackRelease(note, 0.5, time)
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

            if (position === flattenNotes(tempNotes).length - 1){
                position = 0;
            } else {
                position++;
            }
          },
         tempNotes,
          ((1/playConstant) * Tone.Time('4n').toSeconds())
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

          setTimeout(() => Tone.Transport.stop(), totalTime + gap)
          setTimeout(() => setPlaying(false), totalTime)
    }
}

function squishTiming(notesLength, barLength){
    const ratioConst = (1/(barLength/notesLength))
    var num = ratioConst
    num = num.toFixed(3);
    return Number(num)
}

const onChangeModuleLength = e => {
    setModuleLengthDisplay(e.target.value)
    setPlayConstant(squishTiming(notes.length, e.target.value))
}

const exportObj = {
    name: name,
    rhythmName: name,
    desc: description,
    rhythm: notes,
    length: moduleLengthDisplay,
    speed: playConstant,
    notes: noteSlots,
    dataType: 'rhythm',
    author: user?.['name'],
    authorId: user?.['_id'],
    pool: exportPool,
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
const fourFourQuarterNotes = [['O'], ['O'], ['O'], ['O']]
const fourFourEighthNotes = [['O', 'O'], ['O', 'O'], ['O', 'O'], ['O', 'O']]
const threeFourQuarterNotes = [['O'], ['O'], ['O']]
const threeFourEighthNotes = [['O', 'O'], ['O', 'O'], ['O', 'O']]

const dropHandlerSpecial =  e => {
    if (!free){
        return
    }
    const data = JSON.parse(e.dataTransfer.getData("text"));
    if (data['className'] !== 'rhythmData'){
        return
      }
    const importedRhythmData =  data['message']
    setNotes(importedRhythmData['rhythm'])
    setName(importedRhythmData['rhythmName'])
    setPlayConstant(importedRhythmData['speed'])
}
const dragOverHandlerSpecial =  e => {
    e.preventDefault();
}


    return (
        <div onDragOver={dragOverHandlerSpecial} onDrop={dropHandlerSpecial} style={ free ? {'height': '200px', display: display ? '' : 'none'} : {}}>
        <Menu>
         <Menu.Item onClick={() => {playSynth(); setPlaying(true)}}><Icon name={playing ? 'stop' : 'play'}/></Menu.Item>  
         <Button.Group>
         <Button basic onClick={()=> randomRhythmGenerator(nestingDepth, barLength)}> Generate </Button>
         <Dropdown
          simple
          item
          className='button icon'
        > 
            <Dropdown.Menu>
                <Dropdown.Header>Generate Options</Dropdown.Header>
                <Dropdown.Item>
                Bar Length:
                <Input type='number' 
                onKeyDown={(e) => {e.preventDefault();}}
                onChange={(e, {value}) => setBarLength(value)}
                id='setBarLength'
                min='1'
                max='12'
                style={{cursor: 'none'}}
                value={barLength}
                />
                </Dropdown.Item>
                <Dropdown.Item>
                Nesting Depth:
                <Input type='number' 
                onKeyDown={(e) => {e.preventDefault();}}
                onChange={(e, {value}) => setNestingDepth(value)}
                id='setNestingDepth'
                min='0'
                max='3'
                style={{cursor: 'none'}}
                value={nestingDepth}
                />
                </Dropdown.Item>
                <Dropdown.Item>Bar Length</Dropdown.Item>
                <Dropdown.Item>Nesting Depth</Dropdown.Item>
                <Dropdown.Header>Common Rhythms</Dropdown.Header>
                <Dropdown.Item onClick={() => setNotes(fourFourQuarterNotes)}>4/4 Quarter Notes</Dropdown.Item>
                <Dropdown.Item onClick={() => setNotes(fourFourEighthNotes)}>4/4 Eighth Notes</Dropdown.Item>
                <Dropdown.Item onClick={() => setNotes(threeFourQuarterNotes)}>3/4 Quarter Notes</Dropdown.Item>
                <Dropdown.Item onClick={() => setNotes(threeFourEighthNotes)}>3/4 Eighth Notes</Dropdown.Item>
            </Dropdown.Menu> 
        </Dropdown> 
        </Button.Group> 
         <Menu.Item onClick={()=> setEdit(!edit)}> Edit</Menu.Item>   
         <Menu.Item onClick={()=> setStretchCompress(!stretchCompress)}>  Warp </Menu.Item>      
         <Menu.Item onClick={() => setShowDescription(!showDescription)}> Desc </Menu.Item>
         <Button.Group>
         <Button basic onClick={() => setOpened(true)}>Export</Button>
        </Button.Group>
        </Menu>
        {edit && <Button.Group>
            <Button active ={activeButton === 'replace'} compact basic onClick ={() =>handleControls('replace')}> X/O</Button>
            <Button active ={activeButton === 'add'} compact basic onClick ={() =>handleControls('add')}>Add</Button>
            <Button active ={activeButton === 'remove'} compact basic onClick ={() => handleControls('remove')}>Remove</Button>
            <Button active ={activeButton === 'subdivide'} compact basic onClick ={() => handleControls('subdivide')}>Subdivide</Button>
            {activeButton ==='subdivide' && <Button.Group>
            <Button active ={subdivisionValue === 2} compact basic onClick ={() => handleSubdivision(2)}>2</Button>
            <Button active ={subdivisionValue === 3} compact basic onClick ={() => handleSubdivision(3)}>3</Button>
            <Button active ={subdivisionValue === 4} compact basic onClick ={() => handleSubdivision(4)}>4</Button>
            </Button.Group>}
            <Button active ={activeButton === 'undivide'} compact basic onClick ={() => handleControls('undivide')}>Undivide</Button>
            <Button compact basic onClick={()=> shortenPattern(notes)}>Notes--</Button>
            <Button compact basic onClick ={() => lengthenPattern(notes)}>Notes++</Button>
        </Button.Group>}
       <div style={{display: 'flex', flexDirection: 'row', width: '900px', flexWrap: 'wrap'}} >
           {mappedNotes}
       </div>
       { stretchCompress && <div>{playConstant}x speed </div>}
       <div>{moduleLengthDisplay}{moduleLengthDisplay > 1 ? ' beats' : ' beat'} </div>
       <div>{noteSlots}{noteSlots > 1 ? ' notes' : ' note'} </div>
        {stretchCompress && <Input type="range" min='1' max='16' step='1' value={moduleLengthDisplay} onChange={onChangeModuleLength}/>}
       <div>
            <div draggable onClick={() => setInputFocus(!inputFocus)} onDragStart={dragStartHandlerSpecial} style={{height: '25px', width: '125px', backgroundColor: 'lightseagreen', display: !inputFocus ? '': 'none' }}>{name}</div>
            <Input type='text'
            value={name}
            id={'input_rhythmLab'}
            ref={input => input && input.focus()}
            onBlur={() => setInputFocus(false)}
            onInput={e => setName(e.target.value)}
            style={{display: inputFocus ? '': 'none' }}
            />
        </div>
        {showDescription && <Form>
        <TextArea onInput={handleDescriptionChange} id={'desc_chordLab'} ref={input => input && input.focus()} placeholder='Description...' value={description} />
        </Form>}
        <ExportModal
        dataType={'rhythm'}
        exportObj={exportObj}
        opened={opened}
        setOpened={setOpened}
        changeParentName={setName}
        changeParentDesc={setDescription}
        />
        </div>
    )
}
