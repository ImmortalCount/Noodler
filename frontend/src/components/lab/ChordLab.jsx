import {React, useState, useEffect} from 'react'
import * as Tone from 'tone';
import {Scale, Chord, Note} from '@tonaljs/tonal';
import { useDispatch, useSelector} from 'react-redux';
import { insertData } from '../../store/actions/dataPoolActions';
import { setLabData } from '../../store/actions/labDataActions';
import { Icon, Menu, Dropdown, Button, Input, Form, TextArea } from 'semantic-ui-react';
import { polySynth } from './synths';
import { scaleHandler } from './utils';
import ExportModal from '../modal/ExportModal'

export default function ChordLab({importedChordData, masterInstrumentArray}) {
    const [chords, setChords] = useState([['C3', 'E3', 'G3']])
    const [exportNames, setExportNames] = useState([null])
    const [noteOptions, setNoteOptions] = useState("octave")
    const [generateChordOptions, setGenerateChordOptions] = useState({intervals: 3, number: 3})
    const [inputFocus, setInputFocus] = useState(false)
    const [description, setDescription] = useState('')
    const [showDescription, setShowDescription] = useState(false)
    const [octave, setOctave] = useState(3)
    const [options, setOptions] = useState('sharps')
    const [exportPool, setExportPool] = useState('global')
    const [edit, setEdit] = useState(false)
    const isMuted = false;
    const user = JSON.parse(localStorage.getItem('userInfo'))

    const dispatch = useDispatch()

    const labData = useSelector(state => state.labData)
    const {labInfo} = labData

    useEffect(() => {
        if(importedChordData['chord']){
            let newInfo = {...labInfo}
        const chordDataPrototype = {
            name: importedChordData['chordName'],
            chordName: importedChordData['chordName'],
            desc: '',
            chord: importedChordData['chord'],
            position: [],
            author: '',
            authorId: '',
            dataType: 'chord',
            pool: '',
        }
        newInfo['chordLab'] = chordDataPrototype
        dispatch(setLabData(newInfo))
        var returnArr = []
        returnArr.push(importedChordData['chord'])
        setChords(returnArr)
        }
        
    }, [importedChordData])

    useEffect(() => {
        let newInfo = {...labInfo}
        const chordDataPrototype = {
            name: chords.length !==0 ? Chord.detect(chords[0])[0] : 'N/A',
            chordName: chords.length !==0 ? Chord.detect(chords[0])[0] : 'N/A',
            desc: '',
            chord: chords.length !==0 ? chords[0] : [],
            position: [],
            author: '',
            authorId: '',
            dataType: 'chord',
            pool: '',
        }
        newInfo['chordLab'] = chordDataPrototype
        dispatch(setLabData(newInfo))
        
    }, [chords])
    

    const allScaleNotes = [];
    const scaleNotes = labInfo && labInfo['scaleLab'] && labInfo['scaleLab']['scale'] ? scaleHandler(labInfo['scaleLab']['scale'], options): Scale.get('c major').notes
    const allChromaticNotes = [];
    const chromaticNotes = scaleHandler(Scale.get('c chromatic').notes, options);

    
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

    

    function generateChordStack(limit){
        var chordStack = [];
        var nullStack = [];
        let numberOfChords;
        if (limit !== undefined){
            numberOfChords = limit
        } else {
            numberOfChords = scaleNotes.length
        }
            var interval = generateChordOptions['intervals'];
            var stackHeight = generateChordOptions['number'];
            var root = scaleNotes[0] + '3';
            var startingIndex = allScaleNotes.indexOf(root)
        for (var i = 0; i < numberOfChords; i++){
            var oneChord = [];
            for (var j = 0; j < stackHeight; j++){
                oneChord.push(allScaleNotes[startingIndex + i + (j * (interval - 1))])
            }
            chordStack.push(oneChord)
        }

        for (var k = 0; k < chordStack.length; k++){
            nullStack.push(null)
        }

        setExportNames(nullStack)
        setChords(chordStack)
    }




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


    function noteStringHandler(notes){
        var returnArr = []
        if (notes.indexOf(' ') === -1){
            returnArr.push(notes)
        } else {
            returnArr = notes.split(' ')
        }
        return returnArr
    }
    //============

    function playChords(){
        if (isMuted){
            return
        }
        Tone.start()
        Tone.Transport.cancel()
        Tone.Transport.stop()
        Tone.Transport.start();
        const convertedChords = chordSequenceToNoteString(chords)
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
            "4n"
          );
          synthPart.start();
          synthPart.loop = 1;
      }

    function organizeChords(interval){
        var cloneChords = [...chords];
        if (interval === undefined){
            interval = 3;
        }
        var returnArr = [];
        var running = true;;
        var counter = 0;
        while (running === true){
            if (counter >= chords.length){
                counter -= chords.length;
            }
            if (cloneChords[counter] === undefined){
                running = false;
                break;
            }
                returnArr.push(cloneChords[counter])
                cloneChords[counter] = undefined;
                counter += interval;
            
        }
        setChords(returnArr);
    }

    var handleClickUp = (e) =>{
        var clone = [...chords]
        var positionId = e.target.parentNode.parentNode.id;
        var x = positionId.split('_')[1]
        var y = positionId.split('_')[2]
        var cloneNames = [...exportNames]
        cloneNames[x] = null
        setExportNames(cloneNames)
        if (noteOptions === 'scaler'){
            if (allScaleNotes.indexOf(chords[x][y]) === -1){
                var chromaIndex = allChromaticNotes.indexOf(chords[x][y]);
                if (chromaIndex === -1){
                    chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(chords[x][y]));
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
            clone[x][y] = allScaleNotes[allScaleNotes.indexOf(chords[x][y]) + 1];
            }
        setChords(clone)
        }
        if (noteOptions === 'octave'){
        var note = Note.pitchClass(chords[x][y])
        var octave = Note.octave(chords[x][y])
        clone[x][y] = note + (octave + 1)
        setChords(clone)
        }
        if (noteOptions === 'chromatic'){
        var chromaIndex = allChromaticNotes.indexOf(chords[x][y])
        if (allChromaticNotes.indexOf(chords[x][y]) === -1){
            chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(chords[x][y]))
        }
        clone[x][y] = allChromaticNotes[chromaIndex + 1];
        setChords(clone)
        }
        if (noteOptions === 'insert'){
            clone[x].splice(y + 1, 0, chords[x][y]);
            setChords(clone)
            }
    }

    var handleClickDown = (e) =>{
        var clone = [...chords]
        var positionId = e.target.parentNode.parentNode.id;
        var x = positionId.split('_')[1]
        var y = positionId.split('_')[2]
        var cloneNames = [...exportNames]
        cloneNames[x] = null
        setExportNames(cloneNames)

        if (noteOptions === 'scaler'){
            if (allScaleNotes.indexOf(chords[x][y]) === -1){
                var chromaIndex = allChromaticNotes.indexOf(chords[x][y]);
                if (chromaIndex === -1){
                    chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(chords[x][y]));
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
            clone[x][y] = allScaleNotes[allScaleNotes.indexOf(chords[x][y]) - 1];
            }
        setChords(clone)
        }
        if (noteOptions === 'octave'){
        var note = Note.pitchClass(chords[x][y])
        var octave = Note.octave(chords[x][y])
        clone[x][y] = note + (octave - 1)
        setChords(clone)
        }
        if (noteOptions === 'chromatic'){
        var chromaIndex = allChromaticNotes.indexOf(chords[x][y])
        if (allChromaticNotes.indexOf(chords[x][y]) === -1){
            chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(chords[x][y]))
        }
        clone[x][y] = allChromaticNotes[chromaIndex - 1];
        setChords(clone)
        }
        if (noteOptions === 'insert'){
        clone[x].splice(y, 0, chords[x][y]);
        setChords(clone)
        }
    }

    var handleClickUpChord = (e) =>{
        var clone = [...chords]
        var parentID = e.currentTarget.parentNode.parentNode.parentNode.id;
        var x = parentID.split('_')[1]
        var cloneNames = [...exportNames]
        cloneNames[x] = null
        setExportNames(cloneNames)

        if (noteOptions === 'scaler'){
            for (var y = 0; y < chords[x].length; y++){
                if (allScaleNotes.indexOf(chords[x][y]) === -1){
                    var chromaIndex = allChromaticNotes.indexOf(chords[x][y]);
                    if (chromaIndex === -1){
                        chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(chords[x][y]));
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
                clone[x][y] = allScaleNotes[allScaleNotes.indexOf(chords[x][y]) + 1];
                }
            }
        setChords(clone)
        }
        if (noteOptions === 'octave'){
            for (var y = 0; y < chords[x].length; y++){
                var note = Note.pitchClass(chords[x][y])
                var octave = Note.octave(chords[x][y])
                clone[x][y] = note + (octave + 1)
            }
            setChords(clone)
            }
        if (noteOptions === 'chromatic'){
            for (var y = 0; y < chords[x].length; y++){
                var chromaIndex = allChromaticNotes.indexOf(chords[x][y])
                if (allChromaticNotes.indexOf(chords[x][y]) === -1){
                    chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(chords[x][y]))
                }
        clone[x][y] = allChromaticNotes[chromaIndex + 1];
            }
        setChords(clone)
        }
        if (noteOptions === 'insert'){
            var newChord = [...clone[x]]
            clone.splice(x, 0, newChord);
            setChords(clone)
        }
    }

    var handleClickDownChord = (e) =>{
        var clone = [...chords]
        var parentID = e.currentTarget.parentNode.parentNode.parentNode.id;
        var x = parentID.split('_')[1]
        var cloneNames = [...exportNames]
        cloneNames[x] = null
        setExportNames(cloneNames)

        if (noteOptions === 'scaler'){
            for (var y = 0; y < chords[x].length; y++){
                if (allScaleNotes.indexOf(chords[x][y]) === -1){
                    var chromaIndex = allChromaticNotes.indexOf(chords[x][y]);
                    if (chromaIndex === -1){
                        chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(chords[x][y]));
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
                clone[x][y] = allScaleNotes[allScaleNotes.indexOf(chords[x][y]) - 1];
                }
            }
        setChords(clone)
        }
        if (noteOptions === 'octave'){
            for (var y = 0; y < chords[x].length; y++){
                var note = Note.pitchClass(chords[x][y])
                var octave = Note.octave(chords[x][y])
                clone[x][y] = note + (octave - 1)
            }
            setChords(clone)
            }
        if (noteOptions === 'chromatic'){
            for (var y = 0; y < chords[x].length; y++){
                var chromaIndex = allChromaticNotes.indexOf(chords[x][y])
                if (allChromaticNotes.indexOf(chords[x][y]) === -1){
                    chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(chords[x][y]))
                }
        clone[x][y] = allChromaticNotes[chromaIndex - 1];
            }
        setChords(clone)
        }
        if (noteOptions === 'insert'){
            var newChord = [...clone[x]]
            clone.splice(x, 0, newChord);
            setChords(clone)
        }
    }

    var handleClickUpAll = () =>{
        var clone = [...chords]
        var cloneNames = [...exportNames]
        setExportNames(cloneNames)
        if (noteOptions === 'scaler'){
            for (let x = 0; x < chords.length; x++){
                for (let y = 0; y < chords[x].length; y++){
                    if (allScaleNotes.indexOf(chords[x][y]) === -1){
                        let chromaIndex = allChromaticNotes.indexOf(chords[x][y]);
                        if (chromaIndex === -1){
                            chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(chords[x][y]));
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
                    clone[x][y] = allScaleNotes[allScaleNotes.indexOf(chords[x][y]) + 1];
                    }
                }
            }
        setChords(clone)
        }
        if (noteOptions === 'octave'){
            for (let x = 0; x < chords.length; x++){
                for (let y = 0; y < chords[x].length; y++){
                    var note = Note.pitchClass(chords[x][y])
                    var octave = Note.octave(chords[x][y])
                    clone[x][y] = note + (octave + 1)
                }
                setChords(clone)
                }
            }
        if (noteOptions === 'chromatic'){
            for (let x = 0; x < chords.length; x++){
                for (let y = 0; y < chords[x].length; y++){
                    let chromaIndex = allChromaticNotes.indexOf(chords[x][y])
                    if (allChromaticNotes.indexOf(chords[x][y]) === -1){
                        chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(chords[x][y]))
                    }
            clone[x][y] = allChromaticNotes[chromaIndex + 1];
                }
            setChords(clone)
            }
        }
        if (noteOptions === 'insert'){
            return
        }
    }

    var handleClickDownAll = () =>{
        var clone = [...chords]
        var cloneNames = [...exportNames]
        setExportNames(cloneNames)
        if (noteOptions === 'scaler'){
            for (let x = 0; x < chords.length; x++){
                for (let y = 0; y < chords[x].length; y++){
                    if (allScaleNotes.indexOf(chords[x][y]) === -1){
                        var chromaIndex = allChromaticNotes.indexOf(chords[x][y]);
                        if (chromaIndex === -1){
                            chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(chords[x][y]));
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
                    clone[x][y] = allScaleNotes[allScaleNotes.indexOf(chords[x][y]) - 1];
                    }
                }
            }

        setChords(clone)
        }
        if (noteOptions === 'octave'){
            for (let x = 0; x < chords.length; x++){
                for (let y = 0; y < chords[x].length; y++){
                    const note = Note.pitchClass(chords[x][y])
                    const octave = Note.octave(chords[x][y])
                    clone[x][y] = note + (octave - 1)
                }
                setChords(clone)
                }
            }
        if (noteOptions === 'chromatic'){
            for (let x = 0; x < chords.length; x++){
                for (let y = 0; y < chords[x].length; y++){
                    let chromaIndex = allChromaticNotes.indexOf(chords[x][y])
                    if (allChromaticNotes.indexOf(chords[x][y]) === -1){
                        chromaIndex = allChromaticNotes.indexOf(Note.enharmonic(chords[x][y]))
                    }
            clone[x][y] = allChromaticNotes[chromaIndex - 1];
                }
            setChords(clone)
            }
            }
        if (noteOptions === 'insert'){
            return
        }
    }

    const handleDeleteAll = () => {
        setChords([])
        setExportNames([])
    }

    const handleDeleteNote = (e) =>{
        var clone = [...chords]
        var positionId = e.target.parentNode.parentNode.id;
        var x = positionId.split('_')[1]
        var y = positionId.split('_')[2]

        var cloneNames = [...exportNames]
        cloneNames[x] = null
        setExportNames(cloneNames)

        clone[x].splice(y, 1)
        setChords(clone)
    }

    const handleDeleteChord =(e) => {
        var clone = [...chords]
        var parentID = e.currentTarget.parentNode.parentNode.id;
        var x = parentID.split('_')[1]

        var cloneNames = [...exportNames]
        cloneNames[x] = null
        setExportNames(cloneNames)

        clone.splice(x, 1)
        setChords(clone);
    }

    const handleAddChord = () => {
        const clone = JSON.parse(JSON.stringify(chords))
        if (chords.length === 0){
            generateChordStack(1)
        } else {
        const lastChord = clone[clone.length - 1]
        clone.push(JSON.parse(JSON.stringify(lastChord)))
        let y = exportNames[clone.length - 1]
        let z = [...exportNames]
        z.push(y)
        setExportNames(z)
        }
        setChords(clone)
    }

    const handleRemoveChord = () => {
        const clone = [...chords]
        if (chords.length === 0){
            return
        } else {
        clone.pop()
        }
        setChords(clone)
    }

    const handlePlayThis = (e, x) => {
        let parentID;
        if (x){
            parentID = e.target.parentNode.id
        } else {
            parentID = e.target.id;
        }

        if (parentID.split('_').length === 2){
            const x = parentID.split('_')[1]
            polySynth.triggerAttackRelease(chords[x], '8n');
        } else if (parentID.split('_').length === 3) {
            const x = parentID.split('_')[1]
            const y = parentID.split('_')[2]
            polySynth.triggerAttackRelease(chords[x][y], '8n')
        } else {
            return
        }
        var thisChord = document.getElementById(parentID)
        thisChord.className = 'active chord'
        setTimeout(() => {thisChord.className ='inactive chord'}, 250)
    }

    //==========
    function changePositionsUsingIDs(startingID, endingID){
    var xfer;
    var xfer2;
    var clone = [...chords]
    var cloneNames = [...exportNames]
    var ex1 = startingID.split('_')
    var ex2 = endingID.split('_')
    if(ex1 === undefined || ex2 === undefined){
        return
    } 
    var startingPosition = ex1[1]
    var endingPosition = ex2[1]

    xfer = clone[startingPosition]
    clone.splice(startingPosition, 1)
    clone.splice(endingPosition, 0, xfer)

    xfer2 = cloneNames[startingPosition]
    cloneNames.splice(startingPosition, 1)
    cloneNames.splice(endingPosition, 0, xfer2)
    
    setChords(clone)
    setExportNames(cloneNames)
}

    //=================================

    //=======Drag and drop functionality
    const dragStartHandler = e => {
        var idx = Number(e.target.id.split('_')[1])
        let exportName;
        if (exportNames[idx]){
            exportName = exportNames[idx]
        } else {
            exportName = handleChordName(chords[idx])
        }
        var exportChord = chords[idx]
        var obj = {id: e.target.id, className: 'chordData', message: {
            chordName: exportName,
            chord: exportChord,
            position: []
        }, type: 'chordLab'}
        e.dataTransfer.setData('text', JSON.stringify(obj));
        console.log(obj)
    };

    const dragStartHandlerSpecial = e => {
        let exportName;
        if (exportNames[0]){
            exportName = exportNames[0]
        } else {
            exportName = handleChordName(chords[0])
        }
        var exportChord = chords[0]
        var obj = {id: 'special', className: 'chordData', message: {
            chordName: exportName,
            chord: exportChord,
            position: []
        }, type: 'chordLabExport'}
        e.dataTransfer.setData('text', JSON.stringify(obj));
        console.log(obj)
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
        var data = JSON.parse(e.dataTransfer.getData("text"));
        if (data['type'] !== 'chordLab'){
            e.currentTarget.className = 'inactive chord'
            return
        } else {
        e.currentTarget.className = 'inactive chord'
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        e.preventDefault();
        
        changePositionsUsingIDs(data.id, e.currentTarget.id)
        e.dataTransfer.clearData();
        }
        
        
    }

    const clickHandler = e => {
        var childNodes = e.target.childNodes
        var returnArr = []
        for (var i = 0; i < childNodes.length; i++){
            returnArr.push(childNodes)
        }
        // handlePlayThis()
        // console.log(returnArr, 'returnArr')
        // console.log(e.target.id, 'e.target')
        // console.log(e.currentTarget.id, 'e.currentTarget')
    }

    //==========================================
    function handleChordName(pitchClasses){
        if (chords.length === 0){
            return 
        }
        if (Chord.detect(pitchClasses)[0] === undefined){
            return pitchClasses[0] + ' ???'
        } else {
            return Chord.detect(pitchClasses)[0]
        }
    }

    function mapChords(){
        var returnArr = [];
        if (chords.length === 0){
            return <div></div>
        }
        for (var i = 0; i < chords.length; i++){
            var returnChord = [];
            var pitchClasses = [];
            for (var j = 0; j < chords[i].length; j++){
                pitchClasses.push(Note.pitchClass(chords[i][j]))
                returnChord.push(
                    <div id={'chord_' + i + '_' + j} style={{display: 'flex', flexDirection: 'row', height: '50px', width: '50px', backgroundColor: 'wheat', margin: '1px'}}>
                        {chords[i][j]}
                        {(edit && noteOptions !== 'delete') && <div style={{display: 'flex', flexDirection: 'column'}}>
                        <Icon onClick={handleClickUp} name={(noteOptions === 'insert') ? "plus" : "caret square up" }/><Icon onClick={handleClickDown} name={(noteOptions === 'insert') ? "" : "caret square up" }/>
                        </div>}
                        {(edit && noteOptions === 'delete') &&<Icon onClick={handleDeleteNote} name= 'trash alternate outline' />}
                    </div>
                )
            }

            returnArr.push(
                <div  id={'chord_' + i} onClick={handlePlayThis} draggable onDragStart = {dragStartHandler} onDrag = {dragHandler} onDragOver = {dragOverHandler} onDragLeave={dragLeaveHandler} onDrop = {dropHandler}className='inactive chord' style={{display: 'flex', flexDirection: 'column-reverse', margin: '5px', marginBottom: '15px'}}>
                <div onClick={(e) => (handlePlayThis(e, true))} style={{display: 'flex', flexDirection: 'row', marginBottom: '18px'}}>
                { (edit && noteOptions !== 'delete') && <div  style={{display: 'flex', flexDirection: (noteOptions === 'insert') ? 'row' : 'column'}}>
                <Icon onClick={handleClickUpChord} name= {(noteOptions === 'insert') ? "plus" : "caret square up" }/><Icon onClick={handleClickDownChord}name= {(noteOptions === 'insert') ? "" : "caret square down" }/>
                </div>}
                {(edit && noteOptions === 'delete') && <Icon onClick={handleDeleteChord} name= 'trash alternate outline' /> }
                </div>
                
                {returnChord} 
                {exportNames[i] ? exportNames[i] : handleChordName(pitchClasses)}</div>
            )
        }
        return returnArr;
    }

    const handleGenerateChordDropdownOptions = (e, {value}) => {
        var clone = JSON.parse(JSON.stringify(generateChordOptions))
        var thisID = e.target.id;
        if (thisID === 'generateChordIntervalRange'){
            clone['intervals'] = value;
        } else if (thisID === 'generateChordNoteNumber'){
            clone['number'] = value;
        }

        setGenerateChordOptions(clone)
    }

    function handleExport(){
        const user = JSON.parse(localStorage.getItem('userInfo'))
        const chordDataPrototype = {
            name: Chord.detect(chords[0])[0],
            chordName: Chord.detect(chords[0])[0],
            desc: '',
            chord: chords[0],
            position: [],
            author: user['name'],
            authorId: user['_id'],
            dataType: 'chord',
            pool: exportPool,
        }
        dispatch(insertData(chordDataPrototype))
    }

    const exportObj = {
        name: exportNames ? exportNames[0] : Chord.detect(chords[0])[0] ? Chord.detect(chords[0])[0]: '',
        chordName: exportNames ? exportNames[0] : Chord.detect(chords[0])[0] ? Chord.detect(chords[0])[0]: '',
        desc: '',
        chord: chords[0],
        position: [],
        author: user?.['name'],
        authorId: user?.['_id'],
        dataType: 'chord',
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
    
      const handleChangeName = e => {
        const cloneNames = [...exportNames]
        cloneNames[0] = e.target.value
        setExportNames(cloneNames)
      }

      const handleDescriptionChange = e => {
        setDescription(e.target.value)
      }
      //====
    return (
        <>
        <Menu>
         <Menu.Item onClick={() => playChords()}> <Icon name='play'/> </Menu.Item> 
         <Button.Group> 
         <Button basic onClick={()=> generateChordStack()}> Generate </Button>   
         <Dropdown
          simple
          item
          className='button icon'
        >
         <Dropdown.Menu>
             <Dropdown.Item> Character
                <Dropdown.Menu>
                <Dropdown.Item>
                interval size:
                <Input type='number' 
                onKeyDown={(e) => {e.preventDefault();}}
                onChange={handleGenerateChordDropdownOptions}
                id='generateChordIntervalRange'
                min='1'
                max='12'
                style={{cursor: 'none'}}
                value={generateChordOptions['intervals']}
                />
                </Dropdown.Item>
                <Dropdown.Item>
                # of notes  :
                <Input type='number' 
                onKeyDown={(e) => {e.preventDefault();}}
                onChange={handleGenerateChordDropdownOptions}
                id='generateChordNoteNumber'
                min='1'
                max='12'
                style={{cursor: 'none'}}
                value={generateChordOptions['number']}
                />
                </Dropdown.Item>
                </Dropdown.Menu>
             </Dropdown.Item>
             <Dropdown.Item> Progression
                <Dropdown.Menu>
                <Dropdown.Item selected>Diatonic</Dropdown.Item>
                <Dropdown.Item>4ths</Dropdown.Item>
                <Dropdown.Item>5ths</Dropdown.Item>
                </Dropdown.Menu>
             </Dropdown.Item>
            
              </Dropdown.Menu>
            
          </Dropdown>
          </Button.Group> 
         <Menu.Item onClick={() => setEdit(!edit)}> Edit </Menu.Item>    
         <Menu.Item onClick={() => setShowDescription(!showDescription)}> Desc </Menu.Item>   
         <Button.Group>
         <ExportModal
        dataType={'Chord'}
        exportObj={exportObj}/>
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
        </Button.Group>  
        </Menu>
        {edit && <Button.Group>
            <Button basic compact active={noteOptions === 'octave'} onClick={() => setNoteOptions('octave')}>Octave</Button>
            <Button basic compact active={noteOptions === 'scaler'} onClick={() => setNoteOptions('scaler')}>Scale</Button>
            <Button basic compact active={noteOptions === 'chromatic'} onClick={() => setNoteOptions('chromatic')}>Chromatic</Button>
            <Button basic compact active={noteOptions === 'insert'} onClick={() => setNoteOptions('insert')}>Insert</Button>
            <Button basic compact active={noteOptions === 'delete'} onClick={() => setNoteOptions('delete')}>Delete</Button>
            <Button basic compact onClick={handleRemoveChord}>Chord--</Button>
            <Button basic compact onClick={handleAddChord}>Chord++</Button>
            {noteOptions === 'delete' && <Button basic compact onClick={handleDeleteAll}>Delete All</Button>}
            <Button basic compact onClick={handleClickUpAll}>All Up</Button>
            <Button basic compact onClick={handleClickDownAll}>All Down</Button>
        </Button.Group>}
        <div style={{display: 'flex', flexDirection: 'row'}}>
            {mapChords()}
        </div>
        <div>
            <div draggable onClick={() => setInputFocus(!inputFocus)} onDragStart={dragStartHandlerSpecial} style={{height: '25px', width: '125px', backgroundColor: 'lightsalmon', display: !inputFocus ? '': 'none' }}>{chords.length !== 0 ? exportNames?.[0] ? exportNames[0] : handleChordName(chords[0]) : 'N/A'}</div>
            <Input type='text'
            id={'input_patternLab'}
            ref={input => input && input.focus()}
            onBlur={() => setInputFocus(false)}
            onInput={handleChangeName}
            style={{display: inputFocus ? '': 'none' }}
            />
        </div>
        {showDescription && <Form>
        <TextArea onInput={handleDescriptionChange} id={'desc_chordLab'} ref={input => input && input.focus()} placeholder='Description...' value={description} />
        </Form>}
        </>
    ) 
}
